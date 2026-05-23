"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/app/lib/types";
import { LOADING_COPY } from "@/app/lib/i18n";

export default function Loading({ lang }: { lang: Lang }) {
  const copy = LOADING_COPY[lang] ?? LOADING_COPY.en;
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1 < copy.steps.length ? i + 1 : i));
    }, 1400);
    return () => clearInterval(timer);
  }, [copy.steps.length]);

  return (
    <section className="screen-fade flex flex-1 flex-col items-stretch justify-center">
      <div className="mx-auto mt-[8vh] w-full max-w-[520px] text-left">
        <div className="ping mb-[22px]" />
        <h3 className="m-0 mb-2 font-display text-[36px] leading-[1.1] tracking-[-0.015em]">
          {copy.title}
        </h3>
        <p className="m-0 mb-7 text-ink-2">{copy.sub}</p>
        <ul className="m-0 list-none border-t border-line p-0">
          {copy.steps.map((s, i) => {
            const cls =
              i < activeIdx
                ? "step done"
                : i === activeIdx
                  ? "step active"
                  : "step";
            return (
              <li
                key={s}
                className={`${cls} flex items-center gap-3.5 border-b border-line py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3 transition-colors duration-300`}
              >
                <span className="tick" />
                <span>{s}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
