import { Headset, Settings2, ShieldCheck, Wrench } from "lucide-react";
import { company } from "../../data/company";
import { HeroActions } from "../shared/HeroActions";

const technologyFeatures = [
  { title: "Integrated Security", icon: ShieldCheck },
  { title: "Professional Installation", icon: Wrench },
  { title: "Tailored Solutions", icon: Settings2 },
  { title: "Ongoing Support", icon: Headset },
];

export function CorporateTechnologyHero() {
  return (
    <section aria-labelledby="hero-title" className="technology-hero">
      <div className="technology-hero__intro">
        <div className="technology-hero__copy">
          <p className="eyebrow"><span /> ELECTRONIC SECURITY SYSTEMS</p>
          <h1 id="hero-title">Smart Security.<br />Intelligent <span>Protection.</span></h1>
        </div>
        <div className="technology-hero__aside">
          <p>{company.description}</p>
          <HeroActions />
        </div>
      </div>
      <div className="technology-hero__image">
        <img alt={company.technologyHeroImageAlt} fetchPriority="high" height="1000" src={company.technologyHeroImage} width="2000" />
      </div>
      <div aria-label="Our approach" className="technology-hero__services">
        {technologyFeatures.map(({ title, icon: Icon }) => (
          <span key={title}><Icon aria-hidden="true" size={18} /> {title}</span>
        ))}
      </div>
    </section>
  );
}
