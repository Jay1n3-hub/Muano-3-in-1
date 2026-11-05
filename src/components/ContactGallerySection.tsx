import { ArrowUpRight, Clock3, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageActions } from "../layout/SiteLayout";

export function ContactGallerySection({ presentation = "minimal" }: { presentation?: "minimal" | "bold" | "technology" }) {
  const { openEnquiry } = usePageActions();

  return (
    <section aria-label="Gallery and enquiries" className={`contact-gallery-section contact-gallery-section--${presentation}`}>
      <div className="gallery-panel" id="gallery">
        <div aria-hidden="true" className="gallery-art">
          <Images size={48} strokeWidth={1.2} />
          <Clock3 className="gallery-art__clock" size={26} strokeWidth={1.5} />
        </div>
        <div className="gallery-panel__copy">
          <p className="eyebrow"><span /> OUR PROJECTS</p>
          <h2>Project gallery<br />under construction.</h2>
          <p>Our project gallery is being prepared. Contact us to discuss your requirements.</p>
        </div>
        <Link className="gallery-panel__link" to="/gallery/">View Gallery <ArrowUpRight aria-hidden="true" size={15} /></Link>
      </div>
      <div className="contact-panel" id="contact">
        <div className="contact-panel__copy">
          <p className="eyebrow"><span /> CONTACT US</p>
          <h2>Discuss your<br />security requirements.</h2>
          <p>Choose an enquiry type to get started.</p>
          <div className="button-row">
            <button className="button button--dark" onClick={() => openEnquiry("quote")} type="button">
              Request a Quote <ArrowUpRight size={16} />
            </button>
            <button className="button button--outline" onClick={() => openEnquiry("site-visit")} type="button">
              Request a Site Visit <ArrowUpRight size={15} />
            </button>
          </div>
        </div>
        <div aria-hidden="true" className="contact-panel__image" />
      </div>
    </section>
  );
}
