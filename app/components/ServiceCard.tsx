"use client";

import type { NearbyService } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";

const ROMAN = ["i.", "ii.", "iii."];

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

  return (
    <article className="card flex flex-col">
      <span className="num" aria-hidden="true">{ROMAN[index] ?? `${index + 1}.`}</span>
      <span className="inline-block mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-teal-deep">
        {service.category}
      </span>
      <h3 className="m-0 mb-3 text-balance font-display text-[24px] leading-[1.15] tracking-[-0.012em] pr-[46px]">
        {service.name}
      </h3>
      <p className="m-0 mb-[18px] text-pretty text-[14px] leading-[1.5] text-ink-2 flex-1">
        {service.why}
      </p>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-line pt-4">
        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {copy.card.address}
        </dt>
        <dd className="m-0 text-[14px] leading-[1.45] text-ink">
          {service.address || "—"}
        </dd>

        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {copy.card.hours}
        </dt>
        <dd className="m-0 text-[14px] leading-[1.45] text-ink">
          {service.hours || "—"}
        </dd>

        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {copy.card.access}
        </dt>
        <dd className="m-0 text-[14px] leading-[1.45] text-ink-2">
          {service.access || "—"}
        </dd>

        {websiteHref && (
          <>
            <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
              Web
            </dt>
            <dd className="m-0">
              <a
                href={websiteHref}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[14px] text-teal hover:text-teal-deep hover:underline break-all"
              >
                {websiteHref.replace(/^https?:\/\//, "").replace(/\/$/, "")}
              </a>
            </dd>
          </>
        )}
      </dl>
      {service.note && (
        <p className="mt-3.5 rounded-md bg-amber-50 px-3 py-2 text-[12.5px] leading-[1.45] text-amber-700 border border-amber-200">
          ⚠ {service.note}
        </p>
      )}
    </article>
  );
}
