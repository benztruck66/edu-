import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Бүх сэтгэгдлүүдийг авах
export async function GET(request: NextRequest) {
  try {
    // Prisma client-д testimonial байгаа эсэхийг шалгах
    if (!prisma || typeof prisma.testimonial === 'undefined') {
      console.error("Prisma testimonial model not found. Please run: npx prisma generate");
      return NextResponse.json(
        { 
          error: "Testimonial model not available",
          hint: "Please run 'npx prisma generate' and restart the dev server"
        },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const isApproved = searchParams.get("isApproved");
    const isActive = searchParams.get("isActive");
    const rating = searchParams.get("rating");
    const limit = searchParams.get("limit");

    const where: any = {};
    if (isApproved !== null) {
      where.isApproved = isApproved === "true";
    }
    if (isActive !== null) {
      where.isActive = isActive === "true";
    }
    if (rating) {
      where.rating = parseInt(rating);
    }

    const testimonials = await withRetry(() =>
      prisma.testimonial.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        take: limit ? parseInt(limit) : undefined,
      })
    );

    return NextResponse.json({ testimonials });
  } catch (error: any) {
    console.error("Error fetching testimonials:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    
    // Prisma client алдаа эсэхийг шалгах
    if (error.message?.includes("testimonial") || error.message?.includes("Cannot read properties")) {
      return NextResponse.json(
        { 
          error: "Prisma client not generated",
          hint: "Please stop the dev server, run 'npx prisma generate', then restart the dev server"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to fetch testimonials"
      },
      { status: 500 }
    );
  }
}

// POST - Шинэ сэтгэгдэл үлдээх
export async function POST(request: NextRequest) {
  try {
    // Prisma client-д testimonial байгаа эсэхийг шалгах
    if (!prisma || typeof prisma.testimonial === 'undefined') {
      console.error("Prisma testimonial model not found. Please run: npx prisma generate");
      return NextResponse.json(
        { 
          error: "Testimonial model not available",
          hint: "Please run 'npx prisma generate' and restart the dev server"
        },
        { status: 500 }
      );
    }

    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const body = await request.json();
    const { rating, text, university, program, year } = body;

    if (!rating || !text) {
      return NextResponse.json(
        { error: "rating and text are required" },
        { status: 400 }
      );
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const testimonial = await withRetry(() =>
      prisma.testimonial.create({
        data: {
          userId: payload.userId,
          rating: parseInt(rating),
          text,
          university: university || null,
          program: program || null,
          year: year || null,
          isApproved: true, // Бүртгүүлсэн хэрэглэгч шууд үлдээж болно
          isActive: true,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })
    );

    return NextResponse.json({ testimonial }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating testimonial:", error);
    console.error("Error details:", {
      message: error.message,
      code: error.code,
      name: error.name,
      stack: error.stack,
    });
    
    // Prisma client алдаа эсэхийг шалгах
    if (error.message?.includes("testimonial") || error.message?.includes("Cannot read properties")) {
      return NextResponse.json(
        { 
          error: "Prisma client not generated",
          hint: "Please stop the dev server, run 'npx prisma generate', then restart the dev server"
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { 
        error: error.message || "Failed to create testimonial"
      },
      { status: 500 }
    );
  }
}

