import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { usePublishedSiteData, usePublicImage } from "../context/PublishedSiteContext";

const reasons = [
  { title: "Site assessment", body: "Review the property, entry points and security requirements." },
  { title: "Solution planning", body: "Select system components and placement for the site." },
  { title: "Installation", body: "Arrange installation of the agreed security system." },
  { title: "Support", body: "Contact Muanotronics for support after installation." },
];

export function WhyUsPage() {
  const { content } = usePublishedSiteData();
  const whyUs = content["why-us"] ?? {};
  const imagePath = typeof whyUs.main_image === "string" ? whyUs.main_image : "";
  const { url: publishedImage } = usePublicImage(imagePath);
  const configuredSteps = Array.isArray(whyUs.process_steps)
    ? whyUs.process_steps.filter((item): item is string => typeof item === "string")
    : null;
  const displayedReasons = configuredSteps?.length
    ? configuredSteps.map((step, index) => {
      const [title, body] = step.split("|").map((part) => part.trim());
      return { title: title || `Step ${index + 1}`, body: body ?? "" };
    })
    : reasons;
  const features = Array.isArray(whyUs.feature_items)
    ? whyUs.feature_items.filter((item): item is string => typeof item === "string")
    : [];
  const pageHeading = String(whyUs.main_heading ?? "How we work");

  return (
    <>
      <Seo description={String(whyUs.seo_description ?? "Learn about the Muanotronics service and installation process.")} title={String(whyUs.seo_title ?? "Why Choose Muanotronics?")} />
      <main className="inner-page">
        <section className="inner-hero inner-hero--simple">
          <div className="inner-hero__copy">
            <p className="eyebrow"><span /> WHY CHOOSE US</p>
            <h1>{pageHeading}</h1>
            <p>{String(whyUs.supporting_description ?? "Our process covers assessment, planning, installation and support.")}</p>
          </div>
          <img alt="Secure, modern commercial architecture" className="inner-hero__image" height="800" src={publishedImage || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"} width="1200" />
        </section>
        <section className="reasons-section page-section">
          <div className="section-heading"><p className="eyebrow"><span /> WHY CHOOSE US</p><h2>{String(whyUs.process_heading ?? "Planning, installation and support")}</h2></div>
          {features.length > 0 && <ul className="why-us-features">{features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>}
          <div className="reasons-grid">
            {displayedReasons.map((reason, index) => (
              <article className="reason-card" key={reason.title}>
                <span className="reason-card__number">0{index + 1}</span>
                <span className="reason-card__check"><Check size={15} /></span>
                <h3>{reason.title}</h3><p>{reason.body}</p>
              </article>
            ))}
          </div>
          <div className="simple-cta"><div><p className="eyebrow"><span /> CONTACT US</p><h2>Discuss your security requirements.</h2></div><Link className="button button--dark" to="/contact/">Contact Us <ArrowUpRight size={16} /></Link></div>
        </section>
      </main>
    </>
  );
}
