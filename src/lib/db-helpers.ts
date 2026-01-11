import { prisma } from "./db";

/**
 * Database connection health check
 */
export async function checkDatabaseHealth(): Promise<{
  connected: boolean;
  latency?: number;
  error?: string;
}> {
  try {
    const start = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    const latency = Date.now() - start;

    return {
      connected: true,
      latency,
    };
  } catch (error) {
    return {
      connected: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Retry wrapper for database operations
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries = 3,
  delay = 1000
): Promise<T> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      // Хэрэв сүүлийн оролдлого бол error throw хийх
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      const waitTime = delay * Math.pow(2, attempt - 1);
      await new Promise((resolve) => setTimeout(resolve, waitTime));
    }
  }

  throw lastError || new Error("Operation failed");
}

/**
 * Optimized query - зөвхөн шаардлагатай талбаруудыг авах
 */
export function selectFields<T extends Record<string, any>>(
  fields: (keyof T)[]
): Record<string, boolean> {
  const select: Record<string, boolean> = {};
  fields.forEach((field) => {
    select[String(field)] = true;
  });
  return select;
}

/**
 * Pagination helper
 */
export function getPaginationParams(
  page: number,
  pageSize: number
): { skip: number; take: number } {
  const skip = (page - 1) * pageSize;
  const take = Math.min(pageSize, 100); // Max 100 items per page
  return { skip, take };
}

