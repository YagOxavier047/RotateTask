"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import { KanbanBoard } from "@/components/kanban";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import TaskForm from "@/components/TaskForm";

export default function KanbanPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const fetchedTasks = await taskService.getUserTasks(user.uid);
      setTasks(fetchedTasks);
    } catch (error) {
      toast.error("Erro ao carregar tarefas");
    } finally {
      setIsLoading(false);
    }
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setIsFormOpen(false);
    toast.success("Tarefa criada com sucesso!");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-black mb-2">Quadro Kanban</h1>
          <p className="text-black">
            Arraste as tarefas entre as colunas para atualizar o status automaticamente
          </p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
        >
          <Plus className="h-4 w-4" />
          Nova Tarefa
        </button>
      </motion.div>

      <KanbanBoard tasks={tasks} onTasksUpdated={fetchTasks} />

      {/* Modal de Criação */}
      {isFormOpen && (
        <TaskForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          task={null}
          userId={user?.uid || ""}
          onSuccess={handleTaskCreated}
        />
      )}
    </div>
  );
}