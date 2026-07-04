import type { Wall } from "../hooks/useWall";
import { isoDayIndex } from "../lib/week";
import Reveal from "./Reveal";

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function Dashboard({ wall }: { wall: Wall }) {
  const signatures = wall.notes.length;
  const countries = new Set(wall.notes.map((n) => n.name)).size;
  const capacity = Math.round((signatures / wall.limit) * 100);

  const byDay = Array(7).fill(0) as number[];
  for (const note of wall.notes) byDay[isoDayIndex(note.ts)] += 1;
  const max = Math.max(...byDay, 1);
  const today = isoDayIndex(Date.now());

  return (
    <section id="dashboard" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-heading">
            <span className="section-index mono">05</span>
            <h2>Live data dashboard</h2>
            <span className="badge-live mono">PHASE 2 · LIVE</span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="section-intro">
            The Phase 2 pipeline aggregates the visitor wall below — every signature is counted,
            deduplicated by country, and bucketed by day, then read back through the same API.
            These figures are live: they update as the wall fills and reset with it each week.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <div className="dash-card">
            <div className="dash-header mono">
              <span>visitor_wall_metrics · {wall.week}</span>
              <span className="dash-live">
                <span className="dash-live-dot" /> LIVE
              </span>
            </div>
            <div className="dash-stats">
              <div className="dash-stat">
                <p className="dash-stat-label mono">SIGNATURES</p>
                <p className="dash-stat-value mono">{signatures}</p>
              </div>
              <div className="dash-stat">
                <p className="dash-stat-label mono">COUNTRIES</p>
                <p className="dash-stat-value mono">{countries}</p>
              </div>
              <div className="dash-stat">
                <p className="dash-stat-label mono">WALL CAPACITY</p>
                <p className="dash-stat-value mono">{capacity}%</p>
              </div>
            </div>
            <div className="dash-chart-wrap">
              <p className="dash-chart-title mono">SIGNATURES / DAY</p>
              <div className="dash-chart" role="img" aria-label="Signatures per day, Monday to Sunday">
                {byDay.map((count, i) => (
                  <div key={DAY_LABELS[i]} className="dash-col">
                    <div
                      className={`dash-bar ${i === today ? "dash-bar-today" : count > 0 ? "dash-bar-filled" : ""}`}
                      style={{ height: `${count === 0 ? 4 : Math.round((count / max) * 100)}%` }}
                    />
                    <span className="dash-day mono">{DAY_LABELS[i]}</span>
                  </div>
                ))}
              </div>
            </div>
            <p className="dash-footer mono">Live — aggregated from the visitor wall below ↓</p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
