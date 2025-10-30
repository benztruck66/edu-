export type Scholarship = {
  name: string;
  type: "merit" | "need-based" | "athletic" | "international";
  amountMnt?: number;
  description: string;
};

export type University = {
  id: string;
  name: string;
  city: string;
  qsRank: number;
  programs: string[];
  description?: string;
  website?: string;
  email?: string;
  phone?: string;
  tuitionMntPerYear?: number; // mock
  acceptanceRatePct?: number; // mock
  scholarships?: Scholarship[]; // mock
};

export const mockUniversities: University[] = [
  {
    id: "num",
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
    scholarships: [
      { name: "Суралцагчийн тэтгэлэг", type: "merit", amountMnt: 1500000, description: "Өндөр голч авсан оюутнуудад олгогдоно" },
      { name: "Нийгмийн тэтгэлэг", type: "need-based", amountMnt: 1000000, description: "Нийгмийн эмзэг бүлгийн оюутнуудад" },
      { name: "Олон улсын оюутны тэтгэлэг", type: "international", amountMnt: 2000000, description: "Гадаадын оюутнуудад" },
    ],
  },
  {
    id: "must",
    name: "ШУТИС",
    city: "Улаанбаатар",
    qsRank: 801,
    programs: ["Мэдээллийн технологи", "Барилга", "Энергетик", "Автомат удирдлага", "Программ хангамж"],
    description: "Инженер, технологийн чиглэлийн томоохон сургууль. Техникийн боловсрол олгодог тэргүүлэгч их сургууль.",
    website: "https://www.must.edu.mn",
    email: "contact@must.edu.mn",
    phone: "+976-11-654321",
    tuitionMntPerYear: 4200000,
    acceptanceRatePct: 40,
    scholarships: [
      { name: "МТ тэтгэлэг", type: "merit", amountMnt: 1800000, description: "Мэдээллийн технологийн чиглэлийн оюутнуудад" },
      { name: "Инженерийн тэтгэлэг", type: "merit", amountMnt: 1600000, description: "Инженерийн чиглэлийн тэргүүн оюутнуудад" },
    ],
  },
  {
    id: "mnums",
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
    scholarships: [
      { name: "Анагаах ухааны тэтгэлэг", type: "merit", amountMnt: 2500000, description: "Анагаахын чиглэлийн шилдэг оюутнуудад" },
      { name: "Хөдөөгийн эмч", type: "need-based", amountMnt: 3000000, description: "Хөдөөд ажиллах амлалт өгсөн оюутнуудад" },
    ],
  },
  {
    id: "muisc",
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
    scholarships: [
      { name: "Бизнесийн тэтгэлэг", type: "merit", amountMnt: 1400000, description: "Бизнесийн чиглэлийн оюутнуудад" },
    ],
  },
  {
    id: "bdu",
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
    id: "ues",
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
    id: "mue",
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
    id: "msue",
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
    id: "erdenet",
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
    id: "darkhan",
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
    id: "khovd",
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
    id: "otgontenger",
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

export const mockRankings = mockUniversities
  .map((u) => ({ id: u.id, name: u.name, qsRank: u.qsRank }))
  .sort((a, b) => a.qsRank - b.qsRank);


