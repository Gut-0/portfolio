// ISO-8601 week helpers — weeks start Monday; the wall resets Monday 00:00 UTC.

export function isoWeekKey(date: Date = new Date()): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay() || 7; // Sunday -> 7
  d.setUTCDate(d.getUTCDate() + 4 - day); // nearest Thursday decides the ISO year
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  const week = Math.ceil(((d.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
  return `${d.getUTCFullYear()}-W${String(week).padStart(2, "0")}`;
}

export function daysUntilNextMonday(date: Date = new Date()): number {
  const day = date.getUTCDay() || 7;
  return 8 - day;
}

export function resetLabel(date: Date = new Date()): string {
  const days = daysUntilNextMonday(date);
  return days === 1 ? "tomorrow" : `in ${days} days`;
}

export function timeAgo(ts: number, now: number = Date.now()): string {
  const s = Math.max(0, Math.floor((now - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** Mon=0 … Sun=6 bucket for the dashboard's per-day chart. */
export function isoDayIndex(ts: number): number {
  return (new Date(ts).getUTCDay() + 6) % 7;
}
