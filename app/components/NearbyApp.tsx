"use client";

import { useState } from "react";
import type { Lang, Demographic, NearbyResponse, CommunityGroup } from "@/app/lib/types";
import { LANG_LABEL } from "@/app/lib/i18n";
import { detectLangFromText } from "@/app/lib/detect-lang";
import Landing from "./Landing";
import NearbyForm from "./NearbyForm";
import Loading from "./Loading";
import Results from "./Results";
import SubmitGroupForm from "./SubmitGroupForm";
import GroupSubmitted from "./GroupSubmitted";

type Screen = "landing" | "form" | "loading" | "results" | "submit-group" | "group-submitted";

export default function NearbyApp({ initialLang = "en" }: { initialLang?: Lang }) {
  const [screen, setScreen] = useState<Screen>("landing");
  const [lang, setLang] = useState<Lang>(initialLang);
  const [suburb, setSuburb] = useState("");
  const [need, setNeed] = useState("");

  function handleNeedChange(value: string) {
    setNeed(value);
    const detected = detectLangFromText(value);
    if (detected && detected !== lang) setLang(detected);
  }
  const [demographic, setDemographic] = useState<Demographic>("");
  const [result, setResult] = useState<NearbyResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submittedGroup, setSubmittedGroup] = useState<CommunityGroup | null>(null);
  // where to return after finishing submit-group flow
  const [returnScreen, setReturnScreen] = useState<Screen>("landing");

  const dir = lang === "ar" ? "rtl" : "ltr";

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

  return (
    <div
      dir={dir}
      className="relative z-10 mx-auto flex min-h-dvh w-full max-w-[720px] flex-col px-[22px] pt-7 pb-20 sm:px-6"
    >
      {/* topbar */}
      <header className="mb-7 flex items-center justify-between">
        <button
          type="button"
          onClick={reset}
          className="flex select-none items-baseline gap-2 font-display text-[26px] tracking-[-0.01em] text-ink"
          title="Start over"
        >
          <span className="-translate-y-[3px] inline-block h-[7px] w-[7px] rounded-full bg-teal" />
          <span>Nearby</span>
          <span className="ml-1 font-mono text-[10px] uppercase tracking-[0.14em] text-ink-3">
            Melbourne
          </span>
        </button>
        <div className="flex items-center gap-2">
          {lang !== "en" && (
            <span className="rounded-full border border-line bg-paper px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">
              {LANG_LABEL[lang]}
            </span>
          )}
          {screen !== "submit-group" && screen !== "group-submitted" && (
            <button
              type="button"
              onClick={() => goToSubmitGroup(screen)}
              className="rounded-full border border-line bg-paper px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2 hover:border-line-strong hover:text-ink"
            >
              + Share a group
            </button>
          )}
        </div>
      </header>

      {/* screens */}
      {screen === "landing" && (
        <Landing onStart={() => setScreen("form")} onSubmitGroup={() => goToSubmitGroup("landing")} />
      )}
      {screen === "form" && (
        <NearbyForm
          suburb={suburb}
          setSuburb={setSuburb}
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
      {screen === "loading" && <Loading lang={lang} />}
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
  );
}
