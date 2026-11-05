import type { ComponentType } from "react";
import type { DesignId } from "../context/DesignContext";
import { BoldCorporateLayout } from "./corporate/BoldCorporateLayout";
import { CleanMinimalLayout } from "./minimal/CleanMinimalLayout";
import { CorporateTechnologyLayout } from "./technology/CorporateTechnologyLayout";

export const designLayouts: Record<DesignId, ComponentType> = {
  minimal: CleanMinimalLayout,
  bold: BoldCorporateLayout,
  technology: CorporateTechnologyLayout,
};
