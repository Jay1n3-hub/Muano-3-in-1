import { AboutSection } from "../../components/AboutSection";
import { ContactGallerySection } from "../../components/ContactGallerySection";
import { ServicesSection } from "../../components/ServicesSection";
import { services } from "../../data/services";
import { CorporateTechnologyHero } from "./CorporateTechnologyHero";
import { TechnologyProcess } from "./TechnologyProcess";

export function CorporateTechnologyLayout() {
  return (
    <>
      <CorporateTechnologyHero />
      <AboutSection
        heading="Modern Technology. Real Protection."
        image={services[1].image}
        imageAlt={services[1].imageAlt}
        presentation="technology"
      />
      <ServicesSection presentation="technology" />
      <TechnologyProcess />
      <ContactGallerySection presentation="technology" />
    </>
  );
}
