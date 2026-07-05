import { useEffect, useRef, useState } from "react";
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

/** Scroll-driven when there's room for it: the section gains scroll travel
 *  and the active phase follows scroll progress (Phase 1 → Phase 2).
 *  Falls back to the plain click toggle on small screens / reduced motion. */
function useScrollPhase(
  wrapRef: React.RefObject<HTMLDivElement | null>,
  setPhase: (p: 1 | 2) => void,
) {
  const [scrollMode, setScrollMode] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 900px) and (prefers-reduced-motion: no-preference)");
    const apply = () => setScrollMode(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!scrollMode) return;
    const el = wrapRef.current;
    if (!el) return;

    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const travel = el.offsetHeight - window.innerHeight;
      if (travel <= 0) return;
      const progress = Math.min(1, Math.max(0, -rect.top / travel));
      setPhase(progress < 0.5 ? 1 : 2);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [scrollMode, wrapRef, setPhase]);

  return scrollMode;
}

export default function Architecture() {
  const [phase, setPhase] = useState<1 | 2>(DEFAULT_PHASE);
  const wrapRef = useRef<HTMLDivElement>(null);
  const scrollMode = useScrollPhase(wrapRef, setPhase);

  function selectPhase(n: 1 | 2) {
    if (!scrollMode || !wrapRef.current) {
      setPhase(n);
      return;
    }
    // in scroll mode the pills jump to the matching scroll position
    const el = wrapRef.current;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const travel = el.offsetHeight - window.innerHeight;
    window.scrollTo({ top: n === 1 ? top + travel * 0.1 : top + travel * 0.9, behavior: "smooth" });
  }

  return (
    <section id="architecture" className={`section section-dark arch-section ${scrollMode ? "arch-scroll-mode" : ""}`}>
      <div className="arch-scroll" ref={wrapRef}>
        <div className="arch-sticky">
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
                  onClick={() => selectPhase(1)}
                >
                  Phase 1 · 3-tier app
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={phase === 2}
                  className={phase === 2 ? "active" : ""}
                  onClick={() => selectPhase(2)}
                >
                  Phase 2 · Data pipeline
                </button>
                {scrollMode && <span className="phase-hint mono">scroll ↓</span>}
              </div>
              <div className="arch-panel">{phase === 1 ? <Phase1 /> : <Phase2 />}</div>
              <p className="arch-caption mono">
                Provisioned with Terraform · deployed via GitHub Actions on push to main · built to
                stay within the AWS free tier.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
