import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword, generateToken } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * POST /api/auth/register
 * Хэрэглэгч бүртгүүлэх
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, phone } = body;

    // Validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Нэр, и-мэйл, нууц үг шаардлагатай" },
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

    // Password strength шалгах
    if (password.length < 6) {
      return NextResponse.json(
        { error: "Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой" },
        { status: 400 }
      );
    }

    // Email аль хэдийн бүртгэлтэй эсэхийг шалгах
    const existingUser = await withRetry(() =>
      prisma.user.findUnique({
        where: { email },
      })
    );

    if (existingUser) {
      return NextResponse.json(
        { error: "Энэ и-мэйл аль хэдийн бүртгэлтэй байна" },
        { status: 409 }
      );
    }

    // Password hash хийх
    const hashedPassword = await hashPassword(password);

    // Хэрэглэгч үүсгэх
    const user = await withRetry(() =>
      prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          phone: phone || null,
          role: "USER",
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
        },
      })
    );

    // JWT token үүсгэх
    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
        },
        token,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Registration error:", error);

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Энэ и-мэйл аль хэдийн бүртгэлтэй байна" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Бүртгүүлэхэд алдаа гарлаа" },
      { status: 500 }
    );
  }
}

