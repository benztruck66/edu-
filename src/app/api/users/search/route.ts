import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { verifyToken, getTokenFromRequest } from "@/lib/auth";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/users/search?q=...
 * Хэрэглэгч хайх (ID эсвэл И-мэйлээр)
 */
export async function GET(request: NextRequest) {
  try {
    console.log("GET /api/users/search - Request received");
    const token = getTokenFromRequest(request);
    if (!token) {
      console.error("No token provided");
      return NextResponse.json({ error: "Token байхгүй" }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      console.error("Invalid token");
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
      console.error("Access denied - not SUPER_ADMIN", { userId: payload.userId, role: user?.role });
      return NextResponse.json({ error: "Эрх хүрэхгүй" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q") || "";
    console.log("Search query:", q);

    if (!q || q.length < 2) {
      console.log("Query too short, returning empty array");
      return NextResponse.json({ users: [] });
    }

    // ID эсвэл И-мэйлээр хайх
    // MongoDB-д case-insensitive хайлт хийх
    console.log("Searching users in database with query:", q);
    
    // MongoDB-д Prisma-гийн mode: "insensitive" зөв ажиллахгүй байж магадгүй
    // Тиймээс бүх хэрэглэгчдийг авч JavaScript-ээр filter хийх (илүү найдвартай)
    try {
      const allUsers = await withRetry(() =>
        prisma.user.findMany({
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
          take: 500, // Хязгаарлалт - их хэмжээний database-д илүү сайн query хэрэгтэй
        })
      );
      
      console.log(`Fetched ${allUsers.length} users from database`);
      
      // JavaScript-ээр case-insensitive хайлт хийх
      const qLower = q.toLowerCase().trim();
      const filteredUsers = allUsers.filter(u => 
        u.id.toLowerCase().includes(qLower) ||
        u.email.toLowerCase().includes(qLower) ||
        u.name.toLowerCase().includes(qLower)
      );
      
      console.log(`Found ${filteredUsers.length} matching users:`, filteredUsers.map(u => ({ name: u.name, email: u.email })));
      
      return NextResponse.json({ users: filteredUsers.slice(0, 20) });
    } catch (error) {
      console.error("Error searching users:", error);
      throw error;
    }
  } catch (error) {
    console.error("Error searching users:", error);
    const errorMessage = error instanceof Error ? error.message : "Хэрэглэгч хайхад алдаа гарлаа";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

