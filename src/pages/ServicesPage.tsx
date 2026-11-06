import { Seo } from "../components/Seo";
import { ServicesSection } from "../components/ServicesSection";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function ServicesPage() {
  const { settings } = usePublishedSiteData();
  const seo = settings.seo ?? {};
  return (
    <>
      <Seo description={String(seo.default_meta_description || "Explore Muanotronics CCTV, access control, visitor management, PA systems, alarms and electric fencing solutions.")} title={String(seo.default_seo_title || "Our Services | Muanotronics")} />
      <main className="inner-page">
        <ServicesSection compact presentation="technology" />
      </main>
    </>
  );
}
