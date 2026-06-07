"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { 
  Loader2, 
  LogOut, 
  UserX, 
  AlertTriangle,
  Mail,
  Shield
} from "lucide-react";
import Link from "next/link";

export default function SettingsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [password, setPassword] = useState("");

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/login");
    return null;
  }

  // ✅ Função para excluir conta
  const handleDeleteAccount = async () => {
    if (!password) {
      toast.error("Por favor, digite sua senha para confirmar");
      return;
    }

    setIsLoading(true);
    try {
      // Reautenticar antes de excluir
      await authService.reauthenticate(password);
      // Excluir conta
      await authService.deleteAccount();
      
      toast.success("Conta excluída com sucesso");
      router.push("/");
    } catch (error: unknown) {
      toast.error("Erro ao excluir conta. Verifique sua senha e tente novamente.");
    } finally {
      setIsLoading(false);
      setShowDeleteModal(false);
      setPassword("");
    }
  };

  // ✅ Função para logout
  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logout realizado com sucesso");
      router.push("/login");
    } catch (error: unknown) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl p-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Configurações da Conta
          </h1>
          <p className="text-gray-600 mb-8">
            Gerencie suas preferências e dados da conta
          </p>

          {/* Informações da Conta */}
          <div className="mb-8 pb-8 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Informações da Conta
            </h2>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">E-mail</p>
                  <p className="font-medium text-gray-900">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Status do E-mail</p>
                  <p className={`font-medium ${user.emailVerified ? 'text-green-600' : 'text-yellow-600'}`}>
                    {user.emailVerified ? 'Verificado ✓' : 'Não verificado ⚠️'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Zona de Perigo */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-red-600 mb-4">
              Zona de Perigo
            </h2>
            
            <div className="space-y-4">
              {/* Botão Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                <LogOut className="h-5 w-5" />
                Sair da Conta
              </button>

              {/* Botão Excluir Conta */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
              >
                <UserX className="h-5 w-5" />
                Excluir Conta Permanentemente
              </button>
            </div>
          </div>

          <div className="flex gap-4">
            <Link
              href="/dashboard"
              className="flex-1 text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Voltar ao Dashboard
            </Link>
          </div>
        </motion.div>
      </div>

      {/* Modal de Confirmação */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 max-w-md w-full"
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <h2 className="text-2xl font-bold text-gray-900">
                Excluir Conta?
              </h2>
            </div>

            <p className="text-gray-600 mb-6">
              Esta ação <strong>não pode ser desfeita</strong>. Todos os seus dados, 
              tarefas e informações serão permanentemente excluídos.
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Digite sua senha para confirmar
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleDeleteAccount()}
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setPassword("");
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  "Excluir Conta"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}