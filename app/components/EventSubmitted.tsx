"use client";

import type { Event } from "@/app/lib/types";

const REPEAT_LABELS: Record<string, string> = {
  none: "One-time event",
  daily: "Repeats daily",
  weekly: "Repeats weekly",
  monthly: "Repeats monthly",
  yearly: "Repeats yearly",
};

function formatDate(dateStr: string) {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function formatTime(t: string) {
  if (!t) return "";
  const [h, m] = t.split(":").map(Number);
  const ampm = h >= 12 ? "pm" : "am";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")}${ampm}`;
}

export default function EventSubmitted({
  event,
  onDone,
}: {
  event: Event;
  onDone: () => void;
}) {
  return (
    <section className="screen-fade flex flex-1 flex-col items-start justify-center gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-soft">
        <svg className="h-6 w-6 text-teal-deep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div>
        <h2 className="m-0 mb-2 font-display text-[clamp(30px,6vw,42px)] leading-[1.05] tracking-[-0.015em]">
          Event listed.
        </h2>
        <p className="m-0 text-[15.5px] text-ink-2">
          <strong className="font-medium text-ink">{event.title}</strong> is now visible to
          anyone searching{event.suburb ? ` in ${event.suburb}` : ""}.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-line bg-paper p-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[14px]">
          {event.event_date && (
            <>
              <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">When</dt>
              <dd className="m-0 text-ink">
                {formatDate(event.event_date)}, {formatTime(event.start_time)}–{formatTime(event.end_time)}
                {event.repeat_type !== "none" && (
                  <span className="ml-2 text-ink-3">· {REPEAT_LABELS[event.repeat_type]}</span>
                )}
              </dd>
            </>
          )}
          {event.address && (
            <>
              <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Where</dt>
              <dd className="m-0 text-ink">{event.address}</dd>
            </>
          )}
          {event.email && (
            <>
              <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">Email</dt>
              <dd className="m-0 text-ink">{event.email}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={onDone}>
          Back to Nearby
        </button>
      </div>
    </section>
  );
}
