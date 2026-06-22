"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Zap } from "lucide-react";

export function Hero() {
  const features = [
    "Gestão visual de tarefas",
    "Quadro Kanban interativo",
    "Dashboard com métricas",
    "Colaboração em equipe",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-20 pb-12 px-6 overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 -z-10" />
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob -z-10" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 -z-10" />
      <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 -z-10" />

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        {/* Texto */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <Zap className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              Gestão de tarefas simplificada
            </span>
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold text-black mb-6 leading-tight">
            Organize suas tarefas com{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              eficiência
            </span>
          </h1>

          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            O RotateTask é a ferramenta perfeita para equipes que querem gerenciar
            projetos de forma visual, colaborativa e eficiente. Inspirado no Jira e ClickUp.
          </p>

          {/* Lista de features */}
          <div className="grid grid-cols-2 gap-3 mb-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="flex items-center gap-2"
              >
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
                <span className="text-gray-700 text-sm font-medium">{feature}</span>
              </motion.div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/20"
            >
              Começar Grátis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition font-semibold"
            >
              Fazer Login
            </Link>
          </div>
        </motion.div>

        {/* Mockup */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 relative z-10">
            {/* Mockup Header */}
            <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-100">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div className="flex-1 text-center text-xs text-gray-400">
                RotateTask - Dashboard
              </div>
            </div>

            {/* Mockup Content */}
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Total", value: "24", color: "bg-blue-500" },
                  { label: "Pendentes", value: "8", color: "bg-amber-500" },
                  { label: "Concluídas", value: "16", color: "bg-emerald-500" },
                ].map((item) => (
                  <div key={item.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 mb-1">{item.label}</p>
                    <p className="text-2xl font-bold text-black">{item.value}</p>
                    <div className={`w-8 h-1 ${item.color} rounded-full mt-2`} />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                {[
                  { title: "Implementar login", priority: "high" },
                  { title: "Criar dashboard", priority: "medium" },
                  { title: "Testar aplicação", priority: "low" },
                ].map((task, index) => (
                  <motion.div
                    key={task.title}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="bg-white border border-gray-200 rounded-lg p-3 flex items-center gap-3"
                  >
                    <div
                      className={`w-2 h-2 rounded-full ${
                        task.priority === "high"
                          ? "bg-red-500"
                          : task.priority === "medium"
                          ? "bg-amber-500"
                          : "bg-emerald-500"
                      }`}
                    />
                    <span className="text-sm font-medium text-black flex-1">
                      {task.title}
                    </span>
                    <div className="w-16 h-1.5 bg-gray-200 rounded-full">
                      <div
                        className={`h-full rounded-full ${
                          task.priority === "high"
                            ? "bg-red-500 w-3/4"
                            : task.priority === "medium"
                            ? "bg-amber-500 w-1/2"
                            : "bg-emerald-500 w-full"
                        }`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-100 rounded-full -z-10" />
          <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-purple-100 rounded-full -z-10" />
        </motion.div>
      </div>
    </section>
  );
}