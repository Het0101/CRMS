import { useState, useEffect } from "react";

const API_BASE = "http://localhost:8081/api";

interface UseApiResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

// Hook for fetching data (GET)
export function useApi<T>(endpoint: string): UseApiResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trigger, setTrigger] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch(`${API_BASE}${endpoint}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Server error: ${res.status}`);
        return res.json();
      })
      .then((json) => {
        if (!cancelled) setData(json);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Cannot connect to server");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [endpoint, trigger]);

  return { data, loading, error, refetch: () => setTrigger((t) => t + 1) };
}

// Function for sending data (POST) and catching DB Triggers/Errors
export async function apiPost(endpoint: string, body?: any) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!res.ok) {
      // If Oracle throws a trigger error, Spring Boot sends it back here
      const errText = await res.text();
      throw new Error(errText || `HTTP ${res.status} - DATABASE REJECTION`);
    }

    const text = await res.text();
    return text ? JSON.parse(text) : null;
  } catch (err: any) {
    throw new Error(err.message || "Connection lost during transaction.");
  }
}