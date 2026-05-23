"use client";

import { useState } from "react";
import type { CommunityGroup } from "@/app/lib/types";

const CATEGORIES = [
  "",
  "Social club",
  "Sports & fitness",
  "Arts & crafts",
  "Community garden",
  "Food & cooking",
  "Support group",
  "Religious group",
  "Youth group",
  "Seniors group",
  "Cultural group",
  "Environmental",
  "Volunteering",
  "Education",
  "Other",
];

const EMPTY: Omit<CommunityGroup, "id" | "created_at"> = {
  title: "",
  description: "",
  category: "",
  suburb: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  schedule: "",
};

export default function SubmitGroupForm({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: (group: CommunityGroup) => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(field: keyof typeof EMPTY, value: string) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.title.trim()) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/groups", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }

      const created = (await res.json()) as CommunityGroup;
      onSuccess(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="screen-fade flex flex-1 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-1.5 bg-transparent p-0 text-[13.5px] text-ink-2 hover:text-ink"
      >
        <svg
          className="h-3.5 w-3.5"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.6"
        >
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <h2 className="mx-0 mt-1 mb-1.5 font-display text-[clamp(34px,7vw,46px)] leading-[1.05] tracking-[-0.015em]">
        Share your group.
      </h2>
      <p className="m-0 mb-8 text-[15.5px] text-ink-2">
        List a social group, club, or community gathering so others nearby can find it.
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-[#F4D4BD] bg-[#FFF4EE] px-4 py-3.5 text-sm text-[#7A2E08]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
        {/* title */}
        <Field label="Group name *" hint="The public name people will see">
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Carlton Knitting Circle"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </Field>

        {/* description */}
        <Field label="Description" hint="What the group does, who it's for, what to expect">
          <textarea
            className="input-base min-h-[96px] resize-y leading-[1.45]"
            placeholder="e.g. A friendly weekly knitting and craft group open to all skill levels. We share patterns, yarn and tea."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

        {/* category + suburb row */}
        <div className="grid gap-[22px] sm:grid-cols-2">
          <Field label="Category">
            <select
              className="input-base select-base"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
            >
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c || "Choose a category…"}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Suburb">
            <input
              type="text"
              className="input-base"
              placeholder="e.g. Carlton"
              value={form.suburb}
              onChange={(e) => set("suburb", e.target.value)}
            />
          </Field>
        </div>

        {/* address */}
        <Field label="Meeting location / address" hint="Leave blank if location varies">
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Kathleen Syme Library, 251 Faraday St, Carlton"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>

        {/* schedule */}
        <Field label="When do you meet?" hint="Days, times, and how often">
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Every Tuesday 6:30–8:30pm, first Saturday of the month 10am"
            value={form.schedule}
            onChange={(e) => set("schedule", e.target.value)}
          />
        </Field>

        {/* contact row */}
        <div className="grid gap-[22px] sm:grid-cols-2">
          <Field label="Phone" hint="Optional">
            <input
              type="tel"
              className="input-base"
              placeholder="e.g. 0412 345 678"
              value={form.phone}
              onChange={(e) => set("phone", e.target.value)}
            />
          </Field>

          <Field label="Email" hint="Optional">
            <input
              type="email"
              className="input-base"
              placeholder="e.g. hello@carltonknitting.au"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
        </div>

        {/* website */}
        <Field label="Website or social link" hint="Optional">
          <input
            type="url"
            className="input-base"
            placeholder="e.g. https://www.meetup.com/carlton-knitting"
            value={form.website}
            onChange={(e) => set("website", e.target.value)}
          />
        </Field>

        <div className="mt-2 flex flex-col items-stretch justify-between gap-3.5 sm:flex-row sm:items-center">
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">
            Listed immediately · free
          </span>
          <button
            type="submit"
            disabled={!form.title.trim() || submitting}
            className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-40 sm:justify-start"
          >
            {submitting ? "Submitting…" : "Submit group"}
            {!submitting && (
              <svg className="arrow" viewBox="0 0 24 24">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="label-mono mb-2.5 block">{label}</label>
      {children}
      {hint && <div className="mt-1.5 text-[12.5px] text-ink-3">{hint}</div>}
    </div>
  );
}
