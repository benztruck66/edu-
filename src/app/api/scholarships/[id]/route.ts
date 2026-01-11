import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Нэг тэтгэлгийн мэдээлэл авах
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const scholarship = await withRetry(() =>
      prisma.scholarship.findUnique({
        where: { id },
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

    if (!scholarship) {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ scholarship });
  } catch (error: any) {
    console.error("Error fetching scholarship:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch scholarship" },
      { status: 500 }
    );
  }
}

// PATCH - Тэтгэлэг засах
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    const {
      name,
      type,
      amountMnt,
      description,
      requirements,
      deadline,
      isActive,
    } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (type !== undefined) updateData.type = type;
    if (amountMnt !== undefined) updateData.amountMnt = amountMnt ? parseInt(amountMnt) : null;
    if (description !== undefined) updateData.description = description;
    if (requirements !== undefined) updateData.requirements = requirements;
    if (deadline !== undefined) updateData.deadline = deadline ? new Date(deadline) : null;
    if (isActive !== undefined) updateData.isActive = isActive;

    const scholarship = await withRetry(() =>
      prisma.scholarship.update({
        where: { id },
        data: updateData,
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

    return NextResponse.json({ scholarship });
  } catch (error: any) {
    console.error("Error updating scholarship:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update scholarship" },
      { status: 500 }
    );
  }
}

// DELETE - Тэтгэлэг устгах
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await withRetry(() =>
      prisma.scholarship.delete({
        where: { id },
      })
    );

    return NextResponse.json({ message: "Scholarship deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting scholarship:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Scholarship not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete scholarship" },
      { status: 500 }
    );
  }
}








