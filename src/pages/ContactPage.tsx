import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Seo } from "../components/Seo";
import { usePageActions } from "../layout/SiteLayout";

export function ContactPage() {
  const { openEnquiry } = usePageActions();

  return (
    <>
      <Seo description="Contact Muanotronics to discuss an electronic security system, request a quote or arrange a site visit." title="Contact Muanotronics" />
      <main className="inner-page contact-page">
        <section className="contact-page__hero">
          <div className="contact-page__copy">
            <p className="eyebrow"><span /> CONTACT MUANOTRONICS</p>
            <h1>Contact Us</h1>
            <p>Request a quote or arrange a site visit for your property.</p>
            <div className="button-row">
              <button className="button button--dark" onClick={() => openEnquiry("quote")} type="button">Request a Quote <ArrowUpRight size={16} /></button>
              <button className="button button--outline" onClick={() => openEnquiry("site-visit")} type="button">Request a Site Visit <ArrowUpRight size={15} /></button>
            </div>
          </div>
          <div className="contact-details">
            <p className="eyebrow"><span /> CONTACT DETAILS</p>
            <a href="mailto:info@muanotronics.co.za"><Mail size={18} /> info@muanotronics.co.za <ArrowUpRight className="contact-details__arrow" size={15} /></a>
            <a href="tel:+27101234567"><Phone size={18} /> +27 10 123 4567 <ArrowUpRight className="contact-details__arrow" size={15} /></a>
            <a href="https://maps.google.com/?q=Pretoria+South+Africa"><MapPin size={18} /> Pretoria, South Africa <ArrowUpRight className="contact-details__arrow" size={15} /></a>
            <p className="contact-details__note">Use the enquiry form to share your requirements and preferred contact details.</p>
          </div>
        </section>
      </main>
    </>
  );
}
