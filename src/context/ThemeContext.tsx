import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Theme = "mono" | "red" | "blue";

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const allowedThemes: Theme[] = ["mono", "red", "blue"];

function getStoredTheme(): Theme {
  const savedTheme = window.localStorage.getItem("muanotronics-theme");
  return allowedThemes.includes(savedTheme as Theme) ? (savedTheme as Theme) : "mono";
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(getStoredTheme);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem("muanotronics-theme", theme);
  }, [theme]);

  return <ThemeContext.Provider value={{ theme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider.");
  return context;
}
