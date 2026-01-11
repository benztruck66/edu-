import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Нэг төлбөрийн мэдээлэл авах
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

    const payment = await withRetry(() =>
      prisma.payment.findUnique({
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

    if (!payment) {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ payment });
  } catch (error: any) {
    console.error("Error fetching payment:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment" },
      { status: 500 }
    );
  }
}

// PATCH - Төлбөрийн мэдээлэл засах
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
      program,
      tuitionMnt,
      period,
      additionalFees,
      academicYear,
      isActive,
    } = body;

    const updateData: any = {};
    if (program !== undefined) updateData.program = program;
    if (tuitionMnt !== undefined) updateData.tuitionMnt = parseInt(tuitionMnt);
    if (period !== undefined) updateData.period = period;
    if (additionalFees !== undefined) updateData.additionalFees = additionalFees;
    if (academicYear !== undefined) updateData.academicYear = academicYear;
    if (isActive !== undefined) updateData.isActive = isActive;

    const payment = await withRetry(() =>
      prisma.payment.update({
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

    return NextResponse.json({ payment });
  } catch (error: any) {
    console.error("Error updating payment:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update payment" },
      { status: 500 }
    );
  }
}

// DELETE - Төлбөрийн мэдээлэл устгах
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
      prisma.payment.delete({
        where: { id },
      })
    );

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting payment:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Payment not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete payment" },
      { status: 500 }
    );
  }
}








