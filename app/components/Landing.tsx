"use client";

import LanguagePicker from "./LanguagePicker";
import OpenNow from "./OpenNow";

export default function Landing({
  onStart,
  onHowItWorks,
  onSubmitGroup,
  currentLang,
  onLangChange,
}: {
  onStart: () => void;
  onHowItWorks: () => void;
  onSubmitGroup: () => void;
  currentLang: string;
  onLangChange: (lang: string) => void;
}) {
  return (
    <section className="screen-fade flex flex-1 flex-col pt-3">
      <div className="mt-[12vh] lg:mt-[10vh]">
        <div className="eyebrow mb-6">A community connector</div>
        <h1 className="m-0 mb-[22px] text-balance font-display text-[clamp(54px,12vw,88px)] leading-[0.96] tracking-[-0.02em] text-ink">
          Find what you need, <em className="text-teal italic">nearby.</em>
        </h1>
        <p className="m-0 mb-9 max-w-[36ch] text-pretty text-[17px] leading-[1.5] text-ink-2">
          A quiet way to discover the gardens, kitchens, libraries and repair
          benches already running in your council — and the people behind them.
        </p>
        <div className="flex flex-wrap items-center gap-3.5">
          <button type="button" className="btn btn-primary" onClick={onStart}>
            Get started
            <svg className="arrow" viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M5 12h14M13 6l6 6-6 6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onHowItWorks}
          >
            How it works
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onSubmitGroup}
          >
            Share a group
          </button>
        </div>
      </div>

      <OpenNow />

      <div className="mt-10 grid grid-cols-1 gap-x-4 gap-y-5 border-t border-line pt-[22px] text-[13.5px] leading-[1.5] text-ink-2 sm:grid-cols-2 sm:gap-y-7">
        <Cell k="For">
          <strong className="font-medium text-ink">
            Residents, students, new arrivals
          </strong>{" "}
          — anyone looking for a hand or wanting to give one.
        </Cell>
        <Cell k="Across">
          <strong className="font-medium text-ink">City of Melbourne</strong> —
          community gardens, food relief, libraries, repair cafés, grants.
        </Cell>
        <Cell k="Language">
          <LanguagePicker currentLang={currentLang} onSelect={onLangChange} />
        </Cell>
        <Cell k="Built with">
          <strong className="font-medium text-ink">
            Real addresses, real hours.
          </strong>{" "}
          No directory dumps, no signups.
        </Cell>
      </div>
    </section>
  );
}

function Cell({ k, children }: { k: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
        {k}
      </div>
      <div>{children}</div>
    </div>
  );
}
