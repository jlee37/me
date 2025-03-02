"use client";

import { useState, useEffect } from "react";
import { EntryCollection } from "contentful";
import client from "../../lib/contentful";

// import client from "../../../../lib/contentful"; // Adjust import if needed

// Custom hook to fetch data from Contentful
export function useContentful<T>(contentType: string) {
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await client.getEntries<T>({
          content_type: contentType,
        });
        setData(response.items);
      } catch (err) {
        setError("Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [contentType]);

  return { data, error, loading };
}
