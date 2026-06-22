import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { Toaster } from "sonner";
import { VLibras } from "@/components/VLibras";
import { AccessibilityBar } from "@/components/AccessibilityBar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "RotateTask - Gestão de Tarefas",
  description: "Organize suas tarefas com eficiência",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <VLibras />
          <AccessibilityBar />
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}