"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  KanbanSquare,
  Calendar,
  ListTodo,
  Shield,
  Zap,
} from "lucide-react";

const features = [
  {
    icon: LayoutDashboard,
    title: "Dashboard Inteligente",
    description:
      "Visualize métricas em tempo real, gráficos interativos e o progresso geral dos seus projetos.",
    color: "bg-blue-500",
  },
  {
    icon: KanbanSquare,
    title: "Quadro Kanban",
    description:
      "Arraste e solte tarefas entre colunas. Atualize o status automaticamente com drag and drop.",
    color: "bg-purple-500",
  },
  {
    icon: Calendar,
    title: "Calendário Visual",
    description:
      "Veja todas as suas tarefas em um calendário interativo com cores por prioridade.",
    color: "bg-emerald-500",
  },
  {
    icon: ListTodo,
    title: "Sub-tarefas",
    description:
      "Divida tarefas complexas em sub-tarefas com barra de progresso automática.",
    color: "bg-amber-500",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description:
      "Autenticação Firebase com verificação de email, login social e proteção de dados.",
    color: "bg-red-500",
  },
  {
    icon: Zap,
    title: "Performance",
    description:
      "Construído com Next.js 14, TypeScript e Tailwind CSS para máxima performance.",
    color: "bg-pink-500",
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-4">
            Funcionalidades
          </span>
          <h2 className="text-4xl font-bold text-black mb-4">
            Tudo que você precisa para{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              gerenciar tarefas
            </span>
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Recursos poderosos inspirados nas melhores ferramentas do mercado como Jira,
            ClickUp e Trello.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group bg-gray-50 rounded-2xl p-6 hover:bg-white hover:shadow-xl transition-all duration-300 border border-gray-100"
              >
                <div
                  className={`w-12 h-12 ${feature.color} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-bold text-black mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}