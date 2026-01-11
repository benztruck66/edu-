/**
 * Generic API Hook
 * Reusable hook for API requests with error handling and loading states
 */

import { useState, useCallback, useRef, useEffect } from "react";
import { formatErrorMessage, logError } from "@/lib/errors";

interface UseApiOptions<T> {
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  initialData?: T;
}

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (...args: unknown[]) => Promise<T | null>;
  reset: () => void;
}

/**
 * Generic hook for API requests
 */
export function useApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  options?: UseApiOptions<T>
): UseApiResult<T> {
  const [data, setData] = useState<T | null>(options?.initialData || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const execute = useCallback(
    async (...args: unknown[]) => {
      try {
        // Cancel previous request
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();

        setLoading(true);
        setError(null);

        const result = await apiFunction(...args);
        setData(result);
        
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return null;
        }

        const errorMessage = formatErrorMessage(err);
        setError(errorMessage);
        
        logError(err, { args, context: "useApi" });
        options?.onError?.(err instanceof Error ? err : new Error(String(err)));
        
        return null;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction, options]
  );

  const reset = useCallback(() => {
    abortControllerRef.current?.abort();
    setData(options?.initialData || null);
    setLoading(false);
    setError(null);
  }, [options?.initialData]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
}

/**
 * Hook for mutations (POST, PUT, DELETE)
 */
export function useMutation<T, TVariables = unknown>(
  mutationFunction: (variables: TVariables) => Promise<T>,
  options?: UseApiOptions<T>
) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const mutate = useCallback(
    async (variables: TVariables) => {
      try {
        setLoading(true);
        setError(null);

        const result = await mutationFunction(variables);
        setData(result);
        
        options?.onSuccess?.(result);
        return result;
      } catch (err) {
        const errorMessage = formatErrorMessage(err);
        setError(errorMessage);
        
        logError(err, { variables, context: "useMutation" });
        options?.onError?.(err instanceof Error ? err : new Error(String(err)));
        
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [mutationFunction, options]
  );

  const reset = useCallback(() => {
    setData(null);
    setLoading(false);
    setError(null);
  }, []);

  return {
    data,
    loading,
    error,
    mutate,
    reset,
  };
}

/**
 * Hook for debounced API calls (useful for search)
 */
export function useDebouncedApi<T>(
  apiFunction: (...args: unknown[]) => Promise<T>,
  delay: number = 500,
  options?: UseApiOptions<T>
): UseApiResult<T> {
  const api = useApi(apiFunction, options);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const debouncedExecute = useCallback(
    (...args: unknown[]) => {
      return new Promise<T | null>((resolve) => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(async () => {
          const result = await api.execute(...args);
          resolve(result);
        }, delay);
      });
    },
    [api, delay]
  );

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return {
    ...api,
    execute: debouncedExecute,
  };
}

