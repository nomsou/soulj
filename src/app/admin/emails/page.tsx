import { prisma } from "@/lib/prisma";
import { EmailComposer } from "@/components/admin/EmailComposer";

export default async function AdminEmails() {
  const subscribers = await prisma.subscriber.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-8">
      <h1 className="text-xl font-medium mb-2" style={{ color: "var(--body)" }}>
        Emails
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
        {subscribers.length} subscriber{subscribers.length !== 1 ? "s" : ""}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <EmailComposer subscribers={subscribers.map((s) => s.email)} />

        <div>
          <p
            className="text-xs tracking-[0.2em] uppercase font-medium mb-4"
            style={{ color: "var(--body)" }}
          >
            Subscribers
          </p>
          <div
            className="border divide-y"
            style={{ borderColor: "var(--card)" }}
          >
            {subscribers.length === 0 ? (
              <div className="py-10 text-center">
                <p
                  className="text-xs tracking-[0.15em] uppercase"
                  style={{ color: "var(--muted)" }}
                >
                  No subscribers yet
                </p>
              </div>
            ) : (
              subscribers.map((s) => (
                <div
                  key={s.id}
                  className="flex items-center justify-between px-4 py-3"
                  style={{ borderColor: "var(--card)" }}
                >
                  <p className="text-sm" style={{ color: "var(--body)" }}>
                    {s.email}
                  </p>
                  <p className="text-xs" style={{ color: "var(--muted)" }}>
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
