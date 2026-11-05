import { ArrowDownRight, ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { services } from "../data/services";
import { AppearanceMenu } from "./AppearanceMenu";
import { LogoStyleMenu } from "./LogoStyleMenu";
import { Brand } from "./Brand";
import { DesignSwitcher } from "./DesignSwitcher";
import { useDesign } from "../context/DesignContext";

interface SiteHeaderProps {
  onRequestQuote: () => void;
}

export function SiteHeader({ onRequestQuote }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { design } = useDesign();

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <header className={`site-header site-header--${design}`}>
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
          <details className="nav-services">
            <summary>Services <ChevronDown aria-hidden="true" size={14} /></summary>
            <div className="services-menu">
              <Link onClick={closeMenu} to="/services/">All Services</Link>
              {services.map((service) => <Link key={service.slug} onClick={closeMenu} to={`/services/${service.slug}/`}>{service.title}</Link>)}
            </div>
          </details>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/about/">About Us</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/why-us/">Why Us</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/gallery/">Gallery</NavLink>
          <NavLink className={({ isActive }) => `nav-link${isActive ? " nav-link--active" : ""}`} onClick={closeMenu} to="/contact/">Contact</NavLink>
        </div>
        <div className="main-nav__controls">
          <AppearanceMenu />
          <LogoStyleMenu />
          <DesignSwitcher />
        </div>
        <button className="button button--dark nav-mobile-cta" onClick={() => { closeMenu(); onRequestQuote(); }} type="button">
          Request a Quote <ArrowUpRight aria-hidden="true" size={16} />
        </button>
      </nav>
      <button className="button button--dark header-cta" onClick={onRequestQuote} type="button">
        Request a Quote <ArrowUpRight aria-hidden="true" size={16} />
      </button>
      <span className="header-decoration" aria-hidden="true"><ArrowDownRight size={16} /></span>
    </header>
  );
}
