import { prisma } from "@/lib/prisma";
import { EmailComposer } from "@/components/admin/EmailComposer";

export default async function AdminEmails() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-xl font-medium mb-2" style={{ color: "#0D0D0A" }}>
        Emails
      </h1>
      <p className="text-sm mb-8" style={{ color: "#3D4A28" }}>
        {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <EmailComposer subscribers={subscribers.map((s) => s.email)} />

        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase font-medium mb-4"
            style={{ color: "#0D0D0A" }}
          >
            Subscribers
          </p>
          <div style={{ border: "0.5px solid #D5D2BF" }}>
            {subscribers.length === 0 ? (
              <div className="py-10 text-center">
                <p
                  className="text-xs tracking-[0.15em] uppercase"
                  style={{ color: "#3D4A28" }}
                >
                  No subscribers yet
                </p>
              </div>
            ) : (
              subscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderBottom: "0.5px solid #EAE7D8" }}
                >
                  <p
                    className="text-sm truncate mr-4"
                    style={{ color: "#0D0D0A" }}
                  >
                    {s.email}
                  </p>
                  <p className="text-xs shrink-0" style={{ color: "#3D4A28" }}>
                    {new Date(s.createdAt).toLocaleDateString("en-NG")}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
