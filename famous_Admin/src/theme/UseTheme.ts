"use client";

import { useContext } from "react";
import { ThemeContext } from "../theme/theme-context";

function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within a ThemeProvider");
  return ctx;
}

export default useTheme;
