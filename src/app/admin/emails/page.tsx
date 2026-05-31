import { prisma } from "@/lib/prisma";
import { EmailComposer } from "@/components/admin/EmailComposer";

export const dynamic = "force-dynamic";

export default async function AdminEmails() {
  const [explicitSubscribers, pastOrders] = await Promise.all([
    prisma.subscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({ select: { email: true } }),
  ]);

  const customerEmailSet = new Set<string>();
  pastOrders.forEach((o) => {
    if (o.email) customerEmailSet.add(o.email.toLowerCase().trim());
  });

  const allUniqueEmails = new Set<string>();
  explicitSubscribers.forEach((s) =>
    allUniqueEmails.add(s.email.toLowerCase().trim()),
  );
  pastOrders.forEach((o) => {
    if (o.email) allUniqueEmails.add(o.email.toLowerCase().trim());
  });

  const consolidatedEmailList = Array.from(allUniqueEmails);

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-medium mb-2" style={{ color: "#0D0D0A" }}>
        Emails
      </h1>

      <p className="text-sm mb-8" style={{ color: "#3D4A28" }}>
        <span className="font-semibold text-[#0D0D0A]">
          {consolidatedEmailList.length}
        </span>{" "}
        total subscriber
        {consolidatedEmailList.length !== 1 ? "s" : ""} available for campaigns
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <EmailComposer subscribers={consolidatedEmailList} />

        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase font-medium mb-4"
            style={{ color: "#0D0D0A" }}
          >
            Subscribers
          </p>
          <div
            style={{
              border: "0.5px solid #D5D2BF",
              maxHeight: "500px",
              overflowY: "auto",
            }}
          >
            {consolidatedEmailList.length === 0 ? (
              <div className="py-10 text-center">
                <p
                  className="text-xs tracking-[0.15em] uppercase"
                  style={{ color: "#3D4A28" }}
                >
                  No subscribers found
                </p>
              </div>
            ) : (
              consolidatedEmailList.map((email, i) => {
                const isCustomer = customerEmailSet.has(email);

                return (
                  <div
                    key={i}
                    className="flex items-center justify-between px-4 py-3"
                    style={{ borderBottom: "0.5px solid #EAE7D8" }}
                  >
                    <p
                      className="text-sm truncate mr-4"
                      style={{ color: "#0D0D0A" }}
                    >
                      {email}
                    </p>
                    <span
                      className="text-[9px] tracking-wider uppercase px-1.5 py-0.5"
                      style={{
                        background: isCustomer ? "#0D0D0A" : "#EAE7D8",
                        color: isCustomer ? "#F5F5F0" : "#3D4A28",
                      }}
                    >
                      {isCustomer ? "Customer" : "Subscriber"}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
