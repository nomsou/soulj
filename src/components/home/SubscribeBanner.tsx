"use client";

import { useState } from "react";

export function SubscribeBanner() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">(
    "idle",
  );

  const handleSubscribe = async () => {
    if (!email || !email.includes("@")) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        setStatus("done");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section
      className="px-6 md:px-16 py-16 flex flex-col md:flex-row items-start md:items-center justify-between gap-8"
      style={{ background: "var(--nav)" }}
    >
      <div>
        <p
          className="text-lg md:text-xl font-medium mb-1"
          style={{ color: "var(--nav-text)" }}
        >
          Stay in the loop.
        </p>
        <p
          className="text-xs tracking-[0.15em] uppercase"
          style={{ color: "var(--nav-text)", opacity: 0.45 }}
        >
          New drops. Abuja only.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-0 w-full md:w-auto">
        {status === "done" ? (
          <p
            className="text-sm tracking-[0.1em]"
            style={{ color: "var(--nav-text)" }}
          >
            You're in.
          </p>
        ) : (
          <>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
              placeholder="your@email.com"
              className="px-4 py-3 text-sm outline-none w-full sm:w-64"
              style={{
                background: "rgba(255,255,255,0.06)",
                color: "var(--nav-text)",
                border: "none",
              }}
            />
            <button
              onClick={handleSubscribe}
              disabled={status === "loading"}
              className="px-6 py-3 text-xs tracking-[0.18em] uppercase font-medium transition-all disabled:opacity-50"
              style={{
                background: "var(--nav-text)",
                color: "var(--nav)",
              }}
            >
              {status === "loading" ? "..." : "Subscribe"}
            </button>
          </>
        )}
        {status === "error" && (
          <p
            className="text-xs mt-2"
            style={{ color: "var(--nav-text)", opacity: 0.6 }}
          >
            Something went wrong. Try again.
          </p>
        )}
      </div>
    </section>
  );
}
