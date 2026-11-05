import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type LogoStyle = "primary" | "corporate" | "compact" | "stacked" | "icon";

export const logoStyles: { id: LogoStyle; label: string; description: string }[] = [
  { id: "primary", label: "Primary brand", description: "Wordmark with Electronics Solutions tagline" },
  { id: "corporate", label: "Corporate", description: "Expanded wordmark and tagline" },
  { id: "compact", label: "Compact", description: "Horizontal wordmark without tagline" },
  { id: "stacked", label: "Stacked", description: "Centered wordmark with tagline" },
  { id: "icon", label: "Icon only", description: "Original bracket mark" },
];

interface LogoContextValue {
  logoStyle: LogoStyle;
  setLogoStyle: (style: LogoStyle) => void;
}

const LogoContext = createContext<LogoContextValue | null>(null);
const allowedStyles = logoStyles.map(({ id }) => id);

function getStoredLogoStyle(): LogoStyle {
  const savedStyle = window.localStorage.getItem("muanotronics-logo-style");
  return allowedStyles.includes(savedStyle as LogoStyle) ? (savedStyle as LogoStyle) : "primary";
}

export function LogoProvider({ children }: { children: ReactNode }) {
  const [logoStyle, setLogoStyle] = useState<LogoStyle>(getStoredLogoStyle);

  useEffect(() => {
    window.localStorage.setItem("muanotronics-logo-style", logoStyle);
  }, [logoStyle]);

  return <LogoContext.Provider value={{ logoStyle, setLogoStyle }}>{children}</LogoContext.Provider>;
}

export function useLogoStyle(): LogoContextValue {
  const context = useContext(LogoContext);
  if (!context) throw new Error("useLogoStyle must be used within LogoProvider.");
  return context;
}
