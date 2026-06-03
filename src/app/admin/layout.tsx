import { cookies } from "next/headers";
import { AdminNav } from "@/components/admin/AdminNav";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const auth = cookieStore.get("soulj-admin")?.value;

  const isAuthenticated = auth === process.env.ADMIN_PASSWORD;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#F7F5EE]">
        <main className="w-full">{children}</main>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-y-auto bg-[#F7F5EE] pt-14 md:mt-10 md:pt-0">
        {children}
      </main>
    </div>
  );
}
