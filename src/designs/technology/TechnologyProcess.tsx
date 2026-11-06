import { ArrowRight } from "lucide-react";
import { company } from "../../data/company";
import { usePublishedSiteData } from "../../context/PublishedSiteContext";

export function TechnologyProcess() {
  const { content } = usePublishedSiteData();
  const whyUs = content["why-us"] ?? {};
  const configuredSteps = Array.isArray(whyUs.process_steps)
    ? whyUs.process_steps.filter((item): item is string => typeof item === "string")
    : [];
  const steps = configuredSteps.length
    ? configuredSteps.map((step) => {
      const [title, description] = step.split("|").map((part) => part.trim());
      return { title, description: description ?? "" };
    })
    : company.process;

  return (
    <section aria-labelledby="process-title" className="technology-process page-section">
      <div className="technology-process__intro">
        <p className="eyebrow"><span /> HOW WE WORK</p>
        <h2 id="process-title">{String(whyUs.process_heading ?? "From assessment to installation.")}</h2>
      </div>
      <ol className="technology-process__steps">
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className="technology-process__number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index < steps.length - 1 && <ArrowRight aria-hidden="true" className="technology-process__arrow" size={17} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
