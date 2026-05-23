"use client";

import { useEffect, useRef } from "react";

export default function HowItWorks({ onBack, onStart }: { onBack: () => void; onStart: () => void }) {
  const headingRef = useRef<HTMLHeadingElement>(null);

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
        Back
      </button>

      <div className="eyebrow mb-6">A community connector</div>

      <h2
        ref={headingRef}
        tabIndex={-1}
        className="m-0 mb-4 font-display text-[clamp(36px,7vw,56px)] leading-[1.05] tracking-[-0.018em] focus:outline-none"
      >
        How it works
      </h2>
      <p className="m-0 mb-12 max-w-[44ch] text-pretty text-[17px] leading-[1.55] text-ink-2">
        Nearby helps you find community resources in your area — no accounts, no sign-ups, no directory dumps.
      </p>

      <ol className="m-0 list-none p-0 space-y-0 divide-y divide-line">
        {STEPS.map((step, i) => (
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
          What Nearby covers
        </h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {CATEGORIES.map((c) => (
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
          Get started
          <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          Back to home
        </button>
      </div>
    </section>
  );
}

const STEPS = [
  {
    title: "Tell us your suburb",
    body: "Type your suburb or use your device's location. Nearby focuses on the City of Melbourne council area — Carlton, North Melbourne, Docklands, Southbank, Fitzroy, and more.",
  },
  {
    title: "Describe what you need",
    body: "Use plain language — \"somewhere to grow vegetables\", \"free meals this week\", \"help fixing my bike\", \"a quiet place to study\". No categories, no checkboxes.",
  },
  {
    title: "Optionally tell us about yourself",
    body: "If you're a student, a new arrival, an older resident or a family, let us know. Nearby uses that context to tailor recommendations — mentioning free options, language support, or kid-friendly times.",
  },
  {
    title: "Get three specific places",
    body: "Nearby returns three real services with real addresses, opening hours, and how to get in the door. No sign-up required, no referral letter needed.",
  },
  {
    title: "Ask follow-up questions",
    body: "Once you have results, use the chat at the bottom to ask more — \"Is there parking nearby?\", \"What do I need to bring?\", \"Are there other options on weekends?\"",
  },
];

const CATEGORIES = [
  { icon: "🌱", label: "Community gardens", sub: "Plots, working bees, compost" },
  { icon: "🍲", label: "Food relief", sub: "Free meals, food pantries" },
  { icon: "📚", label: "Libraries", sub: "Study spaces, programs" },
  { icon: "🔧", label: "Repair cafés", sub: "Bikes, clothes, electronics" },
  { icon: "💰", label: "Council grants", sub: "Community project funding" },
  { icon: "🤝", label: "Volunteering", sub: "Local opportunities" },
];
