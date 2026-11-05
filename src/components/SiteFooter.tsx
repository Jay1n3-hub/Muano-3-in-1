import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";
import { services } from "../data/services";
import { Brand } from "./Brand";
import { useDesign } from "../context/DesignContext";

export function SiteFooter() {
  const { design } = useDesign();
  return (
    <footer className={`site-footer site-footer--${design}`}>
      <div className="footer-main">
        <div className="footer-brand">
          <Brand light />
          <p>Electronic security solutions for residential, commercial and industrial properties.</p>
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
          <a href="https://maps.google.com/?q=Pretoria+South+Africa"><MapPin aria-hidden="true" size={15} /> Pretoria, South Africa</a>
          <a href="tel:+27101234567"><Phone aria-hidden="true" size={15} /> +27 10 123 4567</a>
          <a href="mailto:info@muanotronics.co.za"><Mail aria-hidden="true" size={15} /> info@muanotronics.co.za</a>
          <Link className="footer-contact-link" to="/contact/">Get in touch <ArrowUpRight size={15} /></Link>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} Muanotronics. All rights reserved.</span>
        <Link to="/contact/">Contact Muanotronics <ArrowUpRight size={13} /></Link>
      </div>
    </footer>
  );
}
