"use client";

import { useEffect, useRef, useState } from "react";
import type { Demographic } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";
import VoiceInput from "./VoiceInput";

interface Props {
  suburb: string;
  setSuburb: (v: string) => void;
  need: string;
  setNeed: (v: string) => void;
  demographic: string;
  setDemographic: (v: string) => void;
  lang: string;
  error: string | null;
  onBack: () => void;
  onSubmit: () => void;
}

const DEMOGRAPHICS: { value: Demographic; label: string }[] = [
  { value: "", label: "Prefer not to say" },
  { value: "International student", label: "International student" },
  { value: "Elderly resident", label: "Elderly resident" },
  { value: "New arrival", label: "New arrival to Australia" },
  { value: "Local family", label: "Local family" },
  { value: "Other", label: "Other" },
];

type GeoState = "idle" | "loading" | "error";

export default function NearbyForm(props: Props) {
  const { suburb, setSuburb, need, setNeed, demographic, setDemographic, lang, error, onBack, onSubmit } = props;
  const cp = useCopy();
  const f = cp.form;
  const [geoState, setGeoState] = useState<GeoState>("idle");
  const [geoError, setGeoError] = useState<string | null>(null);
  const isRtl = ["ar", "Arabic", "he", "Hebrew", "fa", "Persian", "ur", "Urdu"].includes(lang);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const errorId = "form-error";

  // Move focus to heading when this screen mounts
  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  async function handleUseLocation() {
    if (!navigator.geolocation) {
      setGeoError("Geolocation isn't supported by your browser.");
      return;
    }
    setGeoState("loading");
    setGeoError(null);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&addressdetails=1`,
            { headers: { "Accept-Language": "en", "User-Agent": "Nearby-Melbourne/1.0" } },
          );
          if (!res.ok) throw new Error("Geocoding failed");
          const data = (await res.json()) as { address: Record<string, string> };
          const a = data.address;
          const name = a.suburb ?? a.neighbourhood ?? a.city_district ?? a.town ?? a.city ?? "";
          if (name) {
            setSuburb(name);
            setGeoState("idle");
          } else {
            throw new Error("Couldn't determine your suburb from your location.");
          }
        } catch (err) {
          setGeoState("error");
          setGeoError(err instanceof Error ? err.message : "Couldn't determine your suburb.");
        }
      },
      (err) => {
        setGeoState("error");
        if (err.code === err.PERMISSION_DENIED) {
          setGeoError("Location access was denied. Type your suburb manually.");
        } else {
          setGeoError("Couldn't get your location. Type your suburb manually.");
        }
      },
      { timeout: 10000 },
    );
  }

  return (
    <section className="screen-fade flex flex-1 flex-col lg:max-w-[680px]" dir={isRtl ? "rtl" : "ltr"}>
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-1.5 bg-transparent p-0 text-[13.5px] text-ink-2 hover:text-ink"
        aria-label="Back to home"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {f.back}
      </button>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="mx-0 mt-1 mb-1.5 font-display text-[clamp(34px,7vw,46px)] leading-[1.05] tracking-[-0.015em] focus:outline-none"
      >
        {f.heading}
      </h2>
      <p className="m-0 mb-8 text-[15.5px] text-ink-2">{f.sub}</p>

      {error && (
        <div
          id={errorId}
          role="alert"
          className="mb-4 rounded-xl border border-[#F4D4BD] bg-[#FFF4EE] px-4 py-3.5 text-sm text-[#7A2E08]"
        >
          {error}
        </div>
      )}

      <form
        onSubmit={(e) => { e.preventDefault(); onSubmit(); }}
        noValidate
        aria-describedby={error ? errorId : undefined}
      >
        {/* suburb */}
        <div className="mb-[26px]">
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="suburb" className="label-mono">{f.suburbLabel}</label>
            <div className="flex items-center gap-2">
              <VoiceInput lang={lang} value={suburb} onChange={setSuburb} label="Dictate your suburb" />
              <button
                type="button"
                onClick={handleUseLocation}
                disabled={geoState === "loading"}
                aria-label={geoState === "loading" ? "Getting your location…" : "Use my current location"}
                className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-ink-2 hover:border-line-strong hover:text-ink disabled:cursor-wait disabled:opacity-50"
              >
                {geoState === "loading" ? (
                  <>
                    <svg className="h-3 w-3 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" strokeLinecap="round" />
                    </svg>
                    {f.locating}
                  </>
                ) : (
                  <>
                    <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeLinecap="round" />
                    </svg>
                    {f.useLocation}
                  </>
                )}
              </button>
            </div>
          </div>
          <input
            id="suburb"
            type="text"
            className="input-base"
            placeholder="e.g. Carlton, North Melbourne, Kensington"
            autoComplete="off"
            value={suburb}
            onChange={(e) => setSuburb(e.target.value)}
            required
            aria-required="true"
            aria-describedby={geoError ? "geo-error" : undefined}
          />
          {geoError && (
            <div id="geo-error" role="alert" className="mt-1.5 text-[12.5px] text-[#7A2E08]">
              {geoError}
            </div>
          )}
        </div>

        {/* need */}
        <div className="mb-[26px]">
          <div className="mb-2.5 flex items-center justify-between">
            <label htmlFor="need" className="label-mono">{f.needLabel}</label>
            <div className="flex items-center gap-2">
              {!["en", "English"].includes(lang) && (
                <span
                  aria-label={`Language automatically set to ${lang}`}
                  className="rounded-full border border-line bg-paper px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.1em] text-teal-deep"
                >
                  {lang} {f.detected}
                </span>
              )}
              <VoiceInput lang={lang} value={need} onChange={setNeed} label="Dictate what you need" />
            </div>
          </div>
          <textarea
            id="need"
            className="input-base min-h-[96px] resize-y leading-[1.45]"
            placeholder="e.g. somewhere to grow vegetables, free meals this week, help repairing a bike, a quiet place to study, somewhere to volunteer on weekends"
            value={need}
            onChange={(e) => setNeed(e.target.value)}
            required
            aria-required="true"
            dir={isRtl ? "rtl" : "ltr"}
          />
          <div className="mt-1.5 text-[12.5px] text-ink-3" aria-live="polite">
            {need ? "" : f.needHint}
          </div>
        </div>

        {/* demographic */}
        <div className="mb-[26px]">
          <label htmlFor="demographic" className="label-mono mb-2.5 block">{f.demoLabel}</label>
          <select
            id="demographic"
            className="input-base select-base"
            value={demographic}
            onChange={(e) => setDemographic(e.target.value)}
            aria-describedby="demographic-hint"
          >
            {DEMOGRAPHICS.map((d) => (
              <option key={d.label} value={d.value}>
                {d.label}
              </option>
            ))}
          </select>
          <div id="demographic-hint" className="mt-1.5 text-[12.5px] text-ink-3">{f.demoHint}</div>
        </div>

        {/* submit */}
        <div className="mt-3.5 flex flex-col items-stretch justify-between gap-3.5 sm:flex-row sm:items-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">{f.meta}</span>
          <button type="submit" className="btn btn-primary justify-center sm:justify-start">
            {f.submit}
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </form>
    </section>
  );
}
