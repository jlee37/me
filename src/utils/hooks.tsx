"use client";

import { useQuery } from "@tanstack/react-query";
import client from "../../lib/contentful";
import { PhotoEssay, Writing } from "../../types/contentful";

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
    loading: isLoading,
  };
}
async function fetchWriting() {
  const response = await client.getEntries({
    content_type: "writing",
  });
  return response.items as Writing[];
}

export function useWriting() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["writing"],
    queryFn: fetchWriting,
  });
  return {
    data: data ?? [],
    error: error ? String(error) : null,
    loading: isLoading,
  };
}
