import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const products = [
  {
    name: "Full corset",
    price: 60,
    image: "/images/w1.webp",
    sizes: ["S", "M", "L"],
    colors: ["nude"],
    available: "In stock",
    description: "A full-body shaping corset designed to smooth and contour your figure for an elegant silhouette."
  },
  {
    name: "Waist Cincher",
    price: 50,
    image: "/images/waist-cincher.webp",
    sizes: ["M", "L", "XL"],
    colors: ["nude"],
    available: "In stock",
    description: "A comfortable waist cincher that provides firm tummy control and enhances your waistline."
  },
  {
    name: "PowerShorts",
    price: 40,
    image: "/images/powershorts.webp",
    sizes: ["XS", "S", "M"],
    colors: ["black"],
    available: "Out of stock",
    description: "Lightweight shaping shorts that offer targeted compression for a smooth look under clothing."
  },
  {
    name: "Pro Sculpt",
    price: 55,
    image: "/images/pro-sculpt.webp",
    sizes: ["S", "M", "L", "XL"],
    colors: ["nude"],
    available: "In stock",
    description: "High-performance shapewear for sculpting your curves while providing all-day comfort."
  },
  {
    name: "Power Legging",
    price: 100,
    image: "/images/Power Legging.webp",
    sizes: ["M", "L", "XL", "2XL"],
    colors: ["black"],
    available: "In stock",
    description: "Stylish power leggings with compression technology for support and a sleek, flattering fit."
  },
  {
    name: "SmartShape vest",
    price: 65,
    image: "/images/SmartShapevest.webp",
    sizes: ["S", "M", "L"],
    colors: ["nude"],
    available: "Out of stock",
    description: "A shaping vest that smooths your upper body and supports your posture with breathable fabric."
  }
];

const seed = async () => {
  try {
    for (const p of products) {
      await prisma.product.create({
        data: {
          name: p.name,
          price: p.price,
          image: p.image,
          sizes: JSON.stringify(p.sizes),
          colors: JSON.stringify(p.colors),
          available: p.available,
          description: p.description
        }
      });
    }
    console.log("Products seeded successfully!");
  } catch (err) {
    console.error(err);
  } finally {
    await prisma.$disconnect();
  }
};

seed();
