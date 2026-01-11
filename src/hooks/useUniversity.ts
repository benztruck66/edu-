import { useState, useEffect } from "react";
import type { University } from "@/types/university";

type UseUniversityResult = {
  university: University | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
};

export function useUniversity(id: string | null): UseUniversityResult {
  const [university, setUniversity] = useState<University | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversity = async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("🔍 useUniversity: Fetching university with ID:", id);
      const res = await fetch(`/api/universities/${id}`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("❌ useUniversity: API error", res.status, errorData);
        if (res.status === 404) {
          throw new Error("University not found");
        }
        throw new Error(errorData.error || "Failed to fetch university");
      }

      const data = await res.json();
      console.log("✅ useUniversity: Received data", data);
      if (!data.university) {
        console.error("❌ useUniversity: No university in response", data);
        throw new Error("University data not found in response");
      }
      setUniversity(data.university);
    } catch (err) {
      console.error("❌ useUniversity: Error", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      setUniversity(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversity();
  }, [id]);

  return {
    university,
    loading,
    error,
    refetch: fetchUniversity,
  };
}

