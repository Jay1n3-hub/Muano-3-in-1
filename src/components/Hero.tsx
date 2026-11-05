import { useDesign } from "../context/DesignContext";
import { BoldCorporateHero } from "../designs/corporate/BoldCorporateHero";
import { CleanMinimalHero } from "../designs/minimal/CleanMinimalHero";
import { CorporateTechnologyHero } from "../designs/technology/CorporateTechnologyHero";

const heroLayouts = {
  minimal: CleanMinimalHero,
  bold: BoldCorporateHero,
  technology: CorporateTechnologyHero,
};

export function Hero() {
  const { design } = useDesign();
  const HeroLayout = heroLayouts[design];
  return <HeroLayout />;
}
