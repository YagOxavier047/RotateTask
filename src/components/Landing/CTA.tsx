"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";

export function CTA() {
  return (
    <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
            <Zap className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Comece gratuitamente hoje
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Pronto para transformar sua produtividade?
          </h2>

          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de usuários que já estão gerenciando suas tarefas de
            forma mais eficiente com o RotateTask.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition font-bold shadow-xl"
            >
              Criar Conta Grátis
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 backdrop-blur-sm text-white border border-white/30 rounded-lg hover:bg-white/20 transition font-bold"
            >
              Fazer Login
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}