import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { Brand } from "./Brand";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function SiteFooter() {
  const { services, settings } = usePublishedSiteData();
  const contact = settings.contact ?? {};
  const general = settings.general ?? {};
  const socialLinks = typeof contact.social_links === "string"
    ? contact.social_links.split(/\r?\n/).map((url) => url.trim()).filter((url) => /^https?:\/\//i.test(url))
    : [];
  return (
    <footer className="site-footer site-footer--technology">
      <div className="footer-main">
        <div className="footer-brand">
          <Brand light />
          <p>{String(contact.footer_description ?? "Electronic security solutions for residential, commercial and industrial properties.")}</p>
        </div>
        <div className="footer-column">
          <h2>Explore</h2>
          <Link to="/">Home</Link>
          <Link to="/about/">About Us</Link>
          <Link to="/why-us/">Why Choose Us</Link>
          <Link to="/services/">Our Services</Link>
          <Link to="/gallery/">Gallery</Link>
          <Link to="/contact/">Contact</Link>
        </div>
        <div className="footer-column">
          <h2>Our Services</h2>
          {services.map((service) => (
            <Link key={service.slug} to={`/services/${service.slug}/`}>{service.title}</Link>
          ))}
        </div>
        <div className="footer-column footer-contact">
          <h2>Contact Us</h2>
          <a href={String(contact.google_maps_url ?? "https://maps.google.com/?q=Pretoria+South+Africa")}><MapPin aria-hidden="true" size={15} /> {String(contact.location ?? "Pretoria, South Africa")}</a>
          <a href={`tel:${String(contact.telephone ?? "+27 10 123 4567").replace(/[^\d+]/g, "")}`}><Phone aria-hidden="true" size={15} /> {String(contact.telephone ?? "+27 10 123 4567")}</a>
          <a href={`mailto:${String(contact.email ?? "info@muanotronics.co.za")}`}><Mail aria-hidden="true" size={15} /> {String(contact.email ?? "info@muanotronics.co.za")}</a>
          <Link className="footer-contact-link" to="/contact/">Get in touch <ArrowUpRight size={15} /></Link>
          {socialLinks.map((url) => <a href={url} key={url} rel="noreferrer" target="_blank">{url.replace(/^https?:\/\/(?:www\.)?/i, "").split("/")[0]}</a>)}
        </div>
      </div>
      <div className="footer-bottom">
        <span>{String(contact.footer_copyright ?? `© ${new Date().getFullYear()} ${String(general.display_company_name ?? "Muanotronics")}. All rights reserved.`)}</span>
        <Link to="/contact/">Contact Muanotronics <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  );
}
