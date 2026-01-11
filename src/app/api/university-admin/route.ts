import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// Сургуулийн админуудын жагсаалт
export async function GET(request: NextRequest) {
  try {
    // Authentication шалгах
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

    const { searchParams } = new URL(request.url);
    const universityId = searchParams.get("universityId");
    const userId = searchParams.get("userId");
    const isActive = searchParams.get("isActive") !== "false";

    const where: any = {};
    if (universityId) where.universityId = universityId;
    if (userId) where.userId = userId;
    if (isActive) where.isActive = true;

    const admins = await withRetry(() =>
      prisma.universityAdmin.findMany({
        where,
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
              logo: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    );

    return NextResponse.json({ admins });
  } catch (error) {
    console.error("Error fetching university admins:", error);
    return NextResponse.json(
      { error: "Failed to fetch university admins" },
      { status: 500 }
    );
  }
}

// Сургуулийн админ эрх олгох
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log("POST /api/university-admin - Request body:", body);
    
    const {
      userId,
      universityId,
      canEditInfo = true,
      canManageScholarships = true,
      canViewReports = true,
    } = body;

    // Validation
    if (!userId || !universityId) {
      console.error("Missing required fields:", { userId, universityId });
      return NextResponse.json(
        { error: "Missing required fields: userId and universityId" },
        { status: 400 }
      );
    }

    // Хэрэглэгч байгаа эсэхийг шалгах
    console.log("Checking user with ID:", userId);
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      console.error("User not found with ID:", userId);
      return NextResponse.json(
        { error: `User not found with ID: ${userId}` },
        { status: 404 }
      );
    }
    console.log("User found:", { id: user.id, name: user.name, email: user.email });

    // Сургууль байгаа эсэхийг шалгах
    console.log("Checking university with ID:", universityId);
    const university = await prisma.university.findUnique({
      where: { id: universityId },
    });

    if (!university) {
      console.error("University not found with ID:", universityId);
      return NextResponse.json(
        { error: `University not found with ID: ${universityId}` },
        { status: 404 }
      );
    }
    console.log("University found:", { id: university.id, name: university.name });

    // Хэрэв аль хэдийн эрх байгаа бол засах
    console.log("Checking for existing admin with:", { userId, universityId });
    let existingAdmin;
    try {
      existingAdmin = await prisma.universityAdmin.findUnique({
        where: {
          userId_universityId: {
            userId,
            universityId,
          },
        },
      });
      console.log("Existing admin check result:", existingAdmin ? "Found" : "Not found");
    } catch (findError: any) {
      console.error("Error checking for existing admin:", findError);
      // Continue - maybe the unique constraint doesn't exist yet
      existingAdmin = null;
    }

    let admin;
    if (existingAdmin) {
      console.log("Existing admin found, updating...");
      // Засах
      admin = await prisma.universityAdmin.update({
        where: { id: existingAdmin.id },
        data: {
          canEditInfo,
          canManageScholarships,
          canViewReports,
          isActive: true,
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
    } else {
      console.log("Creating new admin...");
      console.log("Admin data:", {
        userId,
        universityId,
        canEditInfo,
        canManageScholarships,
        canViewReports,
        isActive: true,
      });
      
      // Шинээр нэмэх
      try {
        admin = await prisma.universityAdmin.create({
        data: {
          userId,
          universityId,
          canEditInfo,
          canManageScholarships,
          canViewReports,
          isActive: true,
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
        console.log("Admin created successfully:", admin);

        // Хэрэглэгчийн эрхийг шинэчлэх
        console.log("Updating user role to UNIVERSITY_ADMIN...");
        await prisma.user.update({
          where: { id: userId },
          data: {
            role: "UNIVERSITY_ADMIN",
          },
        });
        console.log("User role updated successfully");
      } catch (createError: any) {
        console.error("Error in create operation:", createError);
        throw createError;
      }
    }

    console.log("Admin created/updated successfully:", admin);
    return NextResponse.json({ admin }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating university admin:", error);
    console.error("Error details:", {
      code: error.code,
      message: error.message,
      meta: error.meta,
    });
    
    // Unique constraint error
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "Энэ хэрэглэгч энэ сургуульд аль хэдийн админ эрхтэй байна" },
        { status: 409 }
      );
    }

    // Prisma validation error
    if (error.code === "P2003") {
      return NextResponse.json(
        { error: "Хэрэглэгч эсвэл сургууль олдсонгүй" },
        { status: 404 }
      );
    }

    // Generic error with more details
    const errorMessage = error.message || "Админ эрх олгоход алдаа гарлаа";
    return NextResponse.json(
      { 
        error: errorMessage,
        details: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 }
    );
  }
}



