"use client";

import { useState } from "react";
import { Task, Subtask } from "@/types/task";
import { taskService } from "../services/task.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Flag,
  CheckCircle2,
  Circle,
  Plus,
  Trash2,
  Loader2,
} from "lucide-react";

interface TaskDetailsProps {
  task: Task;
  onClose: () => void;
  onUpdate: () => void;
}

export default function TaskDetails({ task, onClose, onUpdate }: TaskDetailsProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [currentTask, setCurrentTask] = useState(task);

  const progress = taskService.calculateProgress(currentTask.subtasks);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50";
      case "medium":
        return "text-amber-600 bg-amber-50";
      case "low":
        return "text-emerald-600 bg-emerald-50";
      default:
        return "text-gray-600 bg-gray-50";
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

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(date);
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim()) return;

    setIsAddingSubtask(true);
    try {
      await taskService.addSubtask(currentTask.id, newSubtaskTitle);
      setNewSubtaskTitle("");
      
      // Atualizar tarefa localmente
      const updatedTask = await taskService.getTaskById(currentTask.id);
      if (updatedTask) setCurrentTask(updatedTask);
      
      onUpdate();
      toast.success("Sub-tarefa adicionada!");
    } catch (error) {
      toast.error("Erro ao adicionar sub-tarefa");
    } finally {
      setIsAddingSubtask(false);
    }
  };

  const handleToggleSubtask = async (subtaskId: string) => {
    try {
      await taskService.toggleSubtask(currentTask.id, subtaskId);
      
      const updatedTask = await taskService.getTaskById(currentTask.id);
      if (updatedTask) setCurrentTask(updatedTask);
      
      onUpdate();
    } catch (error) {
      toast.error("Erro ao atualizar sub-tarefa");
    }
  };

  const handleRemoveSubtask = async (subtaskId: string) => {
    if (!confirm("Remover esta sub-tarefa?")) return;

    try {
      await taskService.removeSubtask(currentTask.id, subtaskId);
      
      const updatedTask = await taskService.getTaskById(currentTask.id);
      if (updatedTask) setCurrentTask(updatedTask);
      
      onUpdate();
      toast.success("Sub-tarefa removida!");
    } catch (error) {
      toast.error("Erro ao remover sub-tarefa");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{currentTask.title}</h2>
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                  currentTask.priority
                )}`}
              >
                <Flag className="h-3 w-3" />
                {getPriorityLabel(currentTask.priority)}
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                <Calendar className="h-3 w-3" />
                {formatDate(currentTask.dueDate)}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Descrição</h3>
          <p className="text-gray-600 bg-gray-50 p-4 rounded-lg">
            {currentTask.description}
          </p>
        </div>

        {/* Sub-tarefas */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-gray-700">
              Sub-tarefas ({currentTask.subtasks.filter((s) => s.completed).length}/
              {currentTask.subtasks.length})
            </h3>
          </div>

          {currentTask.subtasks.length > 0 && (
            <div className="mb-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{progress}% concluído</p>
            </div>
          )}

          <div className="space-y-2 mb-4">
            <AnimatePresence>
              {currentTask.subtasks.map((subtask) => (
                <motion.div
                  key={subtask.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg group"
                >
                  <button
                    onClick={() => handleToggleSubtask(subtask.id)}
                    className="flex-shrink-0"
                  >
                    {subtask.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                    ) : (
                      <Circle className="h-5 w-5 text-gray-400 hover:text-blue-600" />
                    )}
                  </button>
                  <span
                    className={`flex-1 ${
                      subtask.completed ? "line-through text-gray-400" : "text-gray-700"
                    }`}
                  >
                    {subtask.title}
                  </span>
                  <button
                    onClick={() => handleRemoveSubtask(subtask.id)}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
                    <Trash2 className="h-4 w-4 text-red-500 hover:text-red-700" />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Adicionar nova sub-tarefa */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newSubtaskTitle}
              onChange={(e) => setNewSubtaskTitle(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleAddSubtask()}
              placeholder="Adicionar sub-tarefa..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
            <button
              onClick={handleAddSubtask}
              disabled={isAddingSubtask || !newSubtaskTitle.trim()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-2"
            >
              {isAddingSubtask ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Plus className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
        >
          Fechar
        </button>
      </motion.div>
    </div>
  );
}