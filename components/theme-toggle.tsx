"use client";

import { useEffect, useState } from "react";

type Theme = "dark" | "light";

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  localStorage.setItem("superada-theme", theme);
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const storedTheme = localStorage.getItem("superada-theme");
    const nextTheme: Theme = storedTheme === "light" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = () => {
    const nextTheme: Theme = theme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    applyTheme(nextTheme);
  };

  return (
    <button
      aria-label="Toggle theme"
      className="surface-muted inline-flex h-10 min-w-10 items-center justify-center rounded-full border px-3 text-xs font-medium tracking-wide text-slate-100 transition hover:border-cyan-300/40 hover:text-cyan-200 light:text-slate-800 light:hover:text-cyan-700"
      onClick={toggleTheme}
      type="button"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
