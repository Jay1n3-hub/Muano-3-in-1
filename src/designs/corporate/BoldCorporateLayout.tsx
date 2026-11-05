import { AboutSection } from "../../components/AboutSection";
import { ContactGallerySection } from "../../components/ContactGallerySection";
import { ServicesSection } from "../../components/ServicesSection";
import { services } from "../../data/services";
import { BoldCorporateHero } from "./BoldCorporateHero";

export function BoldCorporateLayout() {
  return (
    <>
      <BoldCorporateHero />
      <ServicesSection presentation="bold" />
      <AboutSection
        heading="Electronic security systems"
        image={services[1].image}
        imageAlt={services[1].imageAlt}
        presentation="bold"
      />
      <ContactGallerySection presentation="bold" />
    </>
  );
}
