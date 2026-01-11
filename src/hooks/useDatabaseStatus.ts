import { useState, useEffect } from "react";

type DatabaseStatus = {
  connected: boolean;
  loading: boolean;
  error: string | null;
};

export function useDatabaseStatus(): DatabaseStatus {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const checkStatus = async () => {
      try {
        setStatus({ connected: false, loading: true, error: null });
        
        // API-аас их сургуулиудын жагсаалт авах замаар database connection шалгах
        const res = await fetch("/api/universities?page=1&pageSize=1");
        
        if (res.ok) {
          setStatus({ connected: true, loading: false, error: null });
        } else {
          setStatus({ connected: false, loading: false, error: "Database холбогдохгүй байна" });
        }
      } catch (err) {
        setStatus({
          connected: false,
          loading: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    };

    checkStatus();
    // 15 секунд тутамд шалгах (илүү амьд)
    const interval = setInterval(checkStatus, 15000);
    return () => clearInterval(interval);
  }, []);

  return status;
}



