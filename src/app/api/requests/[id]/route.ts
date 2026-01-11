import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// GET - Нэг хүсэлтийн мэдээлэл авах
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

    const request = await withRetry(() =>
      prisma.request.findUnique({
        where: { id },
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

    if (!request) {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ request });
  } catch (error: any) {
    console.error("Error fetching request:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch request" },
      { status: 500 }
    );
  }
}

// PATCH - Хүсэлт засах
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
      type,
      subject,
      message,
      status,
      metadata,
      adminNotes,
    } = body;

    const updateData: any = {};
    if (type !== undefined) updateData.type = type;
    if (subject !== undefined) updateData.subject = subject;
    if (message !== undefined) updateData.message = message;
    if (status !== undefined) updateData.status = status;
    if (metadata !== undefined) updateData.metadata = metadata;
    if (adminNotes !== undefined) updateData.adminNotes = adminNotes;

    const updatedRequest = await withRetry(() =>
      prisma.request.update({
        where: { id },
        data: updateData,
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

    return NextResponse.json({ request: updatedRequest });
  } catch (error: any) {
    console.error("Error updating request:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update request" },
      { status: 500 }
    );
  }
}

// DELETE - Хүсэлт устгах
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
      prisma.request.delete({
        where: { id },
      })
    );

    return NextResponse.json({ message: "Request deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting request:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "Request not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete request" },
      { status: 500 }
    );
  }
}

