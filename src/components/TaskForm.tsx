"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Task, Priority, TaskStatus } from "@/types/task";
import { taskService } from "@/services/task.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Save } from "lucide-react";

const taskSchema = z.object({
  title: z.string().min(3, "O título deve ter pelo menos 3 caracteres"),
  description: z.string().min(5, "A descrição deve ter pelo menos 5 caracteres"),
  dueDate: z.string().min(1, "A data de vencimento é obrigatória"),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in_progress", "done"]),
});

type TaskFormData = z.infer<typeof taskSchema>;

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  task?: Task | null;
  userId: string;
  onSuccess: () => void;
}

export default function TaskForm({ isOpen, onClose, task, userId, onSuccess }: TaskFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: task
      ? {
          title: task.title,
          description: task.description,
          dueDate: new Date(task.dueDate).toISOString().split("T")[0],
          priority: task.priority,
          status: task.status,
        }
      : {
          title: "",
          description: "",
          dueDate: new Date().toISOString().split("T")[0],
          priority: "medium",
          status: "todo",
        },
  });

  const onSubmit = async (data: TaskFormData) => {
    setIsLoading(true);
    try {
      const taskData = {
        title: data.title,
        description: data.description,
        dueDate: new Date(data.dueDate),
        priority: data.priority as Priority,
        status: data.status as TaskStatus,
      };

      if (task) {
        await taskService.updateTask(task.id, taskData);
        toast.success("Tarefa atualizada com sucesso!");
      } else {
        await taskService.createTask(userId, taskData);
        toast.success("Tarefa criada com sucesso!");
      }

      reset();
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Erro ao criar/atualizar tarefa:", error);
      toast.error(`Erro ao ${task ? "atualizar" : "criar"} tarefa: ${error instanceof Error ? error.message : "Erro desconhecido"}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-black">
                {task ? "Editar Tarefa" : "Nova Tarefa"}
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-black" />
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Título *
                </label>
                <input
                  {...register("title")}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                  placeholder="Ex: Finalizar relatório"
                />
                {errors.title && (
                  <p className="text-red-600 text-xs mt-1">{errors.title.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Descrição *
                </label>
                <textarea
                  {...register("description")}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-black"
                  placeholder="Descreva os detalhes da tarefa"
                />
                {errors.description && (
                  <p className="text-red-600 text-xs mt-1">{errors.description.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-black mb-1">
                  Data de Vencimento *
                </label>
                <input
                  {...register("dueDate")}
                  type="date"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                />
                {errors.dueDate && (
                  <p className="text-red-600 text-xs mt-1">{errors.dueDate.message}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Prioridade
                  </label>
                  <select
                    {...register("priority")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                  >
                    <option value="low" className="text-black">Baixa</option>
                    <option value="medium" className="text-black">Média</option>
                    <option value="high" className="text-black">Alta</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-black mb-1">
                    Status
                  </label>
                  <select
                    {...register("status")}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                  >
                    <option value="todo" className="text-black">A Fazer</option>
                    <option value="in_progress" className="text-black">Em Andamento</option>
                    <option value="done" className="text-black">Concluído</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-black font-medium"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  {isLoading ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <>
                      <Save className="h-5 w-5" />
                      {task ? "Atualizar" : "Criar"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}