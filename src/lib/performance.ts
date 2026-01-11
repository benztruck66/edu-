/**
 * Performance Monitoring Utilities
 * Ажиллагааны хурд хянах utility functions
 */

/**
 * Measure execution time of a function
 */
export async function measureAsync<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Measure execution time of a sync function
 */
export function measureSync<T>(name: string, fn: () => T): T {
  const start = performance.now();
  try {
    return fn();
  } finally {
    const duration = performance.now() - start;
    if (process.env.NODE_ENV === "development") {
      console.log(`⏱️ ${name}: ${duration.toFixed(2)}ms`);
    }
  }
}

/**
 * Create a performance mark
 */
export function mark(name: string): void {
  if (typeof window !== "undefined" && window.performance) {
    performance.mark(name);
  }
}

/**
 * Measure between two marks
 */
export function measureBetween(
  name: string,
  startMark: string,
  endMark: string
): number | null {
  if (typeof window !== "undefined" && window.performance) {
    try {
      performance.measure(name, startMark, endMark);
      const measure = performance.getEntriesByName(name)[0];
      return measure?.duration ?? null;
    } catch {
      return null;
    }
  }
  return null;
}

/**
 * Log Web Vitals
 */
export function logWebVitals(metric: {
  id: string;
  name: string;
  value: number;
  label: "web-vital" | "custom";
}): void {
  if (process.env.NODE_ENV === "development") {
    console.log(`📊 ${metric.name}:`, metric.value);
  }

  // In production, send to analytics
  // if (process.env.NODE_ENV === "production") {
  //   gtag("event", metric.name, {
  //     value: Math.round(metric.value),
  //     metric_id: metric.id,
  //     metric_label: metric.label,
  //   });
  // }
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;

  return function (this: unknown, ...args: Parameters<T>) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn.apply(this, args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: unknown[]) => unknown>(
  fn: T,
  delay: number
): (...args: Parameters<T>) => void {
  let lastCall = 0;

  return function (this: unknown, ...args: Parameters<T>) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn.apply(this, args);
    }
  };
}

/**
 * Create a memoized version of a function
 */
export function memoize<T extends (...args: unknown[]) => unknown>(
  fn: T
): T {
  const cache = new Map<string, ReturnType<T>>();

  return ((...args: Parameters<T>) => {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args) as ReturnType<T>;
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * Simple profiler for development
 */
export class Profiler {
  private startTime: number;
  private marks: Map<string, number>;

  constructor(private name: string) {
    this.startTime = performance.now();
    this.marks = new Map();
  }

  mark(label: string): void {
    this.marks.set(label, performance.now() - this.startTime);
  }

  end(): void {
    const totalTime = performance.now() - this.startTime;
    
    if (process.env.NODE_ENV === "development") {
      console.group(`📊 Profile: ${this.name} (${totalTime.toFixed(2)}ms)`);
      
      this.marks.forEach((time, label) => {
        console.log(`  ${label}: ${time.toFixed(2)}ms`);
      });
      
      console.groupEnd();
    }
  }
}

/**
 * Monitor component render time
 */
export function useRenderTime(componentName: string): void {
  if (process.env.NODE_ENV === "development") {
    const renderTime = performance.now();
    console.log(`🎨 ${componentName} rendered in ${renderTime.toFixed(2)}ms`);
  }
}

/**
 * Check if browser supports a feature
 */
export function supportsFeature(feature: string): boolean {
  switch (feature) {
    case "localStorage":
      try {
        return typeof window !== "undefined" && "localStorage" in window;
      } catch {
        return false;
      }
    case "webp":
      if (typeof window === "undefined") return false;
      const canvas = document.createElement("canvas");
      return canvas.toDataURL("image/webp").indexOf("data:image/webp") === 0;
    case "intersection-observer":
      return typeof window !== "undefined" && "IntersectionObserver" in window;
    default:
      return false;
  }
}

