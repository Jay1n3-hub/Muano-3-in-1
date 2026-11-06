import { ArrowLeft, ArrowUpRight, Images, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Seo } from "../components/Seo";
import { usePublishedSiteData } from "../context/PublishedSiteContext";

export function GalleryPage() {
  const { content, projects } = usePublishedSiteData();
  const gallery = content.gallery ?? {};
  const heading = typeof gallery.page_title === "string" && gallery.page_title ? gallery.page_title : "Our Projects";
  const introduction = typeof gallery.introduction === "string" && gallery.introduction
    ? gallery.introduction
    : "A selection of electronic security installations delivered by our team.";

  return (
    <>
      <Seo description={String(gallery.seo_description ?? "Explore electronic security installations and projects completed by Muanotronics.")} title={String(gallery.seo_title ?? "Project Gallery | Muanotronics")} />
      <main className="gallery-page">
        <section aria-labelledby="gallery-title" className="gallery-hero">
          <div className="gallery-hero__copy">
            <p className="eyebrow"><span /> {String(gallery.heading ?? "PROJECT GALLERY")}</p>
            <h1 id="gallery-title">{heading}</h1>
            <p>{introduction}</p>
            <div className="button-row">
              <Link className="button button--dark" to="/"><ArrowLeft aria-hidden="true" size={16} /> Return Home</Link>
              <Link className="button button--outline" to="/contact/">{String(gallery.contact_button ?? "Contact Us")} <ArrowUpRight aria-hidden="true" size={16} /></Link>
            </div>
          </div>
          <div aria-hidden="true" className="gallery-hero__icon"><Images size={92} strokeWidth={1} /></div>
        </section>
        <section aria-label="Completed projects" className="gallery-projects">
          {projects.length ? (
            <div className="gallery-project-grid">
              {projects.map((project) => (
                <article className="gallery-project-card" key={project.id}>
                  <div className={`gallery-project-card__photos${project.image_urls.length > 1 ? " gallery-project-card__photos--multiple" : ""}`}>
                    {project.image_urls.slice(0, 3).map((image, index) => <img alt={project.image_alt_text || `${project.title} project photo ${index + 1}`} key={`${project.id}-${image}`} loading="lazy" src={image} />)}
                    {project.image_urls.length > 3 && <span className="gallery-project-card__more">+{project.image_urls.length - 3} photos</span>}
                  </div>
                  <div className="gallery-project-card__content">
                    {project.category && <span className="gallery-project-card__category">{project.category}</span>}
                    <h2>{project.title}</h2>
                    {project.description && <p>{project.description}</p>}
                    {(project.location || project.project_year) && <div className="gallery-project-card__meta">
                      {project.location && <span><MapPin size={14} />{project.location}</span>}
                      {project.project_year && <span>{project.project_year}</span>}
                    </div>}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="gallery-empty">
              <Images aria-hidden="true" size={31} />
              <h2>Project photos coming soon</h2>
              <p>We’re preparing a showcase of our security installations. Please check back soon.</p>
            </div>
          )}
        </section>
      </main>
    </>
  );
}
