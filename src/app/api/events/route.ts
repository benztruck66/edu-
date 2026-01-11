import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/events
 * Бүх үйл явдлуудын жагсаалт авах
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const onlineOnly = searchParams.get("onlineOnly") === "true";
    const isActive = searchParams.get("isActive") !== "false"; // Default: true

    const where: any = {};
    
    if (type && type !== "Бүгд") {
      // EventType enum-тай тааруулах
      const typeMap: Record<string, string> = {
        "Үзэсгэлэн": "EXHIBITION",
        "Вебинар": "WEBINAR",
        "Сургалт": "TRAINING",
        "Курс": "COURSE",
        "Танилцуулга": "INTRODUCTION",
      };
      where.type = typeMap[type] || type;
    }
    
    if (onlineOnly) {
      where.online = true;
    }
    
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    let events;
    try {
      events = await withRetry(() =>
        prisma.event.findMany({
          where,
          include: {
            registrations: {
              select: {
                id: true,
              },
            },
          },
          orderBy: {
            date: "asc",
          },
        })
      );
    } catch (dbError: any) {
      console.error("Database error fetching events:", dbError);
      // Model байхгүй эсэхийг шалгах
      if (dbError.message?.includes("event") || dbError.message?.includes("model") || dbError.message?.includes("Unknown arg") || !prisma.event) {
        console.error("Event model not found. Please run: npm run db:generate && npm run db:push");
        // Model байхгүй бол хоосон array буцаах
        return NextResponse.json({ events: [] });
      }
      throw dbError;
    }

    // registered тоог тооцоолох
    const eventsWithCount = events.map(event => ({
      ...event,
      registered: event.registrations.length,
    }));

    return NextResponse.json({ events: eventsWithCount });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Үйл явдлуудыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/events
 * Шинэ үйл явдал нэмэх (SUPER_ADMIN only)
 */
export async function POST(request: NextRequest) {
  try {
    // Authentication шалгах
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Token байхгүй" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token хүчингүй" }, { status: 401 });
    }

    // Зөвхөн SUPER_ADMIN эрхтэй хэрэглэгч
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true },
      })
    );

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Эрх хүрэхгүй" }, { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      date,
      time,
      location,
      type,
      icon,
      description,
      spots,
      online,
    } = body;

    // Validation
    if (!title || !date || !location || !type || !description || !spots) {
      return NextResponse.json(
        { error: "Бүх шаардлагатай талбаруудыг оруулна уу" },
        { status: 400 }
      );
    }

    // EventType enum-тай тааруулах
    const typeMap: Record<string, string> = {
      "Үзэсгэлэн": "EXHIBITION",
      "Вебинар": "WEBINAR",
      "Сургалт": "TRAINING",
      "Курс": "COURSE",
      "Танилцуулга": "INTRODUCTION",
    };

    const eventType = typeMap[type] || type;

    let event;
    try {
      event = await withRetry(() =>
        prisma.event.create({
          data: {
            title,
            date: new Date(date),
            time: time || null,
            location,
            type: eventType as any,
            icon: icon || null,
            description,
            spots: parseInt(spots),
            online: online || false,
            registered: 0,
          },
        })
      );
    } catch (dbError: any) {
      console.error("Database error creating event:", dbError);
      if (dbError.message?.includes("event") || dbError.message?.includes("model") || !prisma.event) {
        return NextResponse.json(
          { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
          { status: 500 }
        );
      }
      throw dbError;
    }

    return NextResponse.json({ event }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Үйл явдал үүсгэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

