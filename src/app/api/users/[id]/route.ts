import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/users/[id]
 * Нэг хэрэглэгчийн мэдээлэл авах
 */
export async function GET(
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

    // Зөвхөн SUPER_ADMIN эрхтэй хэрэглэгч
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true },
      })
    );

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const targetUser = await withRetry(() =>
      prisma.user.findUnique({
        where: { id },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ user: targetUser });
  } catch (error: any) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch user" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/users/[id]
 * Хэрэглэгчийн мэдээлэл засах
 */
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

    // Зөвхөн SUPER_ADMIN эрхтэй хэрэглэгч
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true },
      })
    );

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();

    const { name, email, phone, role } = body;

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (role !== undefined) updateData.role = role;

    const updatedUser = await withRetry(() =>
      prisma.user.update({
        where: { id },
        data: updateData,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      })
    );

    return NextResponse.json({ user: updatedUser });
  } catch (error: any) {
    console.error("Error updating user:", error);
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 409 }
      );
    }
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to update user" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/users/[id]
 * Хэрэглэгч устгах
 */
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

    // Зөвхөн SUPER_ADMIN эрхтэй хэрэглэгч
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true },
      })
    );

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Өөрийгөө устгахыг хориглох
    if (id === payload.userId) {
      return NextResponse.json(
        { error: "Та өөрийгөө устгах боломжгүй" },
        { status: 400 }
      );
    }

    // Хэрэглэгчийг олох
    const targetUser = await withRetry(() =>
      prisma.user.findUnique({
        where: { id },
        select: { id: true, role: true },
      })
    );

    if (!targetUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // SUPER_ADMIN-ийг устгахыг хориглох
    if (targetUser.role === "SUPER_ADMIN") {
      return NextResponse.json(
        { error: "SUPER_ADMIN хэрэглэгчийг устгах боломжгүй" },
        { status: 403 }
      );
    }

    // Хэрэглэгчийг устгах (cascade delete нь холбоосуудыг автоматаар устгана)
    await withRetry(() =>
      prisma.user.delete({
        where: { id },
      })
    );

    return NextResponse.json({ message: "User deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting user:", error);
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}








