import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/users
 * Бүх хэрэглэгчдийн жагсаалт авах (зөвхөн SUPER_ADMIN)
 */
export async function GET(request: NextRequest) {
  try {
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

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role");
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }
    if (role) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      withRetry(() =>
        prisma.user.findMany({
          where,
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
            createdAt: true,
          },
          orderBy: { createdAt: "desc" },
          skip: (page - 1) * pageSize,
          take: pageSize,
        })
      ),
      withRetry(() => prisma.user.count({ where })),
    ]);

    return NextResponse.json({
      users,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Хэрэглэгчдийн жагсаалт авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

