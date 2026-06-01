import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      {
        name: "Soulj Branded Tee (BLACK)",
        slug: "soulj-tee-black",
        description: "100% cotton. Heavyweight. Made for Abuja.",
        priceNGN: 10000,
        color: "Black",
        size: "M",
        stock: 20,
        images: [],
        published: true,
      },
      {
        name: "Soulj Branded Tee (WHITE)",
        slug: "soulj-tee-white",
        description: "100% cotton. Heavyweight. Made for Abuja.",
        priceNGN: 10000,
        color: "White",
        size: "M",
        stock: 20,
        images: [],
        published: true,
      },
    ],
  });

  await prisma.setting.upsert({
    where: { key: "theme" },
    update: { value: "military" },
    create: { key: "theme", value: "military" },
  });

  console.log("Seeded products and settings.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
