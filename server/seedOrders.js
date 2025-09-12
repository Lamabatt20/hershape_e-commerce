import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const ordersData = [
    {
      customerId: 4,
      status: "delivered",
      items: [
        { productId: 16, quantity: 2, color: "nude", size: "M" },
        { productId: 17, quantity: 1, color: "nude", size: "XS" },
      ],
    },
    {
      customerId: 4,
      status: "pending",
      items: [
        { productId: 20, quantity: 1, color: "black", size: "L" },
      ],
    },
  ];

  for (const order of ordersData) {
    
    let subtotal = 0;
    for (const item of order.items) {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
        select: { price: true },
      });
      if (!product) throw new Error(`Product ${item.productId} not found`);
      subtotal += product.price * item.quantity;
    }

    const createdOrder = await prisma.order.create({
      data: {
        customerId: order.customerId,
        status: order.status,
        subtotal, 
        items: {
          create: order.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            color: item.color,
            size: item.size,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    console.log("Created order:", createdOrder.id, "Subtotal:", subtotal);
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
