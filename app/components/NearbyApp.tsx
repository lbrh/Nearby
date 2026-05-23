"use client";

import { useEffect, useState } from "react";
import type { NearbyResponse, CommunityGroup } from "@/app/lib/types";
import { detectLangFromText } from "@/app/lib/detect-lang";
import { isRtlLang } from "@/app/lib/app-copy";
import { CopyProvider } from "@/app/lib/copy-context";
import Landing from "./Landing";
import NearbyForm from "./NearbyForm";
import Loading from "./Loading";
import Results from "./Results";
import SubmitGroupForm from "./SubmitGroupForm";
import GroupSubmitted from "./GroupSubmitted";
import HowItWorks from "./HowItWorks";
import LanguagePicker from "./LanguagePicker";

type Screen = "landing" | "form" | "loading" | "results" | "submit-group" | "group-submitted" | "how-it-works";

const LANG_STORAGE_KEY = "nearby:lang";
const SUBURB_STORAGE_KEY = "nearby:detected-suburb";

export default function NearbyApp({ initialLang = "en" }: { initialLang?: string }) {
  const [screen, setScreen] = useState<Screen>("landing");

  // lang is a full language name string, e.g. "English", "French", "zh", "ar"
  const [lang, setLangState] = useState<string>(initialLang);

  const [suburb, setSuburb] = useState("");
  const [need, setNeed] = useState("");
  const [demographic, setDemographic] = useState("");
  const [result, setResult] = useState<NearbyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedGroup, setSubmittedGroup] = useState<CommunityGroup | null>(null);
  const [returnScreen, setReturnScreen] = useState<Screen>("landing");

  const isRtl = isRtlLang(lang);
  const dir = isRtl ? "rtl" : "ltr";

  // Load saved language from localStorage on mount (overrides server-detected lang)
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
    try {
      localStorage.setItem(LANG_STORAGE_KEY, value);
    } catch {
      // ignore
    }
    document.documentElement.lang = value;
  }

  // Sync html[lang] on any change
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
    // Auto-detect Arabic/Chinese script while typing
    const detected = detectLangFromText(value);
    if (detected && detected !== lang) setLang(detected);
  }

  async function handleSubmit() {
    setError(null);
    if (!suburb.trim() || !need.trim()) {
      setError("Please fill in both your suburb and what you're looking for.");
      return;
    }
    setScreen("loading");
    try {
      const res = await fetch("/api/nearby", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ suburb, need, demographic, lang }),
      });
      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }
      const data = (await res.json()) as NearbyResponse;
      setResult(data);
      setScreen("results");
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Sorry — Nearby couldn't reach the service just now. Please try again.",
      );
      setScreen("form");
    }
  }

  function reset() {
    setResult(null);
    setError(null);
    setScreen("landing");
  }

  function goToSubmitGroup(from: Screen) {
    setReturnScreen(from);
    setScreen("submit-group");
  }

  function handleGroupSuccess(group: CommunityGroup) {
    setSubmittedGroup(group);
    setScreen("group-submitted");
  }

  const screenLabel: Record<Screen, string> = {
    landing: "Home",
    form: "Find nearby services",
    loading: "Searching for services",
    results: "Results",
    "submit-group": "Share a community group",
    "group-submitted": "Group submitted",
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
            {screen !== "submit-group" && screen !== "group-submitted" && (
              <button
                type="button"
                onClick={() => goToSubmitGroup(screen)}
                className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-line-strong hover:text-ink"
              >
                + Share a group
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
            onSubmitGroup={() => goToSubmitGroup("landing")}
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
            onSubmitGroup={() => goToSubmitGroup("results")}
          />
        )}
        {screen === "submit-group" && (
          <SubmitGroupForm
            onBack={() => setScreen(returnScreen)}
            onSuccess={handleGroupSuccess}
          />
        )}
        {screen === "group-submitted" && submittedGroup && (
          <GroupSubmitted
            group={submittedGroup}
            onDone={() => setScreen(returnScreen)}
          />
        )}
      </div>
    </CopyProvider>
  );
}
