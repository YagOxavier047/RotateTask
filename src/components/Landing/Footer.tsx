import Link from "next/link";
import { Zap } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Logo e Descrição */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">RotateTask</span>
            </Link>
            <p className="text-sm leading-relaxed max-w-md">
              A ferramenta definitiva para gestão de tarefas. Inspirada no Jira e
              ClickUp, construída para equipes modernas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Produto</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#features" className="hover:text-white transition">
                  Funcionalidades
                </a>
              </li>
              <li>
                <a href="#demo" className="hover:text-white transition">
                  Demonstração
                </a>
              </li>
              <li>
                <a href="#stats" className="hover:text-white transition">
                  Estatísticas
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-4">Conta</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition">
                  Cadastro
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm">
            © 2026 RotateTask. Todos os direitos reservados.
          </p>
          <p className="text-sm">
            Desenvolvido com{" "}
            <span className="text-red-500">❤</span> por Yago Xavier
          </p>
        </div>
      </div>
    </footer>
  );
}