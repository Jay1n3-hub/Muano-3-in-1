import { Seo } from "../components/Seo";
import { ServicesSection } from "../components/ServicesSection";
import { useDesign } from "../context/DesignContext";

export function ServicesPage() {
  const { design } = useDesign();
  return (
    <>
      <Seo description="Explore Muanotronics CCTV, access control, visitor management, PA systems, alarms and electric fencing solutions." title="Our Services | Muanotronics" />
      <main className="inner-page">
        <ServicesSection compact presentation={design} />
      </main>
    </>
  );
}
