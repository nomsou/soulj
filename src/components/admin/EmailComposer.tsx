"use client";

import { useState } from "react";

export function EmailComposer({ subscribers }: { subscribers: string[] }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSend = async () => {
    if (!subject.trim() || !body.trim() || subscribers.length === 0) return;
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

  const inputCls =
    "w-full px-3 py-2.5 text-sm outline-none border bg-[#FAFAF5] text-[#0D0D0A]";

  return (
    <div>
      <p
        className="text-xs tracking-[0.2em] uppercase font-medium mb-4"
        style={{ color: "#0D0D0A" }}
      >
        Send campaign
      </p>

      <div className="space-y-4">
        <div>
          <label
            className="block text-[10px] tracking-[0.1em] uppercase mb-1.5"
            style={{ color: "#3D4A28" }}
          >
            Subject
          </label>
          <input
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Drop 001 is live..."
            className={inputCls}
            style={{ borderColor: "#D5D2BF" }}
          />
        </div>

        <div>
          <label
            className="block text-[10px] tracking-[0.1em] uppercase mb-1.5"
            style={{ color: "#3D4A28" }}
          >
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={8}
            placeholder="Write your message..."
            className={inputCls}
            style={{ borderColor: "#D5D2BF", resize: "none" }}
          />
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: "#3D4A28" }}>
            Sending to{" "}
            <span className="font-semibold text-[#0D0D0A]">
              {subscribers.length}
            </span>{" "}
            subscriber
            {subscribers.length !== 1 ? "s" : ""}
          </p>
          <button
            onClick={handleSend}
            disabled={sending || subscribers.length === 0}
            className="px-6 py-2.5 text-xs tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-40"
            style={{ background: "#0D0D0A", color: "#E8E2C8" }}
          >
            {sent ? "Sent!" : sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}
