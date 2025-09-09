import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash("lara1996", 10);

  const admin = await prisma.user.create({
    data: {
      username: "Lara batta",
      email: "Larashareef@hotmail.com",
      password: hashedPassword,
      role: "admin",
      isVerified: true,
    },
  });

  console.log("Admin created:", admin);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());