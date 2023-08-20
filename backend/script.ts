import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const products = await prisma.product.findMany();
  console.log(products);
}

main()
  .catch((error) => {
    console.log(error.message);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
