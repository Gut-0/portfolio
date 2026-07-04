import { useMemo, useState } from "react";
import { COUNTRIES } from "../data/countries";
import type { Country } from "../data/countries";
import type { Wall as WallState } from "../hooks/useWall";
import { resetLabel, timeAgo } from "../lib/week";
import Reveal from "./Reveal";

export const NOTE_COLORS = [
  "#fdec8a",
  "#ffd6c9",
  "#cfeede",
  "#d6e4ff",
  "#ece0ff",
  "#fff0b0",
  "#ffe0ea",
];

function Composer({ wall }: { wall: WallState }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Country | null>(null);
  const [noteColor, setNoteColor] = useState(NOTE_COLORS[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return COUNTRIES;
    return COUNTRIES.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  const reset = resetLabel();

  if (wall.posted) {
    const mine = wall.notes.find((n) => n.id === wall.mineId);
    return (
      <div className="composer">
        <div className="composer-card">
          <p className="composer-confirm">
            <span className="composer-confirm-flag">{mine?.flag}</span> Hello from {mine?.name} —
            pinned ✓
          </p>
          <p className="composer-note">
            One note per visitor — the wall resets {reset}.
          </p>
          <button
            type="button"
            className="pill-delete mono"
            onClick={() => void wall.remove()}
          >
            × Delete my note
          </button>
        </div>
      </div>
    );
  }

  if (wall.full) {
    return (
      <div className="composer">
        <div className="composer-card">
          <p className="composer-confirm">The wall is full this week</p>
          <p className="composer-note">
            All 37 spots are taken. The board clears and reopens {reset} — check back to leave
            your hello.
          </p>
        </div>
      </div>
    );
  }

  async function pin() {
    if (!selected || busy) return;
    setBusy(true);
    setError(null);
    try {
      await wall.pin(selected, noteColor);
      setOpen(false);
      setSelected(null);
      setQuery("");
    } catch {
      setError("Couldn't pin your note — please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="composer">
      <button
        type="button"
        className="composer-trigger"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {open ? "Close" : "Leave a hello"}{" "}
        <span className={`caret ${open ? "caret-open" : ""}`} aria-hidden="true">
          ⌄
        </span>
      </button>
      <div className={`collapse ${open ? "open" : ""}`}>
        <div className="collapse-inner">
          <div className="composer-panel">
            <p className="tile-kicker mono">LEAVE A HELLO</p>
            {!selected ? (
              <>
                <input
                  type="search"
                  className="country-search"
                  placeholder="Search your country…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search your country"
                />
                <ul className="country-list" role="listbox" aria-label="Countries">
                  {results.map((c) => (
                    <li key={c.name}>
                      <button type="button" className="country-row" onClick={() => setSelected(c)}>
                        <span className="country-flag">{c.flag}</span> {c.name}
                      </button>
                    </li>
                  ))}
                  {results.length === 0 && (
                    <li className="country-empty">No country matches "{query}".</li>
                  )}
                </ul>
              </>
            ) : (
              <div className="composer-preview-row">
                <div className="note note-preview" style={{ background: noteColor }}>
                  <span className="note-tape" aria-hidden="true" />
                  <span className="note-flag">{selected.flag}</span>
                  <span className="note-kicker mono">Hello from</span>
                  <span className="note-name">{selected.name}</span>
                </div>
                <div className="composer-controls">
                  <p className="tile-kicker mono">NOTE COLOR</p>
                  <div className="swatch-row">
                    {NOTE_COLORS.map((color) => (
                      <button
                        key={color}
                        type="button"
                        className={`swatch ${color === noteColor ? "swatch-active" : ""}`}
                        style={{ background: color }}
                        aria-label={`Note color ${color}`}
                        onClick={() => setNoteColor(color)}
                      />
                    ))}
                  </div>
                  <button type="button" className="btn-primary" disabled={busy} onClick={() => void pin()}>
                    {busy ? "Pinning…" : "Pin to wall →"}
                  </button>
                  <button type="button" className="composer-back" onClick={() => setSelected(null)}>
                    ← Choose another country
                  </button>
                  {error && <p className="composer-error">{error}</p>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Board({ wall }: { wall: WallState }) {
  if (wall.notes.length === 0) {
    return (
      <div className="board-empty">
        The wall is empty this week — be the first to pin a hello.
      </div>
    );
  }
  return (
    <div className="board">
      {wall.notes.map((note) => (
        <div
          key={note.id}
          className={`note ${note.id === wall.justPinnedId ? "note-pin-in" : ""}`}
          style={{ background: note.color, "--rot": `${note.rot}deg` } as React.CSSProperties}
        >
          <span className="note-tape" aria-hidden="true" />
          {note.id === wall.mineId && (
            <button
              type="button"
              className="note-delete"
              aria-label="Delete my note"
              onClick={() => void wall.remove()}
            >
              ×
            </button>
          )}
          <span className="note-flag">{note.flag}</span>
          <span className="note-kicker mono">Hello from</span>
          <span className="note-name">{note.name}</span>
          <span className="note-time mono">{timeAgo(note.ts)}</span>
        </div>
      ))}
    </div>
  );
}

function PipelineExplainer() {
  const [show, setShow] = useState(false);
  return (
    <div className="wall-pipeline">
      <p className="wall-pipeline-line mono">
        Notes persist via API Gateway → Lambda → DynamoDB · weekly reset on EventBridge schedule.
      </p>
      <button
        type="button"
        className="pill mono pipeline-toggle"
        aria-expanded={show}
        onClick={() => setShow((v) => !v)}
      >
        SHOW PIPELINE{" "}
        <span className={`caret ${show ? "caret-open" : ""}`} aria-hidden="true">
          ⌄
        </span>
      </button>
      <div className={`collapse ${show ? "open" : ""}`}>
        <div className="collapse-inner">
          <div className="pipeline-flow">
            <div className="pipeline-node mono">
              VISITOR<span>Pin note</span>
            </div>
            <span className="pipeline-dash" aria-hidden="true" />
            <div className="pipeline-node mono">
              API GATEWAY<span>POST /notes</span>
            </div>
            <span className="pipeline-dash" aria-hidden="true" />
            <div className="pipeline-node mono">
              LAMBDA<span>Validate</span>
            </div>
            <span className="pipeline-dash" aria-hidden="true" />
            <div className="pipeline-node mono">
              DYNAMODB<span>Stored</span>
            </div>
          </div>
          <p className="pipeline-cron mono">
            EVENTBRIDGE → cron(0 0 ? * MON *) — clears the board &amp; reopens 37 spots every
            Monday.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Wall({ wall }: { wall: WallState }) {
  return (
    <section id="wall" className="section">
      <div className="shell">
        <Reveal>
          <div className="section-heading wall-heading">
            <div className="section-heading">
              <span className="section-index mono">07</span>
              <h2>Visitor wall</h2>
            </div>
            <span className="wall-status mono">
              <span className="wall-status-dot" aria-hidden="true" />
              {wall.notes.length} / {wall.limit} this week · resets {resetLabel()}
            </span>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <p className="section-intro wall-intro">
            No forms here — just say hello. Pick your country and pin a note to the board. One
            note per visitor; the wall holds 37 hellos a week, then starts fresh.
          </p>
        </Reveal>
        <Reveal delay={140}>
          <Composer wall={wall} />
        </Reveal>
        <Reveal delay={180}>
          <Board wall={wall} />
        </Reveal>
        <PipelineExplainer />
      </div>
    </section>
  );
}
