import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Brand } from "./Brand";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

interface SiteHeaderProps {
  onRequestQuote: () => void;
}

export function SiteHeader({ onRequestQuote }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef<HTMLDivElement>(null);
  const { services } = usePublishedSiteData();
  const location = useLocation();
  function closeMenu() {
    setMenuOpen(false);
    setServicesOpen(false);
  }

  useEffect(() => {
    if (!servicesOpen) return;
    function dismiss(event: PointerEvent) {
      if (event.target instanceof Node && !servicesRef.current?.contains(event.target)) setServicesOpen(false);
    }
    function dismissOnEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setServicesOpen(false);
    }
    document.addEventListener("pointerdown", dismiss);
    document.addEventListener("keydown", dismissOnEscape);
    return () => {
      document.removeEventListener("pointerdown", dismiss);
      document.removeEventListener("keydown", dismissOnEscape);
    };
  }, [servicesOpen]);

  useEffect(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, [location.pathname]);

  return (
    <header className="site-header site-header--technology">
      <Brand />
      <button
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close navigation" : "Open navigation"}
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        type="button"
      >
        {menuOpen ? <X size={21} /> : <Menu size={21} />}
      </button>
      <nav aria-label="Main navigation" className={`main-nav${menuOpen ? " main-nav--open" : ""}`}>
        <div className="main-nav__links">
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} end onClick={closeMenu} to="/">Home</NavLink>
          <div className={`nav-services${servicesOpen ? " nav-services--open" : ""}`} ref={servicesRef}>
            <button aria-expanded={servicesOpen} onClick={() => setServicesOpen((open) => !open)} type="button">Services <ChevronDown aria-hidden="true" size={14} /></button>
            {servicesOpen && <div className="services-menu">
              <Link onClick={closeMenu} to="/services/">All Services</Link>
              {services.map((service) => <Link key={service.slug} onClick={closeMenu} to={`/services/${service.slug}/`}>{service.title}</Link>)}
            </div>}
          </div>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/about/">About Us</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/why-us/">Why Us</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/gallery/">Gallery</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/contact/">Contact</NavLink>
        </div>
        <button className="button button--dark nav-mobile-cta" onClick={() => { closeMenu(); onRequestQuote(); }} type="button">
          Request a Quote <ArrowUpRight aria-hidden="true" size={16} />
        </button>
      </nav>
      <button className="button button--dark header-cta" onClick={onRequestQuote} type="button">
        Request a Quote <ArrowUpRight aria-hidden="true" size={16} />
      </button>
    </header>
  );
}
