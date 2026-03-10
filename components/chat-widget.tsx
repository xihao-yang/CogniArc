"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";

type Message = {
  role: "user" | "assistant";
  text: string;
};

export function ChatWidget() {
  const t = useTranslations("chat");
  const locale = useLocale();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const listRef = useRef<HTMLDivElement>(null);

  const hasMessages = messages.length > 0;

  useEffect(() => {
    if (open && !hasMessages) {
      setMessages([{ role: "assistant", text: t("welcome") }]);
    }
  }, [open, hasMessages, t]);

  useEffect(() => {
    if (!listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [messages, open]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const message = input.trim();
    if (!message || loading) return;

    setInput("");
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", text: message }]);

    try {
      const response = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message, locale })
      });

      const data = await response.json();
      const answer =
        typeof data.answer === "string"
          ? data.answer
          : "Unable to answer right now. Please retry.";

      setMessages((prev) => [...prev, { role: "assistant", text: answer }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Request failed. Check API settings and try again."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  const buttonLabel = useMemo(() => (open ? t("close") : t("open")), [open, t]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3">
      {open && (
        <section className="surface w-[min(380px,92vw)] overflow-hidden rounded-2xl border border-slate-300 bg-white shadow-xl">
          <header className="border-b border-slate-200 bg-slate-50 px-4 py-3">
            <h2 className="font-serif text-lg font-semibold text-slate-900">{t("title")}</h2>
            <p className="mt-0.5 text-xs text-slate-600">{t("subtitle")}</p>
          </header>

          <div ref={listRef} className="max-h-[320px] space-y-3 overflow-y-auto px-4 py-4">
            {messages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                className={[
                  "max-w-[85%] rounded-2xl px-3 py-2 text-sm",
                  msg.role === "user"
                    ? "ml-auto bg-slate-900 text-white"
                    : "bg-slate-100 text-slate-800"
                ].join(" ")}
              >
                {msg.text}
              </div>
            ))}
          </div>

          <form onSubmit={onSubmit} className="border-t border-slate-200 bg-white p-3">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder={t("placeholder")}
                className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-slate-500"
              />
              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-60"
              >
                {loading ? t("loading") : t("send")}
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        aria-label={buttonLabel}
        onClick={() => setOpen((prev) => !prev)}
        className="h-12 rounded-full bg-slate-900 px-5 text-sm font-medium text-white shadow-lg transition hover:bg-slate-700"
      >
        {buttonLabel}
      </button>
    </div>
  );
}