"use client";

import { useEffect } from "react";

export function VLibras() {
  useEffect(() => {
    // Carregar script do VLibras
    const script = document.createElement("script");
    script.src = "https://vlibras.gov.br/app/vlibras-plugin.js";
    script.async = true;
    script.onload = () => {
      // Inicializar VLibras
      if (typeof window !== "undefined" && (window as any).VLibrasPlugin) {
        new (window as any).VLibrasPlugin();
      }
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null;
}