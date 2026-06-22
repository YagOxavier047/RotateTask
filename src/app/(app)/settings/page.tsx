"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { profileService, UserProfile } from "@/services/profile.service";
import { taskService } from "@/services/task.service";
import { Task } from "@/types/task";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  Loader2,
  User as UserIcon,
  Briefcase,
  ListTodo,
  Shield,
  LogOut,
  Trash2,
  Save,
  Edit3,
  Calendar,
  Flag,
  CheckCircle2,
  Clock,
  AlertCircle,
  Building2,
  Mail,
  Camera,
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editData, setEditData] = useState({
    displayName: "",
    role: "developer",
    department: "",
    bio: "",
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadProfileAndTasks();
    }
  }, [user]);

  const loadProfileAndTasks = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const profileData = await profileService.getOrCreateProfile(user.uid, {
        displayName: user.displayName || undefined,
        email: user.email || undefined,
        photoURL: user.photoURL || undefined,
      });
      setProfile(profileData);
      setEditData({
        displayName: profileData.displayName,
        role: profileData.role,
        department: profileData.department || "",
        bio: profileData.bio || "",
      });

      const userTasks = await taskService.getUserTasks(user.uid);
      setTasks(userTasks);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao carregar perfil");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!user) return;
    setIsSaving(true);
    try {
      await profileService.updateProfile(user.uid, editData);
      setProfile((prev) =>
        prev ? { ...prev, ...editData } : prev
      );
      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logout realizado!");
      router.push("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Tem certeza que deseja excluir sua conta? Esta ação não pode ser revertida.")) {
      return;
    }
    try {
      await authService.deleteAccount();
      toast.success("Conta excluída com sucesso");
      router.push("/");
    } catch (error) {
      toast.error("Erro ao excluir conta");
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-200";
      case "medium": return "bg-amber-100 text-amber-700 border-amber-200";
      case "low": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "todo": return { label: "A Fazer", color: "bg-gray-500" };
      case "in_progress": return { label: "Fazendo", color: "bg-blue-500" };
      case "done": return { label: "Concluído", color: "bg-emerald-500" };
      default: return { label: status, color: "bg-gray-500" };
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alta";
      case "medium": return "Média";
      case "low": return "Baixa";
      default: return priority;
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const roleInfo = profile ? profileService.getRoleLabel(profile.role) : null;
  const pendingTasks = tasks.filter((t) => t.status !== "done").length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-50 to-blue-50/30 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-black mb-2">Configurações</h1>
          <p className="text-black">
            Gerencie seu perfil, cargo e preferências da conta
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Coluna Esquerda - Perfil */}
          <div className="lg:col-span-1 space-y-6">
            {/* Card de Perfil */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <div className="relative mb-4">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                    {profile?.displayName?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition">
                    <Camera className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                {/* Nome */}
                <h2 className="text-xl font-bold text-black mb-1">
                  {profile?.displayName || "Usuário"}
                </h2>

                {/* Cargo */}
                {roleInfo && (
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full mb-3">
                    <span className="text-lg">{roleInfo.icon}</span>
                    <span className="text-sm font-medium text-blue-700">
                      {roleInfo.label}
                    </span>
                  </div>
                )}

                {/* Email */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Mail className="h-4 w-4" />
                  <span className="break-all">{profile?.email}</span>
                </div>

                {/* Departamento */}
                {profile?.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                    <Building2 className="h-4 w-4" />
                    <span>{profile.department}</span>
                  </div>
                )}

                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-black rounded-lg hover:bg-gray-200 transition font-medium text-sm w-full"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? "Cancelar Edição" : "Editar Perfil"}
                </button>
              </div>
            </motion.div>

            {/* Card de Cargo */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-purple-50 rounded-lg">
                  <Briefcase className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-black">Cargo Atual</h3>
              </div>

              {roleInfo && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-gradient-to-br from-purple-50 to-blue-50 rounded-lg border border-purple-100">
                    <span className="text-3xl">{roleInfo.icon}</span>
                    <div>
                      <p className="font-semibold text-black">{roleInfo.label}</p>
                      <p className="text-xs text-gray-600">
                        {profile?.department || "Sem departamento definido"}
                      </p>
                    </div>
                  </div>

                  {profile?.bio && (
                    <div className="pt-3 border-t border-gray-100">
                      <p className="text-xs font-medium text-gray-600 mb-1">Sobre</p>
                      <p className="text-sm text-black">{profile.bio}</p>
                    </div>
                  )}
                </div>
              )}
            </motion.div>

            {/* Card de Conta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Shield className="h-5 w-5 text-gray-600" />
                </div>
                <h3 className="text-lg font-bold text-black">Conta</h3>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-black hover:bg-gray-50 rounded-lg transition"
                >
                  <LogOut className="h-5 w-5 text-gray-600" />
                  <span className="font-medium">Sair da conta</span>
                </button>

                <button
                  onClick={handleDeleteAccount}
                  className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="h-5 w-5" />
                  <span className="font-medium">Excluir conta</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Coluna Direita - Edição + Tarefas */}
          <div className="lg:col-span-2 space-y-6">
            {/* Formulário de Edição */}
            {isEditing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center gap-2 mb-6">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <UserIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-bold text-black">
                    Editar Informações
                  </h3>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={editData.displayName}
                      onChange={(e) =>
                        setEditData({ ...editData, displayName: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Cargo / Função
                    </label>
                    <select
                      value={editData.role}
                      onChange={(e) =>
                        setEditData({ ...editData, role: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    >
                      {profileService.ROLES.map((role) => (
                        <option key={role.value} value={role.value}>
                          {role.icon} {role.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={editData.department}
                      onChange={(e) =>
                        setEditData({ ...editData, department: e.target.value })
                      }
                      placeholder="Ex: Engenharia, Design, Produto"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-black"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-black mb-1">
                      Bio / Sobre você
                    </label>
                    <textarea
                      value={editData.bio}
                      onChange={(e) =>
                        setEditData({ ...editData, bio: e.target.value })
                      }
                      rows={3}
                      placeholder="Conte um pouco sobre você..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-black"
                    />
                  </div>

                  <button
                    onClick={handleSaveProfile}
                    disabled={isSaving}
                    className="w-full inline-flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                  >
                    {isSaving ? (
                      <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                      <>
                        <Save className="h-5 w-5" />
                        Salvar Alterações
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Estatísticas Rápidas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-3 gap-4"
            >
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <ListTodo className="h-4 w-4 text-blue-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Total
                  </span>
                </div>
                <p className="text-2xl font-bold text-black">{tasks.length}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Pendentes
                  </span>
                </div>
                <p className="text-2xl font-bold text-black">{pendingTasks}</p>
              </div>
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                  <span className="text-xs font-medium text-gray-600">
                    Concluídas
                  </span>
                </div>
                <p className="text-2xl font-bold text-black">{completedTasks}</p>
              </div>
            </motion.div>

            {/* Tarefas Atribuídas */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-emerald-50 rounded-lg">
                    <ListTodo className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-black">
                      Minhas Tarefas
                    </h3>
                    <p className="text-xs text-gray-600">
                      Tarefas atribuídas ao seu perfil
                    </p>
                  </div>
                </div>
                <Link
                  href="/tasks"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  Ver todas →
                </Link>
              </div>

              {tasks.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ListTodo className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">Nenhuma tarefa atribuída</p>
                  <p className="text-sm mt-1">
                    Crie sua primeira tarefa para começar
                  </p>
                  <Link
                    href="/tasks"
                    className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                  >
                    Criar Tarefa
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {tasks.slice(0, 10).map((task) => {
                    const statusInfo = getStatusLabel(task.status);
                    return (
                      <div
                        key={task.id}
                        className="p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition border border-gray-100"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-black text-sm mb-1 truncate">
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-xs text-gray-600 line-clamp-1 mb-2">
                                {task.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2 flex-wrap">
                              <span
                                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityColor(
                                  task.priority
                                )}`}
                              >
                                <Flag className="h-3 w-3" />
                                {getPriorityLabel(task.priority)}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-600">
                                <Calendar className="h-3 w-3" />
                                {new Date(task.dueDate).toLocaleDateString("pt-BR")}
                              </span>
                              <span className="inline-flex items-center gap-1 text-xs">
                                <span
                                  className={`w-2 h-2 rounded-full ${statusInfo.color}`}
                                />
                                <span className="text-gray-700">
                                  {statusInfo.label}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {tasks.length > 10 && (
                    <p className="text-center text-sm text-gray-500 pt-2">
                      + {tasks.length - 10} tarefas mais
                    </p>
                  )}
                </div>
              )}
            </motion.div>

            {/* Data de Criação */}
            {profile && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border border-blue-100 p-6"
              >
                <div className="flex items-center gap-2 mb-2">
                  <UserIcon className="h-5 w-5 text-blue-600" />
                  <h3 className="text-sm font-bold text-black">
                    Membro desde
                  </h3>
                </div>
                <p className="text-lg font-semibold text-black">
                  {profile.createdAt.toLocaleDateString("pt-BR", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}