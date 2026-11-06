import { Seo } from "../components/Seo";
import { CorporateTechnologyLayout } from "../designs/technology/CorporateTechnologyLayout";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function HomePage() {
  const { content, settings } = usePublishedSiteData();
  const home = content.home ?? {};
  const seo = settings.seo ?? {};
  return (
    <>
      <Seo
        description={String(home.seo_description || seo.homepage_meta_description || seo.default_meta_description || "Electronic security solutions for residential, commercial and industrial properties.")}
        title={String(home.seo_title || seo.homepage_seo_title || seo.default_seo_title || "Muanotronics | Smart Security. Intelligent Protection.")}
      />
      <main>
        <CorporateTechnologyLayout />
      </main>
    </>
  );
}
