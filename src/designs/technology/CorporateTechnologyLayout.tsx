import { AboutSection } from "../../components/AboutSection";
import { ContactGallerySection } from "../../components/ContactGallerySection";
import { ServicesSection } from "../../components/ServicesSection";
import { CorporateTechnologyHero } from "./CorporateTechnologyHero";
import { TechnologyProcess } from "./TechnologyProcess";

export function CorporateTechnologyLayout() {
  return (
    <>
      <CorporateTechnologyHero />
      <TechnologyProcess />
      <ServicesSection presentation="technology" />
      <AboutSection presentation="technology" />
      <ContactGallerySection presentation="technology" />
    </>
  );
}
