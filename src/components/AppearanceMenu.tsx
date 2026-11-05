import { Check, ChevronDown, Palette } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { useTheme, type Theme } from "../context/ThemeContext";

const themes: { id: Theme; label: string }[] = [
  { id: "mono", label: "Monochrome" },
  { id: "red", label: "Red" },
  { id: "blue", label: "Blue" },
];

export function AppearanceMenu() {
  const { theme, setTheme } = useTheme();
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

  function chooseTheme(nextTheme: Theme) {
    setTheme(nextTheme);
    setOpen(false);
    triggerRef.current?.focus();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const options = [...(containerRef.current?.querySelectorAll<HTMLButtonElement>(".appearance-option") ?? [])];
    if (event.key === "Escape") {
      setOpen(false);
      triggerRef.current?.focus();
    }
    if (["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        window.requestAnimationFrame(() => containerRef.current?.querySelector<HTMLButtonElement>(".appearance-option")?.focus());
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
    <div className="appearance" onKeyDown={handleKeyDown} ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="menu"
        className="appearance__trigger"
        onClick={() => setOpen(!open)}
        ref={triggerRef}
        type="button"
      >
        <Palette aria-hidden="true" size={16} />
        <span>Appearance</span>
        <ChevronDown aria-hidden="true" className={open ? "rotate-180" : ""} size={14} />
      </button>
      {open && (
        <div aria-label="Choose appearance" className="appearance__menu" role="menu">
          {themes.map((option) => (
            <button
              aria-checked={theme === option.id}
              className="appearance-option"
              key={option.id}
              onClick={() => chooseTheme(option.id)}
              role="menuitemradio"
              type="button"
            >
              <span aria-hidden="true" className={`theme-swatch theme-swatch--${option.id}`} />
              <span>{option.label}</span>
              {theme === option.id && <Check aria-label="Selected" className="ml-auto" size={16} />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
