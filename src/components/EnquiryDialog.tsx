import { CalendarDays, Check, Clock3, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { services } from "../data/services";

export type RequestType = "quote" | "site-visit";

interface EnquiryDialogProps {
  open: boolean;
  requestType: RequestType;
  service?: string;
  onClose: () => void;
}

const serviceOptions = [
  ...services.map((service) => service.title),
  "Multiple Services",
  "Other",
];

export function EnquiryDialog({ open, requestType: initialRequestType, service, onClose }: EnquiryDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [requestType, setRequestType] = useState<RequestType>(initialRequestType);

  useEffect(() => {
    setRequestType(initialRequestType);
  }, [initialRequestType, open]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (open && dialog && !dialog.open) dialog.showModal();
  }, [open]);

  function closeDialog() {
    dialogRef.current?.close();
    onClose();
  }

  const today = new Date();
  const minDate = new Date(today.getTime() - today.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);

  return (
    <dialog
      aria-labelledby="enquiry-title"
      className="enquiry-dialog"
      onClick={(event) => {
        if (event.target === dialogRef.current) closeDialog();
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") {
          event.preventDefault();
          closeDialog();
        }
      }}
      onClose={onClose}
      ref={dialogRef}
    >
      <button aria-label="Close enquiry form" className="dialog-close" onClick={closeDialog} type="button"><X size={20} /></button>
      <p className="eyebrow"><span /> CONTACT US</p>
      <h2 id="enquiry-title">{requestType === "quote" ? "Request a Quote" : "Request a Site Visit"}</h2>
      <p className="dialog-intro">Provide your property and contact details. Our team will follow up.</p>

      <div aria-label="Enquiry type" className="request-tabs" role="group">
        <button aria-pressed={requestType === "quote"} className={requestType === "quote" ? "request-tab request-tab--active" : "request-tab"} onClick={() => setRequestType("quote")} type="button">
          Request a Quote
        </button>
        <button aria-pressed={requestType === "site-visit"} className={requestType === "site-visit" ? "request-tab request-tab--active" : "request-tab"} onClick={() => setRequestType("site-visit")} type="button">
          Request a Site Visit
        </button>
      </div>

      <form
        action="/contact-success/"
        className="enquiry-form"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        method="POST"
        name="project-enquiry"
      >
        <input name="form-name" type="hidden" value="project-enquiry" />
        <input name="requestType" type="hidden" value={requestType === "quote" ? "Quote" : "Site Visit"} />
        <p aria-hidden="true" className="honeypot">
          <label>Leave this field empty <input autoComplete="off" name="bot-field" tabIndex={-1} /></label>
        </p>
        <div className="form-grid">
          <label className="form-field">
            <span>Full Name <span className="required-mark" aria-hidden="true">*</span></span>
            <input autoComplete="name" name="fullName" placeholder="Your full name" required />
          </label>
          <label className="form-field">
            <span>Email Address <span className="required-mark" aria-hidden="true">*</span></span>
            <input autoComplete="email" name="email" placeholder="you@example.com" required type="email" />
          </label>
          <label className="form-field">
            <span>Phone Number <span className="required-mark" aria-hidden="true">*</span></span>
            <input autoComplete="tel" name="phone" pattern="\+?[0-9 ]{7,20}" placeholder="+27 00 000 0000" required type="tel" />
          </label>
          <label className="form-field">
            <span>Service Required <span className="required-mark" aria-hidden="true">*</span></span>
            <select defaultValue={service ?? ""} name="service" required>
              <option disabled value="">Choose a service</option>
              {serviceOptions.map((option) => <option key={option} value={option}>{option}</option>)}
            </select>
          </label>
          <label className="form-field">
            <span>Property Type <span className="required-mark" aria-hidden="true">*</span></span>
            <select defaultValue="" name="propertyType" required>
              <option disabled value="">Choose property type</option>
              <option>Residential</option><option>Commercial</option><option>Industrial</option>
            </select>
          </label>
          {requestType === "site-visit" && (
            <>
              <label className="form-field">
                <span>Preferred Date <span className="required-mark" aria-hidden="true">*</span></span>
                <span className="input-icon-wrap"><CalendarDays aria-hidden="true" size={17} /><input min={minDate} name="preferredDate" required type="date" /></span>
              </label>
              <label className="form-field">
                <span>Preferred Time <span className="required-mark" aria-hidden="true">*</span></span>
                <span className="input-icon-wrap"><Clock3 aria-hidden="true" size={17} /><input name="preferredTime" required type="time" /></span>
              </label>
            </>
          )}
          <label className="form-field form-field--full">
            <span>Message <span className="required-mark" aria-hidden="true">*</span></span>
            <textarea name="message" placeholder="Tell us a little about your property and what you need." required rows={3} />
          </label>
        </div>
        <p className="privacy-note"><Check aria-hidden="true" size={14} /> Your details will only be used to respond to this enquiry.</p>
        <button className="button button--dark form-submit" type="submit">
          {requestType === "quote" ? "Send Quote Request" : "Request a Site Visit"} <span aria-hidden="true">↗</span>
        </button>
      </form>
    </dialog>
  );
}
