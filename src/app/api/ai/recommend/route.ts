import { NextRequest, NextResponse } from "next/server";
import { mockUniversities } from "@/mock/data";

export async function POST(request: NextRequest) {
  try {
    const { preferences, careerGoal } = await request.json();

    if (!preferences) {
      return NextResponse.json({ error: "Invalid preferences" }, { status: 400 });
    }

    // AI-д суурилсан зөвлөмж
    const recommendations = generateRecommendations(preferences, careerGoal);

    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error("AI Recommend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function generateRecommendations(preferences: any, careerGoal: string = "general") {
  const programs = Array.from(new Set(mockUniversities.flatMap((u) => u.programs)));
  
  const scored = programs.map((program) => {
    let score = calculateProgramScore(program, preferences, careerGoal);
    
    // Их сургуулиудын дундаж зэрэглэл нэмэх
    const universitiesWithProgram = mockUniversities.filter((u) =>
      u.programs.includes(program)
    );
    const avgRank = universitiesWithProgram.length > 0
      ? universitiesWithProgram.reduce((sum, u) => sum + u.qsRank, 0) / universitiesWithProgram.length
      : 2000;
    
    // Зэрэглэл бага (сайн) бол score нэмэх
    const rankBonus = Math.max(0, (2000 - avgRank) / 100);
    score += rankBonus;

    return {
      program,
      score: Math.round(score),
      universities: universitiesWithProgram.map((u) => ({
        id: u.id,
        name: u.name,
        city: u.city,
        qsRank: u.qsRank,
        tuition: u.tuitionMntPerYear,
      })),
    };
  });

  return scored.sort((a, b) => b.score - a.score).slice(0, 10);
}

function calculateProgramScore(program: string, preferences: any, careerGoal: string): number {
  let score = 50; // Base score

  // Program category matching
  const programLower = program.toLowerCase();
  
  if (preferences.stem >= 3) {
    if (programLower.includes("компьютер") || programLower.includes("мт") || 
        programLower.includes("программ") || programLower.includes("инженер") ||
        programLower.includes("физик") || programLower.includes("математик")) {
      score += preferences.stem * 8;
    }
  }

  if (preferences.business >= 3) {
    if (programLower.includes("бизнес") || programLower.includes("менежмент") ||
        programLower.includes("санхүү") || programLower.includes("эдийн") ||
        programLower.includes("маркетинг") || programLower.includes("нягтлан")) {
      score += preferences.business * 8;
    }
  }

  if (preferences.medicine >= 3) {
    if (programLower.includes("анагаах") || programLower.includes("эм") ||
        programLower.includes("шүд") || programLower.includes("сувилахуй")) {
      score += preferences.medicine * 8;
    }
  }

  if (preferences.humanities >= 3) {
    if (programLower.includes("хууль") || programLower.includes("хүмүүнлэг") ||
        programLower.includes("урлаг") || programLower.includes("театр") ||
        programLower.includes("уран") || programLower.includes("журналист")) {
      score += preferences.humanities * 8;
    }
  }

  if (preferences.math >= 3) {
    if (programLower.includes("математик") || programLower.includes("санхүү") ||
        programLower.includes("эдийн") || programLower.includes("нягтлан")) {
      score += preferences.math * 5;
    }
  }

  if (preferences.practical >= 3) {
    if (programLower.includes("барилга") || programLower.includes("уул уурхай") ||
        programLower.includes("геологи") || programLower.includes("энергетик") ||
        programLower.includes("хөдөө") || programLower.includes("мал")) {
      score += preferences.practical * 6;
    }
  }

  if (preferences.creative >= 3) {
    if (programLower.includes("дизайн") || programLower.includes("урлаг") ||
        programLower.includes("уран") || programLower.includes("хөгжим")) {
      score += preferences.creative * 7;
    }
  }

  // Career goal matching
  switch (careerGoal) {
    case "research":
      if (programLower.includes("шинжлэх") || programLower.includes("физик") ||
          programLower.includes("математик") || programLower.includes("биологи")) {
        score += 10;
      }
      break;
    case "business":
      if (programLower.includes("бизнес") || programLower.includes("менежмент") ||
          programLower.includes("санхүү")) {
        score += 10;
      }
      break;
    case "technical":
      if (programLower.includes("инженер") || programLower.includes("технологи") ||
          programLower.includes("автомат")) {
        score += 10;
      }
      break;
    case "medical":
      if (programLower.includes("анагаах") || programLower.includes("эм")) {
        score += 10;
      }
      break;
    case "creative":
      if (programLower.includes("урлаг") || programLower.includes("дизайн")) {
        score += 10;
      }
      break;
  }

  return Math.min(100, score);
}

