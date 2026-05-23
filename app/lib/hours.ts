export interface HourSlot {
  days: number[]; // 0=Sun, 1=Mon ... 6=Sat
  opens: string;  // "HH:MM" 24h
  closes: string; // "HH:MM" 24h
}

const TZ = "Australia/Melbourne";
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function nowInMelbourne(): { day: number; minutes: number } {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en-AU", {
    timeZone: TZ,
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
    hour12: false,
  }).formatToParts(now);

  const weekday = parts.find((p) => p.type === "weekday")?.value ?? "Mon";
  const hour = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minute = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);

  return { day: WEEKDAYS.indexOf(weekday), minutes: hour * 60 + minute };
}

function toMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

function formatHHMM(t: string): string {
  const [h, m] = t.split(":").map(Number);
  const suffix = h < 12 ? "am" : "pm";
  const h12 = h % 12 || 12;
  return m ? `${h12}:${m.toString().padStart(2, "0")}${suffix}` : `${h12}${suffix}`;
}

export function isOpenNow(slots: HourSlot[] | null | undefined): boolean {
  if (!slots?.length) return false;
  const { day, minutes } = nowInMelbourne();
  return slots.some(
    (s) =>
      s.days.includes(day) &&
      toMinutes(s.opens) <= minutes &&
      minutes < toMinutes(s.closes),
  );
}

export function formatUntil(slots: HourSlot[] | null | undefined): string | null {
  if (!slots?.length) return null;
  const { day, minutes } = nowInMelbourne();
  const active = slots.filter(
    (s) =>
      s.days.includes(day) &&
      toMinutes(s.opens) <= minutes &&
      minutes < toMinutes(s.closes),
  );
  if (!active.length) return null;
  const latest = active.map((s) => toMinutes(s.closes)).sort((a, b) => b - a)[0];
  const h = Math.floor(latest / 60);
  const m = latest % 60;
  return formatHHMM(`${h}:${m.toString().padStart(2, "0")}`);
}
