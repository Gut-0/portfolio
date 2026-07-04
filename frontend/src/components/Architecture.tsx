import { useState } from "react";
import { DEFAULT_PHASE } from "../config";
import Reveal from "./Reveal";

function Node({ kicker, label, accent = false }: { kicker: string; label: string; accent?: boolean }) {
  return (
    <div className={`arch-node ${accent ? "arch-node-accent" : ""}`}>
      <span className="arch-node-kicker mono">{kicker}</span>
      <span className="arch-node-label">{label}</span>
    </div>
  );
}

const Arrow = () => (
  <span className="arch-arrow mono" aria-hidden="true">
    →
  </span>
);

function Phase1() {
  return (
    <div className="arch-diagram" key="phase1">
      <div className="arch-tier">
        <p className="arch-tier-label mono">PRESENTATION</p>
        <div className="arch-row">
          <Node kicker="CLIENT" label="Browser" />
          <Arrow />
          <Node kicker="CLOUDFRONT" label="CDN + HTTPS" />
          <Arrow />
          <Node kicker="S3" label="Static front" />
        </div>
      </div>
      <div className="arch-connector mono">┆ dynamic calls</div>
      <div className="arch-tier">
        <p className="arch-tier-label mono">API</p>
        <div className="arch-row">
          <Node kicker="API GATEWAY" label="REST endpoints" />
          <Arrow />
          <Node kicker="LAMBDA" label="Python" />
        </div>
      </div>
      <div className="arch-connector mono">┆</div>
      <div className="arch-tier">
        <p className="arch-tier-label mono">DATA</p>
        <div className="arch-row">
          <Node kicker="DYNAMODB" label="Wall notes / content" />
        </div>
      </div>
    </div>
  );
}

function Phase2() {
  return (
    <div className="arch-diagram" key="phase2">
      <div className="arch-tier">
        <p className="arch-tier-label mono">INGEST → TRANSFORM</p>
        <div className="arch-row">
          <Node kicker="EVENTBRIDGE" label="Daily schedule" />
          <Arrow />
          <Node kicker="LAMBDA" label="Ingest" />
          <Arrow />
          <Node kicker="S3 · RAW" label="Landing zone" />
          <Arrow />
          <Node kicker="LAMBDA" label="Transform" />
          <Arrow />
          <Node kicker="S3 · PROCESSED" label="Parquet, partitioned" />
        </div>
      </div>
      <div className="arch-connector mono">┆</div>
      <div className="arch-tier">
        <p className="arch-tier-label mono">QUERY → SERVE</p>
        <div className="arch-row">
          <Node kicker="GLUE CATALOG" label="Schema" />
          <span className="arch-arrow mono" aria-hidden="true">
            +
          </span>
          <Node kicker="ATHENA" label="Query & aggregate" />
          <Arrow />
          <Node kicker="SERVING" label="DynamoDB / JSON" />
          <Arrow />
          <Node kicker="API" label="Phase 1" />
          <Arrow />
          <Node kicker="SITE" label="Dashboard" accent />
        </div>
      </div>
    </div>
  );
}

export default function Architecture() {
  const [phase, setPhase] = useState<1 | 2>(DEFAULT_PHASE);

  return (
    <section id="architecture" className="section section-dark">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">04</span>
            <h2>Architecture</h2>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="section-intro on-dark">
            The portfolio is also the proof. A real multi-tier architecture on AWS — built
            additively in two phases, kept inside the free tier by design.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="phase-toggle" role="tablist" aria-label="Architecture phase">
            <button
              type="button"
              role="tab"
              aria-selected={phase === 1}
              className={phase === 1 ? "active" : ""}
              onClick={() => setPhase(1)}
            >
              Phase 1 · 3-tier app
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={phase === 2}
              className={phase === 2 ? "active" : ""}
              onClick={() => setPhase(2)}
            >
              Phase 2 · Data pipeline
            </button>
          </div>
          <div className="arch-panel">{phase === 1 ? <Phase1 /> : <Phase2 />}</div>
          <p className="arch-caption mono">
            Provisioned with Terraform · deployed via GitHub Actions on push to main · built to
            stay within the AWS free tier.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
