import { profile } from "../data/profile";

export default function Projects() {
  return (
    <section id="projects" className="container section">
      <h2>
        <span className="mono accent">03.</span> Projects
      </h2>
      <div className="projects-grid">
        {profile.projects.map((project) => (
          <article className="card project-card" key={project.title}>
            <header className="project-header">
              <h3>{project.title}</h3>
              <span className={`status status-${project.status.replace(" ", "-")}`}>
                {project.status}
              </span>
            </header>
            <p>{project.description}</p>
            <ul className="tag-list">
              {project.stack.map((tech) => (
                <li className="tag" key={tech}>
                  {tech}
                </li>
              ))}
            </ul>
            {project.link && (
              <a href={project.link} target="_blank" rel="noreferrer" className="project-link mono">
                source ↗
              </a>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
