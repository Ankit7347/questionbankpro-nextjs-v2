// src/components/ThemeProvider.tsx
"use client";

import React, { ReactNode, useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

type Theme = "light" | "dark" | "system";

/* ------------------ */
/* Icons (Improved)   */
/* ------------------ */

const icons: Record<Theme, React.ReactElement> = {
  light: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
      <circle cx="12" cy="12" r="4" />
      <path strokeLinecap="round" d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
    </svg>
  ),
  dark: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-indigo-400" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
    </svg>
  ),
  system: (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M7 20h10M12 16v4" />
    </svg>
  ),
};

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [spinning, setSpinning] = useState(false);

  // Avoid hydration mismatch by only rendering after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const cycleTheme = () => {
    if (spinning) return;
    setSpinning(true);

    const themes: Theme[] = ["light", "dark", "system"];
    const currentTheme = (theme as Theme) || "system";
    const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
    const nextTheme = themes[nextIndex];

    setTheme(nextTheme);

    setTimeout(() => setSpinning(false), 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <button
        onClick={cycleTheme}
        aria-label={`Switch theme (currently ${theme})`}
        className={`
          relative w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300
          /* Light Mode Styles: Added clear border and off-white bg */
          bg-white border-2 border-gray-200 shadow-[0_4px_12px_rgba(0,0,0,0.1)] 
          /* Dark Mode Styles: Glassmorphism and subtle border */
          dark:bg-gray-900 dark:border-gray-700 dark:shadow-[0_4px_20px_rgba(0,0,0,0.4)]
          /* Interaction */
          hover:scale-110 active:scale-90
          ${spinning ? "animate-spin-slow" : ""}
        `}
      >
        {icons[theme as Theme] || icons.system}

        {/* Subtle indicator dot */}
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-20"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-500/20 border border-blue-500/50"></span>
        </span>
      </button>
    </div>
  );
}

function ToasterWithTheme() {
  const { theme } = useTheme();
  return (
    <Toaster
      theme={theme as "light" | "dark" | "system"}
      richColors
      closeButton
      position="top-right"
    />
  );
}

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem>
      {children}
      <ThemeToggle />
      <ToasterWithTheme />
    </NextThemesProvider>
  );
}
