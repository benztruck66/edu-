import { NextRequest, NextResponse } from "next/server";
import { mockUniversities } from "@/mock/data";

// AI чатботын систем prompt
const SYSTEM_PROMPT = `Та бол Монголын их дээд сургуулиудын мэдээлэл өгдөг AI туслах юм. Таны үүрэг:

1. Их сургуулиудын мэдээлэл өгөх
2. Хөтөлбөр сонголтод зөвлөмж өгөх
3. Элсэлтийн асуудлаар туслах
4. Тэтгэлэг, төлбөрийн мэдээлэл өгөх

Одоогийн их сургуулиудын мэдээлэл:
${mockUniversities.map(u => `- ${u.name} (${u.city}): ${u.programs.join(", ")}`).join("\n")}

Хариултаа богино, тодорхой, монгол хэлээр бичнэ үү.`;

// Rate limiting configuration (in-memory, for production use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10;

// Input validation and sanitization
function validateAndSanitizeMessage(message: unknown): string | null {
  if (!message || typeof message !== "string") {
    return null;
  }

  // Trim and limit length
  const sanitized = message.trim();
  
  if (sanitized.length === 0 || sanitized.length > 500) {
    return null;
  }

  // Remove potentially harmful characters
  const cleaned = sanitized.replace(/[<>]/g, "");
  
  return cleaned;
}

// Rate limiting check
function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const userLimit = rateLimitMap.get(identifier);

  if (!userLimit || now > userLimit.resetTime) {
    rateLimitMap.set(identifier, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW_MS,
    });
    return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - 1 };
  }

  if (userLimit.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remaining: 0 };
  }

  userLimit.count++;
  return { allowed: true, remaining: MAX_REQUESTS_PER_WINDOW - userLimit.count };
}

export async function POST(request: NextRequest) {
  try {
    // Get client identifier (IP address or user ID)
    const clientIp = request.headers.get("x-forwarded-for") || 
                     request.headers.get("x-real-ip") || 
                     "unknown";

    // Rate limiting
    const { allowed, remaining } = checkRateLimit(clientIp);
    
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { 
          status: 429,
          headers: {
            "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
            "X-RateLimit-Remaining": "0",
            "Retry-After": "60",
          }
        }
      );
    }

    // Parse and validate request body
    const body = await request.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { error: "Invalid JSON body" },
        { status: 400 }
      );
    }

    const { message } = body;

    // Validate and sanitize message
    const sanitizedMessage = validateAndSanitizeMessage(message);
    
    if (!sanitizedMessage) {
      return NextResponse.json(
        { error: "Invalid message. Message must be between 1-500 characters." },
        { status: 400 }
      );
    }

    // Generate AI response
    const response = await generateAIResponse(sanitizedMessage);

    // Return response with rate limit headers
    return NextResponse.json(
      { response },
      {
        headers: {
          "X-RateLimit-Limit": MAX_REQUESTS_PER_WINDOW.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        }
      }
    );
  } catch (error) {
    console.error("AI Chat error:", error);
    
    // Don't expose internal error details to client
    return NextResponse.json(
      { error: "An error occurred while processing your request" },
      { status: 500 }
    );
  }
}

async function generateAIResponse(userMessage: string): Promise<string> {
  try {
    const lowerMessage = userMessage.toLowerCase();
    const originalMessage = userMessage;

    // Их сургууль хайх
    if (lowerMessage.includes("сургууль") || lowerMessage.includes("университет") || lowerMessage.includes("их")) {
      const universities = mockUniversities
        .filter((u) => {
          const nameLower = u.name.toLowerCase();
          const cityLower = u.city.toLowerCase();
          const programsLower = u.programs.map(p => p.toLowerCase());
          
          return nameLower.includes(lowerMessage) ||
                 cityLower.includes(lowerMessage) ||
                 lowerMessage.split(" ").some(word => 
                   nameLower.includes(word) || 
                   cityLower.includes(word) ||
                   programsLower.some(p => p.includes(word))
                 );
        })
        .slice(0, 3);

      if (universities.length > 0) {
        const response = universities.map(u => {
          const parts = [
            `**${u.name}** (${u.city})`,
            `Хөтөлбөрүүд: ${u.programs.slice(0, 5).join(", ")}${u.programs.length > 5 ? "..." : ""}`,
          ];
          
          if (u.qsRank) parts.push(`QS Rank: ${u.qsRank}`);
          if (u.tuitionMntPerYear) {
            parts.push(`Төлбөр: ${(u.tuitionMntPerYear / 1000000).toFixed(1)}М₮/жил`);
          }
          if (u.website) parts.push(`Веб: ${u.website}`);
          
          return parts.join("\n");
        }).join("\n\n---\n\n");
        
        return `${universities.length === 1 ? "Танд тохирох сургууль:" : `${universities.length} сургууль олдлоо:`}\n\n${response}`;
      } else {
        return `Уучлаарай, "${originalMessage}" гэсэн хайлтаар сургууль олдсонгүй. Та өөр утгаар хайж үзнэ үү?\n\nЖишээ: "Компьютер хөтөлбөртэй их сургуулиуд" эсвэл "Улаанбаатар дахь их сургуулиуд"`;
      }
    }

    // Хөтөлбөр сонголт
    if (lowerMessage.includes("хөтөлбөр") || lowerMessage.includes("мэргэжил") || lowerMessage.includes("сонгох") || lowerMessage.includes("сонирхол")) {
      return `Хөтөлбөр сонгохдоо дараах зүйлсийг анхаарна уу:

1. **Өөрийн сонирхол** - Юу сонирхож байна вэ?
2. **Карьерын зорилго** - Ирээдүйд юу хийх вэ?
3. **Чадвар ба авъяас** - Таны хүч чадал
4. **Ажлын байрны боломж** - Хөдөлмөрийн зах зээл
5. **Орлого** - Ямар орлого хүлээж байна вэ?

Манай системд **/guidance** хуудас дээр танд тохирох хөтөлбөрийг олох интерактив зөвлөгөө байна.`;
    }

    // Тэтгэлэг
    if (lowerMessage.includes("тэтгэлэг") || lowerMessage.includes("scholarship") || lowerMessage.includes("санхүүжилт")) {
      const allScholarships = mockUniversities.flatMap(u => 
        (u.scholarships || []).map(s => ({ university: u.name, ...s }))
      );
      
      if (allScholarships.length > 0) {
        const topScholarships = allScholarships.slice(0, 5);
        return `Тэтгэлэгийн мэдээлэл (${topScholarships.length}/${allScholarships.length}):\n\n` +
          topScholarships.map(s => {
            const parts = [
              `**${s.name}** - ${s.university}`,
              `Төрөл: ${s.type}`,
            ];
            if (s.amountMnt) {
              parts.push(`Хэмжээ: ${(s.amountMnt / 1000000).toFixed(1)}М₮`);
            }
            parts.push(`Тайлбар: ${s.description}`);
            return parts.join("\n");
          }).join("\n\n---\n\n");
      } else {
        return `Одоогоор тэтгэлэгийн мэдээлэл байхгүй байна. Дэлгэрэнгүй мэдээллийг их сургуулиудын вэбсайтаас үзнэ үү.`;
      }
    }

    // Зэрэглэл
    if (lowerMessage.includes("зэрэглэл") || lowerMessage.includes("ranking") || lowerMessage.includes("qs") || lowerMessage.includes("шилдэг")) {
      const topUniversities = mockUniversities
        .filter(u => u.qsRank)
        .sort((a, b) => (a.qsRank || Infinity) - (b.qsRank || Infinity))
        .slice(0, 5);
      
      if (topUniversities.length > 0) {
        return `Монголын шилдэг их сургуулиуд (QS зэрэглэлээр):\n\n` +
          topUniversities.map((u, idx) => 
            `${idx + 1}. **${u.name}**\n` +
            `   QS Rank: ${u.qsRank}\n` +
            `   Хот: ${u.city}`
          ).join("\n\n") +
          `\n\nДэлгэрэнгүйг **/rankings** хуудаснаас үзнэ үү.`;
      }
    }

    // Элсэлт
    if (lowerMessage.includes("элсэлт") || lowerMessage.includes("бүртгэл") || lowerMessage.includes("хэрхэн элсэх")) {
      return `Их сургуульд элсэхийн тулд:

1. **ЭЕШ өгөх** - Элсэлтийн ерөнхий шалгалт
2. **Бүртгэл** - Сургуулийн вэбсайт дээр бүртгүүлэх
3. **Материал бэлтгэх** - Дипломын хуулбар, зураг гэх мэт
4. **Төлбөр төлөх** - Элсэлтийн төлбөр

Дэлгэрэнгүй мэдээллийг тухайн их сургуулийн вэбсайтаас үзнэ үү.`;
    }

    // Ерөнхий хариулт
    return `Таны асуултыг ойлголоо. Манай системд дараах боломжууд байна:

- **Их сургуулиуд** (/universities) - Бүх их сургуулиудын мэдээлэл
- **Хөтөлбөрүүд** (/programs) - Бүх хөтөлбөрүүд
- **Зөвлөмж** (/guidance) - Танд тохирох хөтөлбөр олох
- **Зэрэглэл** (/rankings) - QS зэрэглэл
- **Харьцуулах** (/compare) - Их сургуулиудыг харьцуулах

Илүү нарийн мэдээлэл авахыг хүсвэл тодорхой асуулт асууна уу. 

**Жишээ асуултууд:**
- "Компьютер хөтөлбөртэй их сургуулиуд юу вэ?"
- "МУИС-ийн мэдээлэл"
- "Тэтгэлэгийн мэдээлэл"
- "Улаанбаатар дахь их сургуулиуд"`;
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "Уучлаарай, хариулт үүсгэхэд алдаа гарлаа. Та өөр утгаар оролдоно уу.";
  }
}

