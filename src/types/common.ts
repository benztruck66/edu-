/**
 * Common Types
 * Бүх системд ашиглагдах ерөнхий type definitions
 */

export type Status = "active" | "inactive" | "pending" | "archived";

export type Role = "user" | "admin" | "super_admin" | "university_admin" | "teacher" | "alumni";

export type Language = "mn" | "en";

export type SortOrder = "asc" | "desc";

export interface TimestampFields {
  createdAt: Date;
  updatedAt: Date;
}

export interface SoftDeleteFields {
  deletedAt?: Date | null;
  isDeleted: boolean;
}

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatar?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: SortOrder;
}

export interface FilterParams {
  search?: string;
  status?: Status;
  startDate?: Date;
  endDate?: Date;
  [key: string]: unknown;
}

export interface ValidationError {
  field: string;
  message: string;
  code: string;
}

export interface ActionResult<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: ValidationError[];
}

// Form Types
export type FormStatus = "idle" | "loading" | "success" | "error";

export interface FormState<T = unknown> {
  status: FormStatus;
  data?: T;
  error?: string;
  errors?: Record<string, string[]>;
}

// Toast/Notification Types
export type ToastType = "success" | "error" | "info" | "warning";

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Loading States
export interface LoadingState {
  isLoading: boolean;
  isError: boolean;
  error?: Error | null;
}

// Search Types
export interface SearchResult<T> {
  items: T[];
  total: number;
  query: string;
  filters?: Record<string, unknown>;
}

