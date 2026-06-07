import { prisma } from "@/lib/prisma";
import { formatNGN } from "@/lib/utils";
import { OrderStatusSelect } from "@/components/admin/OrderStatusSelect";
import { Order } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminOrders() {
  let orders: Order[] = [];
  let databaseError = false;

  try {
    orders = await prisma.order.findMany({
      where: {
        status: { in: ["PAID", "DELIVERED"] },
      },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error(
      "Prisma lookup failed on Admin Orders component view:",
      error,
    );
    databaseError = true;
  }

  return (
    <div className="p-4 md:p-8">
      <h1
        className="text-xl font-medium mb-6 md:mb-8"
        style={{ color: "#0D0D0A" }}
      >
        Orders
      </h1>

      {databaseError && (
        <div className="mb-6 p-4 text-xs tracking-[0.05em] border border-[#E24B4A] bg-[#E24B4A]/10 text-[#E24B4A]">
          Connection timeout. The database node is waking up — please refresh
          this page to synchronize your data.
        </div>
      )}

      <div style={{ border: "0.5px solid #D5D2BF" }}>
        {orders.length === 0 ? (
          <div className="py-16 text-center">
            <p
              className="text-xs tracking-[0.15em] uppercase"
              style={{ color: "#3D4A28" }}
            >
              {databaseError
                ? "Failed to synchronize orders ledger"
                : "No orders yet"}
            </p>
          </div>
        ) : (
          orders.map((order) => {
            const items = order.items as any[];
            return (
              <div
                key={order.id}
                className="px-4 md:px-5 py-4 md:py-5 space-y-3"
                style={{ borderBottom: "0.5px solid #EAE7D8" }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className="text-sm font-medium mb-0.5"
                      style={{ color: "#0D0D0A" }}
                    >
                      {order.firstName} {order.lastName}
                    </p>
                    <p
                      className="text-xs mb-0.5 truncate"
                      style={{ color: "#3D4A28" }}
                    >
                      {order.email}
                    </p>
                    <p className="text-xs" style={{ color: "#3D4A28" }}>
                      {order.phone}
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
                      {new Date(order.createdAt).toLocaleString("en-NG", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                <p className="text-xs" style={{ color: "#3D4A28" }}>
                  {order.address}, {order.city}, {order.state}
                </p>

                <div className="space-y-0.5">
                  {items.map((item: any, i: number) => (
                    <p key={i} className="text-xs" style={{ color: "#3D4A28" }}>
                      {item.name} × {item.quantity} — {item.color}{" "}
                      {item.size ? `(${item.size})` : ""}
                    </p>
                  ))}
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
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
