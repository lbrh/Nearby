"use client";

import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import type { NearbyResponse, Event } from "@/app/lib/types";
import { detectLangFromText } from "@/app/lib/detect-lang";
import { isRtlLang } from "@/app/lib/app-copy";
import { CopyProvider } from "@/app/lib/copy-context";
import { supabase } from "@/app/lib/supabase";
import Landing from "./Landing";
import NearbyForm from "./NearbyForm";
import Loading from "./Loading";
import Results from "./Results";
import SubmitEventForm from "./SubmitEventForm";
import EventSubmitted from "./EventSubmitted";
import HowItWorks from "./HowItWorks";
import LanguagePicker from "./LanguagePicker";

type Screen =
  | "landing"
  | "form"
  | "loading"
  | "results"
  | "submit-event"
  | "event-submitted"
  | "how-it-works";

const LANG_STORAGE_KEY = "nearby:lang";
const SUBURB_STORAGE_KEY = "nearby:detected-suburb";
const POST_AUTH_KEY = "nearby:post-auth-screen";

export default function NearbyApp({ initialLang = "en" }: { initialLang?: string }) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [lang, setLangState] = useState<string>(initialLang);
  const [suburb, setSuburb] = useState("");
  const [need, setNeed] = useState("");
  const [demographic, setDemographic] = useState("");
  const [result, setResult] = useState<NearbyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedEvent, setSubmittedEvent] = useState<Event | null>(null);
  const [returnScreen, setReturnScreen] = useState<Screen>("landing");
  const [user, setUser] = useState<User | null>(null);
  // Track the lang that was used for the last fetch, to re-fetch when it changes
  const resultLangRef = useRef<string | null>(null);

  const isRtl = isRtlLang(lang);
  const dir = isRtl ? "rtl" : "ltr";

  // Auth: load session on mount and handle post-OAuth redirect
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);

      const pending = localStorage.getItem(POST_AUTH_KEY);
      if (pending === "submit-event" && session?.user) {
        localStorage.removeItem(POST_AUTH_KEY);
        setScreen("submit-event");
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Persist lang preference
  useEffect(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved) setLangState(saved);
    } catch {
      // ignore
    }
  }, []);

  function setLang(value: string) {
    setLangState(value);
    try { localStorage.setItem(LANG_STORAGE_KEY, value); } catch { /* ignore */ }
    document.documentElement.lang = value;
  }

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  function handleSuburbChange(value: string) {
    setSuburb(value);
    if (value.trim()) {
      try { localStorage.setItem(SUBURB_STORAGE_KEY, value.trim()); } catch { /* ignore */ }
    }
  }

  function handleNeedChange(value: string) {
    setNeed(value);
    const detected = detectLangFromText(value);
    if (detected && detected !== lang) setLang(detected);
  }

  async function fetchNearby(params: { suburb: string; need: string; demographic: string; lang: string; returnToResults?: boolean }) {
    setScreen("loading");
    try {
      const res = await fetch("/api/nearby", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ suburb: params.suburb, need: params.need, demographic: params.demographic, lang: params.lang }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as NearbyResponse;
      resultLangRef.current = params.lang;
      setResult(data);
      setScreen("results");
    } catch (err) {
      console.error(err);
      if (params.returnToResults) {
        setScreen("results"); // stay on results if retranslation fails
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Sorry — Nearby couldn't reach the service just now. Please try again.",
        );
        setScreen("form");
      }
    }
  }

  async function handleSubmit() {
    setError(null);
    if (!suburb.trim() || !need.trim()) {
      setError("Please fill in both your suburb and what you're looking for.");
      return;
    }
    await fetchNearby({ suburb, need, demographic, lang });
  }

  // Re-fetch results in new language when user changes lang on results screen
  useEffect(() => {
    if (screen !== "results") return;
    if (resultLangRef.current === null || resultLangRef.current === lang) return;
    fetchNearby({ suburb, need, demographic, lang, returnToResults: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang]);

  function reset() {
    setResult(null);
    setError(null);
    setScreen("landing");
  }

  function goToSubmitEvent(from: Screen) {
    setReturnScreen(from);
    setScreen("submit-event");
  }

  function handleEventSuccess(event: Event) {
    setSubmittedEvent(event);
    setScreen("event-submitted");
  }

  const screenLabel: Record<Screen, string> = {
    landing: "Home",
    form: "Find nearby services",
    loading: "Searching for services",
    results: "Results",
    "submit-event": "Add your own events",
    "event-submitted": "Event submitted",
    "how-it-works": "How it works",
  };

  return (
    <CopyProvider lang={lang}>
      <div
        id="main-content"
        role="main"
        dir={dir}
        className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[1120px] flex-col px-5 pt-7 pb-20 sm:px-8 lg:px-16"
      >
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {screenLabel[screen]}
        </div>

        {/* topbar */}
        <header className="mb-7 flex items-center justify-between">
          <button
            type="button"
            onClick={reset}
            className="flex select-none items-baseline gap-2 font-display text-[26px] tracking-[-0.01em] text-ink"
            title="Start over"
          >
            <span className="-translate-y-[3px] inline-block h-[7px] w-[7px] rounded-full bg-teal" aria-hidden="true" />
            <span>Nearby</span>
            <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
              Melbourne
            </span>
          </button>
          <div className="flex items-center gap-2">
            {screen !== "submit-event" && screen !== "event-submitted" && (
              <button
                type="button"
                onClick={() => goToSubmitEvent(screen)}
                className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-line-strong hover:text-ink"
              >
                + Add your own events
              </button>
            )}
            {user && (
              <button
                type="button"
                onClick={() => supabase.auth.signOut()}
                className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-line-strong hover:text-ink"
                title={user.email}
              >
                Sign out
              </button>
            )}
            <LanguagePicker currentLang={lang} onSelect={setLang} />
          </div>
        </header>

        {/* screens */}
        {screen === "landing" && (
          <Landing
            onStart={() => setScreen("form")}
            onHowItWorks={() => setScreen("how-it-works")}
            onSubmitGroup={() => goToSubmitEvent("landing")}
            currentLang={lang}
            onLangChange={setLang}
          />
        )}
        {screen === "how-it-works" && (
          <HowItWorks
            onBack={() => setScreen("landing")}
            onStart={() => setScreen("form")}
          />
        )}
        {screen === "form" && (
          <NearbyForm
            suburb={suburb}
            setSuburb={handleSuburbChange}
            need={need}
            setNeed={handleNeedChange}
            demographic={demographic}
            setDemographic={setDemographic}
            lang={lang}
            error={error}
            onBack={reset}
            onSubmit={handleSubmit}
          />
        )}
        {screen === "loading" && <Loading />}
        {screen === "results" && result && (
          <Results
            data={result}
            lang={lang}
            suburb={suburb}
            need={need}
            demographic={demographic}
            onRestart={reset}
            onSubmitGroup={() => goToSubmitEvent("results")}
          />
        )}
        {screen === "submit-event" && (
          <SubmitEventForm
            user={user}
            onBack={() => setScreen(returnScreen)}
            onSuccess={handleEventSuccess}
          />
        )}
        {screen === "event-submitted" && submittedEvent && (
          <EventSubmitted
            event={submittedEvent}
            onDone={() => setScreen(returnScreen)}
          />
        )}
      </div>
    </CopyProvider>
  );
}
