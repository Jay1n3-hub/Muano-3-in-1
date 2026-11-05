import { company } from "../../data/company";
import { HeroActions } from "../shared/HeroActions";

export function BoldCorporateHero() {
  return (
    <section aria-labelledby="hero-title" className="hero hero--bold">
      <div className="hero-copy">
        <p className="eyebrow"><span /> ELECTRONIC SECURITY SOLUTIONS</p>
        <h1 id="hero-title">Smart Security.<br />Intelligent<br /><span>Protection.</span></h1>
        <p className="hero-copy__description">{company.description}</p>
        <HeroActions />
      </div>
      <div className="hero-visual">
        <img alt={company.heroImageAlt} className="hero-visual__image" fetchPriority="high" height="1200" src={company.heroImage} width="1200" />
        <span aria-hidden="true" className="hero-bold__index">MUANOTRONICS</span>
      </div>
    </section>
  );
}
