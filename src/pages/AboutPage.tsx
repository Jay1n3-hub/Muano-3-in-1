import { ArrowUpRight, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { usePageActions } from "../layout/SiteLayout";

const commitments = [
  "Listen carefully to your security priorities.",
  "Recommend solutions that fit your property and budget.",
  "Install with care and provide ongoing support.",
];

export function AboutPage() {
  const { openEnquiry } = usePageActions();

  return (
    <>
      <Seo description="Learn about Muanotronics and our approach to professional electronic security solutions in South Africa." title="About Muanotronics" />
      <main className="inner-page">
        <section className="inner-hero">
          <div className="inner-hero__copy">
            <p className="eyebrow"><span /> ABOUT MUANOTRONICS</p>
            <h1>About Muanotronics</h1>
            <p>Electronic security solutions for residential, commercial and industrial properties.</p>
          </div>
          <img alt="Contemporary commercial building representing the spaces we help protect" className="inner-hero__image" height="800" src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1400&q=85" width="1200" />
        </section>
        <section className="story-section page-section">
          <div>
            <p className="eyebrow"><span /> WHO WE ARE</p>
            <h2>Electronic security systems</h2>
          </div>
          <div className="story-section__copy">
            <p>Muanotronics provides electronic security systems for residential, commercial and industrial properties in South Africa.</p>
            <p>Our services include CCTV, access control, visitor management, PA systems, alarms and electric fencing.</p>
            <button className="button button--dark button--small" onClick={() => openEnquiry("quote")} type="button">Talk to Our Team <ArrowUpRight size={15} /></button>
          </div>
        </section>
        <section className="commitments-section page-section" id="why-us">
          <div className="section-heading">
            <p className="eyebrow"><span /> HOW WE WORK</p>
            <h2>How we work</h2>
          </div>
          <div className="commitment-grid">
            {commitments.map((item, index) => (
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
