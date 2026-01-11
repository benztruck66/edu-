import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest, verifyToken } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Нэг сэтгэгдлийн мэдээлэл авах
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const testimonial = await withRetry(() =>
      prisma.testimonial.findUnique({
        where: { id },
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

    if (!testimonial) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error("Error fetching testimonial:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch testimonial" },
      { status: 500 }
    );
  }
}

// PATCH - Сэтгэгдэл засах (зөвхөн өөрийн сэтгэгдэл эсвэл админ)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Сэтгэгдлийг олох
    const existing = await withRetry(() =>
      prisma.testimonial.findUnique({
        where: { id },
      })
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Зөвхөн өөрийн сэтгэгдэл эсвэл админ засах боломжтой
    if (existing.userId !== payload.userId && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { rating, text, university, program, year, isApproved, isActive } = body;

    const updateData: any = {};
    if (rating !== undefined) updateData.rating = parseInt(rating);
    if (text !== undefined) updateData.text = text;
    if (university !== undefined) updateData.university = university;
    if (program !== undefined) updateData.program = program;
    if (year !== undefined) updateData.year = year;
    // Зөвхөн админ isApproved, isActive засах боломжтой
    if (payload.role === "SUPER_ADMIN") {
      if (isApproved !== undefined) updateData.isApproved = isApproved;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    const testimonial = await withRetry(() =>
      prisma.testimonial.update({
        where: { id },
        data: updateData,
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

    return NextResponse.json({ testimonial });
  } catch (error: any) {
    console.error("Error updating testimonial:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update testimonial" },
      { status: 500 }
    );
  }
}

// DELETE - Сэтгэгдэл устгах
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const { id } = await params;

    const existing = await withRetry(() =>
      prisma.testimonial.findUnique({
        where: { id },
      })
    );

    if (!existing) {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }

    // Зөвхөн өөрийн сэтгэгдэл эсвэл админ устгах боломжтой
    if (existing.userId !== payload.userId && payload.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await withRetry(() =>
      prisma.testimonial.delete({
        where: { id },
      })
    );

    return NextResponse.json({ message: "Testimonial deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting testimonial:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Testimonial not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete testimonial" },
      { status: 500 }
    );
  }
}








