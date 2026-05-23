"use client";

import { useEffect, useState } from "react";
import { useCopy } from "@/app/lib/copy-context";

export default function Loading() {
  const copy = useCopy();
  const [activeIdx, setActiveIdx] = useState(0);

  useEffect(() => {
    setActiveIdx(0);
    const timer = setInterval(() => {
      setActiveIdx((i) => (i + 1 < copy.loading.steps.length ? i + 1 : i));
    }, 1400);
    return () => clearInterval(timer);
  }, [copy.loading.steps.length]);

  const currentStep = copy.loading.steps[activeIdx];

  return (
    <section
      className="screen-fade flex flex-1 flex-col items-stretch justify-center"
      aria-label="Loading results"
    >
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {currentStep}
      </div>

      <div className="mx-auto mt-[8vh] w-full max-w-[520px] text-left">
        <div className="ping mb-[22px]" aria-hidden="true" />
        <h3 className="m-0 mb-2 font-display text-[36px] leading-[1.1] tracking-[-0.015em]">
          {copy.loading.title}
        </h3>
        <p className="m-0 mb-7 text-ink-2">{copy.loading.sub}</p>
        <ul className="m-0 list-none border-t border-line p-0" aria-label="Progress steps">
          {copy.loading.steps.map((s, i) => {
            const isDone = i < activeIdx;
            const isActive = i === activeIdx;
            const cls = isDone ? "step done" : isActive ? "step active" : "step";
            return (
              <li
                key={i}
                className={`${cls} flex items-center gap-3.5 border-b border-line py-3.5 font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3 transition-colors duration-300`}
                aria-current={isActive ? "step" : undefined}
              >
                <span className="tick" aria-hidden="true" />
                <span>{s}{isDone ? " — done" : ""}</span>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
