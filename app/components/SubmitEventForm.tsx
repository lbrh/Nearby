"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { Event, RepeatType } from "@/app/lib/types";
import { supabase } from "@/app/lib/supabase";
import { MELBOURNE_SUBURBS } from "@/app/lib/suburbs";

const POST_AUTH_KEY = "nearby:post-auth-screen";

const CATEGORIES = [
  "",
  "Arts & culture",
  "Community gathering",
  "Education",
  "Environmental",
  "Food & cooking",
  "Health & wellness",
  "Kids & families",
  "Music & performance",
  "Networking",
  "Religious",
  "Seniors",
  "Sports & fitness",
  "Volunteering",
  "Other",
];

const REPEAT_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: "none", label: "Does not repeat" },
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "monthly", label: "Monthly" },
  { value: "yearly", label: "Yearly" },
];

const EMPTY: Omit<Event, "id" | "user_id" | "created_at"> = {
  title: "",
  description: "",
  category: "",
  suburb: "",
  address: "",
  phone: "",
  email: "",
  website: "",
  event_date: "",
  start_time: "",
  end_time: "",
  repeat_type: "none",
};

export default function SubmitEventForm({
  user,
  onBack,
  onSuccess,
}: {
  user: User | null;
  onBack: () => void;
  onSuccess: (event: Event) => void;
}) {
  const [form, setForm] = useState(EMPTY);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  function set<K extends keyof typeof EMPTY>(field: K, value: (typeof EMPTY)[K]) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleGoogleLogin() {
    setGoogleLoading(true);
    localStorage.setItem(POST_AUTH_KEY, "submit-event");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim() || !form.event_date || !form.start_time || !form.end_time) {
      setError("Please fill in the event name, date, and times.");
      return;
    }
    if (form.end_time <= form.start_time) {
      setError("End time must be after start time.");
      return;
    }

    setSubmitting(true);
    setError(null);

    const { data, error: insertError } = await supabase
      .from("events")
      .insert({
        user_id: user.id,
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        suburb: form.suburb.trim(),
        address: form.address.trim(),
        phone: form.phone.trim(),
        email: form.email.trim(),
        website: form.website.trim(),
        event_date: form.event_date,
        start_time: form.start_time,
        end_time: form.end_time,
        repeat_type: form.repeat_type,
      })
      .select()
      .single();

    setSubmitting(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    onSuccess(data as Event);
  }

  if (!user) {
    return (
      <AuthPrompt
        onBack={onBack}
        onGoogleLogin={handleGoogleLogin}
        googleLoading={googleLoading}
        externalError={error}
        onAuthSuccess={() => {/* NearbyApp's onAuthStateChange handles user state update */}}
      />
    );
  }

  return (
    <section className="screen-fade flex flex-1 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-1.5 bg-transparent p-0 text-[13.5px] text-ink-2 hover:text-ink"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <h2 className="mx-0 mt-1 mb-1.5 font-display text-[clamp(34px,7vw,46px)] leading-[1.05] tracking-[-0.015em]">
        Add your event.
      </h2>
      <p className="m-0 mb-2 text-[15.5px] text-ink-2">
        Share a community event so others nearby can find it.
      </p>
      <p className="m-0 mb-8 text-[13px] text-ink-3">
        Logged in as {user.email}
      </p>

      {error && (
        <div className="mb-5 rounded-xl border border-[#F4D4BD] bg-[#FFF4EE] px-4 py-3.5 text-sm text-[#7A2E08]">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-[22px]">
        <Field label="Event name *" hint="The public name people will see">
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Carlton Community Repair Café"
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
          />
        </Field>

        <Field label="Description" hint="What the event is, who it's for, what to expect">
          <textarea
            className="input-base min-h-[96px] resize-y leading-[1.45]"
            placeholder="e.g. Bring your broken items and our volunteer fixers will help you repair them for free."
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
          />
        </Field>

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
            <SuburbAutocomplete
              value={form.suburb}
              onChange={(v) => set("suburb", v)}
            />
          </Field>
        </div>

        <Field label="Location / address" hint="Leave blank if online or location varies">
          <input
            type="text"
            className="input-base"
            placeholder="e.g. Kathleen Syme Library, 251 Faraday St, Carlton"
            value={form.address}
            onChange={(e) => set("address", e.target.value)}
          />
        </Field>

        <div className="rounded-2xl border border-line bg-paper p-5">
          <div className="mb-4 font-mono text-[10.5px] uppercase tracking-[0.14em] text-ink-3">
            Date & time
          </div>
          <div className="grid gap-[18px] sm:grid-cols-3">
            <Field label="Date *">
              <input
                type="date"
                className="input-base"
                value={form.event_date}
                onChange={(e) => set("event_date", e.target.value)}
                required
              />
            </Field>
            <Field label="Start time *">
              <input
                type="time"
                className="input-base"
                value={form.start_time}
                onChange={(e) => set("start_time", e.target.value)}
                required
              />
            </Field>
            <Field label="End time *">
              <input
                type="time"
                className="input-base"
                value={form.end_time}
                onChange={(e) => set("end_time", e.target.value)}
                required
              />
            </Field>
          </div>

          <div className="mt-[18px]">
            <Field label="Repeating">
              <select
                className="input-base select-base"
                value={form.repeat_type}
                onChange={(e) => set("repeat_type", e.target.value as RepeatType)}
              >
                {REPEAT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>
        </div>

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
              placeholder="e.g. hello@event.au"
              value={form.email}
              onChange={(e) => set("email", e.target.value)}
            />
          </Field>
        </div>

        <Field label="Website or social link" hint="Optional">
          <input
            type="url"
            className="input-base"
            placeholder="e.g. https://www.meetup.com/my-event"
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
            disabled={!form.title.trim() || !form.event_date || !form.start_time || !form.end_time || submitting}
            className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-40 sm:justify-start"
          >
            {submitting ? "Submitting…" : "Add event"}
            {!submitting && (
              <svg className="arrow" viewBox="0 0 24 24">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

function AuthPrompt({
  onBack,
  onGoogleLogin,
  googleLoading,
  externalError,
  onAuthSuccess,
}: {
  onBack: () => void;
  onGoogleLogin: () => void;
  googleLoading: boolean;
  externalError: string | null;
  onAuthSuccess: () => void;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (!email.trim() || !password.trim()) return;
    setLoading(true);

    if (mode === "signup") {
      const { error } = await supabase.auth.signUp({ email: email.trim(), password });
      setLoading(false);
      if (error) {
        setError(error.message);
      } else {
        setMessage("Check your email for a confirmation link, then come back to add your event.");
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      setLoading(false);
      if (error) {
        if (error.message.toLowerCase().includes("invalid login")) {
          setError("Email or password is incorrect.");
        } else {
          setError(error.message);
        }
      } else {
        onAuthSuccess();
      }
    }
  }

  const combinedError = error ?? externalError;

  return (
    <section className="screen-fade flex flex-1 flex-col">
      <button
        type="button"
        onClick={onBack}
        className="mb-7 inline-flex items-center gap-1.5 bg-transparent p-0 text-[13.5px] text-ink-2 hover:text-ink"
      >
        <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
          <path d="M15 6l-6 6 6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <div className="flex flex-1 flex-col items-start justify-center max-w-[420px]">
        <h2 className="mx-0 mt-0 mb-2 font-display text-[clamp(30px,6vw,40px)] leading-[1.05] tracking-[-0.015em]">
          {mode === "signin" ? "Sign in to add your event." : "Create a free account."}
        </h2>
        <p className="m-0 mb-7 text-[15px] leading-[1.5] text-ink-2">
          A free account lets you list community events so others nearby can find them.
        </p>

        {/* Google */}
        <button
          type="button"
          onClick={onGoogleLogin}
          disabled={googleLoading}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-paper px-5 py-3 text-[14.5px] font-medium text-ink shadow-sm hover:border-line-strong hover:bg-white disabled:opacity-50 transition-colors"
        >
          {googleLoading ? (
            <span className="text-ink-2">Redirecting…</span>
          ) : (
            <>
              <GoogleIcon />
              Continue with Google
            </>
          )}
        </button>

        {/* Divider */}
        <div className="my-5 flex w-full items-center gap-3">
          <div className="h-px flex-1 bg-line" />
          <span className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink-3">or</span>
          <div className="h-px flex-1 bg-line" />
        </div>

        {combinedError && (
          <div className="mb-4 w-full rounded-xl border border-[#F4D4BD] bg-[#FFF4EE] px-4 py-3 text-sm text-[#7A2E08]">
            {combinedError}
          </div>
        )}
        {message && (
          <div className="mb-4 w-full rounded-xl border border-[#BBF7D0] bg-[#F0FDF4] px-4 py-3 text-sm text-[#166534]">
            {message}
          </div>
        )}

        {/* Email / password form */}
        <form onSubmit={handleEmailAuth} noValidate className="flex w-full flex-col gap-3">
          <input
            type="email"
            className="input-base"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <input
            type="password"
            className="input-base"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "signup" ? "new-password" : "current-password"}
            required
          />
          <button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="btn btn-primary justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            {loading ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-[13px] text-ink-3">
          {mode === "signin" ? (
            <>
              No account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signup"); setError(null); setMessage(null); }}
                className="text-teal-deep underline hover:text-teal"
              >
                Sign up free
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => { setMode("signin"); setError(null); setMessage(null); }}
                className="text-teal-deep underline hover:text-teal"
              >
                Sign in
              </button>
            </>
          )}
        </p>

        <p className="mt-3 text-[12px] leading-[1.5] text-ink-3">
          By signing in you agree to your event being publicly listed on Nearby.
        </p>
      </div>
    </section>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"
        fill="#4285F4"
      />
      <path
        d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"
        fill="#34A853"
      />
      <path
        d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332z"
        fill="#FBBC05"
      />
      <path
        d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z"
        fill="#EA4335"
      />
    </svg>
  );
}

function SuburbAutocomplete({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIdx, setActiveIdx] = useState(-1);

  const matches = query.trim().length > 0
    ? MELBOURNE_SUBURBS.filter((s) => s.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : [];

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    setOpen(true);
    setActiveIdx(-1);
  }

  function select(suburb: string) {
    setQuery(suburb);
    onChange(suburb);
    setOpen(false);
    setActiveIdx(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open || matches.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, matches.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter" && activeIdx >= 0) {
      e.preventDefault();
      select(matches[activeIdx]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        type="text"
        className="input-base"
        placeholder="e.g. Carlton"
        value={query}
        onChange={handleInputChange}
        onFocus={() => query.trim().length > 0 && setOpen(true)}
        onKeyDown={handleKeyDown}
        autoComplete="off"
        role="combobox"
        aria-autocomplete="list"
        aria-expanded={open && matches.length > 0}
      />
      {open && matches.length > 0 && (
        <ul
          role="listbox"
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-[220px] overflow-auto rounded-xl border border-line bg-white py-1 shadow-lg"
        >
          {matches.map((suburb, i) => (
            <li
              key={suburb}
              role="option"
              aria-selected={i === activeIdx}
              onMouseDown={() => select(suburb)}
              onMouseEnter={() => setActiveIdx(i)}
              className={`cursor-pointer px-4 py-2 text-[14px] ${
                i === activeIdx ? "bg-teal-soft text-ink" : "text-ink hover:bg-[#f5f5f3]"
              }`}
            >
              {suburb}
            </li>
          ))}
        </ul>
      )}
    </div>
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
