import { PrismaClient } from "../generated/prisma";

const prisma = new PrismaClient();

(async function test() {
  const count = await prisma.student.count();
  // const count = 9;
  console.log(`Database connection successful! Students: ${count}`);
})();

export default prisma;
