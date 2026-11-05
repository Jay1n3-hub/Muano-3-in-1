import { Link } from "react-router-dom";
import { useLogoStyle, type LogoStyle } from "../context/LogoContext";

export function LogoArtwork({ style, light = false }: { style: LogoStyle; light?: boolean }) {
  return (
    <span aria-hidden="true" className={`brand__artwork brand__artwork--${style}${light ? " brand__artwork--light" : ""}`}>
      <svg className="brand__mark" fill="none" viewBox="0 0 42 42">
        <path d="M15 4H4v11M4 27v11h11M27 4h11v11M38 27v11H27" />
      </svg>
      {style !== "icon" && (
        <span className="brand__type">
          <span className="brand__name">Muanotronics</span>
          {style !== "compact" && <span className="brand__tag">ELECTRONICS SOLUTIONS</span>}
        </span>
      )}
    </span>
  );
}

export function Brand({ light = false, previewStyle }: { light?: boolean; previewStyle?: LogoStyle }) {
  const { logoStyle } = useLogoStyle();
  const style = previewStyle ?? logoStyle;

  return (
    <Link
      aria-label="Muanotronics home"
      className={`brand brand--${style}${light ? " brand--light" : ""}`}
      to="/"
    >
      <LogoArtwork light={light} style={style} />
    </Link>
  );
}
