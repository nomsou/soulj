"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const themes = [
  {
    id: "neutral",
    name: "Neutral",
    tag: "Off-white + black",
    nav: "#0A0A0A",
    hero: "#0A0A0A",
    page: "#F5F5F0",
    card: "#E8E8E3",
  },
  {
    id: "military",
    name: "Military",
    tag: "Forest + bone",
    nav: "#1B2A1B",
    hero: "#2C3E1F",
    page: "#F2EFE4",
    card: "#D8D5C8",
  },
  {
    id: "olive",
    name: "Dark Olive",
    tag: "Olive + cream",
    nav: "#0D0D0A",
    hero: "#3D4A28",
    page: "#FAFAF5",
    card: "#E2DFCF",
  },
  {
    id: "sage",
    name: "Washed Sage",
    tag: "Sage + black",
    nav: "#0A0A0A",
    hero: "#0A0A0A",
    page: "#C8D4B8",
    card: "#E8F0DC",
  },
];

export function ThemeSwitcher({ currentTheme }: { currentTheme: string }) {
  const [selected, setSelected] = useState(currentTheme);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const router = useRouter();

  const handleSave = async () => {
    setSaving(true);
    await fetch("/api/admin/theme", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ theme: selected }),
    });
    setSaving(false);
    setSaved(true);
    router.refresh();
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-2" style={{ color: "var(--body)" }}>
        Theme
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        Changes apply to the storefront immediately on save.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {themes.map((t) => (
          <button
            key={t.id}
            onClick={() => setSelected(t.id)}
            className="text-left border-2 overflow-hidden transition-all"
            style={{
              borderColor: selected === t.id ? "var(--body)" : "transparent",
            }}
          >
            <div style={{ height: 80 }}>
              <div style={{ background: t.nav, height: 20 }} />
              <div style={{ background: t.hero, height: 32 }} />
              <div
                style={{
                  background: t.page,
                  height: 28,
                  display: "flex",
                  gap: 4,
                  alignItems: "center",
                  padding: "0 6px",
                }}
              >
                <div style={{ flex: 1, height: 16, background: t.card }} />
                <div style={{ flex: 1, height: 16, background: t.card }} />
                <div style={{ flex: 1, height: 16, background: t.card }} />
              </div>
            </div>
            <div className="p-3" style={{ background: "var(--card)" }}>
              <p
                className="text-xs font-medium mb-0.5"
                style={{ color: "var(--body)" }}
              >
                {t.name}
              </p>
              <p className="text-[10px]" style={{ color: "var(--muted)" }}>
                {t.tag}
              </p>
            </div>
          </button>
        ))}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="px-8 py-3 text-sm tracking-[0.15em] uppercase font-medium transition-all disabled:opacity-50"
        style={{ background: "var(--body)", color: "var(--page)" }}
      >
        {saved ? "Saved!" : saving ? "Saving..." : "Save and apply"}
      </button>
    </div>
  );
}
