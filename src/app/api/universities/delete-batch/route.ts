import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/db-helpers";

/**
 * DELETE /api/universities/delete-batch
 * Олон сургууль устгах (admin only)
 */
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { ids } = body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "IDs шаардлагатай" },
        { status: 400 }
      );
    }

    // Сургуулиуд устгах
    const result = await withRetry(() =>
      prisma.university.deleteMany({
        where: {
          id: { in: ids },
        },
      })
    );

    return NextResponse.json({
      message: `${result.count} сургууль устгагдлаа`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error("Error deleting universities:", error);
    return NextResponse.json(
      { error: "Устгахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}

