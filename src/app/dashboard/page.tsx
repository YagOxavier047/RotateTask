"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import TaskForm from "@/components/TaskForm";
import { 
  Loader2, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  TrendingUp,
  Calendar as CalendarIcon,
  BarChart3,
  Target,
  Zap,
  MoreHorizontal,
  ArrowUpRight,
  X
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface TaskMetrics {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  overdue: number;
  completedThisWeek: number;
}

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [metrics, setMetrics] = useState<TaskMetrics>({
    total: 0,
    pending: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0,
    completedThisWeek: 0,
  });

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
      calculateMetrics(fetchedTasks);
    } catch (error) {
      console.error("Erro ao buscar tarefas:", error);
      toast.error("Erro ao carregar dados do dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateMetrics = (tasksList: Task[]) => {
    const now = new Date();
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const metricsData: TaskMetrics = {
      total: tasksList.length,
      pending: tasksList.filter((t) => t.status === "todo").length,
      inProgress: tasksList.filter((t) => t.status === "in_progress").length,
      completed: tasksList.filter((t) => t.status === "done").length,
      overdue: tasksList.filter((t) => t.dueDate < now && t.status !== "done").length,
      completedThisWeek: tasksList.filter(
        (t) => t.status === "done" && new Date(t.updatedAt) >= startOfWeek
      ).length,
    };

    setMetrics(metricsData);
  };

  const getRecentTasks = () => {
    return [...tasks]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 5);
  };

  const getUrgentTasks = () => {
    const now = new Date();
    return tasks
      .filter((t) => t.status !== "done" && t.dueDate <= new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000))
      .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
      .slice(0, 3);
  };

  const handleTaskCreated = () => {
    fetchTasks();
    setIsFormOpen(false);
    toast.success("Tarefa criada com sucesso!");
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const completionRate = metrics.total > 0 ? Math.round((metrics.completed / metrics.total) * 100) : 0;
  const productivityChange = metrics.completedThisWeek > 0 ? "+12%" : "0%";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-black mb-2">Dashboard</h1>
              <p className="text-black">
                {new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/tasks"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-black hover:bg-gray-50 transition font-medium"
              >
                <BarChart3 className="h-4 w-4" />
                Ver Tarefas
              </Link>
              <button
                onClick={() => setIsFormOpen(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-sm"
              >
                <Target className="h-4 w-4" />
                Nova Tarefa
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {/* Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Target className="h-5 w-5 text-blue-600" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                +8%
              </span>
            </div>
            <p className="text-3xl font-bold text-black mb-1">{metrics.total}</p>
            <p className="text-sm text-black font-medium">Total de Tarefas</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-amber-50 rounded-lg">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <span className="text-xs font-medium text-amber-600">
                {metrics.pending} pendentes
              </span>
            </div>
            <p className="text-3xl font-bold text-black mb-1">{metrics.pending}</p>
            <p className="text-sm text-black font-medium">Em Andamento</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <span className="text-xs font-medium text-green-600 flex items-center gap-1">
                <ArrowUpRight className="h-3 w-3" />
                {productivityChange}
              </span>
            </div>
            <p className="text-3xl font-bold text-black mb-1">{metrics.completedThisWeek}</p>
            <p className="text-sm text-black font-medium">Concluídas Esta Semana</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
              </div>
              {metrics.overdue > 0 && (
                <span className="text-xs font-medium text-red-600">
                  Atenção!
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-black mb-1">{metrics.overdue}</p>
            <p className="text-sm text-black font-medium">Tarefas Vencidas</p>
          </motion.div>
        </div>

        {/* Progresso e Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Progresso Geral */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">Progresso Geral</h3>
                <p className="text-sm text-black mt-1">Taxa de conclusão</p>
              </div>
              <div className="p-2 bg-blue-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex items-end justify-between mb-2">
                <span className="text-4xl font-bold text-black">{completionRate}%</span>
                <span className="text-sm text-black mb-1">{metrics.completed}/{metrics.total} tarefas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${completionRate}%` }}
                  transition={{ duration: 1, delay: 0.8 }}
                  className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 rounded-full"
                />
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">A Fazer</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-500"></div>
                  <span className="text-sm font-medium text-black">{metrics.pending}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Fazendo</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                  <span className="text-sm font-medium text-black">{metrics.inProgress}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-black">Concluído</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                  <span className="text-sm font-medium text-black">{metrics.completed}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Gráfico de Status */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-black">Distribuição por Status</h3>
                <p className="text-sm text-black mt-1">Visualização do fluxo de trabalho</p>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <MoreHorizontal className="h-5 w-5 text-black" />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "A Fazer", value: metrics.pending, color: "bg-gray-500", percentage: metrics.total > 0 ? (metrics.pending / metrics.total) * 100 : 0 },
                { label: "Fazendo", value: metrics.inProgress, color: "bg-blue-500", percentage: metrics.total > 0 ? (metrics.inProgress / metrics.total) * 100 : 0 },
                { label: "Concluído", value: metrics.completed, color: "bg-emerald-500", percentage: metrics.total > 0 ? (metrics.completed / metrics.total) * 100 : 0 },
              ].map((item) => (
                <div key={item.label} className="text-center">
                  <div className="relative mb-3">
                    <div className="w-24 h-24 mx-auto rounded-full bg-gray-100 flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-2xl font-bold text-black">{Math.round(item.percentage)}%</span>
                        <span className="text-xs text-black">{item.value}</span>
                      </div>
                    </div>
                    <svg className="absolute inset-0 w-24 h-24 transform -rotate-90">
                      <circle
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        className="text-gray-200"
                      />
                      <motion.circle
                        initial={{ strokeDasharray: "0 276" }}
                        animate={{ strokeDasharray: `${(item.percentage / 100) * 276} 276` }}
                        transition={{ duration: 1, delay: 0.9 }}
                        cx="48"
                        cy="48"
                        r="44"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="8"
                        strokeLinecap="round"
                        className={item.color.replace("bg-", "text-")}
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-medium text-black">{item.label}</p>
                  <p className="text-xs text-black mt-1">{item.value} tarefas</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Tarefas Urgentes e Atividades Recentes */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tarefas Urgentes */}
          {getUrgentTasks().length > 0 && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border border-red-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <Zap className="h-5 w-5 text-red-600" />
                <h3 className="text-lg font-semibold text-black">Tarefas Urgentes</h3>
              </div>
              <div className="space-y-3">
                {getUrgentTasks().map((task) => (
                  <div key={task.id} className="bg-white rounded-lg p-4 border border-red-100">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-black mb-1">{task.title}</h4>
                        <div className="flex items-center gap-3 text-sm text-black">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                          </span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            task.priority === 'high' ? 'bg-red-100 text-red-700' :
                            task.priority === 'medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-emerald-100 text-emerald-700'
                          }`}>
                            {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                          </span>
                        </div>
                      </div>
                      <Link href="/tasks" className="text-blue-600 hover:text-blue-700">
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Atividades Recentes */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-black">Atividades Recentes</h3>
              <Link href="/tasks" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Ver todas
              </Link>
            </div>
            <div className="space-y-3">
              {getRecentTasks().map((task) => (
                <div key={task.id} className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    task.status === 'done' ? 'bg-emerald-500' :
                    task.status === 'in_progress' ? 'bg-blue-500' :
                    'bg-gray-500'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-black">{task.title}</p>
                    <p className="text-xs text-black mt-0.5">
                      {new Date(task.updatedAt).toLocaleDateString('pt-BR', { 
                        day: '2-digit', 
                        month: 'short', 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </p>
                  </div>
                </div>
              ))}
              {tasks.length === 0 && (
                <p className="text-sm text-black text-center py-4">
                  Nenhuma atividade recente
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Modal de Criação de Tarefa */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto relative"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition"
              >
                <X className="h-5 w-5 text-black" />
              </button>
              
              <TaskForm
                isOpen={isFormOpen}
                onClose={() => setIsFormOpen(false)}
                task={null}
                userId={user?.uid || ""}
                onSuccess={handleTaskCreated}
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}