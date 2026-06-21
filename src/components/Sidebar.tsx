"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ListTodo,
  KanbanSquare,
  Calendar as CalendarIcon,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Zap,
} from "lucide-react";
import { useState } from "react";

const menuItems = [
  {
    href: "/dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    href: "/tasks",
    label: "Minhas Tarefas",
    icon: ListTodo,
  },
  {
    href: "/kanban",
    label: "Quadro Kanban",
    icon: KanbanSquare,
  },
  {
    href: "/calendar",
    label: "Calendário",
    icon: CalendarIcon,
  },
  {
    href: "/settings",
    label: "Configurações",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success("Logout realizado com sucesso!");
      router.push("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
  };

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-200 flex flex-col transition-all duration-300 z-40 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      {/* Header da Sidebar */}
      <div className="p-6 border-b border-gray-200 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Zap className="h-5 w-5 text-white" />
            </div>
            <span className="font-bold text-black text-lg">RotateTask</span>
          </div>
        )}
        {collapsed && (
          <div className="p-2 bg-blue-600 rounded-lg mx-auto">
            <Zap className="h-5 w-5 text-white" />
          </div>
        )}
      </div>

      {/* Botão de recolher */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-white border border-gray-200 rounded-full p-1 shadow-sm hover:bg-gray-50 transition"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4 text-black" />
        ) : (
          <ChevronLeft className="h-4 w-4 text-black" />
        )}
      </button>

      {/* Menu de Navegação */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? "bg-blue-50 text-blue-600 border border-blue-200"
                  : "text-gray-700 hover:bg-gray-50"
              } ${collapsed ? "justify-center" : ""}`}
            >
              <Icon className={`h-5 w-5 flex-shrink-0 ${isActive ? "text-blue-600" : "text-gray-600"}`} />
              {!collapsed && (
                <span className={`font-medium ${isActive ? "text-blue-600" : "text-black"}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Perfil do Usuário */}
      <div className="p-4 border-t border-gray-200">
        {!collapsed && user && (
          <div className="mb-3 px-2">
            <p className="text-sm font-medium text-black truncate">{user.displayName || "Usuário"}</p>
            <p className="text-xs text-gray-600 truncate">{user.email}</p>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 transition w-full ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <LogOut className="h-5 w-5" />
          {!collapsed && <span className="font-medium">Sair</span>}
        </button>
      </div>
    </motion.aside>
  );
}