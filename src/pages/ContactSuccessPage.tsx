import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";

export function ContactSuccessPage() {
  return (
    <>
      <Seo description="Thank you for contacting Muanotronics." title="Enquiry Received | Muanotronics" />
      <main className="success-page">
        <CheckCircle2 aria-hidden="true" size={48} strokeWidth={1.4} />
        <p className="eyebrow"><span /> ENQUIRY RECEIVED</p>
        <h1>Thank you for getting in touch.</h1>
        <p>Your enquiry has been sent to our team. We appreciate your interest in Muanotronics.</p>
        <Link className="button button--dark" to="/">Back to Home <ArrowRight size={16} /></Link>
      </main>
    </>
  );
}
