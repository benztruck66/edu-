/**
 * Validation Utilities
 * Input validation болон sanitization functions
 */

import { ValidationError } from "./errors";

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate Mongolian phone number
 */
export function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[0-9]{8}$/;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return phoneRegex.test(cleanPhone);
}

/**
 * Validate password strength
 */
export function isValidPassword(password: string): boolean {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password)
  );
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, "") // Remove angle brackets
    .replace(/\s+/g, " "); // Normalize whitespace
}

/**
 * Validate and sanitize search query
 */
export function sanitizeSearchQuery(query: string, maxLength: number = 100): string {
  const sanitized = sanitizeString(query);
  
  if (sanitized.length === 0) {
    throw new ValidationError("Search query cannot be empty");
  }
  
  if (sanitized.length > maxLength) {
    throw new ValidationError(`Search query too long (max ${maxLength} characters)`);
  }
  
  return sanitized;
}

/**
 * Validate number within range
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate pagination parameters
 */
export function validatePagination(params: {
  page?: unknown;
  limit?: unknown;
}): { page: number; limit: number } {
  const page = typeof params.page === "number" ? params.page : 1;
  const limit = typeof params.limit === "number" ? params.limit : 10;

  if (page < 1) {
    throw new ValidationError("Page must be >= 1");
  }

  if (limit < 1 || limit > 100) {
    throw new ValidationError("Limit must be between 1 and 100");
  }

  return { page, limit };
}

/**
 * Validate sort parameters
 */
export function validateSort(
  sortBy: unknown,
  allowedFields: string[]
): string | undefined {
  if (!sortBy || typeof sortBy !== "string") {
    return undefined;
  }

  if (!allowedFields.includes(sortBy)) {
    throw new ValidationError(`Invalid sort field. Allowed: ${allowedFields.join(", ")}`);
  }

  return sortBy;
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate file size
 */
export function isValidFileSize(sizeInBytes: number, maxSizeMB: number = 5): boolean {
  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  return sizeInBytes <= maxSizeBytes;
}

/**
 * Validate file type
 */
export function isValidFileType(
  filename: string,
  allowedTypes: string[]
): boolean {
  const ext = filename.split(".").pop()?.toLowerCase();
  return ext ? allowedTypes.includes(ext) : false;
}

/**
 * Comprehensive form validation
 */
export interface FormValidationRules {
  required?: boolean;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  pattern?: RegExp;
  custom?: (value: unknown) => boolean | string;
}

export function validateField(
  value: unknown,
  rules: FormValidationRules
): string | null {
  if (rules.required && (!value || (typeof value === "string" && !value.trim()))) {
    return "Энэ талбарыг заавал бөглөнө үү";
  }

  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength) {
      return `Хамгийн багадаа ${rules.minLength} тэмдэгт байх ёстой`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return `Хамгийн ихдээ ${rules.maxLength} тэмдэгт байх ёстой`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return "Буруу формат байна";
    }
  }

  if (typeof value === "number") {
    if (rules.min !== undefined && value < rules.min) {
      return `Хамгийн багадаа ${rules.min} байх ёстой`;
    }

    if (rules.max !== undefined && value > rules.max) {
      return `Хамгийн ихдээ ${rules.max} байх ёстой`;
    }
  }

  if (rules.custom) {
    const result = rules.custom(value);
    if (result !== true && typeof result === "string") {
      return result;
    }
    if (result === false) {
      return "Буруу утга байна";
    }
  }

  return null;
}

/**
 * Validate entire form
 */
export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<keyof T, FormValidationRules>
): Record<string, string> {
  const errors: Record<string, string> = {};

  for (const field in rules) {
    const error = validateField(data[field], rules[field]);
    if (error) {
      errors[field] = error;
    }
  }

  return errors;
}

