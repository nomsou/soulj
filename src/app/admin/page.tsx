import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

const statusColors: Record<string, string> = {
  PAID: "#1D9E75",
  DELIVERED: "#639922",
};

export default async function AdminOverview() {
  const [orders, productCount, subscriberCount] = await Promise.all([
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
    prisma.product.count(),
    prisma.subscriber.count(),
  ]);

  const revenue = orders.reduce((sum, o) => sum + o.totalNGN, 0);

  const stats = [
    { label: "Revenue", value: formatNGN(revenue) },
    { label: "Orders", value: orders.length },
    { label: "Products", value: productCount },
    { label: "Subscribers", value: subscriberCount },
  ];

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-8" style={{ color: "#0D0D0A" }}>
        Overview
      </h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {stats.map((s) => (
          <div key={s.label} className="p-5" style={{ background: "#E8E4D4" }}>
            <p
              className="text-xs tracking-[0.12em] uppercase mb-2"
              style={{ color: "#3D4A28" }}
            >
              {s.label}
            </p>
            <p className="text-2xl font-medium" style={{ color: "#0D0D0A" }}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <p
          className="text-xs tracking-[0.2em] uppercase font-medium"
          style={{ color: "#0D0D0A" }}
        >
          Recent orders
        </p>
        <Link
          href="/admin/orders"
          className="text-xs tracking-[0.12em] uppercase"
          style={{ color: "#3D4A28" }}
        >
          View all
        </Link>
      </div>

      <div style={{ border: "0.5px solid #D5D2BF" }}>
        {orders.length === 0 ? (
          <div className="py-12 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "#3D4A28" }}
            >
              No orders yet
            </p>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order.id}
              className="flex items-center justify-between px-5 py-4"
              style={{ borderBottom: "0.5px solid #EAE7D8" }}
            >
              <div>
                <p
                  className="text-sm font-medium mb-0.5"
                  style={{ color: "#0D0D0A" }}
                >
                  {order.firstName} {order.lastName}
                </p>
                <p className="text-xs" style={{ color: "#3D4A28" }}>
                  {order.reference}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <p className="text-sm" style={{ color: "#0D0D0A" }}>
                  {formatNGN(order.totalNGN)}
                </p>
                <span
                  className="text-[10px] tracking-[0.1em] uppercase px-2.5 py-1"
                  style={{
                    color: statusColors[order.status] ?? "#1D9E75",
                    background: `${statusColors[order.status] ?? "#1D9E75"}18`,
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
  );
}
