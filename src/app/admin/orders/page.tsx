import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

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
        Orders
      </h1>

      <div className="border divide-y" style={{ borderColor: "var(--card)" }}>
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "var(--muted)" }}
            >
              No orders yet
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const items = order.items as any[];
            return (
              <div
                key={order.id}
                className="px-5 py-5 space-y-3"
                style={{ borderColor: "var(--card)" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-sm font-medium mb-0.5"
                      style={{ color: "var(--body)" }}
                    >
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>
                      {order.email} · {order.phone}
                    </p>
                    <p
                      className="text-xs mt-1"
                      style={{ color: "var(--muted)" }}
                    >
                      {order.address}, {order.city}, {order.state}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "var(--body)" }}
                    >
                      {formatNGN(order.totalNGN)}
                    </p>
                    <p
                      className="text-[10px] tracking-[0.1em] uppercase"
                      style={{ color: "var(--muted)" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                </div>

                <div
                  className="text-xs space-y-0.5"
                  style={{ color: "var(--muted)" }}
                >
                  {items.map((item: any, i: number) => (
                    <p key={i}>
                      {item.name} × {item.quantity} — {item.color}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-[10px] tracking-[0.1em] uppercase"
                    style={{ color: "var(--muted)" }}
                  >
                    {order.reference}
                  </p>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
                    statusColors={statusColors}
                  />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
