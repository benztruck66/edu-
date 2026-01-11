import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { withRetry } from "@/lib/db-helpers";

/**
 * GET /api/events/[id]
 * Тодорхой үйл явдлын мэдээлэл авах
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const event = await withRetry(() =>
      prisma.event.findUnique({
        where: { id },
        include: {
          registrations: {
            select: {
              id: true,
              userId: true,
              registeredAt: true,
            },
          },
        },
      })
    );

    if (!event) {
      return NextResponse.json(
        { error: "Үйл явдал олдсонгүй" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      event: {
        ...event,
        registered: event.registrations.length,
      },
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Үйл явдлыг авахад алдаа гарлаа" },
      { status: 500 }
    );
  }
}




