"use client";

import React, { ReactNode, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

const THEME_ORDER: Theme[] = ["light", "dark", "system"];

/* ------------------ */
/* System resolver    */
/* ------------------ */

function resolveSystemTheme(): "dark" | "light" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function writeTheme(theme: Theme): void {
  const resolvedTheme =
    theme === "system" ? resolveSystemTheme() : theme;

  document.cookie = `theme=${resolvedTheme}; path=/; max-age=31536000; SameSite=Lax`;
}

const icons: Record<Theme, React.ReactElement> = {
  light: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-yellow-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <circle cx="12" cy="12" r="5" fill="yellow" />
      <path d="M12 1v2m0 18v2m11-11h-2M3 12H1" />
    </svg>
  ),
  dark: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-gray-200"
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M21 12.79A9 9 0 0111.21 3 7 7 0 0012 17a7 7 0 009-4.21z" />
    </svg>
  ),
  system: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="w-6 h-6 text-blue-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <rect x="3" y="4" width="18" height="14" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </svg>
  ),
};

/* ------------------ */
/* Theme helpers      */
/* ------------------ */

function applyTheme(theme: Theme): void {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

function readTheme(): Theme {
  const match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
  const value = match?.[1];
  return value === "light" || value === "dark" || value === "system"
    ? value
    : "system";
}

// function writeTheme(theme: Theme): void {
//   document.cookie = `theme=${theme}; path=/; max-age=31536000; SameSite=Lax`;
// }

/* ------------------ */
/* Provider           */
/* ------------------ */

interface ThemeProviderProps {
  children: ReactNode;
}

export default function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>("system");
  const [spinning, setSpinning] = useState<boolean>(false);

  // Initial theme (after hydration)
  useEffect(() => {
    const saved = readTheme();
    setTheme(saved);
    applyTheme(saved);
  }, []);

  // System theme listener
  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [theme]);

  /* ------------------ */
  /* Spin + cycle logic */
  /* ------------------ */

  const cycleTheme = (): void => {
    setSpinning(true);

    setTimeout(() => {
      setTheme((current) => {
      const next =
        THEME_ORDER[(THEME_ORDER.indexOf(current) + 1) % THEME_ORDER.length];

      writeTheme(next);

      // apply resolved theme to DOM
      if (next === "system") {
        applyTheme(resolveSystemTheme());
      } else {
        applyTheme(next);
      }

      return next;
    });


      setSpinning(false);
    }, 350);
  };

  return (
    <>
      <div
        className="fixed bottom-4 right-4 z-50"
        style={{ width: 56 }}
      >
        <button
          onClick={cycleTheme}
          aria-label="Switch theme"
          title={`Current theme: ${theme}`}
          className={`w-12 h-12 rounded-full bg-gray-200 dark:bg-gray-800 shadow-lg flex items-center justify-center transition-transform ${
            spinning ? "animate-spin" : "active:scale-95"
          }`}
          style={{ animationTimingFunction: "ease-in-out" }}
        >
          {icons[theme]}
        </button>
      </div>

      {children}
    </>
  );
}
