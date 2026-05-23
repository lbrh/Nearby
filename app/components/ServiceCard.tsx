"use client";

import { useState } from "react";
import type { NearbyService } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";

const ROMAN = ["i.", "ii.", "iii."];
const COLOURS = [
  "text-teal-deep bg-teal-soft",
  "text-[#0891b2] bg-[#e0f2fe]",
  "text-[#7c3aed] bg-[#ede9fe]",
];

function safeUrl(url: string | undefined): string | null {
  if (!url) return null;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    if (u.protocol === "https:" || u.protocol === "http:") return u.href;
    return null;
  } catch {
    return null;
  }
}

export default function ServiceCard({ service, index }: { service: NearbyService; index: number }) {
  const copy = useCopy();
  const websiteHref = safeUrl(service.website);
  const [expanded, setExpanded] = useState(false);
  const colour = COLOURS[index] ?? COLOURS[0];

  return (
    <article className="card flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${colour}`}
          aria-hidden="true"
        >
          {index + 1}
        </span>
        <div className="min-w-0 flex-1">
          <span className={`mb-0.5 inline-block font-mono text-[10px] uppercase tracking-[0.16em] ${colour.split(" ")[0]}`}>
            {service.category}
          </span>
          <h3 className="m-0 text-balance font-display text-[20px] leading-[1.2] tracking-[-0.01em]">
            {service.name}
          </h3>
        </div>
      </div>

      {/* Always visible: address + hours */}
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 text-[13px]">
        <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{copy.card.address}</span>
        <span className="text-ink">{service.address || "—"}</span>

        <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{copy.card.hours}</span>
        <span className="text-ink">{service.hours || "—"}</span>
      </div>

      {/* Expanded details */}
      {expanded && (
        <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1.5 border-t border-line pt-3 text-[13px]">
          <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{copy.card.access}</span>
          <span className="text-ink-2">{service.access || "—"}</span>

          <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Why</span>
          <span className="text-ink-2">{service.why || "—"}</span>

          {websiteHref && (
            <>
              <span className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">Web</span>
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-[13px] text-teal hover:text-teal-deep hover:underline"
              >
                {websiteHref.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </>
          )}
        </div>
      )}

      {service.note && expanded && (
        <p className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-[12px] leading-[1.45] text-amber-700">
          ⚠ {service.note}
        </p>
      )}

      {/* Toggle */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-auto inline-flex items-center gap-1 self-start text-[12px] font-medium text-teal-deep hover:text-teal"
      >
        {expanded ? "Show less" : "Show more"}
        <svg
          className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </article>
  );
}
