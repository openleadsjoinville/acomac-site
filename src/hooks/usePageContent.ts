"use client";

import { useEffect, useState } from "react";
import type { PageContentMap, PageKey } from "@/lib/content/schema";

export function usePageContent<K extends PageKey>(
  key: K
): PageContentMap[K] | null {
  const [data, setData] = useState<PageContentMap[K] | null>(null);

  useEffect(() => {
    let mounted = true;
    fetch(`/api/public/page/${key}`)
      .then((r) => r.json())
      .then((json) => {
        if (mounted) setData(json);
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, [key]);

  return data;
}
