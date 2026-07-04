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

const experience = [
  {
    index: "002",
    title: "GCP microservices migration",
    org: "NT Group / NexT Technologies · Nov 2024 – Jun 2026",
    body: "Led the migration of a core module of an enterprise fiscal-invoicing SaaS from v7 to v8: re-architected ~5 Cloud Run APIs and 4 Cloud Functions on GCP, refactored function-based code into class-based services, added automated tests, and partnered with DevOps to deploy event-driven workflows (Pub/Sub) end to end. Also shipped backend features for the invoicing platform used by enterprise hospitality and retail clients (Opera PMS / Micros-Simphony POS integrations).",
    tech: ["Python", "Cloud Run", "Cloud Functions", "Pub/Sub", "BigQuery", "Microservices", "REST APIs"],
  },
  {
    index: "003",
    title: "Industrial MES data layer & dashboards",
    org: "Sitec Soluções em Tecnologia · Sep 2022 – Jun 2024",
    body: "Built the data layer of an industrial MES (Manufacturing Execution System) for large food-industry clients (JBS, BRF, Aurora): real-time ingestion via API endpoints, processing in PHP/Laravel, persisted to PostgreSQL. Built operational dashboards (Angular + Chart.js) for factory KPIs.",
    tech: ["PHP", "Laravel", "PostgreSQL", "Angular", "Chart.js", "REST APIs"],
  },
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
        <Reveal delay={120}>
          <div className="exp-grid">
            {experience.map((job) => (
              <article key={job.index} className="exp-card">
                <p className="exp-meta mono">
                  <span className="exp-index">{job.index}</span>
                  <span className="exp-org">{job.org}</span>
                </p>
                <h3>{job.title}</h3>
                <p className="exp-body">{job.body}</p>
                <div className="chip-row">
                  {job.tech.map((t) => (
                    <span key={t} className="chip mono">
                      {t}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
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
