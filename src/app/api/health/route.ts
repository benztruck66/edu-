import { NextResponse } from "next/server";
import { checkDatabaseHealth } from "@/lib/db-helpers";

/**
 * Database health check endpoint
 * GET /api/health
 */
export async function GET() {
  try {
    const health = await checkDatabaseHealth();

    if (health.connected) {
      return NextResponse.json(
        {
          status: "healthy",
          database: {
            connected: true,
            latency: health.latency,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json(
        {
          status: "unhealthy",
          database: {
            connected: false,
            error: health.error,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 503 }
      );
    }
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}

