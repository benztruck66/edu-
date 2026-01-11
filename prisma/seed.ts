import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../src/lib/auth";

const prisma = new PrismaClient();

const mockUniversities = [
  {
    name: "Монгол Улсын Их Сургууль",
    city: "Улаанбаатар",
    qsRank: 751,
    programs: ["Компьютер", "Эдийн засаг", "Физик", "Математик", "Хүмүүнлэг", "Биологи"],
    description: "Монголын тэргүүлэгч судалгааны их сургууль. 1942 онд байгуулагдсан түүхэн их сургууль.",
    website: "https://www.num.edu.mn",
    email: "info@num.edu.mn",
    phone: "+976-11-123456",
    tuitionMntPerYear: 4500000,
    acceptanceRatePct: 35,
  },
  {
    name: "ШУТИС",
    city: "Улаанбаатар",
    qsRank: 1201,
    programs: ["Мэдээлэл, Холбооны Технологийн Сургууль (МХТС)", "Барилга, Архитектурын Сургууль (БАС)", "Эрчим Хүчний Сургууль (ЭХС)", "Хэрэглээний Шинжлэх Ухааны Сургууль (ХШУС)", "Программ хангамжийн инженерчлэл (МХТС)"],
    description: "Монгол улсын инженер, технологийн салбарын тэргүүлэх сургууль. 1959 онд байгуулагдсан, олон улсын магадлан итгэмжлэгдсэн хөтөлбөрүүдтэй.",
    website: "https://www.must.edu.mn",
    email: "contact@must.edu.mn",
    phone: "+976-11-654321",
    tuitionMntPerYear: 3800000,
    acceptanceRatePct: 45,
  },
  {
    name: "АШУҮИС",
    city: "Улаанбаатар",
    qsRank: 1001,
    programs: ["Ерөнхий анагаах", "Шүд", "Эм зүй", "Сувилахуй", "Нийгмийн эрүүл мэнд"],
    description: "Эрүүл мэндийн шинжлэх ухааны чиглэлээр дагнасан их сургууль. Монголын анагаах ухааны тэргүүлэгч сургууль.",
    website: "https://www.mnums.edu.mn",
    email: "admission@mnums.edu.mn",
    phone: "+976-11-777777",
    tuitionMntPerYear: 6500000,
    acceptanceRatePct: 25,
  },
  {
    name: "СЭЗИС",
    city: "Улаанбаатар",
    qsRank: 1201,
    programs: ["Санхүү", "Менежмент", "МТ менежмент", "Нягтлан бодох бүртгэл", "Бизнес"],
    description: "Эдийн засаг, бизнесийн чиглэл давамгай. Олон улсын стандартад нийцсэн сургалт.",
    website: "https://www.ufe.edu.mn",
    email: "hello@ufe.edu.mn",
    phone: "+976-11-888888",
    tuitionMntPerYear: 4800000,
    acceptanceRatePct: 45,
  },
  {
    name: "ХААИС",
    city: "Улаанбаатар",
    qsRank: 1501,
    programs: ["Хөдөө аж ахуй", "Мал эмнэлэг", "Ургамал хамгаалал", "Байгаль орчин"],
    description: "Хөдөө аж ахуй, мал аж ахуй чиглэлийн мэргэжилтэн бэлтгэдэг их сургууль.",
    website: "https://www.muls.edu.mn/",
    email: "info@bdu.example.mn",
    phone: "+976-7037-0000",
    tuitionMntPerYear: 3000000,
    acceptanceRatePct: 55,
  },
  {
    name: "Их Засаг Их Сургууль",
    city: "Улаанбаатар",
    qsRank: 1301,
    programs: ["Хууль", "Олон улсын харилцаа", "Нийгмийн ажил", "Журналистик", "Санхүү эдийн засаг", "Инженер технологи", "Анагаах ухаан", "Аюулгүй байдал"],
    description: "Их Засаг Их Сургууль. Хууль зүй, олон улсын харилцаа, инженер технологи, эдийн засаг зэрэг чиглэлээр мэргэжилтэн бэлтгэдэг.",
    website: "https://www.ikhzasag.edu.mn",
    email: "info@ikhzasag.edu.mn",
    phone: "+976-7711-9696",
    tuitionMntPerYear: 4300000,
    acceptanceRatePct: 42,
  },
  {
    name: "Монгол Улсын Боловсролын Их Сургууль (МУБИС)",
    city: "Улаанбаатар",
    qsRank: 1401,
    programs: ["Багш", "Сэтгэл судлал", "Хүүхэд хөгжил", "Боловсролын менежмент", "Математик", "Биологи", "Дүрслэх урлаг", "Биеийн тамир"],
    description: "Монгол Улсын Боловсролын Их Сургууль. Багш, боловсролын ажилтан бэлтгэдэг Монголын тэргүүлэгч их сургууль.",
    website: "https://msue.edu.mn",
    email: "info@msue.edu.mn",
    phone: "+976-11-444444",
    tuitionMntPerYear: 3500000,
    acceptanceRatePct: 50,
  },
  {
    name: "Соёл урлагийн их сургууль (СУИС)",
    city: "Улаанбаатар",
    qsRank: 1601,
    programs: ["Хөгжим", "Дүрслэх урлаг", "Театр урлаг", "Дизайн", "Уран зохиол"],
    description: "Монгол Улсын Соёл урлагийн их сургууль. Урлаг, соёлын чиглэлийн мэргэжилтэн бэлтгэдэг.",
    website: "https://mnuac.edu.mn",
    email: "info@mnuac.edu.mn",
    phone: "+976-11-555555",
    tuitionMntPerYear: 3800000,
    acceptanceRatePct: 38,
  },
  {
    name: "Эрдэнэтийн Их Сургууль",
    city: "Эрдэнэт",
    qsRank: 1801,
    programs: ["Уул уурхай", "Геологи", "Барилга", "МТ", "Бизнес"],
    description: "Эрдэнэт хотын томоохон их сургууль. Уул уурхай, техникийн чиглэлээр мэргэжилтэн бэлтгэнэ.",
    website: "https://www.erdenet-university.edu.mn",
    email: "info@erdenet-uni.mn",
    phone: "+976-1352-12345",
    tuitionMntPerYear: 2800000,
    acceptanceRatePct: 60,
  },
  {
    name: "Дархан Их Сургууль",
    city: "Дархан",
    qsRank: 1901,
    programs: ["Барилга", "Эдийн засаг", "Багш", "МТ"],
    description: "Дархан хотын их сургууль. Бүс нутгийн боловсролын түвшинг дэмжин хөгжүүлнэ.",
    website: "https://www.darkhan-uni.edu.mn",
    email: "contact@darkhan-uni.mn",
    phone: "+976-1372-98765",
    tuitionMntPerYear: 2500000,
    acceptanceRatePct: 65,
  },
  {
    name: "Ховд Их Сургууль",
    city: "Ховд",
    qsRank: 2001,
    programs: ["Багш", "Эдийн засаг", "Хөдөө аж ахуй", "Хүмүүнлэг"],
    description: "Баруун бүсийн их сургууль. Орон нутгийн хөгжилд үйлчилдэг.",
    website: "https://www.khovd-university.edu.mn",
    email: "info@khovd-uni.mn",
    phone: "+976-1432-11111",
    tuitionMntPerYear: 2200000,
    acceptanceRatePct: 70,
  },
  {
    name: "Отгонтэнгэр Их Сургууль",
    city: "Улаанбаатар",
    qsRank: 1701,
    programs: ["МТ менежмент", "Мэдээллийн технологи", "Бизнес", "Санхүү", "Маркетинг"],
    description: "Хувийн их сургууль. Бизнес, МТ-ийн чиглэлээр олон улсын стандартад нийцсэн сургалт явуулна.",
    website: "https://www.otgontenger.edu.mn",
    email: "info@otgontenger.mn",
    phone: "+976-11-666666",
    tuitionMntPerYear: 5200000,
    acceptanceRatePct: 48,
  },
];

async function main() {
  console.log("🌱 Seeding database...");

  // Админ хэрэглэгч үүсгэх
  try {
    const existingAdmin = await prisma.user.findUnique({
      where: { email: "admin@edu-portal.mn" },
    });

    if (!existingAdmin) {
      const adminPassword = await hashPassword("admin123");
      const admin = await prisma.user.create({
        data: {
          email: "admin@edu-portal.mn",
          name: "Системийн Админ",
          password: adminPassword,
          role: "SUPER_ADMIN",
          phone: "+976-99112233",
        },
      });
      console.log(`✅ Created admin user: ${admin.email}`);
      console.log(`   Name: ${admin.name}`);
      console.log(`   Password: admin123`);
      console.log(`   Role: ${admin.role}`);
    } else {
      console.log(`⏭️  Admin user already exists: ${existingAdmin.email}`);
      console.log(`   Name: ${existingAdmin.name}`);
      console.log(`   Role: ${existingAdmin.role}`);
    }
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }

  // Сургуулиуд нэмэх
  for (const uni of mockUniversities) {
    try {
      const existing = await prisma.university.findFirst({
        where: { name: uni.name },
      });

      if (existing) {
        console.log(`⏭️  Skipping ${uni.name} (already exists)`);
        continue;
      }

      const created = await prisma.university.create({
        data: uni,
      });

      console.log(`✅ Created: ${created.name}`);

      // Тэтгэлэг нэмэх (зарим сургуульд)
      if (uni.name === "Монгол Улсын Их Сургууль") {
        await prisma.scholarship.createMany({
          data: [
            {
              universityId: created.id,
              name: "Суралцагчийн тэтгэлэг",
              type: "MERIT",
              amountMnt: 1500000,
              description: "Өндөр голч авсан оюутнуудад олгогдоно",
              requirements: ["Голч 3.5+", "Шалгалт тэнцсэн"],
              isActive: true,
            },
            {
              universityId: created.id,
              name: "Нийгмийн тэтгэлэг",
              type: "NEED_BASED",
              amountMnt: 1000000,
              description: "Нийгмийн эмзэг бүлгийн оюутнуудад",
              requirements: ["Нийгмийн эмзэг бүлгийн гэрчилгээ"],
              isActive: true,
            },
          ],
        });
      }

      if (uni.name === "ШУТИС") {
        await prisma.scholarship.createMany({
          data: [
            {
              universityId: created.id,
              name: "ШУТИС-ийн нэрэмжит тэтгэлэг",
              type: "MERIT",
              amountMnt: 1750000,
              description: "Голч оноо (GPA): 3.6+, ЭЕШ-ын оноо (шинэ элсэгч): 750+, Бүх мэргэжлээр",
              requirements: ["Суралцаж буй чиглэл: Бүх мэргэжил", "Голч оноо (GPA): 3.6+", "ЭЕШ-ын оноо (шинэ элсэгч): 750+"],
              isActive: true,
            },
          ],
        });
      }
    } catch (error) {
      console.error(`❌ Error creating ${uni.name}:`, error);
    }
  }

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



