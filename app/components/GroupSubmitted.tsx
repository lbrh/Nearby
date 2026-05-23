"use client";

import type { CommunityGroup } from "@/app/lib/types";

export default function GroupSubmitted({
  group,
  onDone,
}: {
  group: CommunityGroup;
  onDone: () => void;
}) {
  return (
    <section className="screen-fade flex flex-1 flex-col items-start justify-center gap-6">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-teal-soft">
        <svg
          className="h-6 w-6 text-teal-deep"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div>
        <h2 className="m-0 mb-2 font-display text-[clamp(30px,6vw,42px)] leading-[1.05] tracking-[-0.015em]">
          Group listed.
        </h2>
        <p className="m-0 text-[15.5px] text-ink-2">
          <strong className="font-medium text-ink">{group.title}</strong> is now visible to
          anyone searching{group.suburb ? ` in ${group.suburb}` : ""}.
        </p>
      </div>

      <div className="w-full rounded-2xl border border-line bg-paper p-5">
        <dl className="grid grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-[14px]">
          {group.schedule && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 pt-0.5">When</dt>
              <dd className="m-0 text-ink">{group.schedule}</dd>
            </>
          )}
          {group.address && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 pt-0.5">Where</dt>
              <dd className="m-0 text-ink">{group.address}</dd>
            </>
          )}
          {group.email && (
            <>
              <dt className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3 pt-0.5">Email</dt>
              <dd className="m-0 text-ink">{group.email}</dd>
            </>
          )}
        </dl>
      </div>

      <div className="flex flex-wrap gap-3">
        <button type="button" className="btn btn-primary" onClick={onDone}>
          Back to Nearby
        </button>
      </div>
    </section>
  );
}
