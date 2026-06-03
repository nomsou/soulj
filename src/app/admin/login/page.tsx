"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AdminLogin() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      window.location.href = "/admin";
    } else {
      setError("Incorrect password.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-6"
      style={{ background: "var(--page)" }}
    >
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center space-y-2">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Soulj
          </p>
          <h1 className="text-2xl font-medium" style={{ color: "var(--body)" }}>
            Admin
          </h1>
        </div>

        <div className="space-y-4">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            className="w-full px-4 py-3 text-sm outline-none border"
            style={{
              background: "transparent",
              borderColor: "var(--border)",
              color: "var(--body)",
            }}
          />

          {error && (
            <p className="text-xs" style={{ color: "#E24B4A" }}>
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 text-sm tracking-[0.2em] uppercase font-medium transition-all disabled:opacity-50 mb-2"
            style={{ background: "var(--body)", color: "var(--page)" }}
          >
            {loading ? "..." : "Enter"}
          </button>

          <div className="flex justify-center pt-2">
            <Link
              href="/"
              className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase transition-opacity hover:opacity-60"
              style={{ color: "var(--muted)" }}
            >
              <ArrowLeft size={13} strokeWidth={1.5} />
              Back to store
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
