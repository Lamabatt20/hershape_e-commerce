import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const customersData = [
    {
      name: "Lama Batta",
      email: "1210922@student.birzeit.edu",
      phone: "0591234567",
      address: "Ramallah, Palestine",
      userId: 1,
    },
    {
      name: "Ahmad Saleh",
      email: "ahmad@example.com",
      phone: "0599876543",
      address: "Nablus, Palestine",
      userId: null,
    },
    {
      name: "Sara Ali",
      email: "sara@example.com",
      phone: "0591112223",
      address: "Jerusalem, Palestine",
      userId: null,
    },
  ];

  for (const customer of customersData) {
    const createdCustomer = await prisma.customer.create({
      data: customer,
    });
    console.log("Created customer:", createdCustomer.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
