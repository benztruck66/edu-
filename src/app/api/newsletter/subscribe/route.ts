import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/db-helpers";

/**
 * POST /api/newsletter/subscribe
 * Newsletter-д бүртгүүлэх
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validation
    if (!email) {
      return NextResponse.json(
        { error: "И-мэйл хаяг шаардлагатай" },
        { status: 400 }
      );
    }

    // Email format шалгах
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "И-мэйл формат буруу байна" },
        { status: 400 }
      );
    }

    // Аль хэдийн бүртгэлтэй эсэхийг шалгах
    const existing = await withRetry(() =>
      prisma.newsletterSubscription.findUnique({
        where: { email },
      })
    );

    if (existing) {
      if (existing.isActive) {
        return NextResponse.json(
          { error: "Энэ и-мэйл аль хэдийн бүртгэлтэй байна" },
          { status: 400 }
        );
      } else {
        // Дахин идэвхжүүлэх
        const subscription = await withRetry(() =>
          prisma.newsletterSubscription.update({
            where: { email },
            data: {
              isActive: true,
              subscribedAt: new Date(),
              unsubscribedAt: null,
            },
          })
        );
        return NextResponse.json({
          message: "Амжилттай бүртгүүллээ",
          subscription,
        });
      }
    }

    // Шинэ бүртгэл үүсгэх
    const subscription = await withRetry(() =>
      prisma.newsletterSubscription.create({
        data: {
          email,
          isActive: true,
        },
      })
    );

    return NextResponse.json(
      {
        message: "Амжилттай бүртгүүллээ",
        subscription,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error subscribing to newsletter:", error);

    // Prisma model байхгүй эсэхийг шалгах
    if (error.message?.includes("newsletterSubscription") || error.message?.includes("model")) {
      console.error("Database schema not updated. Please run: npm run db:push");
      return NextResponse.json(
        { error: "Database schema шинэчлэгдээгүй байна. Админд мэдэгднэ үү." },
        { status: 500 }
      );
    }

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Энэ и-мэйл аль хэдийн бүртгэлтэй байна" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: `Бүртгүүлэхэд алдаа гарлаа: ${error.message || "Тодорхойгүй алдаа"}` },
      { status: 500 }
    );
  }
}

