"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export function Demo() {
  return (
    <section id="demo" className="py-20 px-6 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="inline-block px-4 py-1 bg-purple-50 text-purple-700 rounded-full text-sm font-medium mb-4">
            Demonstração
          </span>
          <h2 className="text-4xl font-bold text-black mb-4">
            Veja o RotateTask em ação
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            Interface moderna e intuitiva, inspirada nas melhores ferramentas de gestão
            de projetos do mercado.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Kanban Preview */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full" />
              Quadro Kanban
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { title: "A Fazer", color: "bg-gray-100", tasks: ["Design UI", "Criar API"] },
                { title: "Fazendo", color: "bg-blue-50", tasks: ["Implementar login"] },
                { title: "Concluído", color: "bg-emerald-50", tasks: ["Setup projeto"] },
              ].map((column) => (
                <div key={column.title} className={`${column.color} rounded-lg p-3`}>
                  <p className="text-xs font-bold text-black mb-2">{column.title}</p>
                  <div className="space-y-2">
                    {column.tasks.map((task) => (
                      <div
                        key={task}
                        className="bg-white rounded p-2 text-xs text-gray-700 shadow-sm"
                      >
                        {task}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl border border-gray-200 p-6"
          >
            <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-purple-500 rounded-full" />
              Dashboard
            </h3>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "Total", value: "24", color: "text-blue-600" },
                  { label: "Pendentes", value: "8", color: "text-amber-600" },
                  { label: "Concluídas", value: "16", color: "text-emerald-600" },
                  { label: "Vencidas", value: "2", color: "text-red-600" },
                ].map((metric) => (
                  <div key={metric.label} className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600">{metric.label}</p>
                    <p className={`text-2xl font-bold ${metric.color}`}>
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600 mb-2">Progresso Geral</p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full w-3/4" />
                  </div>
                  <span className="text-sm font-bold text-black">75%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-lg shadow-blue-600/20"
          >
            Experimentar Agora
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}