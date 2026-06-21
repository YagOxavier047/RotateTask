"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor, closestCorners } from "@dnd-kit/core";
import { Task } from "@/types/task";
import { taskService } from "@/services/task.service";
import { KanbanColumn } from "./KanbanColumn";
import { TaskCard } from "./TaskCard";
import { toast } from "sonner";

interface KanbanBoardProps {
  tasks: Task[];
  onTasksUpdated: () => void;
}

type ColumnId = "todo" | "in_progress" | "done";

interface Column {
  id: ColumnId;
  title: string;
  color: string;
  icon: string;
}

const COLUMNS: Column[] = [
  { id: "todo", title: "A Fazer", color: "bg-gray-50", icon: "📋" },
  { id: "in_progress", title: "Fazendo", color: "bg-blue-50", icon: "" },
  { id: "done", title: "Concluído", color: "bg-emerald-50", icon: "✅" },
];

export function KanbanBoard({ tasks, onTasksUpdated }: KanbanBoardProps) {
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);

  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const getTasksByColumn = (columnId: ColumnId) => {
    return localTasks.filter((task) => task.status === columnId);
  };

  const handleDragStart = (event: any) => {
    const { active } = event;
    const task = localTasks.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as ColumnId;

    const task = localTasks.find((t) => t.id === activeId);
    if (!task || task.status === overId) return;

    try {
      await taskService.updateTask(activeId, { status: overId });
      
      setLocalTasks((prev) =>
        prev.map((t) => (t.id === activeId ? { ...t, status: overId } : t))
      );

      toast.success(`Tarefa movida para "${COLUMNS.find(c => c.id === overId)?.title}"!`);
      onTasksUpdated();
    } catch (error) {
      toast.error("Erro ao mover tarefa");
      console.error(error);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map((column) => (
          <KanbanColumn
            key={column.id}
            column={column}
            tasks={getTasksByColumn(column.id)}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask && (
          <div className="transform rotate-3 scale-105 shadow-2xl">
            <TaskCard task={activeTask} />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}