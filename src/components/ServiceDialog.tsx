import { ArrowRight, ArrowUpRight, Check, X } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import type { SecurityService } from "../data/services";

interface ServiceDialogProps {
  service: SecurityService | null;
  onClose: () => void;
  onRequestQuote: (service: string) => void;
}

export function ServiceDialog({ service, onClose, onRequestQuote }: ServiceDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (service && dialog && !dialog.open) dialog.showModal();
  }, [service]);

  return (
    <dialog
      aria-labelledby="service-dialog-title"
      className="service-dialog"
      onClick={(event) => {
        if (event.target === dialogRef.current) dialogRef.current?.close();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          dialogRef.current?.close();
        }
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      {service && (
        <>
          <div className="service-dialog__visual">
            <img
              alt={service.imageAlt}
              className="service-dialog__image"
              height="800"
              src={service.image}
              style={{ objectPosition: service.imagePosition }}
              width="1000"
            />
          </div>
          <div className="service-dialog__content">
            <button aria-label="Close service details" className="dialog-close" onClick={() => dialogRef.current?.close()} type="button"><X size={20} /></button>
            <span className="service-dialog__icon"><service.icon aria-hidden="true" size={30} strokeWidth={1.6} /></span>
            <p className="eyebrow"><span /> OUR SECURITY SOLUTIONS</p>
            <h2 id="service-dialog-title">{service.title}</h2>
            <p className="service-dialog__description">{service.detail}</p>
            <ul className="feature-list feature-list--compact">
              {service.features.slice(0, 3).map((feature) => <li key={feature}><Check aria-hidden="true" size={15} /> {feature}</li>)}
            </ul>
            <div className="button-row">
              <button className="button button--dark" onClick={() => onRequestQuote(service.title)} type="button">Request a Quote <ArrowUpRight size={16} /></button>
              <Link className="button button--outline" onClick={onClose} to={`/services/${service.slug}/`}>Full Service Details <ArrowRight size={16} /></Link>
            </div>
          </div>
        </>
      )}
    </dialog>
  );
}
