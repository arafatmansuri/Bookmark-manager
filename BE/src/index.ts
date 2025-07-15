import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

async function main() {
  await prisma.user.create({
    data: {
      username: "primsaUser",
      email: "primsaUser@gmail.com",
      password: "primsaUser@123",
    },
  });
  const allUsers = await prisma.user.findMany();
  console.log(allUsers);
}

main()
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
