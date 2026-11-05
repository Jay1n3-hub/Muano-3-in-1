import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

const reasons = [
  { title: "Site assessment", body: "Review the property, entry points and security requirements." },
  { title: "Solution planning", body: "Select system components and placement for the site." },
  { title: "Installation", body: "Arrange installation of the agreed security system." },
  { title: "Support", body: "Contact Muanotronics for support after installation." },
];

export function WhyUsPage() {
  return (
    <>
      <Seo description="Discover Muanotronics' commitment to thoughtful design, reliable security installations and local support." title="Why Choose Muanotronics?" />
      <main className="inner-page">
        <section className="inner-hero inner-hero--simple">
          <div className="inner-hero__copy">
            <p className="eyebrow"><span /> WHY CHOOSE US</p>
            <h1>How we work</h1>
            <p>Our process covers assessment, planning, installation and support.</p>
          </div>
          <img alt="Secure, modern commercial architecture" className="inner-hero__image" height="800" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85" width="1200" />
        </section>
        <section className="reasons-section page-section">
          <div className="section-heading"><p className="eyebrow"><span /> WHY CHOOSE US</p><h2>Planning, installation and support</h2></div>
          <div className="reasons-grid">
            {reasons.map((reason, index) => (
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
