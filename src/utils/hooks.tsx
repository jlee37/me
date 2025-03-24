"use client";

import { useQuery } from "@tanstack/react-query";
import client from "../../lib/contentful";
import { PhotoEssay } from "../../types/contentful";

async function fetchPhotoEssays() {
  const response = await client.getEntries({
    content_type: "photoEssay",
  });
  return response.items as PhotoEssay[];
}

export function usePhotoEssays() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["photoEssays"],
    queryFn: fetchPhotoEssays,
  });

  return { 
    data: data ?? [], 
    error: error ? String(error) : null, 
    loading: isLoading 
  };
}
