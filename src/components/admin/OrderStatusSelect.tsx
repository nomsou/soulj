"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = [
  "PENDING",
  "PAID",
  "PROCESSING",
  "DISPATCHED",
  "DELIVERED",
  "CANCELLED",
];

export function OrderStatusSelect({
  orderId,
  currentStatus,
  statusColors,
}: {
  orderId: string;
  currentStatus: string;
  statusColors: Record<string, string>;
}) {
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  const handleChange = async (val: string) => {
    setSaving(true);
    setStatus(val);
    await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: val }),
    });
    setSaving(false);
    router.refresh();
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value)}
      disabled={saving}
      className="text-[10px] tracking-[0.1em] uppercase px-3 py-1.5 border outline-none"
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
