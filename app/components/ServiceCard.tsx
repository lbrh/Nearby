"use client";

import type { Lang, NearbyService } from "@/app/lib/types";
import { CARD_LABELS, CHAT_COPY } from "@/app/lib/i18n";

const ROMAN = ["i.", "ii.", "iii."];

export default function ServiceCard({
  service,
  index,
  lang,
}: {
  service: NearbyService;
  index: number;
  lang: Lang;
}) {
  const labels = CARD_LABELS[lang] ?? CARD_LABELS.en;
  const isRtl = lang === "ar";

  return (
    <article className="card">
      <span className="num">{ROMAN[index] ?? `${index + 1}.`}</span>
      <span className="inline-block mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.16em] text-teal-deep">
        {service.category}
      </span>
      <h3
        className={`m-0 mb-3.5 text-balance font-display text-[26px] leading-[1.15] tracking-[-0.012em] ${
          isRtl ? "pl-[46px]" : "pr-[46px]"
        }`}
      >
        {service.name}
      </h3>
      <p className="m-0 mb-[18px] text-pretty text-[14.5px] leading-[1.5] text-ink-2">
        {service.why}
      </p>
      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 border-t border-line pt-4">
        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {labels.address}
        </dt>
        <dd className="m-0 text-[14.5px] leading-[1.45] text-ink">
          {service.address || "—"}
        </dd>

        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {labels.hours}
        </dt>
        <dd className="m-0 text-[14.5px] leading-[1.45] text-ink">
          {service.hours || "—"}
        </dd>

        <dt className="pt-0.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
          {labels.access}
        </dt>
        <dd className="m-0 text-[14.5px] leading-[1.45] text-ink-2">
          {service.access || "—"}
        </dd>
      </dl>
      {service.note && (
        <p className="mt-3.5 rounded-md bg-amber-50 px-3 py-2 text-[12.5px] leading-[1.45] text-amber-700 border border-amber-200">
          ⚠ {service.note}
        </p>
      )}
    </article>
  );
}
