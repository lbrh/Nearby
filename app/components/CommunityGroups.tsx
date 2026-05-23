"use client";

import { useEffect, useState } from "react";
import type { CommunityGroup } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";

export default function CommunityGroups({
  suburb,
  onSubmitGroup,
}: {
  suburb: string;
  onSubmitGroup: () => void;
}) {
  const copy = useCopy();
  const g = copy.groups;
  const [groups, setGroups] = useState<CommunityGroup[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const params = suburb ? `?suburb=${encodeURIComponent(suburb)}` : "";
    fetch(`/api/groups${params}`)
      .then((r) => r.json())
      .then((data: CommunityGroup[]) => setGroups(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [suburb]);

  return (
    <div className="mt-8 border-t border-line pt-6">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="m-0 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
          {g.heading}{suburb ? ` — ${suburb}` : ""}
        </h3>
        <button
          type="button"
          onClick={onSubmitGroup}
          className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-ink-2 hover:border-line-strong hover:text-ink"
        >
          {g.addYours}
        </button>
      </div>

      {loading && (
        <p className="text-[14px] text-ink-3">Loading…</p>
      )}

      {!loading && groups.length === 0 && (
        <div className="rounded-xl border border-dashed border-line px-5 py-6 text-center">
          <p className="m-0 text-[14.5px] text-ink-2">
            {g.empty}{" "}
            <button
              type="button"
              className="text-teal underline-offset-2 hover:underline"
              onClick={onSubmitGroup}
            >
              {g.beFirst}
            </button>
          </p>
        </div>
      )}

      {!loading && groups.length > 0 && (
        <div className="grid gap-3">
          {groups.map((g) => (
            <GroupCard key={g.id} group={g} />
          ))}
        </div>
      )}
    </div>
  );
}

function GroupCard({ group }: { group: CommunityGroup }) {
  const { groups: g } = useCopy();
  return (
    <article className="rounded-2xl border border-line bg-paper p-5">
      <div className="mb-1 flex flex-wrap items-start justify-between gap-2">
        <div>
          {group.category && (
            <span className="mb-1.5 inline-block font-mono text-[10.5px] uppercase tracking-[0.16em] text-teal-deep">
              {group.category}
            </span>
          )}
          <h4 className="m-0 font-display text-[20px] leading-[1.2] tracking-[-0.01em] text-ink">
            {group.title}
          </h4>
        </div>
      </div>

      {group.description && (
        <p className="mt-2 mb-3 text-[14px] leading-[1.5] text-ink-2">
          {group.description}
        </p>
      )}

      <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5 border-t border-line pt-3">
        {group.schedule && (
          <>
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{g.when}</dt>
            <dd className="m-0 text-[13.5px] text-ink">{group.schedule}</dd>
          </>
        )}
        {group.address && (
          <>
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{g.where}</dt>
            <dd className="m-0 text-[13.5px] text-ink">{group.address}</dd>
          </>
        )}
        {group.phone && (
          <>
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{g.phone}</dt>
            <dd className="m-0 text-[13.5px] text-ink">
              <a href={`tel:${group.phone}`} className="text-teal hover:underline">
                {group.phone}
              </a>
            </dd>
          </>
        )}
        {group.email && (
          <>
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{g.email}</dt>
            <dd className="m-0 text-[13.5px] text-ink">
              <a href={`mailto:${group.email}`} className="text-teal hover:underline">
                {group.email}
              </a>
            </dd>
          </>
        )}
        {group.website && (
          <>
            <dt className="pt-0.5 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">{g.web}</dt>
            <dd className="m-0 text-[13.5px] text-ink">
              <a
                href={group.website}
                target="_blank"
                rel="noopener noreferrer"
                className="break-all text-teal hover:underline"
              >
                {group.website.replace(/^https?:\/\//, "")}
              </a>
            </dd>
          </>
        )}
      </dl>
    </article>
  );
}
