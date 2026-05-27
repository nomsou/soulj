import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-8" style={{ color: "#0D0D0A" }}>
        Orders
      </h1>

      <div style={{ border: "0.5px solid #D5D2BF" }}>
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "#3D4A28" }}
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
                style={{ borderBottom: "0.5px solid #EAE7D8" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p
                      className="text-sm font-medium mb-0.5"
                      style={{ color: "#0D0D0A" }}
                    >
                      {order.firstName} {order.lastName}
                    </p>
                    <p className="text-xs mb-0.5" style={{ color: "#3D4A28" }}>
                      {order.email} · {order.phone}
                    </p>
                    <p className="text-xs" style={{ color: "#3D4A28" }}>
                      {order.address}, {order.city}, {order.state}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p
                      className="text-sm font-medium mb-1"
                      style={{ color: "#0D0D0A" }}
                    >
                      {formatNGN(order.totalNGN)}
                    </p>
                    <p
                      className="text-[10px] tracking-[0.1em] uppercase"
                      style={{ color: "#3D4A28" }}
                    >
                      {new Date(order.createdAt).toLocaleDateString("en-NG")}
                    </p>
                  </div>
                </div>

                <div className="space-y-0.5">
                  {items.map((item: any, i: number) => (
                    <p key={i} className="text-xs" style={{ color: "#3D4A28" }}>
                      {item.name} × {item.quantity} — {item.color}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <p
                    className="text-[10px] tracking-[0.1em] uppercase"
                    style={{ color: "#3D4A28" }}
                  >
                    {order.reference}
                  </p>
                  <OrderStatusSelect
                    orderId={order.id}
                    currentStatus={order.status}
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
