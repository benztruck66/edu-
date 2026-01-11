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
  logo?: string; // Логоны URL
  images?: string[]; // Зургуудын URL-ууд
};

export const mockUniversities: University[] = [
  {
    id: "num",
    name: "Монгол Улсын Их Сургууль",
    city: "Улаанбаатар",
    qsRank: 751,
    programs: [
      "Компьютер",
      "Программ хангамж",
      "Мэдээллийн технологи",
      "Мэдээллийн систем",
      "Мультимедиа технологи",
      "Компьютерын сүлжээ",
      "Математик",
      "Физик",
      "Хими",
      "Биологи",
      "Газар зүй",
      "Биотехнологи",
      "Түүх",
      "Гадаад хэл",
      "Хэл шинжлэл",
      "Утга зохиол",
      "Нийгмийн ажил",
      "Сэтгүүл зүй",
      "Эдийн засаг",
      "Санхүү",
      "Нягтлан бодох бүртгэл",
      "Маркетинг",
      "Менежмент",
      "Худалдаа",
      "Жуулчлал",
      "Хууль зүй",
      "Олон улсын харилцаа",
      "Удирдлага",
      "Улс төр"
    ],
    description: "Монголын тэргүүлэгч судалгааны их сургууль. 1942 онд байгуулагдсан түүхэн их сургууль. Программ хангамж хөтөлбөрт онолын суурь маш хүчтэй, алгоритм, математикийн суурь, Data Science, AI, ML талд давуу. Судалгаа, академик чиглэл хүчтэй. Coding-ийн 'гадагш нь гаргах' чанар сайн.",
    website: "https://www.num.edu.mn",
    email: "info@num.edu.mn",
    phone: "+976-11-123456",
    tuitionMntPerYear: 4500000,
    acceptanceRatePct: 35,
    logo: "/logos/num.png",
    images: [],
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
    qsRank: 1201,
    programs: ["Мэдээлэл, Холбооны Технологийн Сургууль (МХТС)", "Барилга, Архитектурын Сургууль (БАС)", "Эрчим Хүчний Сургууль (ЭХС)", "Хэрэглээний Шинжлэх Ухааны Сургууль (ХШУС)", "Программ хангамжийн инженерчлэл (МХТС)"],
    description: "Монгол улсын инженер, технологийн салбарын тэргүүлэх сургууль. 1959 онд байгуулагдсан, олон улсын магадлан итгэмжлэгдсэн хөтөлбөрүүдтэй.",
    website: "https://www.must.edu.mn",
    email: "contact@must.edu.mn",
    phone: "+976-11-654321",
    tuitionMntPerYear: 3800000,
    acceptanceRatePct: 45,
    logo: "/logos/must.png",
    images: [],
    scholarships: [
      { name: "ШУТИС-ийн нэрэмжит тэтгэлэг", type: "merit", amountMnt: 1750000, description: "Голч оноо (GPA): 3.6+, ЭЕШ-ын оноо (шинэ элсэгч): 750+, Бүх мэргэжлээр" },
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
    // logo: "/logos/mnums.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/muisc.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/bdu.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/ues.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/mue.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/msue.png", // Logo оруулаагүй байна
    images: [],
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
    // logo: "/logos/otgontenger.png", // Logo оруулаагүй байна
    images: [],
  },
];

export const mockRankings = mockUniversities
  .map((u) => ({ id: u.id, name: u.name, qsRank: u.qsRank }))
  .sort((a, b) => a.qsRank - b.qsRank);


