"use client";

import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Task } from "@/types/task";
import { TaskCard } from "./TaskCard";

interface Column {
  id: string;
  title: string;
  color: string;
  icon: string;
}

interface KanbanColumnProps {
  column: Column;
  tasks: Task[];
}

export function KanbanColumn({ column, tasks }: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl p-4 min-h-[600px] transition-all ${
        isOver ? "ring-2 ring-blue-500 ring-offset-2" : ""
      } ${column.color} border border-gray-200`}
    >
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{column.icon}</span>
          <h2 className="text-lg font-bold text-black">{column.title}</h2>
        </div>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-bold text-black">
          {tasks.length}
        </span>
      </div>

      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </div>
      </SortableContext>

      {tasks.length === 0 && (
        <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-300 rounded-lg">
          <p>Arraste tarefas aqui</p>
        </div>
      )}
    </div>
  );
}