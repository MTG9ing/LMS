import prisma from "../src/configurations/prisma.config";
async function main() {
  await prisma.gradeLevel.create({
    data: {
      name: "ثالث ثانوي",
      order: 3,
      isActive: true,
    },
  });

  const a = await prisma.category.create({
    data: {
      name: "حضور الحصص",
      description: "قدرة حضور الحصص",
      isActive: true,
    },
  });

  await prisma.paymentPlan.create({
    data: {
      name: "اشتراك عربي شهر",
      type: "MONTHLY",
      amount: 240,
      isActive: true,
      categoryId: a.id,
      isRecurring: true,
    },
  });

  console.log("✅ Seed data inserted");
}
main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
