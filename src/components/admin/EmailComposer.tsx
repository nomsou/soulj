"use client";

import { useState } from "react";

export function EmailComposer({ subscribers }: { subscribers: string[] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) return;
    setSending(true);

    await fetch("/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, body, recipients: subscribers }),
    });

    setSending(false);
    setSent(true);
    setSubject("");
    setBody("");
    setTimeout(() => setSent(false), 3000);
  };

  const inputStyle = {
    background: "transparent",
    borderColor: "var(--card)",
    color: "var(--body)",
  };

  return (
    <div>
      <p
        className="text-xs tracking-[0.2em] uppercase font-medium mb-4"
        style={{ color: "var(--body)" }}
      >
        Send campaign
      </p>

      <div className="space-y-4">
        <div className="space-y-1.5">
          <label
            className="text-xs tracking-[0.12em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Drop 001 is live..."
            className="w-full px-4 py-3 text-sm outline-none border"
            style={inputStyle}
          />
        </div>

        <div className="space-y-1.5">
          <label
            className="text-xs tracking-[0.12em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Write your message..."
            className="w-full px-4 py-3 text-sm outline-none border resize-none"
            style={inputStyle}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "var(--muted)" }}>
            Sending to {subscribers.length} subscriber
            {subscribers.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleSend}
            disabled={sending || subscribers.length === 0}
            className="px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-40"
            style={{ background: "var(--body)", color: "var(--page)" }}
          >
            {sent ? "Sent!" : sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
