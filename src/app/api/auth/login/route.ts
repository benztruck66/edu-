import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyPassword, generateToken } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * POST /api/auth/login
 * Хэрэглэгч нэвтрэх
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "И-мэйл болон нууц үг шаардлагатай" },
        { status: 400 }
      );
    }

    // Хэрэглэгч олох
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          name: true,
          email: true,
          password: true,
          role: true,
          phone: true,
        },
      })
    );

    if (!user) {
      return NextResponse.json(
        { error: "И-мэйл эсвэл нууц үг буруу байна" },
        { status: 401 }
      );
    }

    // Password verify хийх
    const isValidPassword = await verifyPassword(password, user.password);

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "И-мэйл эсвэл нууц үг буруу байна" },
        { status: 401 }
      );
    }

    // JWT token үүсгэх
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
      },
      token,
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Нэвтрэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

