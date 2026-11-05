import { Check, ChevronDown, PanelsTopLeft } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { logoStyles, useLogoStyle, type LogoStyle } from "../context/LogoContext";
import { LogoArtwork } from "./Brand";

export function LogoStyleMenu() {
  const { logoStyle, setLogoStyle } = useLogoStyle();
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

  function chooseStyle(style: LogoStyle) {
    setLogoStyle(style);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(containerRef.current?.querySelectorAll<HTMLButtonElement>(".logo-style-option") ?? [])];
    if (event.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        window.requestAnimationFrame(() => containerRef.current?.querySelector<HTMLButtonElement>(".logo-style-option")?.focus());
        return;
      }
      const currentIndex = options.indexOf(document.activeElement as HTMLButtonElement);
      const nextIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? options.length - 1
          : (currentIndex + (event.key === "ArrowUp" ? -1 : 1) + options.length) % options.length;
      options[nextIndex]?.focus();
    }
  }

  return (
    <div className="logo-style" onKeyDown={handleKeyDown} ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="logo-style__trigger"
        onClick={() => setOpen(!open)}
        ref={triggerRef}
        type="button"
      >
        <PanelsTopLeft aria-hidden="true" size={16} />
        <span>Logo Style</span>
        <ChevronDown aria-hidden="true" className={open ? "rotate-180" : ""} size={14} />
      </button>
      {open && (
        <div aria-label="Choose logo style" className="logo-style__menu" role="menu">
          {logoStyles.map((option) => (
            <button
              aria-checked={logoStyle === option.id}
              className="logo-style-option"
              key={option.id}
              onClick={() => chooseStyle(option.id)}
              role="menuitemradio"
              type="button"
            >
              <span className="logo-style-option__preview">
                <LogoArtwork style={option.id} />
              </span>
              <span className="logo-style-option__copy">
                <span>{option.label}{option.id === "corporate" ? " · Expanded" : ""}</span>
                <span>{option.description}</span>
              </span>
              {logoStyle === option.id && <Check aria-label="Selected" className="logo-style-option__check" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
