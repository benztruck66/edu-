import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Бүх тэтгэлгүүдийг авах
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (universityId) {
      where.universityId = universityId;
    }
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const scholarships = await withRetry(() =>
      prisma.scholarship.findMany({
        where,
        include: {
          university: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return NextResponse.json({ scholarships });
  } catch (error: any) {
    console.error("Error fetching scholarships:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch scholarships" },
      { status: 500 }
    );
  }
}

// POST - Шинэ тэтгэлэг үүсгэх
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      universityId,
      name,
      type,
      amountMnt,
      description,
      requirements,
      deadline,
      isActive = true,
    } = body;

    if (!universityId || !name || !type || !description) {
      return NextResponse.json(
        { error: "universityId, name, type, description are required" },
        { status: 400 }
      );
    }

    // Сургууль байгаа эсэхийг шалгах
    const university = await withRetry(() =>
      prisma.university.findUnique({
        where: { id: universityId },
      })
    );

    if (!university) {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    const scholarship = await withRetry(() =>
      prisma.scholarship.create({
        data: {
          universityId,
          name,
          type,
          amountMnt: amountMnt ? parseInt(amountMnt) : null,
          description,
          requirements: requirements || [],
          deadline: deadline ? new Date(deadline) : null,
          isActive,
        },
        include: {
          university: {
            select: {
              id: true,
              name: true,
              city: true,
            },
          },
        },
      })
    );

    return NextResponse.json({ scholarship }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating scholarship:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create scholarship" },
      { status: 500 }
    );
  }
}








