import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { usePageActions } from "../layout/SiteLayout";
import { usePublishedSiteData, usePublicImage } from "../context/PublishedSiteContext";

const commitments = [
  "Listen carefully to your security priorities.",
  "Recommend solutions that fit your property and budget.",
  "Install with care and provide ongoing support.",
];

export function AboutPage() {
  const { openEnquiry } = usePageActions();
  const { content } = usePublishedSiteData();
  const about = content.about ?? {};
  const mainImage = typeof about.main_image === "string" ? about.main_image : "";
  const { url: publishedImage } = usePublicImage(mainImage);
  const approach = Array.isArray(about.approach_items)
    ? about.approach_items.filter((item): item is string => typeof item === "string")
    : commitments;
  const pageHeading = String(about.page_heading ?? "About Muanotronics");
  const ctaDestination = String(about.cta_destination ?? "");
  const introduction = typeof about.introduction === "string" && about.introduction
    ? about.introduction
    : "Muanotronics provides electronic security systems for residential, commercial and industrial properties in South Africa.";

  return (
    <>
      <Seo description={String(about.seo_description ?? "Learn about Muanotronics and our approach to electronic security solutions.")} title={String(about.seo_title ?? "About Muanotronics")} />
      <main className="inner-page">
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="eyebrow"><span /> ABOUT MUANOTRONICS</p>
            <h1>{pageHeading}</h1>
            <p>{introduction}</p>
          </div>
          <img alt={String(about.image_alt_text ?? "Contemporary commercial building representing the spaces we help protect")} className="inner-hero__image" height="800" src={publishedImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"} width="1200" />
        </section>
        <section className="story-section page-section">
          <div>
            <p className="eyebrow"><span /> WHO WE ARE</p>
            <h2>{String(about.section_heading ?? "Electronic security systems")}</h2>
          </div>
          <div className="story-section__copy">
            <p>{introduction}</p>
            <p>{String(about.description ?? "Our services include CCTV, access control, visitor management, PA systems, alarms and electric fencing.")}</p>
            {ctaDestination
              ? <Link className="button button--dark button--small" to={ctaDestination}>{String(about.cta_text ?? "Talk to Our Team")} <ArrowUpRight size={15} /></Link>
              : <button className="button button--dark button--small" onClick={() => openEnquiry("quote")} type="button">{String(about.cta_text ?? "Talk to Our Team")} <ArrowUpRight size={15} /></button>}
          </div>
        </section>
        <section className="commitments-section page-section" id="why-us">
          <div className="section-heading">
            <p className="eyebrow"><span /> HOW WE WORK</p>
            <h2>{String(about.approach_heading ?? "How we work")}</h2>
          </div>
          <div className="commitment-grid">
            {approach.map((item, index) => (
              <article className="commitment-card" key={item}>
                <span>0{index + 1}</span><Check aria-hidden="true" size={20} /><h3>{item}</h3>
              </article>
            ))}
          </div>
        </section>
        <section className="simple-cta page-section">
          <div><p className="eyebrow"><span /> CONTACT US</p><h2>Discuss your requirements.</h2></div>
          <Link className="button button--dark" to="/contact/">Contact Us <ArrowUpRight size={16} /></Link>
        </section>
      </main>
    </>
  );
}
