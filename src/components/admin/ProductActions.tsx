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
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const res = await fetch(`/api/products/${productId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to delete product. Try again.");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Link
        href={`/admin/products/${slug}/edit`}
        aria-label="Edit product"
        className="hover:opacity-60 transition-opacity"
      >
        <Pencil size={14} strokeWidth={1.5} style={{ color: "#3D4A28" }} />
      </Link>
      <button
        onClick={handleDelete}
        aria-label="Delete product"
        className="hover:opacity-60 transition-opacity"
      >
        <Trash2 size={14} strokeWidth={1.5} style={{ color: "#E24B4A" }} />
      </button>
    </div>
  );
}
