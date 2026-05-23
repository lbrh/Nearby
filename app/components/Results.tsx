"use client";

import { useEffect, useRef } from "react";
import type { NearbyResponse } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";
import ServiceCard from "./ServiceCard";
import FollowUpChat from "./FollowUpChat";
import CommunityGroups from "./CommunityGroups";

interface Props {
  data: NearbyResponse;
  lang: string;
  suburb: string;
  need: string;
  demographic: string;
  onRestart: () => void;
  onSubmitGroup: () => void;
}

export default function Results({ data, lang, suburb, need, demographic, onRestart, onSubmitGroup }: Props) {
  const copy = useCopy();
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  const chips = [suburb, demographic].filter(Boolean);

  return (
    <section className="screen-fade flex flex-1 flex-col gap-[18px] lg:max-w-none">
      <div className="mb-1.5 flex flex-col items-start justify-between gap-[18px] sm:flex-row">
        <div className="flex-1">
          <div className="mb-2.5 flex flex-wrap items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
            {chips.map((c) => (
              <span key={c} className="rounded-full border border-line bg-paper px-2.5 py-1 text-ink-2">
                {c}
              </span>
            ))}
          </div>
          <h2
            ref={headingRef}
            tabIndex={-1}
            className="m-0 mb-1.5 text-balance font-display text-[clamp(28px,5.6vw,38px)] leading-[1.1] tracking-[-0.015em] focus:outline-none"
          >
            {copy.results.title}
          </h2>
          <p className="m-0 max-w-[52ch] text-pretty text-[15.5px] text-ink-2">
            {data.intro}
          </p>
        </div>
        <button
          type="button"
          onClick={onRestart}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-line bg-paper px-3.5 py-2 text-[13px] text-ink-2 hover:border-line-strong hover:text-ink"
        >
          {copy.results.restart}
        </button>
      </div>

      <div className="mt-2 grid gap-3.5 lg:grid-cols-3">
        {data.services.slice(0, 3).map((s, i) => (
          <ServiceCard key={i} service={s} index={i} />
        ))}
      </div>

      <FollowUpChat lang={lang} suburb={suburb} need={need} demographic={demographic} services={data.services.slice(0, 3)} />

      <CommunityGroups suburb={suburb} onSubmitGroup={onSubmitGroup} />
    </section>
  );
}
