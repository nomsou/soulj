"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["PAID", "DELIVERED"] as const;
type Status = (typeof statuses)[number];

const statusColors: Record<Status, string> = {
  PAID: "#1D9E75",
  DELIVERED: "#639922",
};

export function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: string;
}) {
  const [status, setStatus] = useState<Status>(
    (currentStatus as Status) ?? "PAID",
  );
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = async (val: Status) => {
    if (val === status) return;
    setSaving(true);

    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val }),
    });

    if (res.ok) {
      setStatus(val);
      router.refresh();
    }

    setSaving(false);
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as Status)}
      disabled={saving}
      className="text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border outline-none cursor-pointer disabled:opacity-50"
      style={{
        borderColor: statusColors[status],
        color: statusColors[status],
        background: `${statusColors[status]}12`,
      }}
    >
      {statuses.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
