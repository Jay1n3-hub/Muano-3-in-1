import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";

const reasons = [
  "Assess the property and requirements",
  "Plan equipment and system coverage",
  "Install the selected system",
  "Provide post-installation support",
];

export function AboutSection({ presentation = "minimal" }: { presentation?: "minimal" | "bold" | "technology" }) {
  return (
    <section aria-labelledby="about-title" className={`about-section about-section--${presentation} page-section`} id="about">
      <div className="about-image-wrap">
        <img
          alt="Contemporary glass commercial building at dusk"
          className="about-image"
          height="900"
          loading="lazy"
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85"
          width="1200"
        />
      </div>
      <div className="about-copy">
        <p className="eyebrow"><span /> ABOUT MUANOTRONICS</p>
        <h2 id="about-title">Electronic security for your property.</h2>
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
