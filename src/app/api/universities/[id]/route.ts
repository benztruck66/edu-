import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

// Тодорхой сургуулийн дэлгэрэнгүй мэдээлэл
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log("🔍 Fetching university with ID:", id);

    // Check if id is a valid ObjectId (24 hex characters)
    const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
    console.log("📝 Is ObjectId?", isObjectId);
    
    let university;
    if (isObjectId) {
      // Try to find by ObjectId
      university = await prisma.university.findUnique({
        where: { id },
        include: {
          scholarships: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          },
          payments: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          },
          admins: {
            where: { isActive: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    } else {
      // If not ObjectId, try to find by name (for mock data compatibility)
      // This is a fallback for old mock data IDs like "mue", "num", etc.
      const nameMap: Record<string, string> = {
        "num": "Монгол Улсын Их Сургууль",
        "must": "ШУТИС",
        "mnums": "АШУҮИС",
        "muisc": "СЭЗИС",
        "bdu": "ХААИС",
        "ues": "Их Засаг Их Сургууль",
        "mue": "Монгол Улсын Боловсролын Их Сургууль (МУБИС)",
        "msue": "Соёл урлагийн их сургууль (СУИС)",
        "otgontenger": "Отгонтэнгэр Их Сургууль",
      };
      
      const searchName = nameMap[id] || id;
      console.log("🔍 Searching by name:", searchName);
      
      // MongoDB-д нэрээр хайх - эхлээд nameMap-аас, дараа нь шууд нэрээр
      // Эхлээд яг таарч байгаа нэрийг хайх
      university = await prisma.university.findFirst({
        where: {
          OR: [
            {
              name: {
                equals: searchName,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: searchName,
                mode: "insensitive",
              },
            },
            {
              name: {
                equals: id,
                mode: "insensitive",
              },
            },
            {
              name: {
                contains: id,
                mode: "insensitive",
              },
            },
          ],
        },
        include: {
          scholarships: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          },
          payments: {
            where: { isActive: true },
            orderBy: { createdAt: "desc" },
          },
          admins: {
            where: { isActive: true },
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    }

    if (!university) {
      console.error("❌ University not found with ID:", id);
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    console.log("✅ Found university:", university.name);
    return NextResponse.json({ university });
  } catch (error) {
    console.error("Error fetching university:", error);
    return NextResponse.json(
      { error: "Failed to fetch university" },
      { status: 500 }
    );
  }
}

// Сургуулийн мэдээлэл засах
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const {
      name,
      city,
      qsRank,
      programs,
      description,
      website,
      email,
      phone,
      tuitionMntPerYear,
      acceptanceRatePct,
      logo,
      images,
    } = body;

    const updateData: any = {};
    
    if (name !== undefined) updateData.name = name;
    if (city !== undefined) updateData.city = city;
    if (qsRank !== undefined) updateData.qsRank = parseInt(qsRank);
    if (programs !== undefined) updateData.programs = programs;
    if (description !== undefined) updateData.description = description;
    if (website !== undefined) updateData.website = website;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (tuitionMntPerYear !== undefined) updateData.tuitionMntPerYear = tuitionMntPerYear ? parseInt(tuitionMntPerYear) : null;
    if (acceptanceRatePct !== undefined) updateData.acceptanceRatePct = acceptanceRatePct ? parseFloat(acceptanceRatePct) : null;
    if (logo !== undefined) updateData.logo = logo;
    if (images !== undefined) updateData.images = images;

    const university = await prisma.university.update({
      where: { id },
      data: updateData,
      include: {
        scholarships: {
          where: { isActive: true },
        },
        payments: {
          where: { isActive: true },
        },
      },
    });

    return NextResponse.json({ university });
  } catch (error: any) {
    console.error("Error updating university:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to update university" },
      { status: 500 }
    );
  }
}

// Сургууль устгах
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Authentication шалгах
    const token = getTokenFromRequest(request);
    if (!token) {
      return NextResponse.json({ error: "Token байхгүй" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Token хүчингүй" }, { status: 401 });
    }

    // Зөвхөн SUPER_ADMIN эрхтэй хэрэглэгч
    const user = await withRetry(() =>
      prisma.user.findUnique({
        where: { id: payload.userId },
        select: { role: true },
      })
    );

    if (!user || user.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Эрх хүрэхгүй" }, { status: 403 });
    }

    const { id } = await params;

    await withRetry(() =>
      prisma.university.delete({
        where: { id },
      })
    );

    return NextResponse.json({
      message: "University deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting university:", error);
    
    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "University not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to delete university" },
      { status: 500 }
    );
  }
}

