/**
 * Сургуулиудын харьцуулалт - МУИС vs ШУТИС
 * Програм хангамж хөтөлбөрийн ялгаа
 */

export interface UniversityComparison {
  universityId: string;
  universityName: string;
  programName: string;
  focus: string; // Зорилго, чиглэл
  strengths: string[]; // Давуу талууд
  courses: string[]; // Гол хичээлүүд
  environment: {
    theory: number; // 1-5
    practical: number; // 1-5
    lab: number; // 1-5
    research: number; // 1-5
    programming: number; // 1-5
  };
  careerPaths: string[]; // Төгсөөд юу болдог
  bestFor: string[]; // Хэнд тохиромжтой
}

export const universityComparisons: Record<string, UniversityComparison[]> = {
  "Программ хангамж": [
    {
      universityId: "num",
      universityName: "МУИС",
      programName: "Програм хангамж",
      focus: "Онолын суурь МАШ хүчтэй. Алгоритм, математикийн суурь. Data Science, AI, ML талд давуу. Судалгаа, академик чиглэл хүчтэй. Coding-ийн 'гадагш нь гаргах' чанар сайн.",
      strengths: [
        "Онолын суурь маш хүчтэй - Discrete Math, Linear Algebra, Algorithms, Data Structures",
        "Алгоритм, математикийн суурь - Компьютерийн шинжлэх ухааны онолын суурь",
        "Data Science, AI, ML талд давуу - Machine Learning, Data Mining, AI хичээлүүд",
        "Судалгаа, академик чиглэл хүчтэй - Research project, академик судалгаа",
        "Coding-ийн 'гадагш нь гаргах' чанар сайн - Алгоритм, логик сэтгэлгээ хүчтэй"
      ],
      courses: [
        "Discrete Math (Дискрет математик)",
        "Linear Algebra (Шугаман алгебр)",
        "Algorithms & Data Structures (Алгоритм, мэдээллийн бүтэц)",
        "Compiler Design (Компиляторын дизайн)",
        "Operating Systems Theory (Үйлдлийн системийн онол)",
        "Artificial Intelligence (Хиймэл оюун ухаан)",
        "Machine Learning (Машин сургалт)",
        "Data Mining (Өгөгдөл олборлолт)",
        "Research project (Судалгааны төсөл)",
        "Computer Graphics (Компьютерийн график)"
      ],
      environment: {
        theory: 5,
        practical: 3,
        lab: 3,
        research: 5,
        programming: 5
      },
      careerPaths: [
        "Backend Developer (Алгоритм, системийн дизайн)",
        "Data Engineer (Өгөгдөл боловсруулах, анализ)",
        "Machine Learning/AI инженер (AI систем хөгжүүлэгч)",
        "Research engineer (Судалгааны инженер)",
        "Algorithm-heavy ажлууд (Алгоритм хөгжүүлэгч)"
      ],
      bestFor: [
        "AI/Data/Algorithm талд сонирхолтой хүмүүс",
        "Онолын суурь мэтгэлцээн, олимпиад сонирхогчид",
        "Судалгаа, академик чиглэл сонирхогчид",
        "Математик, алгоритм сонирхогчид"
      ]
    },
    {
      universityId: "must",
      universityName: "ШУТИС",
      programName: "Программ хангамж",
      focus: "Инженерчлэл, практик тал илүү. DevOps, Network, System, Cloud талд давуу. Лаборатори, тоног төхөөрөмж сайтай. Full-stack веб, мобайл, серверийн практик их. Инженерийн хичээл ордог (электроник, тооцоолуурын бүтэц...).",
      strengths: [
        "Инженерчлэл, практик тал илүү - Практик төслүүд, лабораторийн ажил их",
        "DevOps, Network, System, Cloud талд давуу - Сервер, сүлжээ, cloud технологи",
        "Лаборатори, тоног төхөөрөмж сайтай - Практик туршлага олох боломж",
        "Full-stack веб, мобайл, серверийн практик их - Бодит төслүүд хийх",
        "Инженерийн хичээл ордог - Электроник, тооцоолуурын бүтэц, системийн дизайн"
      ],
      courses: [
        "Computer Networks (Компьютерийн сүлжээ)",
        "Server administration (Серверийн удирдлага)",
        "Operating Systems (Үйлдлийн систем - Практик талтай)",
        "Database Systems (Өгөгдлийн сангийн систем - lab их)",
        "DevOps (Docker, CI/CD, сервер ажиллагаа)",
        "Software Engineering (Практик төслийн ажил)",
        "Электроник (Электроникийн суурь)",
        "Тооцоолуурын бүтэц (Computer Architecture)",
        "Web Development (Веб хөгжүүлэлт)",
        "Mobile Development (Мобайл хөгжүүлэлт)"
      ],
      environment: {
        theory: 3,
        practical: 5,
        lab: 5,
        research: 3,
        programming: 4
      },
      careerPaths: [
        "Full-stack Developer (Веб, мобайл, сервер)",
        "DevOps / Cloud инженер (Сервер, cloud систем)",
        "Mobile Developer (iOS, Android хөгжүүлэгч)",
        "Network/System Engineer (Сүлжээ, системийн инженер)",
        "Системийн инженерийн ажил (Системийн дизайн, удирдлага)"
      ],
      bestFor: [
        "Практик инженер, сервер, DevOps сонирхогчид",
        "Веб, мобайл, full-stack хөгжүүлэлт сонирхогчид",
        "Инженерийн практик ажил сонирхогчид",
        "Лабораторийн ажил, практик туршлага сонирхогчид"
      ]
    }
  ]
};

/**
 * Сургуулиудын харьцуулалт авах
 */
export function getUniversityComparison(
  programName: string,
  universityId?: string
): UniversityComparison[] | UniversityComparison | null {
  const comparisons = universityComparisons[programName];
  if (!comparisons) return null;
  
  if (universityId) {
    return comparisons.find(c => c.universityId === universityId) || null;
  }
  
  return comparisons;
}

/**
 * Хөтөлбөрийн харьцуулалт хийх
 */
export function comparePrograms(
  programName: string,
  universityIds: string[]
): UniversityComparison[] {
  const comparisons = universityComparisons[programName];
  if (!comparisons) return [];
  
  return comparisons.filter(c => universityIds.includes(c.universityId));
}

