"use client";

import { useEffect, useRef, useState } from "react";
// BCP-47 tags for SpeechRecognition
const LANG_TAG: Record<string, string> = {
  en: "en-AU",
  english: "en-AU",
  zh: "zh-CN",
  "chinese (simplified)": "zh-CN",
  "chinese (traditional)": "zh-TW",
  ar: "ar-SA",
  arabic: "ar-SA",
  vi: "vi-VN",
  vietnamese: "vi-VN",
  id: "id-ID",
  indonesian: "id-ID",
  fr: "fr-FR",
  french: "fr-FR",
  de: "de-DE",
  german: "de-DE",
  es: "es-ES",
  spanish: "es-ES",
  it: "it-IT",
  italian: "it-IT",
  ja: "ja-JP",
  japanese: "ja-JP",
  ko: "ko-KR",
  korean: "ko-KR",
  hi: "hi-IN",
  hindi: "hi-IN",
  pt: "pt-PT",
  portuguese: "pt-PT",
  ru: "ru-RU",
  russian: "ru-RU",
};

interface Props {
  lang: string;
  value: string;
  onChange: (v: string) => void;
  label?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySR = any;

function getSR(): AnySR | null {
  if (typeof window === "undefined") return null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition ?? null;
}

type State = "idle" | "recording" | "unsupported";

export default function VoiceInput({ lang, value, onChange, label = "Dictate" }: Props) {
  const [state, setState] = useState<State>("idle");
  const recRef = useRef<AnySR>(null);
  const baseRef = useRef(value);

  useEffect(() => {
    if (!getSR()) setState("unsupported");
  }, []);

  function start() {
    const SR = getSR();
    if (!SR) return;

    baseRef.current = value;
    const rec = new SR();
    rec.lang = LANG_TAG[lang.toLowerCase()] ?? "en-AU";
    rec.interimResults = true;
    rec.continuous = false;

    rec.onresult = (e: AnySR) => {
      const result = e.results[e.results.length - 1];
      const transcript: string = result[0].transcript;
      const joined = baseRef.current
        ? `${baseRef.current.trimEnd()} ${transcript}`
        : transcript;
      onChange(joined);
      if (result.isFinal) baseRef.current = joined;
    };

    rec.onend = () => setState("idle");
    rec.onerror = () => setState("idle");

    rec.start();
    recRef.current = rec;
    setState("recording");
  }

  function stop() {
    recRef.current?.stop();
    setState("idle");
  }

  if (state === "unsupported") return null;

  const isRecording = state === "recording";

  return (
    <button
      type="button"
      onClick={isRecording ? stop : start}
      aria-label={isRecording ? "Stop dictation" : label}
      aria-pressed={isRecording}
      title={isRecording ? "Stop dictation" : label}
      className={`inline-flex items-center justify-center rounded-full border p-2 transition-colors ${
        isRecording
          ? "border-red-300 bg-red-50 text-red-600 hover:bg-red-100"
          : "border-line bg-paper text-ink-2 hover:border-line-strong hover:text-ink"
      }`}
    >
      {isRecording ? (
        <span className="relative flex h-4 w-4 items-center justify-center">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-40" aria-hidden="true" />
          <span className="h-2.5 w-2.5 rounded-sm bg-red-500" aria-hidden="true" />
        </span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <rect x="9" y="2" width="6" height="12" rx="3" />
          <path d="M5 10a7 7 0 0 0 14 0" strokeLinecap="round" />
          <line x1="12" y1="19" x2="12" y2="22" strokeLinecap="round" />
          <line x1="9" y1="22" x2="15" y2="22" strokeLinecap="round" />
        </svg>
      )}
    </button>
  );
}
