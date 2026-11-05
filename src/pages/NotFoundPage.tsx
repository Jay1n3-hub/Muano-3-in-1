import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function NotFoundPage() {
  return (
    <>
      <Seo description="The page you're looking for could not be found." title="Page Not Found | Muanotronics" />
      <main className="not-found-page">
        <p className="eyebrow"><span /> 404 / PAGE NOT FOUND</p>
        <h1>Page not found.</h1>
        <p>The requested page is unavailable. Use the links below to continue.</p>
        <div className="button-row">
          <Link className="button button--dark" to="/"><ArrowLeft size={16} /> Back Home</Link>
          <Link className="button button--outline" to="/services/">Explore Services <ArrowUpRight size={16} /></Link>
        </div>
      </main>
    </>
  );
}
