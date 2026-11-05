import { AboutSection } from "../../components/AboutSection";
import { ContactGallerySection } from "../../components/ContactGallerySection";
import { ServicesSection } from "../../components/ServicesSection";
import { BoldCorporateHero } from "./BoldCorporateHero";

export function BoldCorporateLayout() {
  return (
    <>
      <BoldCorporateHero />
      <ServicesSection presentation="bold" />
      <AboutSection presentation="bold" />
      <ContactGallerySection presentation="bold" />
    </>
  );
}
