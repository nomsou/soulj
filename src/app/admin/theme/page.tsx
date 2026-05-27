import { ThemeSwitcher } from "@/components/admin/ThemeSwitcher";
import { prisma } from "@/lib/prisma";

export default async function AdminTheme() {
  const setting = await prisma.setting.findUnique({
    where: { key: "theme" },
  });

  return <ThemeSwitcher currentTheme={setting?.value ?? "olive"} />;
}
