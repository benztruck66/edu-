import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/auth/me
 * Одоогийн хэрэглэгчийн мэдээлэл авах
 */
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);

    if (!token) {
      return NextResponse.json(
        { error: "Token байхгүй байна" },
        { status: 401 }
      );
    }

    const payload = verifyToken(token);

    if (!payload) {
      return NextResponse.json(
        { error: "Token хүчингүй байна" },
        { status: 401 }
      );
    }

    // Хэрэглэгч олох
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          favorites: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { error: "Хэрэглэгч олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user error:", error);
    return NextResponse.json(
      { error: "Мэдээлэл авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

