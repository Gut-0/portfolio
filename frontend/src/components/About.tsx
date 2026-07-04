import Reveal from "./Reveal";

const paragraphs = [
  "My path began in full-stack software development and evolved toward backend engineering, cloud infrastructure, and automation — most recently leading the migration of an enterprise SaaS module to microservices on Google Cloud.",
  "I've delivered projects across industrial operations, agribusiness, electronic invoicing, and business-process optimization — always connecting technology to real operational problems.",
  "I'm Brazilian, with international experience in Mexico, and I work in Portuguese, English, and Spanish. That shaped how I work: direct, adaptable, technical, and comfortable in multicultural environments.",
  "My core interests are backend systems, cloud infrastructure, automation, data platforms, and the connection between technology and business operations.",
];

export default function About() {
  return (
    <section id="about" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">01</span>
            <h2>About</h2>
          </div>
        </Reveal>
        <div className="about-grid">
          {paragraphs.map((p, i) => (
            <Reveal key={p.slice(0, 20)} delay={i * 80}>
              <p className={`about-p ${i === 0 ? "about-p-lead" : ""}`}>{p}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
