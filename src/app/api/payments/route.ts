import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Бүх төлбөрийн мэдээллийг авах
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");
    const program = searchParams.get("program");
    const isActive = searchParams.get("isActive");

    const where: any = {};
    if (universityId) {
      where.universityId = universityId;
    }
    if (program) {
      where.program = program;
    }
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }

    const payments = await withRetry(() =>
      prisma.payment.findMany({
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

    return NextResponse.json({ payments });
  } catch (error: any) {
    console.error("Error fetching payments:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payments" },
      { status: 500 }
    );
  }
}

// POST - Шинэ төлбөрийн мэдээлэл үүсгэх
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      universityId,
      program,
      tuitionMnt,
      period,
      additionalFees,
      academicYear,
      isActive = true,
    } = body;

    if (!universityId || !program || !tuitionMnt || !period) {
      return NextResponse.json(
        { error: "universityId, program, tuitionMnt, period are required" },
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

    const payment = await withRetry(() =>
      prisma.payment.create({
        data: {
          universityId,
          program,
          tuitionMnt: parseInt(tuitionMnt),
          period,
          additionalFees: additionalFees || null,
          academicYear: academicYear || null,
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

    return NextResponse.json({ payment }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 }
    );
  }
}

