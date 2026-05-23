"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { BUILT_IN, getBuiltInCode, type AppCopy } from "./app-copy";

const CopyContext = createContext<AppCopy>(BUILT_IN.en);

export function useCopy() {
  return useContext(CopyContext);
}

function cacheKey(lang: string) {
  return `nearby:translations:${lang.toLowerCase()}`;
}

async function fetchTranslations(lang: string): Promise<AppCopy> {
  const res = await fetch("/api/translate", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ language: lang, strings: BUILT_IN.en }),
  });
  if (!res.ok) throw new Error("Translation fetch failed");
  return (await res.json()) as AppCopy;
}

export function CopyProvider({
  children,
  lang,
}: {
  children: ReactNode;
  lang: string;
}) {
  const code = getBuiltInCode(lang);
  const builtIn = code ? BUILT_IN[code] : null;

  const [copy, setCopy] = useState<AppCopy>(builtIn ?? BUILT_IN.en);

  useEffect(() => {
    const currentCode = getBuiltInCode(lang);
    
    // Built-in: use immediately
    if (currentCode && BUILT_IN[currentCode]) {
      setCopy(BUILT_IN[currentCode]);
      return;
    }

    // Custom: check localStorage cache
    try {
      const cached = localStorage.getItem(cacheKey(lang));
      if (cached) {
        const parsed = JSON.parse(cached) as any;
        if (parsed && parsed.landing && parsed.howItWorks) {
          setCopy(parsed as AppCopy);
          return;
        }
      }
    } catch {
      // ignore
    }

    // Fetch and cache
    fetchTranslations(lang)
      .then((translated) => {
        try {
          localStorage.setItem(cacheKey(lang), JSON.stringify(translated));
        } catch {
          // storage full, continue without caching
        }
        setCopy(translated);
      })
      .catch(() => {
        // fall back to English silently
        setCopy(BUILT_IN.en);
      });
  }, [lang]);

  return <CopyContext.Provider value={copy}>{children}</CopyContext.Provider>;
}
