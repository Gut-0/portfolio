import { REPO_URL } from "../config";
import Reveal from "./Reveal";

const terminalLines = [
  { text: "$ git push origin main", cls: "t-cmd" },
  { text: "→ build & test", cls: "" },
  { text: "→ sync front → S3", cls: "" },
  { text: "→ invalidate CloudFront", cls: "" },
  { text: "→ update Lambda", cls: "" },
  { text: "✓ deployed · ~90s", cls: "t-ok" },
];

const domains = [
  {
    title: "Industrial operations",
    text: "Data and automation tooling supporting production and operational workflows.",
  },
  {
    title: "Electronic invoicing",
    text: "Backend systems for compliant billing and document processing at scale.",
  },
  {
    title: "Agribusiness",
    text: "Process optimization and integrations connecting field data to decisions.",
  },
];

export default function Work() {
  return (
    <section id="work" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">03</span>
            <h2>Selected work</h2>
          </div>
        </Reveal>
        <Reveal delay={100}>
          <article className="featured-card">
            <div className="featured-left">
              <p className="featured-badges">
                <span className="badge-flagship mono">FLAGSHIP</span>
                <span className="featured-index mono">001</span>
              </p>
              <h3>Personal cloud platform &amp; portfolio</h3>
              <p className="featured-body">
                A multi-tier application on AWS that doubles as this site. A static front on S3 +
                CloudFront, a real API on API Gateway + Lambda writing to DynamoDB — all
                provisioned with Terraform and shipped through GitHub Actions. Phase 2 adds a
                scheduled data pipeline feeding a live dashboard.
              </p>
              <div className="chip-row">
                {["AWS", "Serverless", "Terraform", "CI/CD"].map((t) => (
                  <span key={t} className="chip mono">
                    {t}
                  </span>
                ))}
              </div>
              <p className="featured-links">
                <a href={REPO_URL} target="_blank" rel="noreferrer">
                  Repository ↗
                </a>
                <a href="#architecture">See architecture ↓</a>
              </p>
            </div>
            <div className="featured-terminal mono" aria-label="Deploy pipeline demo">
              <p className="terminal-label">DEPLOY · PUSH TO main</p>
              {terminalLines.map((line) => (
                <p key={line.text} className={`terminal-line ${line.cls}`}>
                  {line.text}
                </p>
              ))}
            </div>
          </article>
        </Reveal>
        <Reveal delay={140}>
          <p className="domains-kicker mono">DOMAINS I'VE WORKED IN</p>
          <div className="domains-grid">
            {domains.map((d) => (
              <div key={d.title} className="domain-card">
                <h4>{d.title}</h4>
                <p>{d.text}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
