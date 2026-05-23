"use client";

import { useState, useRef, useEffect } from "react";
import type { NearbyService, ChatMessage } from "@/app/lib/types";
import { useCopy } from "@/app/lib/copy-context";

interface Props {
  lang: string;
  suburb: string;
  need: string;
  demographic: string;
  services: NearbyService[];
}

export default function FollowUpChat({ lang, suburb, need, demographic, services }: Props) {
  const copy = useCopy();
  const isRtl = ["ar", "Arabic", "he", "Hebrew", "fa", "Persian", "ur", "Urdu"].includes(lang);

  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, loading]);

  async function handleSend() {
    const question = input.trim();
    if (!question || loading) return;

    const nextHistory: ChatMessage[] = [...history, { role: "user", content: question }];
    setHistory(nextHistory);
    setInput("");
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/nearby/followup", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          suburb,
          need,
          demographic,
          lang,
          services,
          history,
          question,
        }),
      });

      if (!res.ok) {
        const j = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(j.error ?? `Request failed (${res.status})`);
      }

      const data = (await res.json()) as { answer: string };
      setHistory([...nextHistory, { role: "assistant", content: data.answer }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setHistory(history);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    <div className="mt-6 border-t border-line pt-6" dir={isRtl ? "rtl" : "ltr"}>
      <h3 className="m-0 mb-4 font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
        {copy.chat.heading}
      </h3>

      {history.length > 0 && (
        <div className="mb-4 flex flex-col gap-3" aria-live="polite" aria-label="Conversation">
          {history.map((msg, i) => (
            <div
              key={i}
              className={`rounded-xl px-4 py-3 text-[14.5px] leading-[1.55] ${
                msg.role === "user"
                  ? "ml-auto max-w-[80%] bg-teal text-white"
                  : "mr-auto max-w-[90%] bg-paper text-ink border border-line"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && (
            <div
              role="status"
              aria-label="Loading response"
              className="mr-auto max-w-[90%] rounded-xl border border-line bg-paper px-4 py-3"
            >
              <span className="inline-flex gap-1" aria-hidden="true">
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3 [animation-delay:0ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3 [animation-delay:150ms]" />
                <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-ink-3 [animation-delay:300ms]" />
              </span>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {error && (
        <p className="mb-3 rounded-md bg-red-50 px-3 py-2 text-[13px] text-red-600 border border-red-200">
          {error}
        </p>
      )}

      <div className="flex gap-2 items-end">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={copy.chat.placeholder}
          rows={2}
          disabled={loading}
          aria-label={copy.chat.placeholder}
          aria-multiline="true"
          className="flex-1 resize-none rounded-xl border border-line bg-paper px-4 py-3 text-[14.5px] text-ink placeholder:text-ink-3 focus:border-teal focus:outline-none focus-visible:outline-2 focus-visible:outline-teal disabled:opacity-50"
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={!input.trim() || loading}
          className="shrink-0 rounded-xl bg-teal px-4 py-3 text-[13.5px] font-medium text-white hover:bg-teal-deep disabled:cursor-not-allowed disabled:opacity-40"
        >
          {copy.chat.send}
        </button>
      </div>
    </div>
  );
}
