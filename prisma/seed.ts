import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.createMany({
    data: [
      {
        name: "Plain Tee",
        slug: "plain-tee-black",
        description: "100% cotton. Heavyweight. Made for Abuja.",
        priceNGN: 18000,
        color: "Black",
        size: "M",
        stock: 20,
        images: [],
        published: true,
      },
      {
        name: "Plain Tee",
        slug: "plain-tee-white",
        description: "100% cotton. Heavyweight. Made for Abuja.",
        priceNGN: 18000,
        color: "White",
        size: "M",
        stock: 20,
        images: [],
        published: true,
      },
      {
        name: "Longsleeve",
        slug: "longsleeve-white",
        description: "Brushed cotton longsleeve. Relaxed fit.",
        priceNGN: 22000,
        color: "White",
        size: "M",
        stock: 15,
        images: [],
        published: true,
      },
    ],
  });

  await prisma.setting.upsert({
    where: { key: "theme" },
    update: { value: "olive" },
    create: { key: "theme", value: "olive" },
  });

  console.log("Seeded products and settings.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
