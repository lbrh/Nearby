"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

export const LANGUAGES: { name: string; native: string }[] = [
  { name: "English", native: "English" },
  { name: "Arabic", native: "العربية" },
  { name: "Bengali", native: "বাংলা" },
  { name: "Chinese (Simplified)", native: "中文（简体）" },
  { name: "Chinese (Traditional)", native: "中文（繁體）" },
  { name: "Croatian", native: "Hrvatski" },
  { name: "Czech", native: "Čeština" },
  { name: "Danish", native: "Dansk" },
  { name: "Dutch", native: "Nederlands" },
  { name: "Finnish", native: "Suomi" },
  { name: "French", native: "Français" },
  { name: "German", native: "Deutsch" },
  { name: "Greek", native: "Ελληνικά" },
  { name: "Gujarati", native: "ગુજરાતી" },
  { name: "Hebrew", native: "עברית" },
  { name: "Hindi", native: "हिन्दी" },
  { name: "Hungarian", native: "Magyar" },
  { name: "Indonesian", native: "Bahasa Indonesia" },
  { name: "Italian", native: "Italiano" },
  { name: "Japanese", native: "日本語" },
  { name: "Kannada", native: "ಕನ್ನಡ" },
  { name: "Korean", native: "한국어" },
  { name: "Malay", native: "Bahasa Melayu" },
  { name: "Marathi", native: "मराठी" },
  { name: "Nepali", native: "नेपाली" },
  { name: "Norwegian", native: "Norsk" },
  { name: "Pashto", native: "پښتو" },
  { name: "Persian", native: "فارسی" },
  { name: "Polish", native: "Polski" },
  { name: "Portuguese", native: "Português" },
  { name: "Punjabi", native: "ਪੰਜਾਬੀ" },
  { name: "Romanian", native: "Română" },
  { name: "Russian", native: "Русский" },
  { name: "Serbian", native: "Српски" },
  { name: "Sinhalese", native: "සිංහල" },
  { name: "Somali", native: "Soomaali" },
  { name: "Spanish", native: "Español" },
  { name: "Swahili", native: "Kiswahili" },
  { name: "Swedish", native: "Svenska" },
  { name: "Tagalog", native: "Filipino" },
  { name: "Tamil", native: "தமிழ்" },
  { name: "Telugu", native: "తెలుగు" },
  { name: "Thai", native: "ภาษาไทย" },
  { name: "Turkish", native: "Türkçe" },
  { name: "Ukrainian", native: "Українська" },
  { name: "Urdu", native: "اردو" },
  { name: "Vietnamese", native: "Tiếng Việt" },
  { name: "Yoruba", native: "Yorùbá" },
  { name: "Zulu", native: "isiZulu" },
];

interface Props {
  currentLang: string;
  onSelect: (lang: string) => void;
}

export default function LanguagePicker({ currentLang, onSelect }: Props) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);
  const inputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  const currentDisplay =
    LANGUAGES.find((l) => l.name.toLowerCase() === currentLang.toLowerCase()) ??
    { name: currentLang, native: currentLang };

  const filtered = query.trim()
    ? LANGUAGES.filter(
        (l) =>
          l.name.toLowerCase().includes(query.toLowerCase()) ||
          l.native.toLowerCase().includes(query.toLowerCase()),
      )
    : LANGUAGES;

  function openModal() {
    setQuery("");
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 50);
  }

  function select(name: string) {
    onSelect(name);
    setOpen(false);
  }

  // Close on backdrop click
  function handleBackdrop(e: React.MouseEvent) {
    if (e.target === e.currentTarget) setOpen(false);
  }

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      {/* Trigger */}
      <button
        type="button"
        onClick={openModal}
        aria-label={`Change language, currently ${currentDisplay.name}`}
        className="inline-flex items-center gap-1.5 rounded-full border border-line bg-paper px-3 py-1.5 text-[13px] text-ink-2 hover:border-line-strong hover:text-ink"
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" strokeLinecap="round" />
        </svg>
        <span>{currentDisplay.native !== currentDisplay.name ? currentDisplay.native : currentDisplay.name}</span>
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M6 9l6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {/* Modal */}
      {open && mounted && createPortal(
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/30 p-4 backdrop-blur-sm sm:items-center"
          onClick={handleBackdrop}
          role="dialog"
          aria-modal="true"
          aria-label="Choose language"
        >
          <div
            ref={dialogRef}
            className="w-full max-w-md rounded-2xl border border-line bg-paper shadow-xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 className="m-0 font-display text-[22px] tracking-[-0.01em]">Choose language</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="rounded-full p-1.5 text-ink-3 hover:bg-bg hover:text-ink"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Search */}
            <div className="px-5 pt-4 pb-2">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type your language…"
                aria-label="Search languages"
                className="input-base"
              />
            </div>

            {/* List */}
            <ul
              role="listbox"
              aria-label="Languages"
              className="max-h-[52vh] overflow-y-auto px-2 pb-4"
            >
              {filtered.length === 0 && (
                <li className="px-3 py-3 text-[14px] text-ink-3">No match — try a different spelling.</li>
              )}
              {filtered.map((l) => {
                const active = l.name.toLowerCase() === currentLang.toLowerCase();
                return (
                  <li key={l.name} role="option" aria-selected={active}>
                    <button
                      type="button"
                      onClick={() => select(l.name)}
                      className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-bg ${
                        active ? "bg-teal-soft text-teal-deep" : "text-ink"
                      }`}
                    >
                      <span className="text-[15px] font-medium">{l.native}</span>
                      <span className="text-[13px] text-ink-3">{l.name}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
