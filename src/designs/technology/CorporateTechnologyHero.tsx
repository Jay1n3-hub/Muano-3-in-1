import { Camera, Fence, LockKeyhole, Megaphone, ShieldAlert, UsersRound } from "lucide-react";
import { company } from "../../data/company";
import { HeroActions } from "../shared/HeroActions";

const serviceAreas = [
  { title: "CCTV", icon: Camera },
  { title: "Access Control", icon: LockKeyhole },
  { title: "Visitor Management", icon: UsersRound },
  { title: "PA Systems", icon: Megaphone },
  { title: "Alarm Systems", icon: ShieldAlert },
  { title: "Electric Fencing", icon: Fence },
];

export function CorporateTechnologyHero() {
  return (
    <section aria-labelledby="hero-title" className="technology-hero">
      <div className="technology-hero__intro">
        <div className="technology-hero__copy">
          <p className="eyebrow"><span /> ELECTRONIC SECURITY SYSTEMS</p>
          <h1 id="hero-title">Smart Security.<br />Intelligent Protection.</h1>
        </div>
        <div className="technology-hero__aside">
          <p>{company.description}</p>
          <HeroActions />
        </div>
      </div>
      <div className="technology-hero__image">
        <img alt={company.heroImageAlt} fetchPriority="high" height="1000" src={company.heroImage} width="2000" />
        <span>MUANOTRONICS / SECURITY SYSTEMS</span>
      </div>
      <div aria-label="Security services" className="technology-hero__services">
        {serviceAreas.map(({ title, icon: Icon }) => (
          <span key={title}><Icon aria-hidden="true" size={18} /> {title}</span>
        ))}
      </div>
    </section>
  );
}
