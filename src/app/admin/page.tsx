import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import Link from "next/link";

export default async function AdminOverview() {
  const [orders, products, subscribers] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.product.count(),
    prisma.subscriber.count(),
  ]);

  const revenue = orders
    .filter(
      (o) =>
        o.status === "PAID" ||
        o.status === "DISPATCHED" ||
        o.status === "DELIVERED",
    )
    .reduce((sum, o) => sum + o.totalNGN, 0);

  const stats = [
    { label: "Revenue", value: formatNGN(revenue) },
    { label: "Orders", value: orders.length },
    { label: "Products", value: products },
    { label: "Subscribers", value: subscribers },
  ];

  const statusColors: Record<string, string> = {
    PENDING: "#BA7517",
    PAID: "#1D9E75",
    PROCESSING: "#378ADD",
    DISPATCHED: "#7F77DD",
    DELIVERED: "#639922",
    CANCELLED: "#E24B4A",
  };

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-8" style={{ color: "var(--body)" }}>
        Overview
      </h1>

      {/* stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div
            key={s.label}
            className="p-5 border"
            style={{
              borderColor: "var(--card)",
              background: "var(--card)",
            }}
          >
            <p
              className="text-xs tracking-[0.12em] uppercase mb-2"
              style={{ color: "var(--muted)" }}
            >
              {s.label}
            </p>
            <p
              className="text-2xl font-medium"
              style={{ color: "var(--body)" }}
            >
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* recent orders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p
            className="text-xs tracking-[0.2em] uppercase font-medium"
            style={{ color: "var(--body)" }}
          >
            Recent orders
          </p>
          <Link
            href="/admin/orders"
            className="text-xs tracking-[0.12em] uppercase"
            style={{ color: "var(--muted)" }}
          >
            View all
          </Link>
        </div>

        <div
          className="border divide-y"
          style={
            {
              borderColor: "var(--card)",
              "--tw-divide-opacity": 1,
            } as React.CSSProperties
          }
        >
          {orders.length === 0 ? (
            <div className="py-10 text-center">
              <p
                className="text-xs tracking-[0.15em] uppercase"
                style={{ color: "var(--muted)" }}
              >
                No orders yet
              </p>
            </div>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between px-5 py-4"
                style={{ borderColor: "var(--card)" }}
              >
                <div>
                  <p
                    className="text-sm font-medium mb-0.5"
                    style={{ color: "var(--body)" }}
                  >
                    {order.firstName} {order.lastName}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
                    {order.reference}
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <p className="text-sm" style={{ color: "var(--body)" }}>
                    {formatNGN(order.totalNGN)}
                  </p>
                  <span
                    className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1"
                    style={{
                      color: statusColors[order.status],
                      background: `${statusColors[order.status]}18`,
                    }}
                  >
                    {order.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
