"use client";

import { useEffect, useState } from "react";
import type { HourSlot } from "@/app/lib/hours";
import { isOpenNow, formatUntil } from "@/app/lib/hours";

interface Service {
  id: string;
  name: string;
  category: string;
  address: string;
  hours_raw: string;
  hours_structured: HourSlot[];
  phone: string;
  website: string;
}

const AVATAR_COLORS = [
  "bg-teal text-white",
  "bg-[#4B7BF5] text-white",
  "bg-[#E07B5C] text-white",
  "bg-[#6B5FED] text-white",
  "bg-[#2CA85A] text-white",
];

const SUBURB_KEY = "nearby:detected-suburb";

interface Props {
  suburb?: string;
}

export default function OpenNow({ suburb: suburbProp }: Props) {
  const [suburb, setSuburb] = useState<string | null>(suburbProp ?? null);
  const [services, setServices] = useState<Service[]>([]);
  const [expanded, setExpanded] = useState(false);

  // Resolve suburb: prop → localStorage → geolocation
  useEffect(() => {
    if (suburbProp) {
      setSuburb(suburbProp);
      return;
    }
    try {
      const cached = localStorage.getItem(SUBURB_KEY);
      if (cached) { setSuburb(cached); return; }
    } catch { /* ignore */ }

    if (!navigator.geolocation) { return; }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en", "User-Agent": "Nearby-Melbourne/1.0" } },
          );
          if (!res.ok) throw new Error();
          const data = (await res.json()) as { address: Record<string, string> };
          const a = data.address;
          const name =
            a.suburb ?? a.neighbourhood ?? a.city_district ?? a.town ?? a.city ?? "";
          if (name) {
            try { localStorage.setItem(SUBURB_KEY, name); } catch { /* ignore */ }
            setSuburb(name);
          }
        } catch {
          // silently give up
        }
      },
      () => { /* silently give up */ },
      { timeout: 6000 },
    );
  }, [suburbProp]);

  // Fetch services when suburb is known
  useEffect(() => {
    if (!suburb) return;
    fetch(`/api/services?suburb=${encodeURIComponent(suburb)}`)
      .then((r) => r.json())
      .then((d: { services?: Service[] }) => setServices(d.services ?? []))
      .catch(() => { /* silently give up */ });
  }, [suburb]);

  const openNow = services.filter((s) => isOpenNow(s.hours_structured));
  const visible = expanded ? openNow : openNow.slice(0, 5);

  // Only render once we have confirmed open services — avoids skeleton flash
  if (openNow.length === 0) return null;

  return (
    <div className="mt-10 border-t border-line pt-7">
      <div className="mb-3.5 flex items-center gap-2.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal opacity-70" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-teal" />
        </span>
        <h2 className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          Open right now
        </h2>
        {suburb && (
          <span className="font-mono text-[11px] text-ink-3">· {suburb}</span>
        )}
      </div>

      <ul
        className="m-0 list-none space-y-0.5 p-0"
        aria-label={`Services open right now in ${suburb ?? ""}`}
      >
        {visible.map((s, i) => {
          const until = formatUntil(s.hours_structured);
          const color = AVATAR_COLORS[i % AVATAR_COLORS.length];
          return (
            <li
              key={s.id}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors hover:bg-paper"
            >
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${color}`}
                aria-hidden="true"
              >
                {s.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <span className="truncate text-[14px] font-medium text-ink">
                    {s.name}
                  </span>
                  {until && (
                    <span className="shrink-0 font-mono text-[11px] text-teal-deep">
                      until {until}
                    </span>
                  )}
                </div>
                <div className="truncate text-[12.5px] text-ink-3">
                  {s.address}
                  <span className="mx-1.5" aria-hidden="true">·</span>
                  <span className="text-ink-2">{s.category}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>

      {openNow.length > 5 && (
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="mt-3 bg-transparent p-0 font-mono text-[11px] uppercase tracking-[0.12em] text-teal hover:text-teal-deep"
        >
          {expanded ? "Show less" : `Browse all ${openNow.length} →`}
        </button>
      )}
    </div>
  );
}
