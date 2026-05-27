"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";

export function ProductActions({
  productId,
  slug,
}: {
  productId: string;
  slug: string;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/products/${productId}`, { method: "DELETE" });
    router.refresh();
  };

  return (
    <div className="flex items-center gap-3">
      <Link href={`/admin/products/${slug}/edit`}>
        <Pencil size={14} strokeWidth={1.5} style={{ color: "var(--muted)" }} />
      </Link>
      <button onClick={handleDelete}>
        <Trash2 size={14} strokeWidth={1.5} style={{ color: "#E24B4A" }} />
      </button>
    </div>
  );
}
