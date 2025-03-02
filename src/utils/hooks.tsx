"use client";

import { useState, useEffect } from "react";
import client from "../../lib/contentful";
import { PhotoEssay } from "../../types/contentful";

export function usePhotoEssays() {
  const [data, setData] = useState<PhotoEssay[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        setLoading(true);
        const response = await client.getEntries({
          content_type: "photoEssay",
        });
        setData(response.items as PhotoEssay[]);
      } catch (err) {
        setError(`Failed to fetch content: ${JSON.stringify(err)}`);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  return { data, error, loading };
}
