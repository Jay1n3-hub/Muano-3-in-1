import { Headset, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { company } from "../../data/company";
import { usePublishedSiteData, usePublicImage } from "../../context/PublishedSiteContext";
import { HeroActions } from "../shared/HeroActions";

const technologyFeatures = [
  { title: "Integrated Security", icon: ShieldCheck },
  { title: "Professional Installation", icon: Wrench },
  { title: "Tailored Solutions", icon: Settings2 },
  { title: "Ongoing Support", icon: Headset },
];

export function CorporateTechnologyHero() {
  const { content } = usePublishedSiteData();
  const home = content.home ?? {};
  const imagePath = typeof home.hero_image === "string" ? home.hero_image : "";
  const { url: publishedHeroImage } = usePublicImage(imagePath);
  const heading = typeof home.hero_heading === "string" && home.hero_heading.trim()
    ? home.hero_heading
    : "Smart Security. Intelligent Protection.";
  const image = publishedHeroImage || company.technologyHeroImage;
  const imageAlt = typeof home.hero_image_alt === "string" && home.hero_image_alt.trim()
    ? home.hero_image_alt
    : company.technologyHeroImageAlt;
  const featureItems = Array.isArray(home.feature_strip_items)
    ? home.feature_strip_items.filter((item): item is string => typeof item === "string")
    : technologyFeatures.map(({ title }) => title);
  const actions = {
    primaryText: typeof home.primary_cta_text === "string" ? home.primary_cta_text : "Request a Quote",
    primaryDestination: typeof home.primary_cta_destination === "string" ? home.primary_cta_destination : "quote",
    secondaryText: typeof home.secondary_cta_text === "string" ? home.secondary_cta_text : "Explore Our Services",
    secondaryDestination: typeof home.secondary_cta_destination === "string" ? home.secondary_cta_destination : "/services/",
  };

  return (
    <section aria-labelledby="hero-title" className="technology-hero">
      <div className="technology-hero__intro">
        <div className="technology-hero__copy">
          <p className="eyebrow"><span /> {typeof home.hero_label === "string" && home.hero_label.trim() ? home.hero_label : "ELECTRONIC SECURITY SYSTEMS"}</p>
          <h1 id="hero-title">{heading === "Smart Security. Intelligent Protection." ? <>Smart Security.<br />Intelligent <span>Protection.</span></> : heading}</h1>
        </div>
        <div className="technology-hero__aside">
          <p>{typeof home.hero_description === "string" && home.hero_description.trim() ? home.hero_description : company.description}</p>
          <HeroActions {...actions} />
        </div>
      </div>
      <div className="technology-hero__image">
        <img alt={imageAlt} fetchPriority="high" height="1000" src={image} style={{ objectPosition: typeof home.hero_focal_position === "string" ? home.hero_focal_position : "center" }} width="2000" />
      </div>
      <div aria-label={typeof home.feature_strip_heading === "string" ? home.feature_strip_heading : "Our approach"} className="technology-hero__services">
        {featureItems.map((title, index) => {
          const Icon = technologyFeatures[index % technologyFeatures.length].icon;
          return <span key={`${title}-${index}`}><Icon aria-hidden="true" size={18} /> {title}</span>;
        })}
      </div>
    </section>
  );
}
