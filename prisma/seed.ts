import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  await prisma.product.deleteMany({});

  await prisma.product.createMany({
    data: [
      {
        name: "Plain Tee",
        slug: "plain-tee-black",
        description: "100% cotton. Heavyweight. Made for Abuja.",
        priceNGN: 10500,
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
        priceNGN: 10500,
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
        priceNGN: 13500,
        color: "White",
        size: "M",
        stock: 15,
        images: [],
        published: false,
      },
    ],
  });

  await prisma.setting.upsert({
    where: { key: "theme" },
    update: { value: "military" },
    create: { key: "theme", value: "military" },
  });

  console.log("Seeded drop inventory with upcoming previews.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
