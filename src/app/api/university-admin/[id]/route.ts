import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// Сургуулийн админы дэлгэрэнгүй
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await prisma.universityAdmin.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            phone: true,
          },
        },
        university: {
          select: {
            id: true,
            name: true,
            city: true,
            qsRank: true,
          },
        },
      },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "University admin not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Error fetching university admin:", error);
    return NextResponse.json(
      { error: "Failed to fetch university admin" },
      { status: 500 }
    );
  }
}

// Сургуулийн админы эрх засах
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      canEditInfo,
      canManageScholarships,
      canViewReports,
      isActive,
    } = body;

    const admin = await prisma.universityAdmin.update({
      where: { id },
      data: {
        ...(canEditInfo !== undefined && { canEditInfo }),
        ...(canManageScholarships !== undefined && { canManageScholarships }),
        ...(canViewReports !== undefined && { canViewReports }),
        ...(isActive !== undefined && { isActive }),
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
        university: {
          select: {
            id: true,
            name: true,
            city: true,
          },
        },
      },
    });

    return NextResponse.json({ admin });
  } catch (error) {
    console.error("Error updating university admin:", error);
    return NextResponse.json(
      { error: "Failed to update university admin" },
      { status: 500 }
    );
  }
}

// Сургуулийн админ эрх хязгаарлах/устгах
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await prisma.universityAdmin.findUnique({
      where: { id },
    });

    if (!admin) {
      return NextResponse.json(
        { error: "University admin not found" },
        { status: 404 }
      );
    }

    // Эрхийг идэвхгүй болгох (устгах биш)
    await prisma.universityAdmin.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    // Хэрэв энэ хэрэглэгчид өөр сургуулийн эрх байхгүй бол эрхийг USER болгох
    const otherAdmins = await prisma.universityAdmin.findFirst({
      where: {
        userId: admin.userId,
        isActive: true,
      },
    });

    if (!otherAdmins) {
      await prisma.user.update({
        where: { id: admin.userId },
        data: {
          role: "USER",
        },
      });
    }

    return NextResponse.json({
      message: "University admin access revoked successfully",
    });
  } catch (error) {
    console.error("Error revoking university admin:", error);
    return NextResponse.json(
      { error: "Failed to revoke university admin access" },
      { status: 500 }
    );
  }
}



