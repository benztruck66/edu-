import { useEffect, useState, useRef } from "react";

type RealtimeEvent = {
  type: "connected" | "stats" | "university_update" | "notification";
  data?: any;
  message?: string;
};

type RealtimeStats = {
  timestamp: string;
  activeUsers: number;
  universities: number;
  programs: number;
};

export function useRealtime() {
  const [connected, setConnected] = useState(false);
  const [stats, setStats] = useState<RealtimeStats | null>(null);
  const [notifications, setNotifications] = useState<RealtimeEvent[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    // Create EventSource connection
    const eventSource = new EventSource("/api/realtime");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setConnected(true);
    };

    eventSource.onmessage = (event) => {
      try {
        const data: RealtimeEvent = JSON.parse(event.data);
        
        switch (data.type) {
          case "connected":
            console.log("✅ Real-time connection established");
            break;
          case "stats":
            if (data.data) {
              setStats(data.data);
            }
            break;
          case "university_update":
            // Add notification
            setNotifications((prev) => [
              ...prev.slice(-4), // Keep only last 5
              {
                type: "notification",
                data: data.data,
                message: "Их сургуулийн мэдээлэл шинэчлэгдлээ",
              },
            ]);
            break;
        }
      } catch (error) {
        console.error("Error parsing real-time event:", error);
      }
    };

    eventSource.onerror = (error) => {
      console.error("Real-time connection error:", error);
      setConnected(false);
    };

    // Cleanup
    return () => {
      eventSource.close();
      eventSourceRef.current = null;
    };
  }, []);

  return {
    connected,
    stats,
    notifications,
    clearNotifications: () => setNotifications([]),
  };
}

