import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Устгах сургуулиудын ID-ууд
  const idsToDelete = ["erdenet", "darkhan", "khovd"];

  console.log("Устгаж байна:", idsToDelete);

  // MongoDB-д ObjectId эсвэл string ID-ээр хайх
  // Эхлээд нэрээр олох
  const universities = await prisma.university.findMany({
    where: {
      OR: [
        { name: { contains: "Эрдэнэт" } },
        { name: { contains: "Дархан" } },
        { name: { contains: "Ховд" } },
      ],
    },
  });

  if (universities.length > 0) {
    const deleteResult = await prisma.university.deleteMany({
      where: {
        id: { in: universities.map((u) => u.id) },
      },
    });

    console.log(`✅ ${deleteResult.count} сургууль устгагдлаа`);
  } else {
    console.log("ℹ️ Database-д эдгээр сургуулиуд олдсонгүй");
  }
}

main()
  .catch((e) => {
    console.error("❌ Алдаа:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

