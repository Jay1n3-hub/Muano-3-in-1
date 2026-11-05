import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const defaultReasons = [
  "Assess the property and requirements",
  "Plan equipment and system coverage",
  "Install the selected system",
  "Provide post-installation support",
];

interface AboutSectionProps {
  presentation?: "minimal" | "bold" | "technology";
  heading?: string;
  image?: string;
  imageAlt?: string;
}

export function AboutSection({
  presentation = "minimal",
  heading,
  image = "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85",
  imageAlt = "Contemporary glass commercial building at dusk",
}: AboutSectionProps) {
  const reasons = presentation === "technology"
    ? ["Property-specific assessment", "Planned system coverage", "Professional installation", "Post-installation support"]
    : presentation === "bold"
      ? ["Assess the site", "Plan the system", "Install the equipment", "Provide support"]
      : defaultReasons;

  return (
    <section aria-labelledby="about-title" className={`about-section about-section--${presentation} page-section`} id="about">
      <div className="about-image-wrap">
        <img
          alt={imageAlt}
          className="about-image"
          height="900"
          loading="lazy"
          src={image}
          width="1200"
        />
      </div>
      <div className="about-copy">
        <p className="eyebrow"><span /> ABOUT MUANOTRONICS</p>
        <h2 id="about-title">{heading ?? "Electronic security for your property."}</h2>
        <p>
          We provide electronic security systems for residential, commercial and industrial properties in South Africa.
        </p>
        <Link className="button button--dark button--small" to="/about/">About Us <ArrowUpRight size={16} /></Link>
      </div>
      <aside className="why-card" id="why-us">
        <p className="eyebrow"><span /> WHY CHOOSE US</p>
        <h3>Our approach</h3>
        <ul>
          {reasons.map((reason) => <li key={reason}><span className="why-check"><Check size={11} /></span>{reason}</li>)}
        </ul>
        <Link className="text-link" to="/why-us/">More about our approach <ArrowUpRight size={14} /></Link>
      </aside>
    </section>
  );
}
