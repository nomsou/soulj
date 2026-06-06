import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const defaultProducts = [
    {
      name: "Soulj Tee[BLACK]",
      slug: "soulj-tee-black",
      description: "100% cotton. Heavyweight. Made for Abuja.",
      priceNGN: 10500,
      color: "Black",
      size: "M",
      stock: 20,
      published: true,
      position: 1,
    },
    {
      name: "Soulj Tee[WHITE]",
      slug: "soulj-tee-white",
      description: "100% cotton. Heavyweight. Made for Abuja.",
      priceNGN: 10500,
      color: "White",
      size: "M",
      stock: 20,
      published: true,
      position: 2,
    },
    {
      name: "Soulj Longsleeve",
      slug: "longsleeve-white",
      description: "Brushed cotton longsleeve. Relaxed fit.",
      priceNGN: 13500,
      color: "White",
      size: "M",
      stock: 15,
      published: false,
      position: 3,
    },
  ];

  for (const item of defaultProducts) {
    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        priceNGN: item.priceNGN,
        color: item.color,
        size: item.size,
        stock: item.stock,
        position: item.position,
      },
      create: {
        ...item,
        images: [],
      },
    });
  }

  await prisma.setting.upsert({
    where: { key: "theme" },
    update: { value: "military" },
    create: { key: "theme", value: "military" },
  });

  console.log(
    "Seeded and synchronized drop inventory without altering custom images.",
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
