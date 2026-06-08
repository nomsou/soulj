"use client";

import { useState } from "react";
import { Download } from "lucide-react";

export function ExportOrdersButton() {
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/export-orders");
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `soulj-orders-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Export failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleExport}
      disabled={loading}
      className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase px-4 py-2.5 border transition-all hover:opacity-80 disabled:opacity-40"
      style={{ borderColor: "#D5D2BF", color: "#3D4A28" }}
    >
      <Download size={13} strokeWidth={1.5} />
      {loading ? "Exporting..." : "Export CSV"}
    </button>
  );
}
