"use client";

import { useState, useEffect } from "react";
import { EntryCollection, Entry } from "contentful";
import client from "../../lib/contentful";
import { IPhotoEssay } from "../../types/contentful";

// Custom hook to fetch data from Contentful
export function usePhotoEssays<T>() {
  const [data, setData] = useState(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await client.getEntries({
          content_type: "photoEssay",
        });
        setData(response.items);
      } catch (err) {
        setError("Failed to fetch content");
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { data, error, loading };
}
