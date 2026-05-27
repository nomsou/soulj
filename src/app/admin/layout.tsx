import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      <AdminNav />
      <main className="mt-10 flex-1 overflow-auto bg-[#F7F5EE]">{children}</main>
    </div>
  );
}
