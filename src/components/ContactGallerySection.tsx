import { ArrowUpRight, Clock3, Images } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageActions } from "../layout/SiteLayout";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function ContactGallerySection({ presentation = "minimal" }: { presentation?: "minimal" | "bold" | "technology" }) {
  const { openEnquiry } = usePageActions();
  const { content } = usePublishedSiteData();
  const gallery = content.gallery ?? {};
  const contact = content.contact ?? {};
  const galleryHeading = typeof gallery.construction_heading === "string" && gallery.construction_heading
    ? gallery.construction_heading
    : null;
  const galleryMessage = typeof gallery.construction_message === "string" && gallery.construction_message
    ? gallery.construction_message
    : null;

  return (
    <section aria-label="Gallery and enquiries" className={`contact-gallery-section contact-gallery-section--${presentation}`}>
      <div className="gallery-panel" id="gallery">
        <div aria-hidden="true" className="gallery-art">
          <Images size={48} strokeWidth={1.2} />
          <Clock3 className="gallery-art__clock" size={26} strokeWidth={1.5} />
        </div>
        <div className="gallery-panel__copy">
          <p className="eyebrow"><span /> {typeof gallery.heading === "string" && gallery.heading ? gallery.heading : presentation === "minimal" ? "OUR PROJECTS" : "OUR PROJECT GALLERY"}</p>
          <h2>
            {galleryHeading ?? (presentation === "minimal"
              ? <>Project gallery<br />under construction.</>
              : <>Our Project Gallery<br /><span>Under Construction</span></>)}
          </h2>
          <p>
            {galleryMessage ?? (presentation === "minimal"
              ? "Our project gallery is being prepared. Contact us to discuss your requirements."
              : "We're preparing a showcase of our electronic security installations and solutions. Check back soon.")}
          </p>
        </div>
        <Link className="gallery-panel__link" to="/gallery/">{String(gallery.view_gallery_button ?? "View Gallery")} <ArrowUpRight aria-hidden="true" size={15} /></Link>
      </div>
      <div className="contact-panel" id="contact">
        <div className="contact-panel__copy">
          <p className="eyebrow"><span /> CONTACT US</p>
          <h2>{typeof contact.heading === "string" && contact.heading ? contact.heading : presentation === "bold" ? <>Ready to Secure<br />Your Property?</> : <>Discuss your<br />security requirements.</>}</h2>
          <p>{typeof contact.description === "string" && contact.description ? contact.description : presentation === "minimal" ? "Choose an enquiry type to get started." : "Request a quote or arrange a site visit."}</p>
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
