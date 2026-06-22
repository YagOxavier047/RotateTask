"use client";

import { motion } from "framer-motion";

const stats = [
  { value: "10K+", label: "Tarefas Criadas" },
  { value: "500+", label: "Usuários Ativos" },
  { value: "99%", label: "Uptime" },
  { value: "24/7", label: "Suporte" },
];

export function Stats() {
  return (
    <section id="stats" className="py-20 px-6 bg-black">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-white mb-4">
            Números que impressionam
          </h2>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            O RotateTask está crescendo rapidamente e ajudando equipes a serem mais
            produtivas.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm"
            >
              <p className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-2">
                {stat.value}
              </p>
              <p className="text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}