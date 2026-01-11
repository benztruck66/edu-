import { useState, useEffect, useCallback, useRef } from "react";
import type { University, UniversityFilters } from "@/types/university";
import { formatErrorMessage, logError } from "@/lib/errors";

type UseUniversitiesFilters = UniversityFilters;

interface Pagination {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface UseUniversitiesResult {
  universities: University[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  refetch: () => Promise<void>;
  hasMore: boolean;
  isEmpty: boolean;
}

// Simple in-memory cache
const cache = new Map<string, { data: University[]; pagination: Pagination | null; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Cache clear function
export function clearUniversitiesCache() {
  cache.clear();
}

function getCacheKey(filters?: UseUniversitiesFilters): string {
  return JSON.stringify(filters || {});
}

export function useUniversities(
  filters?: UseUniversitiesFilters,
  options?: { cacheEnabled?: boolean; autoRefresh?: boolean; refreshInterval?: number }
): UseUniversitiesResult {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheEnabled = options?.cacheEnabled ?? true;
  const autoRefresh = options?.autoRefresh ?? false;
  const refreshInterval = options?.refreshInterval ?? 30000; // 30 секунд default

  const fetchUniversities = useCallback(async () => {
    try {
      // Cancel previous request if exists
      abortControllerRef.current?.abort();
      abortControllerRef.current = new AbortController();

      setLoading(true);
      setError(null);

      // Check cache first
      const cacheKey = getCacheKey(filters);
      if (cacheEnabled) {
        const cached = cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
          setUniversities(cached.data);
          setPagination(cached.pagination);
          setLoading(false);
          return;
        }
      }

      // Build query parameters
      const params = new URLSearchParams();
      if (filters?.city && filters.city !== "all") {
        params.append("city", filters.city);
      }
      if (filters?.program && filters.program !== "all") {
        params.append("program", filters.program);
      }
      if (filters?.search) {
        params.append("search", filters.search);
      }
      if (filters?.sortBy) {
        params.append("sortBy", filters.sortBy);
      }
      if (filters?.sortOrder) {
        params.append("sortOrder", filters.sortOrder);
      }
      if (filters?.page) {
        params.append("page", filters.page.toString());
      }
      if (filters?.pageSize) {
        params.append("pageSize", filters.pageSize.toString());
      }
      if (filters?.minTuition) {
        params.append("minTuition", filters.minTuition.toString());
      }
      if (filters?.maxTuition) {
        params.append("maxTuition", filters.maxTuition.toString());
      }
      if (filters?.minRank) {
        params.append("minRank", filters.minRank.toString());
      }
      if (filters?.maxRank) {
        params.append("maxRank", filters.maxRank.toString());
      }
      if (filters?.hasScholarships !== undefined) {
        params.append("hasScholarships", String(filters.hasScholarships));
      }

      const res = await fetch(`/api/universities?${params}`, {
        signal: abortControllerRef.current.signal,
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const fetchedUniversities = data.universities || [];
      const fetchedPagination = data.pagination || null;

      setUniversities(fetchedUniversities);
      setPagination(fetchedPagination);

      // Update cache
      if (cacheEnabled) {
        cache.set(cacheKey, {
          data: fetchedUniversities,
          pagination: fetchedPagination,
          timestamp: Date.now(),
        });
      }
    } catch (err) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }

      const errorMessage = formatErrorMessage(err);
      setError(errorMessage);
      setUniversities([]);
      setPagination(null);
      
      logError(err, { filters, context: "useUniversities" });
    } finally {
      setLoading(false);
    }
  }, [
    filters?.city,
    filters?.program,
    filters?.search,
    filters?.sortBy,
    filters?.sortOrder,
    filters?.page,
    filters?.pageSize,
    filters?.minTuition,
    filters?.maxTuition,
    filters?.minRank,
    filters?.maxRank,
    filters?.hasScholarships,
    cacheEnabled,
  ]);

  useEffect(() => {
    fetchUniversities();

    // Auto-refresh механизм
    let intervalId: NodeJS.Timeout | null = null;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchUniversities();
      }, refreshInterval);
    }

    // Cleanup on unmount
    return () => {
      abortControllerRef.current?.abort();
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [fetchUniversities, autoRefresh, refreshInterval]);

  return {
    universities,
    loading,
    error,
    pagination,
    refetch: fetchUniversities,
    hasMore: pagination?.hasNext ?? false,
    isEmpty: !loading && universities.length === 0,
  };
}

