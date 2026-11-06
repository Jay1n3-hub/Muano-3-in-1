import { ArrowLeft, ArrowUpRight, Check, ChevronRight } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Seo } from "../components/Seo";
import { usePageActions } from "../layout/SiteLayout";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function ServicePage() {
  const { slug } = useParams();
  const { services } = usePublishedSiteData();
  const service = services.find((item) => item.slug === slug);
  const { openEnquiry } = usePageActions();

  if (!service) return <Navigate replace to="/not-found/" />;

  const Icon = service.icon;
  const relatedServices = services.filter((item) => item.slug !== service.slug).slice(0, 3);

  return (
    <>
      <Seo description={service.seoDescription || service.description} title={service.seoTitle || `${service.title} | Muanotronics`} />
      <main className="service-page">
        <section className="service-hero">
          <div className="service-hero__copy">
            <Link className="back-link" to="/services/"><ArrowLeft size={15} /> All Services</Link>
            <p className="eyebrow"><span /> ELECTRONIC SECURITY SOLUTIONS</p>
            <span className="service-hero__icon"><Icon aria-hidden="true" size={30} strokeWidth={1.6} /></span>
            <h1>{service.title}</h1>
            <p>{service.description}</p>
            <button className="button button--dark" onClick={() => openEnquiry("quote", service.title)} type="button">
              Request a Quote <ArrowUpRight size={16} />
            </button>
          </div>
          <div className="service-hero__image-wrap">
            <img alt={service.imageAlt} className="service-hero__image" height="1000" src={service.image} style={{ objectPosition: service.imagePosition }} width="1400" />
          </div>
        </section>

        <section className="service-detail page-section">
          <div className="service-detail__main">
            <p className="eyebrow"><span /> SERVICE DETAILS</p>
            <h2>{service.shortTitle}</h2>
            <p>{service.detail}</p>
            <button className="button button--dark button--small" onClick={() => openEnquiry("quote", service.title)} type="button">
              Talk to Our Team <ArrowUpRight size={15} />
            </button>
          </div>
          <div className="service-detail__lists">
            <div className="detail-list">
              <p className="eyebrow"><span /> KEY FEATURES</p>
              <ul>{service.features.map((feature) => <li key={feature}><Check size={15} />{feature}</li>)}</ul>
            </div>
            <div className="detail-list">
              <p className="eyebrow"><span /> BENEFITS</p>
              <ul>{service.benefits.map((benefit) => <li key={benefit}><Check size={15} />{benefit}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="related-section page-section">
          <div className="section-heading section-heading--row">
            <div><p className="eyebrow"><span /> RELATED SERVICES</p><h2>Other services</h2></div>
            <Link className="text-link" to="/services/">All Services <ArrowUpRight size={15} /></Link>
          </div>
          <div className="related-grid">
            {relatedServices.map((related) => {
              const RelatedIcon = related.icon;
              return (
                <Link className="related-card" key={related.slug} to={`/services/${related.slug}/`}>
                  <RelatedIcon aria-hidden="true" size={27} strokeWidth={1.6} />
                  <span>{related.title}</span><ChevronRight aria-hidden="true" size={17} />
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
