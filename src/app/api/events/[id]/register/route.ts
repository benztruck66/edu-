import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * POST /api/events/[id]/register
 * Үйл явдалд бүртгүүлэх
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication шалгах
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json(
        { error: "Нэвтрэх шаардлагатай" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json(
        { error: "Token хүчингүй" },
        { status: 401 }
      );
    }

    const { id: eventId } = await params;

    // Event ID validation
    if (!eventId) {
      return NextResponse.json(
        { error: "Үйл явдлын ID шаардлагатай" },
        { status: 400 }
      );
    }

    // Prisma client-д event model байгаа эсэхийг шалгах
    if (!prisma.event) {
      console.error("Event model not found in Prisma client. Please run: npm run db:generate && npm run db:push");
      return NextResponse.json(
        { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
        { status: 500 }
      );
    }

    // Үйл явдал олох
    let event;
    try {
      event = await withRetry(() =>
        prisma.event.findUnique({
          where: { id: eventId },
          include: {
            registrations: true,
          },
        })
      );
    } catch (dbError: any) {
      console.error("Database error:", dbError);
      // Model байхгүй эсэхийг шалгах
      if (dbError.message?.includes("event") || dbError.message?.includes("model") || dbError.message?.includes("Unknown arg") || dbError.message?.includes("undefined")) {
        return NextResponse.json(
          { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
          { status: 500 }
        );
      }
      throw dbError;
    }

    if (!event) {
      return NextResponse.json(
        { error: "Үйл явдал олдсонгүй" },
        { status: 404 }
      );
    }

    if (!event.isActive) {
      return NextResponse.json(
        { error: "Энэ үйл явдал идэвхгүй байна" },
        { status: 400 }
      );
    }

    // Бүртгэл дүүрсэн эсэхийг шалгах
    const registeredCount = event.registrations.length;
    if (registeredCount >= event.spots) {
      return NextResponse.json(
        { error: "Энэ үйл явдал дүүрсэн байна" },
        { status: 400 }
      );
    }

    // Prisma client-д eventRegistration model байгаа эсэхийг шалгах
    if (!prisma.eventRegistration) {
      console.error("EventRegistration model not found in Prisma client. Please run: npm run db:generate && npm run db:push");
      return NextResponse.json(
        { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
        { status: 500 }
      );
    }

    // Хэрэглэгч аль хэдийн бүртгүүлсэн эсэхийг шалгах
    let existingRegistration;
    try {
      existingRegistration = await withRetry(() =>
        prisma.eventRegistration.findUnique({
          where: {
            userId_eventId: {
              userId: payload.userId,
              eventId: eventId,
            },
          },
        })
      );
    } catch (dbError: any) {
      console.error("Database error checking registration:", dbError);
      if (dbError.message?.includes("eventRegistration") || dbError.message?.includes("model") || dbError.message?.includes("undefined")) {
        return NextResponse.json(
          { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
          { status: 500 }
        );
      }
      throw dbError;
    }

    if (existingRegistration) {
      return NextResponse.json(
        { error: "Та энэ үйл явдалд аль хэдийн бүртгүүлсэн байна" },
        { status: 400 }
      );
    }

    // Бүртгэл үүсгэх
    let registration;
    try {
      registration = await withRetry(() =>
        prisma.eventRegistration.create({
          data: {
            userId: payload.userId,
            eventId: eventId,
          },
          include: {
            event: {
              select: {
                title: true,
              },
            },
          },
        })
      );
    } catch (dbError: any) {
      console.error("Database error creating registration:", dbError);
      if (dbError.message?.includes("eventRegistration") || dbError.message?.includes("model") || dbError.message?.includes("undefined")) {
        return NextResponse.json(
          { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
          { status: 500 }
        );
      }
      throw dbError;
    }

    return NextResponse.json(
      {
        message: "Амжилттай бүртгүүллээ",
        registration,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error registering for event:", error);

    // Prisma model байхгүй эсэхийг шалгах
    if (error.message?.includes("event") || error.message?.includes("model") || error.message?.includes("EventRegistration")) {
      console.error("Database schema not updated. Please run: npm run db:push");
      return NextResponse.json(
        { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
        { status: 500 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Та энэ үйл явдалд аль хэдийн бүртгүүлсэн байна" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Бүртгүүлэхэд алдаа гарлаа: ${error.message || "Тодорхойгүй алдаа"}` },
      { status: 500 }
    );
  }
}

