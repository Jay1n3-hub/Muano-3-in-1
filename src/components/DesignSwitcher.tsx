import { Check, ChevronDown, LayoutTemplate } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { designOptions, useDesign, type DesignId } from "../context/DesignContext";

export function DesignSwitcher() {
  const { design, setDesign } = useDesign();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(event: PointerEvent) {
      if (!containerRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("pointerdown", handleOutsideClick);
    return () => document.removeEventListener("pointerdown", handleOutsideClick);
  }, [open]);

  function selectDesign(nextDesign: DesignId) {
    setDesign(nextDesign);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
  }

  return (
    <div className="design-switcher" onKeyDown={handleKeyDown} ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="dialog"
        className="design-switcher__trigger"
        onClick={() => setOpen(!open)}
        ref={triggerRef}
        type="button"
      >
        <LayoutTemplate aria-hidden="true" size={16} />
        <span>Change Design</span>
        <ChevronDown aria-hidden="true" className={open ? "rotate-180" : ""} size={14} />
      </button>
      {open && (
        <section aria-label="Choose a website design" className="design-switcher__panel" role="dialog">
          <div className="design-switcher__heading">
            <div><p className="eyebrow"><span /> DESIGN PRESETS</p><h2>Choose a design</h2></div>
            <span className="design-switcher__count">0{designOptions.length} STYLES</span>
          </div>
          <div className="design-options">
            {designOptions.map((option) => (
              <article
                aria-current={design === option.id ? "true" : undefined}
                className={`design-option design-option--${option.id}${design === option.id ? " design-option--active" : ""}`}
                key={option.id}
              >
                <DesignPreview design={option.id} />
                <div className="design-option__details">
                  <div className="design-option__title">{option.name}{design === option.id && <span className="design-option__active"><Check size={12} /> ACTIVE</span>}</div>
                  <p>{option.description}</p>
                  <button
                    aria-pressed={design === option.id}
                    className="design-option__select"
                    onClick={() => selectDesign(option.id)}
                    type="button"
                  >
                    {design === option.id ? "Selected" : "Select Design"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function DesignPreview({ design }: { design: DesignId }) {
  if (design === "bold") {
    return (
      <div aria-hidden="true" className="design-preview design-preview--bold">
        <span className="design-preview__bold-nav" />
        <span className="design-preview__bold-hero"><i /><i /></span>
        <span className="design-preview__bold-cards"><i /><i /></span>
      </div>
    );
  }

  if (design === "technology") {
    return (
      <div aria-hidden="true" className="design-preview design-preview--technology">
        <span className="design-preview__tech-nav" />
        <span className="design-preview__tech-heading"><i /><i /></span>
        <span className="design-preview__tech-image" />
        <span className="design-preview__tech-strip"><i /><i /><i /><i /></span>
      </div>
    );
  }

  return (
    <div aria-hidden="true" className="design-preview design-preview--minimal">
      <span className="design-preview__minimal-nav" />
      <span className="design-preview__minimal-hero"><i /><i /></span>
      <span className="design-preview__minimal-cards"><i /><i /><i /></span>
    </div>
  );
}
