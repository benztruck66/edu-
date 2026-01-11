import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/db-helpers";

// POST - Сэтгэгдэлд "Тустай" гэж үнэлэх
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonial = await withRetry(() =>
      prisma.testimonial.update({
        where: { id },
        data: {
          helpfulCount: {
            increment: 1,
          },
        },
      })
    );

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error("Error incrementing helpful count:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to increment helpful count" },
      { status: 500 }
    );
  }
}








