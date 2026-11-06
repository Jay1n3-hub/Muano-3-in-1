import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { usePageActions } from "../../layout/SiteLayout";

interface HeroActionsProps {
  primaryText?: string;
  primaryDestination?: string;
  secondaryText?: string;
  secondaryDestination?: string;
}

export function HeroActions({
  primaryText = "Request a Quote",
  primaryDestination = "quote",
  secondaryText = "Explore Our Services",
  secondaryDestination = "/services/",
}: HeroActionsProps) {
  const { openEnquiry } = usePageActions();

  return (
    <div className="button-row hero-actions">
      {primaryDestination === "quote"
        ? <button className="button button--dark" onClick={() => openEnquiry("quote")} type="button">{primaryText} <ArrowUpRight aria-hidden="true" size={17} /></button>
        : <ActionLink className="button button--dark" destination={primaryDestination}>{primaryText} <ArrowUpRight aria-hidden="true" size={17} /></ActionLink>}
      <ActionLink className="button button--outline" destination={secondaryDestination}>{secondaryText} <ArrowDownRight aria-hidden="true" size={16} /></ActionLink>
    </div>
  );
}

function ActionLink({ destination, className, children }: { destination: string; className: string; children: React.ReactNode }) {
  return /^https?:\/\//i.test(destination)
    ? <a className={className} href={destination} rel="noreferrer" target="_blank">{children}</a>
    : <Link className={className} to={destination || "/services/"}>{children}</Link>;
}
