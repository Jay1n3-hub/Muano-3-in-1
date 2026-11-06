import { createContext, useContext, type ReactNode } from "react";

export type DesignId = "minimal" | "bold" | "technology";

export const designOptions: { id: DesignId; name: string; description: string }[] = [
  { id: "minimal", name: "Clean Minimal", description: "Spacious, refined and editorial." },
  { id: "bold", name: "Bold Corporate", description: "High-contrast layouts with confident red accents." },
  { id: "technology", name: "Corporate Technology", description: "Structured, image-led blue technology." },
];

interface DesignContextValue {
  design: DesignId;
  setDesign: (design: DesignId) => void;
}

const DesignContext = createContext<DesignContextValue | null>(null);
export function DesignProvider({ children }: { children: ReactNode }) {
  return <DesignContext.Provider value={{ design: "technology", setDesign: () => undefined }}>{children}</DesignContext.Provider>;
}

export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) throw new Error("useDesign must be used within DesignProvider.");
  return context;
}
