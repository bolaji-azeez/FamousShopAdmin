"use client";

import { createContext, useState, useEffect, type PropsWithChildren } from "react";

export type Theme = "light" | "dark";
export type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const saved = (typeof window !== "undefined"
      ? (localStorage.getItem("theme") as Theme | null)
      : null);
    const prefersDark =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (saved) setTheme(saved);
    else if (prefersDark) setTheme("dark");
  }, []);

  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(theme);
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
