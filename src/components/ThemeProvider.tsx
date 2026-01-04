"use client";

import { ReactNode, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark" | "system";

function applyTheme(theme: Theme) {
  const root = document.documentElement;

  if (theme === "system") {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
  } else {
    root.classList.toggle("dark", theme === "dark");
  }
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark"); // default dark
  const [hydrated, setHydrated] = useState(false);

  // ✅ Mark hydration complete
  useEffect(() => {
    setHydrated(true);
  }, []);

  // ✅ Apply theme ONLY after hydration
  useEffect(() => {
    if (!hydrated) return;

    const match = document.cookie.match(/(?:^|; )theme=([^;]+)/);
    const cookieTheme = (match?.[1] as Theme) || "dark";

    setTheme(cookieTheme);
    applyTheme(cookieTheme);
  }, [hydrated]);

  // Optional: react to system changes AFTER hydration
  useEffect(() => {
    if (!hydrated || theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = () => applyTheme("system");

    media.addEventListener("change", handler);
    return () => media.removeEventListener("change", handler);
  }, [hydrated, theme]);

  return <>{children}</>;
}
