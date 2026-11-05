import { company } from "../../data/company";
import { HeroActions } from "../shared/HeroActions";

export function CleanMinimalHero() {
  return (
    <section aria-labelledby="hero-title" className="hero hero--minimal">
      <div className="hero-copy">
        <h1 id="hero-title">Smart Security.<br />Intelligent Protection.</h1>
        <p className="hero-copy__description">{company.description}</p>
        <HeroActions />
      </div>
      <div className="hero-visual">
        <img alt={company.heroImageAlt} className="hero-visual__image" fetchPriority="high" height="1200" src={company.heroImage} width="1200" />
      </div>
    </section>
  );
}
