"use client";

import { Task } from "@/types/task";
import { taskService } from "../services/task.service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Calendar,
  Flag,
  MoreVertical,
  Edit,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onViewDetails: (task: Task) => void;
  onTaskDeleted: () => void;
}

export default function TaskCard({ task, onEdit, onViewDetails, onTaskDeleted }: TaskCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const progress = taskService.calculateProgress(task.subtasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-amber-600 bg-amber-50 border-amber-200";
      case "low":
        return "text-emerald-600 bg-emerald-50 border-emerald-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high":
        return "Alta";
      case "medium":
        return "Média";
      case "low":
        return "Baixa";
      default:
        return priority;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle2 className="h-4 w-4 text-emerald-600" />;
      case "in_progress":
        return <Clock className="h-4 w-4 text-blue-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const isOverdue = () => {
    return task.dueDate < new Date() && task.status !== "done";
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir esta tarefa?")) return;

    try {
      await taskService.deleteTask(task.id);
      toast.success("Tarefa excluída com sucesso!");
      onTaskDeleted();
    } catch (error) {
      toast.error("Erro ao excluir tarefa");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-5 border border-gray-100"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 cursor-pointer" onClick={() => onViewDetails(task)}>
          <h3 className="font-semibold text-gray-900 text-lg mb-1 hover:text-blue-600 transition">
            {task.title}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2">{task.description}</p>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded-lg transition"
          >
            <MoreVertical className="h-5 w-5 text-gray-500" />
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition"
              >
                <Edit className="h-4 w-4" />
                Editar
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setShowMenu(false);
                }}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
              >
                <Trash2 className="h-4 w-4" />
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(
            task.priority
          )}`}
        >
          <Flag className="h-3 w-3" />
          {getPriorityLabel(task.priority)}
        </span>

        <span
          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
            isOverdue() ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
          }`}
        >
          <Calendar className="h-3 w-3" />
          {formatDate(task.dueDate)}
        </span>

        <span className="inline-flex items-center gap-1">
          {getStatusIcon(task.status)}
        </span>
      </div>

      {task.subtasks.length > 0 && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
            <span>Sub-tarefas</span>
            <span>
              {task.subtasks.filter((s) => s.completed).length}/{task.subtasks.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}
    </motion.div>
  );
}