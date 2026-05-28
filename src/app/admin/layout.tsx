import { AdminNav } from "@/components/admin/AdminNav";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden">
      <AdminNav />
      <main className="flex-1 overflow-y-auto bg-[#F7F5EE] pt-14 md:mt-10 md:pt-0">
        {children}
      </main>
    </div>
  );
}
