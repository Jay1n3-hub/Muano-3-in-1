import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageActions } from "../../layout/SiteLayout";

export function HeroActions() {
  const { openEnquiry } = usePageActions();

  return (
    <div className="button-row hero-actions">
      <button className="button button--dark" onClick={() => openEnquiry("quote")} type="button">
        Request a Quote <ArrowUpRight aria-hidden="true" size={17} />
      </button>
      <Link className="button button--outline" to="/services/">
        Explore Our Services <ArrowDownRight aria-hidden="true" size={16} />
      </Link>
    </div>
  );
}
