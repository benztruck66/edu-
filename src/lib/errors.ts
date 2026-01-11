/**
 * Error Handling Utilities
 * Алдааны боловсруулалтын utility functions
 */

import { ApiError } from "@/types/api";

export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public details?: Record<string, string[]>
  ) {
    super(message);
    this.name = "AppError";
    Object.setPrototypeOf(this, AppError.prototype);
  }

  toJSON(): ApiError {
    return {
      error: this.message,
      statusCode: this.statusCode,
      details: this.details,
    };
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: Record<string, string[]>) {
    super(message, 400, "VALIDATION_ERROR", details);
    this.name = "ValidationError";
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = "Resource") {
    super(`${resource} not found`, 404, "NOT_FOUND");
    this.name = "NotFoundError";
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = "Unauthorized") {
    super(message, 401, "UNAUTHORIZED");
    this.name = "UnauthorizedError";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "Access denied") {
    super(message, 403, "FORBIDDEN");
    this.name = "ForbiddenError";
  }
}

export class RateLimitError extends AppError {
  constructor(retryAfter: number = 60) {
    super("Too many requests", 429, "RATE_LIMIT_EXCEEDED");
    this.name = "RateLimitError";
    this.details = { retryAfter: [retryAfter.toString()] };
  }
}

/**
 * Format error for user display
 */
export function formatErrorMessage(error: unknown): string {
  if (error instanceof AppError) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "An unexpected error occurred";
}

/**
 * Check if error is network related
 */
export function isNetworkError(error: unknown): boolean {
  if (error instanceof Error) {
    return (
      error.message.includes("fetch") ||
      error.message.includes("network") ||
      error.message.includes("Failed to fetch") ||
      error.name === "NetworkError" ||
      error.name === "TypeError"
    );
  }
  return false;
}

/**
 * Log error with context
 */
export function logError(error: unknown, context?: Record<string, unknown>): void {
  if (process.env.NODE_ENV === "development") {
    console.error("Error:", error);
    if (context) {
      console.error("Context:", context);
    }
  }

  // In production, send to error tracking service (e.g., Sentry)
  // if (process.env.NODE_ENV === "production") {
  //   Sentry.captureException(error, { extra: context });
  // }
}

/**
 * Safe error handler for async functions
 */
export function handleAsync<T>(
  promise: Promise<T>
): Promise<[T | null, Error | null]> {
  return promise
    .then((data) => [data, null] as [T, null])
    .catch((error) => [null, error] as [null, Error]);
}

/**
 * Retry function with exponential backoff
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  baseDelay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (i < maxRetries - 1) {
        const delay = baseDelay * Math.pow(2, i);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError!;
}

/**
 * Create user-friendly error message based on status code
 */
export function getErrorMessageByStatus(statusCode: number): string {
  const messages: Record<number, string> = {
    400: "Буруу хүсэлт илгээгдсэн байна",
    401: "Нэвтрэх шаардлагатай",
    403: "Хандах эрхгүй байна",
    404: "Хайсан мэдээлэл олдсонгүй",
    429: "Хэт олон хүсэлт илгээсэн байна. Түр хүлээнэ үү.",
    500: "Серверийн алдаа гарлаа",
    502: "Серверт холбогдож чадсангүй",
    503: "Үйлчилгээ түр хүртээмжгүй байна",
  };

  return messages[statusCode] || "Алдаа гарлаа";
}

