import { useCallback, useEffect, useMemo, useState } from "react";
import type { Country } from "../data/countries";
import { WALL_LIMIT, myNoteId, wallApi } from "../lib/wallApi";
import type { Note } from "../lib/wallApi";
import { isoWeekKey } from "../lib/week";

export type Wall = {
  week: string;
  limit: number;
  notes: Note[];
  mineId: string | null;
  posted: boolean;
  full: boolean;
  justPinnedId: string | null;
  pin: (country: Country, color: string) => Promise<void>;
  remove: () => Promise<void>;
};

export function useWall(): Wall {
  const week = isoWeekKey();
  const [notes, setNotes] = useState<Note[]>([]);
  const [mineId, setMineId] = useState<string | null>(myNoteId());
  const [justPinnedId, setJustPinnedId] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    wallApi
      .getNotes()
      .then((snap) => {
        if (cancelled) return;
        setNotes(snap.notes);
        // stale local marker (server-side delete, TTL, or new week)
        const mine = myNoteId();
        if (mine && !snap.notes.some((n) => n.id === mine)) setMineId(null);
      })
      .catch(() => {
        /* wall stays empty; composer still works and will surface errors */
      });
    return () => {
      cancelled = true;
    };
  }, [week]);

  const pin = useCallback(async (country: Country, color: string) => {
    const note = await wallApi.postNote({ name: country.name, flag: country.flag, color });
    setNotes((prev) => [note, ...prev]);
    setMineId(note.id);
    setJustPinnedId(note.id);
  }, []);

  const remove = useCallback(async () => {
    const id = myNoteId();
    if (!id) return;
    await wallApi.deleteNote(id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
    setMineId(null);
    setJustPinnedId(null);
  }, []);

  const posted = mineId !== null && notes.some((n) => n.id === mineId);

  return useMemo(
    () => ({
      week,
      limit: WALL_LIMIT,
      notes,
      mineId,
      posted,
      full: notes.length >= WALL_LIMIT,
      justPinnedId,
      pin,
      remove,
    }),
    [week, notes, mineId, posted, justPinnedId, pin, remove],
  );
}
