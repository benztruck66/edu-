"use client";
import { Component, ReactNode } from "react";
import Link from "next/link";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="text-center max-w-md">
            <h1 className="text-2xl font-semibold mb-4">Алдаа гарлаа</h1>
            <p className="text-zinc-600 dark:text-zinc-400 mb-6">
              Уучлаарай, алдаа гарлаа. Дахин оролдоно уу.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:bg-zinc-800 dark:hover:bg-zinc-200 transition"
              >
                Дахин ачаалах
              </button>
              <Link
                href="/"
                className="px-4 py-2 border border-zinc-300 dark:border-white/20 rounded-md hover:bg-zinc-50 dark:hover:bg-white/10 transition"
              >
                Нүүр хуудас
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}


