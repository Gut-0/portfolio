// Visitor-wall client. Talks to the real API when VITE_API_URL is set;
// otherwise falls back to localStorage so local dev works without a backend.

import { isoWeekKey } from "./week";

export type Note = {
  id: string;
  week: string;
  name: string;
  flag: string;
  color: string;
  rot: number;
  ts: number;
};

export type WallSnapshot = { week: string; limit: number; notes: Note[] };

export const WALL_LIMIT = 37;

const API_URL = import.meta.env.VITE_API_URL as string | undefined;

// Anonymous visitor id: best-effort client identity, enforced server-side
// as one note per (week, visitor). Documented trade-off in the README.
function visitorId(): string {
  const key = "gb_visitor_id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

const mineKey = () => `gb_wall_mineid_${isoWeekKey()}`;

export function myNoteId(): string | null {
  return localStorage.getItem(mineKey());
}

function rememberMine(id: string | null) {
  if (id) localStorage.setItem(mineKey(), id);
  else localStorage.removeItem(mineKey());
}

// ---- real API ----

async function apiGetNotes(): Promise<WallSnapshot> {
  const res = await fetch(`${API_URL}/notes`);
  if (!res.ok) throw new Error(`GET /notes -> ${res.status}`);
  return res.json();
}

async function apiPostNote(input: { name: string; flag: string; color: string }): Promise<Note> {
  const res = await fetch(`${API_URL}/notes`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-visitor-id": visitorId() },
    body: JSON.stringify(input),
  });
  if (!res.ok) throw new Error(`POST /notes -> ${res.status}`);
  const note: Note = await res.json();
  rememberMine(note.id);
  return note;
}

async function apiDeleteNote(id: string): Promise<void> {
  const res = await fetch(`${API_URL}/notes/${id}`, {
    method: "DELETE",
    headers: { "x-visitor-id": visitorId() },
  });
  if (!res.ok && res.status !== 404) throw new Error(`DELETE /notes/${id} -> ${res.status}`);
  rememberMine(null);
}

// ---- localStorage fallback (dev only) ----

const localKey = () => `gb_wall_notes_${isoWeekKey()}`;

function localRead(): Note[] {
  try {
    return JSON.parse(localStorage.getItem(localKey()) ?? "[]");
  } catch {
    return [];
  }
}

function localWrite(notes: Note[]) {
  localStorage.setItem(localKey(), JSON.stringify(notes));
}

async function localGetNotes(): Promise<WallSnapshot> {
  return { week: isoWeekKey(), limit: WALL_LIMIT, notes: localRead() };
}

async function localPostNote(input: { name: string; flag: string; color: string }): Promise<Note> {
  const notes = localRead();
  if (notes.length >= WALL_LIMIT) throw new Error("wall full");
  const note: Note = {
    id: crypto.randomUUID(),
    week: isoWeekKey(),
    ...input,
    rot: Math.round((Math.random() * 8 - 4) * 10) / 10,
    ts: Date.now(),
  };
  localWrite([note, ...notes]);
  rememberMine(note.id);
  return note;
}

async function localDeleteNote(id: string): Promise<void> {
  localWrite(localRead().filter((n) => n.id !== id));
  rememberMine(null);
}

export const wallApi = API_URL
  ? { getNotes: apiGetNotes, postNote: apiPostNote, deleteNote: apiDeleteNote }
  : { getNotes: localGetNotes, postNote: localPostNote, deleteNote: localDeleteNote };
