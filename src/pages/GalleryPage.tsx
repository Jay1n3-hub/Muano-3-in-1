import { ArrowLeft, ArrowUpRight, Construction, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function GalleryPage() {
  return (
    <>
      <Seo
        description="Our project gallery is under construction. Check back soon to see Muanotronics electronic security installations and solutions."
        title="Project Gallery | Muanotronics"
      />
      <main className="gallery-page">
        <section aria-labelledby="gallery-title" className="gallery-hero">
          <div className="gallery-hero__copy">
            <p className="eyebrow"><span /> GALLERY</p>
            <h1 id="gallery-title">Our Project Gallery<br />Is Under Construction</h1>
            <p>We're preparing a showcase of our electronic security installations and solutions. Check back soon to see our work.</p>
            <div className="button-row">
              <Link className="button button--dark" to="/"><ArrowLeft aria-hidden="true" size={16} /> Return Home</Link>
              <Link className="button button--outline" to="/contact/">Contact Us <ArrowUpRight aria-hidden="true" size={16} /></Link>
            </div>
          </div>
          <div aria-label="Gallery coming soon illustration" className="gallery-illustration" role="img">
            <div aria-hidden="true" className="gallery-illustration__grid" />
            <div aria-hidden="true" className="gallery-illustration__frame">
              <Images aria-hidden="true" className="gallery-illustration__images" size={118} strokeWidth={1} />
              <span className="gallery-illustration__sun" />
              <span className="gallery-illustration__hill gallery-illustration__hill--back" />
              <span className="gallery-illustration__hill gallery-illustration__hill--front" />
            </div>
            <div aria-hidden="true" className="gallery-illustration__badge"><Construction size={19} /><span>IN PROGRESS</span></div>
          </div>
        </section>
      </main>
    </>
  );
}
