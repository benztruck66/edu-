import { NextRequest, NextResponse } from "next/server";
import { mockUniversities } from "@/mock/data";

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Invalid query" }, { status: 400 });
    }

    // Ухаалаг хайлт - семантик хайлт болон keyword matching
    const results = performSmartSearch(query);

    return NextResponse.json({ results });
  } catch (error) {
    console.error("AI Search error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function performSmartSearch(query: string) {
  const lowerQuery = query.toLowerCase();
  const results: Array<{ type: "university" | "program"; id: string; name: string; score: number; match: string }> = [];

  // Их сургуулиуд хайх
  mockUniversities.forEach((u) => {
    let score = 0;
    let match = "";

    // Нэрээр хайх
    if (u.name.toLowerCase().includes(lowerQuery)) {
      score += 10;
      match = `Нэр: ${u.name}`;
    }

    // Хотод хайх
    if (u.city.toLowerCase().includes(lowerQuery)) {
      score += 5;
      match = `Хот: ${u.city}`;
    }

    // Хөтөлбөрөөр хайх
    u.programs.forEach((p) => {
      if (p.toLowerCase().includes(lowerQuery)) {
        score += 8;
        match = `Хөтөлбөр: ${p}`;
      }
    });

    // Тайлбар дээр хайх
    if (u.description?.toLowerCase().includes(lowerQuery)) {
      score += 3;
      match = match || `Тайлбар: ${u.description.substring(0, 50)}...`;
    }

    if (score > 0) {
      results.push({
        type: "university",
        id: u.id,
        name: u.name,
        score,
        match,
      });
    }
  });

  // Хөтөлбөрүүд хайх
  const allPrograms = Array.from(new Set(mockUniversities.flatMap((u) => u.programs)));
  allPrograms.forEach((program) => {
    if (program.toLowerCase().includes(lowerQuery)) {
      const universitiesWithProgram = mockUniversities.filter((u) =>
        u.programs.includes(program)
      );

      results.push({
        type: "program",
        id: program,
        name: program,
        score: 7,
        match: `${universitiesWithProgram.length} их сургуульд байна`,
      });
    }
  });

  // Score-оор эрэмбэлэх
  return results.sort((a, b) => b.score - a.score).slice(0, 10);
}

