import { NextRequest } from "next/server";

// Server-Sent Events (SSE) endpoint for real-time updates
export async function GET(request: NextRequest) {
  // Create a readable stream for SSE
  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      
      // Send initial connection message
      const send = (data: object) => {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`));
      };

      // Send connection confirmation
      send({ type: "connected", message: "Real-time connection established" });

      // Simulate real-time updates
      const interval = setInterval(() => {
        // Send live statistics
        send({
          type: "stats",
          data: {
            timestamp: new Date().toISOString(),
            activeUsers: Math.floor(Math.random() * 100) + 50,
            universities: 12,
            programs: 45 + Math.floor(Math.random() * 5),
          },
        });

        // Send random university updates
        if (Math.random() > 0.7) {
          send({
            type: "university_update",
            data: {
              id: `uni-${Math.floor(Math.random() * 12) + 1}`,
              update: "ranking_updated",
              timestamp: new Date().toISOString(),
            },
          });
        }
      }, 5000); // Update every 5 seconds

      // Cleanup on client disconnect
      request.signal.addEventListener("abort", () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "Connection": "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}

