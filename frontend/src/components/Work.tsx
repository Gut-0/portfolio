import { useEffect, useRef } from "react";
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

/**
 * Sticky-deck scroll effect: as the next card scrolls up to cover the pinned
 * one, the covered card scales down and dims. Skipped entirely under
 * prefers-reduced-motion (cards then flow normally).
 */
function useDeckEffect(deckRef: React.RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const deck = deckRef.current;
    if (!deck) return;
    const items = Array.from(deck.querySelectorAll<HTMLElement>(".deck-item"));

    const update = () => {
      const stickyTop = 96;
      const span = window.innerHeight * 0.65;
      items.forEach((item, i) => {
        const card = item.firstElementChild as HTMLElement | null;
        if (!card) return;
        const next = items[i + 1];
        let t = 0;
        if (next) {
          const top = next.getBoundingClientRect().top;
          t = Math.min(1, Math.max(0, 1 - (top - stickyTop) / span));
        }
        card.style.transform = t > 0 ? `scale(${(1 - 0.06 * t).toFixed(4)})` : "";
        card.style.filter = t > 0 ? `brightness(${(1 - 0.14 * t).toFixed(4)})` : "";
      });
    };

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });
    update();
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [deckRef]);
}

export default function Work() {
  const deckRef = useRef<HTMLDivElement>(null);
  useDeckEffect(deckRef);

  return (
    <section id="work" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">03</span>
            <h2>Selected work</h2>
          </div>
        </Reveal>
        <div className="work-deck" ref={deckRef}>
          <div className="deck-item" style={{ "--stack": 0 } as React.CSSProperties}>
            <article className="featured-card deck-card">
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
                    <svg
                      className="link-icon"
                      viewBox="0 0 16 16"
                      width="16"
                      height="16"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
                    </svg>
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
          </div>
          {experience.map((job, i) => (
            <div
              key={job.index}
              className="deck-item"
              style={{ "--stack": i + 1 } as React.CSSProperties}
            >
              <article className="exp-card deck-card">
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
            </div>
          ))}
        </div>
        <Reveal delay={100}>
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
