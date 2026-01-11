import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRetry, getPaginationParams } from "@/lib/db-helpers";

// Бүх сургуулиудын жагсаалт авах
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const city = searchParams.get("city");
    const program = searchParams.get("program");
    const search = searchParams.get("search");
    const sortBy = searchParams.get("sortBy") || "qsRank";
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "50");

    // Шүүлтүүр
    const where: any = {};
    
    if (city && city !== "all") {
      where.city = city;
    }

    if (program && program !== "all") {
      // MongoDB-д array-д элемент байгаа эсэхийг шалгах
      where.programs = { hasSome: [program] };
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        { city: { contains: search, mode: "insensitive" } },
      ];
    }

    // Эрэмбэлэлт
    const orderBy: any = {};
    switch (sortBy) {
      case "name":
        orderBy.name = "asc";
        break;
      case "tuition":
        orderBy.tuitionMntPerYear = "asc";
        break;
      case "acceptance":
        orderBy.acceptanceRatePct = "asc";
        break;
      case "rank":
      default:
        orderBy.qsRank = "asc";
        break;
    }

    // Pagination params
    const { skip, take } = getPaginationParams(page, pageSize);

    // Нийт тоо (retry logic-тэй)
    const total = await withRetry(() => 
      prisma.university.count({ where })
    );

    // Сургуулиуд (retry logic-тэй, optimized query)
    const universities = await withRetry(() =>
      prisma.university.findMany({
        where,
        orderBy,
        skip,
        take,
        // Зөвхөн шаардлагатай талбаруудыг авах (performance сайжруулах)
        select: {
          id: true,
          name: true,
          city: true,
          qsRank: true,
          programs: true,
          description: true,
          website: true,
          email: true,
          phone: true,
          tuitionMntPerYear: true,
          acceptanceRatePct: true,
          logo: true,
          images: true,
          createdAt: true,
          updatedAt: true,
          scholarships: {
            where: { isActive: true },
            take: 3, // Эхний 3 тэтгэлэг
            select: {
              id: true,
              name: true,
              type: true,
              amountMnt: true,
              description: true,
            },
          },
          payments: {
            where: { isActive: true },
            take: 5, // Эхний 5 төлбөрийн мэдээлэл
            select: {
              id: true,
              program: true,
              tuitionMnt: true,
              period: true,
            },
          },
        },
      })
    );

    return NextResponse.json({
      universities,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.ceil(total / pageSize),
      },
    });
  } catch (error) {
    console.error("Error fetching universities:", error);
    return NextResponse.json(
      { error: "Failed to fetch universities" },
      { status: 500 }
    );
  }
}

// Шинэ сургууль нэмэх
export async function POST(request: NextRequest) {
  try {
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

    // Validation
    if (!name || !city || !qsRank || !programs || !Array.isArray(programs)) {
      return NextResponse.json(
        { error: "Missing required fields: name, city, qsRank, programs" },
        { status: 400 }
      );
    }

    // Retry logic-тэй create
    const university = await withRetry(() =>
      prisma.university.create({
        data: {
          name,
          city,
          qsRank: parseInt(qsRank),
          programs: programs,
          description,
          website,
          email,
          phone,
          tuitionMntPerYear: tuitionMntPerYear ? parseInt(tuitionMntPerYear) : null,
          acceptanceRatePct: acceptanceRatePct ? parseFloat(acceptanceRatePct) : null,
          logo,
          images: images || [],
        },
        include: {
          scholarships: true,
          payments: true,
        },
      })
    );

    return NextResponse.json({ university }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating university:", error);
    
    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "University with this name already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create university" },
      { status: 500 }
    );
  }
}

