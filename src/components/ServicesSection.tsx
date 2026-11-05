import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import type { SecurityService } from "../data/services";
import { services } from "../data/services";
import { usePageActions } from "../layout/SiteLayout";
import { ServiceDialog } from "./ServiceDialog";

interface ServicesSectionProps {
  compact?: boolean;
  presentation?: "minimal" | "bold" | "technology";
}

export function ServicesSection({ compact = false, presentation = "minimal" }: ServicesSectionProps) {
  const [selectedService, setSelectedService] = useState<SecurityService | null>(null);
  const { openEnquiry } = usePageActions();

  return (
    <section aria-labelledby="services-title" className={`services-section services-section--${presentation} page-section${compact ? " services-section--standalone" : ""}`} id="services">
      {!compact && (
        <div className="services-intro">
          <p className="eyebrow"><span /> OUR SERVICES</p>
          <h2 id="services-title">Electronic security services</h2>
          <p>Systems for property monitoring, access, communication and perimeter security.</p>
          <Link className="button button--dark button--small" to="/services/">Explore All Services <ArrowUpRight size={15} /></Link>
        </div>
      )}
      {compact && (
        <div className="section-heading">
          <p className="eyebrow"><span /> OUR SERVICES</p>
          <h1 id="services-title">Our services</h1>
          <p>Electronic security systems for residential, commercial and industrial properties.</p>
        </div>
      )}
      <div className="service-grid">
        {(presentation === "technology" && !compact ? [services[0], ...services.slice(1)] : services).map((service, index) => (
          <ServiceCard featured={presentation === "technology" && !compact && index === 0} key={service.slug} onSelect={setSelectedService} service={service} />
        ))}
      </div>
      <ServiceDialog
        onClose={() => setSelectedService(null)}
        onRequestQuote={(serviceName) => {
          setSelectedService(null);
          openEnquiry("quote", serviceName);
        }}
        service={selectedService}
      />
    </section>
  );
}

function ServiceCard({ service, onSelect, featured = false }: { service: SecurityService; onSelect: (service: SecurityService) => void; featured?: boolean }) {
  const Icon = service.icon;
  return (
    <article className={`service-card${featured ? " service-card--featured" : ""}`}>
      <img
        alt={service.imageAlt}
        className="service-card__image"
        height="520"
        loading="lazy"
        src={service.image}
        style={{ objectPosition: service.imagePosition }}
        width="800"
      />
      <div className="service-card__body">
        <div className="service-card__heading">
          <span className="service-card__icon"><Icon aria-hidden="true" size={21} strokeWidth={1.6} /></span>
          <span className="service-card__title">{service.title}</span>
        </div>
        <span className="service-card__summary">{service.summary}</span>
        <div className="service-card__actions">
          <button className="service-card__action" onClick={() => onSelect(service)} type="button">Quick View <ArrowRight aria-hidden="true" size={13} /></button>
          <Link aria-label={`View ${service.title} service page`} className="service-card__page-link" to={`/services/${service.slug}/`}>Service Page <ArrowUpRight aria-hidden="true" size={13} /></Link>
        </div>
      </div>
    </article>
  );
}
