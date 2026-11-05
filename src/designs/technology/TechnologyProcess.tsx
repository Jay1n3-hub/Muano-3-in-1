import { ArrowRight } from "lucide-react";
import { company } from "../../data/company";

export function TechnologyProcess() {
  return (
    <section aria-labelledby="process-title" className="technology-process page-section">
      <div className="technology-process__intro">
        <p className="eyebrow"><span /> HOW WE WORK</p>
        <h2 id="process-title">From assessment to installation.</h2>
      </div>
      <ol className="technology-process__steps">
        {company.process.map((step, index) => (
          <li key={step.title}>
            <span className="technology-process__number">0{index + 1}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
            {index < company.process.length - 1 && <ArrowRight aria-hidden="true" className="technology-process__arrow" size={17} />}
          </li>
        ))}
      </ol>
    </section>
  );
}
