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
      published: true,
      position: 1,
      sizesStock: { M: 0, L: 9, XL: 0, "2XL": 0 },
    },
    {
      name: "Soulj Tee[WHITE]",
      slug: "soulj-tee-white",
      description: "100% cotton. Heavyweight. Made for Abuja.",
      priceNGN: 10500,
      color: "White",
      published: true,
      position: 2,
      sizesStock: { M: 0, L: 10, XL: 0, "2XL": 0 },
    },
    {
      name: "Soulj Longsleeve",
      slug: "longsleeve-white",
      description: "Brushed cotton longsleeve. Relaxed fit.",
      priceNGN: 13500,
      color: "White",
      published: true,
      position: 3,
      sizesStock: { M: 0, L: 0, XL: 0, "2XL": 0 },
    },
  ];

  for (const item of defaultProducts) {
    const existingProduct = await prisma.product.findUnique({
      where: { slug: item.slug },
    });

    const existingImages = existingProduct ? existingProduct.images : [];

    await prisma.product.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        priceNGN: item.priceNGN,
        color: item.color,
        sizesStock: item.sizesStock,
        position: item.position,
        published: item.published,
        images: existingImages,
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
    "⚡️ Done. Database stock synchronized without touching active images.",
  );
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
