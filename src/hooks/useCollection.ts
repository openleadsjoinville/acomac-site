"use client";

import { useEffect, useState } from "react";

export function useCollection<T>(endpoint: string): T[] | null {
  const [data, setData] = useState<T[] | null>(null);
  useEffect(() => {
    let mounted = true;
    fetch(endpoint)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch(() => {
        if (mounted) setData([]);
      });
    return () => {
      mounted = false;
    };
  }, [endpoint]);
  return data;
}
