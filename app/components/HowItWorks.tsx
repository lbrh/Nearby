"use client";

import { useEffect, useRef } from "react";
import { useCopy } from "../lib/copy-context";

export default function HowItWorks({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  const copy = useCopy();

  useEffect(() => {
    headingRef.current?.focus();
  }, []);

  return (
    <section className="screen-fade flex flex-1 flex-col lg:max-w-[720px]">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-1.5 bg-transparent p-0 text-[13.5px] text-ink-2 hover:text-ink"
        aria-label="Back to home"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {copy.howItWorks.back}
      </button>

      <div className="eyebrow mb-6">{copy.howItWorks.eyebrow}</div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="m-0 mb-4 font-display text-[clamp(36px,7vw,56px)] leading-[1.05] tracking-[-0.018em] focus:outline-none"
      >
        {copy.howItWorks.heading}
      </h2>
      <p className="m-0 mb-12 max-w-[44ch] text-pretty text-[17px] leading-[1.55] text-ink-2">
        {copy.howItWorks.sub}
      </p>

      <ol className="m-0 list-none p-0 space-y-0 divide-y divide-line">
        {copy.howItWorks.steps.map((step, i) => (
          <li key={i} className="flex gap-6 py-8 first:pt-0 last:pb-0">
            <span
              className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-soft font-mono text-[11px] font-medium text-teal-deep"
              aria-hidden="true"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="m-0 mb-1.5 font-display text-[22px] leading-[1.2] tracking-[-0.01em]">
                {step.title}
              </h3>
              <p className="m-0 text-[15px] leading-[1.6] text-ink-2">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 border-t border-line pt-8">
        <h3 className="m-0 mb-5 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          {copy.howItWorks.coversHeading}
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {copy.howItWorks.categories.map((c) => (
            <div
              key={c.label}
              className="rounded-xl border border-line bg-paper px-4 py-3"
            >
              <div className="mb-1 text-[20px]" aria-hidden="true">{c.icon}</div>
              <div className="text-[13.5px] font-medium text-ink">{c.label}</div>
              <div className="text-[12px] text-ink-3">{c.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 flex flex-wrap items-center gap-3.5">
        <button type="button" className="btn btn-primary" onClick={onStart}>
          {copy.howItWorks.getStarted}
          <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          {copy.howItWorks.backToHome}
        </button>
      </div>
    </section>
  );
}
