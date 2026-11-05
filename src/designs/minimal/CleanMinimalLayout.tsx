import { AboutSection } from "../../components/AboutSection";
import { ContactGallerySection } from "../../components/ContactGallerySection";
import { ServicesSection } from "../../components/ServicesSection";
import { CleanMinimalHero } from "./CleanMinimalHero";

export function CleanMinimalLayout() {
  return (
    <>
      <CleanMinimalHero />
      <AboutSection presentation="minimal" />
      <ServicesSection presentation="minimal" />
      <ContactGallerySection presentation="minimal" />
    </>
  );
}
