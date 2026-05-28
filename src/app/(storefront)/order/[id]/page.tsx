import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatNGN } from "@/lib/utils";
import Link from "next/link";
import type { Metadata } from "next";
import { ClearCartTrigger } from "@/components/cart/ClearCartTrigger";

export const metadata: Metadata = { title: "Order Confirmed" };

export default async function OrderConfirmation({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { reference: id },
  });

  if (!order) notFound();

  const items = order.items as any[];

  const baseTargetTotal = order.subtotalNGN + order.deliveryFee;
  const calculatedProcessingFee = Math.max(0, order.totalNGN - baseTargetTotal);

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center px-6 py-20"
      style={{ background: "var(--page)" }}
    >
      <ClearCartTrigger />

      <div className="w-full max-w-md space-y-10">
        <div className="text-center space-y-3">
          <p
            className="text-xs tracking-[0.3em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Order confirmed
          </p>
          <h1 className="text-3xl font-medium" style={{ color: "var(--body)" }}>
            Thank you,
            <br />
            {order.firstName}.
          </h1>
          <p className="text-sm" style={{ color: "var(--muted)" }}>
            A confirmation has been sent to {order.email}.
          </p>
        </div>

        <div
          className="border p-6 space-y-4"
          style={{ borderColor: "var(--border)" }}
        >
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            Ref: {order.reference}
          </p>

          <div className="space-y-3">
            {items.map((item: any, i: number) => (
              <div key={i} className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>
                  {item.name} — {item.color} × {item.quantity}
                </span>
                <span style={{ color: "var(--body)" }}>
                  {formatNGN(item.priceNGN * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div
            className="pt-4 border-t space-y-2"
            style={{ borderColor: "var(--border)" }}
          >
            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>Subtotal</span>
              <span style={{ color: "var(--body)" }}>
                {formatNGN(order.subtotalNGN)}
              </span>
            </div>

            <div className="flex justify-between text-sm">
              <span style={{ color: "var(--muted)" }}>Delivery</span>
              <span style={{ color: "var(--body)" }}>
                {formatNGN(order.deliveryFee)}
              </span>
            </div>

            <div className="space-y-0.5">
              <div className="flex justify-between text-sm">
                <span style={{ color: "var(--muted)" }}>Processing Fee</span>
                <span style={{ color: "var(--body)" }}>
                  {formatNGN(calculatedProcessingFee)}
                </span>
              </div>
              <p
                className="text-[10px] italic opacity-60 text-right"
                style={{ color: "var(--muted)", margin: 0 }}
              >
                *Payment processing fee charged by Paystack
              </p>
            </div>

            <div
              className="flex justify-between text-sm font-medium pt-2 border-t"
              style={{ borderColor: "var(--border)" }}
            >
              <span style={{ color: "var(--body)" }}>Total</span>
              <span style={{ color: "var(--body)" }}>
                {formatNGN(order.totalNGN)}
              </span>
            </div>
          </div>

          <div
            className="pt-4 border-t text-sm space-y-1"
            style={{
              borderColor: "var(--border)",
              color: "var(--muted)",
            }}
          >
            <p>{order.address}</p>
            <p>
              {order.city}, {order.state}
            </p>
          </div>
        </div>

        <div className="text-center">
          <Link
            href="/shop"
            className="text-xs tracking-[0.2em] uppercase border px-8 py-3 inline-block transition-all hover:opacity-70"
            style={{
              borderColor: "var(--body)",
              color: "var(--body)",
            }}
          >
            Continue shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
