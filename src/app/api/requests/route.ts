import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Бүх хүсэлтүүдийг авах
export async function GET(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");
    const type = searchParams.get("type");

    const where: any = {};
    if (userId) {
      where.userId = userId;
    }
    if (status) {
      where.status = status;
    }
    if (type) {
      where.type = type;
    }

    const requests = await withRetry(() =>
      prisma.request.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return NextResponse.json({ requests });
  } catch (error: any) {
    console.error("Error fetching requests:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch requests" },
      { status: 500 }
    );
  }
}

// POST - Шинэ хүсэлт үүсгэх
export async function POST(request: NextRequest) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      userId,
      type,
      subject,
      message,
      metadata,
    } = body;

    if (!userId || !type || !subject || !message) {
      return NextResponse.json(
        { error: "userId, type, subject, message are required" },
        { status: 400 }
      );
    }

    // Хэрэглэгч байгаа эсэхийг шалгах
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: userId },
      })
    );

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    const request = await withRetry(() =>
      prisma.request.create({
        data: {
          userId,
          type,
          subject,
          message,
          metadata: metadata || null,
          status: "PENDING",
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      })
    );

    return NextResponse.json({ request }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create request" },
      { status: 500 }
    );
  }
}








