"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Contrast, Sun, Moon, Type, Eye, Keyboard } from "lucide-react";

export function AccessibilityBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [fontSize, setFontSize] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [readingFocus, setReadingFocus] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const savedFontSize = localStorage.getItem("fontSize");
    const savedContrast = localStorage.getItem("highContrast");
    const savedDarkMode = localStorage.getItem("darkMode");
    const savedReadingFocus = localStorage.getItem("readingFocus");
    const savedReduceMotion = localStorage.getItem("reduceMotion");

    if (savedFontSize) {
      setFontSize(Number(savedFontSize));
      document.documentElement.style.fontSize = `${savedFontSize}%`;
    }

    if (savedContrast === "true") {
      setHighContrast(true);
      document.documentElement.classList.add("high-contrast");
    }

    if (savedDarkMode === "true") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }

    if (savedReadingFocus === "true") {
      setReadingFocus(true);
      document.documentElement.classList.add("reading-focus");
    }

    if (savedReduceMotion === "true") {
      setReduceMotion(true);
      document.documentElement.classList.add("reduce-motion");
    }
  }, []);

  const increaseFontSize = () => {
    const newSize = Math.min(fontSize + 10, 150);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem("fontSize", String(newSize));
  };

  const decreaseFontSize = () => {
    const newSize = Math.max(fontSize - 10, 80);
    setFontSize(newSize);
    document.documentElement.style.fontSize = `${newSize}%`;
    localStorage.setItem("fontSize", String(newSize));
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    document.documentElement.classList.toggle("high-contrast");
    localStorage.setItem("highContrast", String(!highContrast));
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("darkMode", String(!darkMode));
  };

  const toggleReadingFocus = () => {
    setReadingFocus(!readingFocus);
    document.documentElement.classList.toggle("reading-focus");
    localStorage.setItem("readingFocus", String(!readingFocus));
  };

  const toggleReduceMotion = () => {
    setReduceMotion(!reduceMotion);
    document.documentElement.classList.toggle("reduce-motion");
    localStorage.setItem("reduceMotion", String(!reduceMotion));
  };

  const resetSettings = () => {
    setFontSize(100);
    setHighContrast(false);
    setDarkMode(false);
    setReadingFocus(false);
    setReduceMotion(false);
    document.documentElement.style.fontSize = "100%";
    document.documentElement.classList.remove(
      "high-contrast",
      "dark",
      "reading-focus",
      "reduce-motion"
    );
    localStorage.removeItem("fontSize");
    localStorage.removeItem("highContrast");
    localStorage.removeItem("darkMode");
    localStorage.removeItem("readingFocus");
    localStorage.removeItem("reduceMotion");
  };

  return (
    <>
      {/* Botão flutuante */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setIsOpen(!isOpen)}
          className="p-4 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition"
          aria-label="Opções de acessibilidade"
        >
          <Type className="h-6 w-6" />
        </motion.button>
      </div>

      {/* Barra de ferramentas */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 p-4 w-80"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-black dark:text-white">
                Acessibilidade
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                
              </button>
            </div>

            <div className="space-y-4">
              {/* Tamanho da Fonte */}
              <div>
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                  Tamanho da Fonte
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={decreaseFontSize}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center font-bold text-gray-700 dark:text-gray-300"
                    aria-label="Diminuir fonte"
                  >
                    −
                  </button>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${((fontSize - 80) / 70) * 100}%` }}
                    />
                  </div>
                  <button
                    onClick={increaseFontSize}
                    className="w-8 h-8 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition flex items-center justify-center font-bold text-gray-700 dark:text-gray-300"
                    aria-label="Aumentar fonte"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 text-center">
                  {fontSize}%
                </p>
              </div>

              {/* Alto Contraste */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Contrast className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Alto Contraste
                  </span>
                </div>
                <button
                  onClick={toggleHighContrast}
                  className={`relative w-12 h-6 rounded-full transition ${
                    highContrast ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label="Alternar alto contraste"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      highContrast ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Modo Escuro */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {darkMode ? (
                    <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  ) : (
                    <Sun className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  )}
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {darkMode ? "Modo Escuro" : "Modo Claro"}
                  </span>
                </div>
                <button
                  onClick={toggleDarkMode}
                  className={`relative w-12 h-6 rounded-full transition ${
                    darkMode ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label="Alternar modo escuro"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      darkMode ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Foco em Leitura */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Eye className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Foco em Leitura
                  </span>
                </div>
                <button
                  onClick={toggleReadingFocus}
                  className={`relative w-12 h-6 rounded-full transition ${
                    readingFocus ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label="Alternar foco em leitura"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      readingFocus ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Reduzir Animações */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Reduzir Animações
                  </span>
                </div>
                <button
                  onClick={toggleReduceMotion}
                  className={`relative w-12 h-6 rounded-full transition ${
                    reduceMotion ? "bg-blue-600" : "bg-gray-300 dark:bg-gray-600"
                  }`}
                  aria-label="Alternar reduzir animações"
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition ${
                      reduceMotion ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>

              {/* Resetar */}
              <button
                onClick={resetSettings}
                className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition text-sm font-medium"
              >
                Resetar Configurações
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}