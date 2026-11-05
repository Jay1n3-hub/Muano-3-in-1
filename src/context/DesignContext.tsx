import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

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
const allowedDesigns = designOptions.map(({ id }) => id);

function getStoredDesign(): DesignId {
  const savedDesign = window.localStorage.getItem("muanotronics-design");
  return allowedDesigns.includes(savedDesign as DesignId) ? savedDesign as DesignId : "minimal";
}

export function DesignProvider({ children }: { children: ReactNode }) {
  const [design, updateDesign] = useState<DesignId>(getStoredDesign);

  function setDesign(nextDesign: DesignId) {
    updateDesign(nextDesign);
    document.documentElement.dataset.design = nextDesign;
  }

  useEffect(() => {
    document.documentElement.dataset.design = design;
    window.localStorage.setItem("muanotronics-design", design);
  }, [design]);

  return <DesignContext.Provider value={{ design, setDesign }}>{children}</DesignContext.Provider>;
}

export function useDesign(): DesignContextValue {
  const context = useContext(DesignContext);
  if (!context) throw new Error("useDesign must be used within DesignProvider.");
  return context;
}
