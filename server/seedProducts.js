// seedProducts.js
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.orderItem.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.productVariant.deleteMany();
  await prisma.product.deleteMany();

  const productsData = [
    {
      name: "Full-body Shaping Corset",
      price: 120,
      description:
        "A full-body shaping corset designed to smooth and contour your figure for an elegant silhouette.",
      images: ["/images/w1.webp"],
      variants: [
        {
          color: "nude",
          size: "M",
          stock: 50,
          available: true,
          image: "/images/w1.webp",
        },
      ],
    },
    {
      name: "Waist Cincher",
      price: 80,
      description:
        "A comfortable waist cincher that provides firm tummy control and enhances your waistline.",
      images: ["/images/waist-cincher.webp"],
      variants: [
        {
          color: "nude",
          size: "M",
          stock: 10,
          available: true,
          image: "/images/waist-cincher.webp",
        },
      ],
    },
    {
      name: "Shaping Shorts",
      price: 95,
      description:
        "Lightweight shaping shorts that offer targeted compression for a smooth look under clothing.",
      images: [
        "1757348674876-powershorts.webp",
        "1757346667040-shoretcorset.png",
      ],
      variants: [
        {
          color: "black",
          size: "M",
          stock: 1,
          available: true,
          image: "1757348674876-powershorts.webp",
        },
        {
          color: "nude",
          size: "M",
          stock: 1,
          available: true,
          image: "1757346667040-shoretcorset.png",
        },
      ],
    },
    {
      name: "Pro Sculpt Shapewear",
      price: 110,
      description:
        "High-performance shapewear for sculpting your curves while providing all-day comfort.",
      images: ["/images/pro-sculpt.webp"],
      variants: [
        {
          color: "nude",
          size: "M",
          stock: 40,
          available: true,
          image: "/images/pro-sculpt.webp",
        },
      ],
    },
    {
      name: "Power Leggings",
      price: 130,
      description:
        "Stylish power leggings with compression technology for support and a sleek, flattering fit.",
      images: ["/images/Power Legging.webp"],
      variants: [
        {
          color: "black",
          size: "M",
          stock: 30,
          available: true,
          image: "/images/Power Legging.webp",
        },
      ],
    },
    {
      name: "Smart Shape Vest",
      price: 100,
      description:
        "A shaping vest that smooths your upper body and supports your posture with breathable fabric.",
      images: ["/images/SmartShapevest.webp"],
      variants: [
        {
          color: "nude",
          size: "M",
          stock: 0,
          available: false,
          image: "/images/SmartShapevest.webp",
        },
      ],
    },
  ];

  for (const product of productsData) {
    await prisma.product.create({
      data: {
        name: product.name,
        price: product.price,
        description: product.description,
        images: product.images,
        variants: {
          create: product.variants,
        },
      },
    });
  }

  console.log("✅ Products seeded successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding products:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
