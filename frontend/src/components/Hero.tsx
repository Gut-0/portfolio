import Reveal from "./Reveal";

const specs = [
  ["ROLE", "Cloud & Backend Engineer"],
  ["BASED", "Brazil · open to remote"],
  ["LANGUAGES", "PT · EN · ES"],
  ["FOCUS", "Python · AWS · GCP · IaC"],
];

export default function Hero() {
  return (
    <section id="top" className="hero">
      <div className="shell">
        <Reveal>
          <p className="eyebrow mono">CLOUD &amp; BACKEND ENGINEER (PYTHON) — PORTFOLIO</p>
        </Reveal>
        <div className="hero-grid">
          <div>
            <Reveal delay={80}>
              <h1>
                I build backend systems and cloud infrastructure that connect technology to real
                business operations.
              </h1>
            </Reveal>
            <Reveal delay={160}>
              <p className="hero-sub">
                Five years across software development, data engineering, and cloud — for
                industrial operations, agribusiness, and electronic invoicing. Brazilian,
                internationally experienced, and trilingual.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="hero-actions">
                <a className="btn-primary" href="#work">
                  View work →
                </a>
                <a className="btn-outline" href="#wall">
                  Leave a hello →
                </a>
              </div>
            </Reveal>
          </div>
          <Reveal delay={200}>
            <dl className="hero-specs mono">
              {specs.map(([label, value]) => (
                <div key={label} className="hero-spec-row">
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
