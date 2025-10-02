"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import client from "../../lib/contentful";
import { Memory, PhotoEssay, Writing } from "../../types/contentful";

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

async function fetchMemory() {
  const response = await client.getEntries({
    content_type: "memory",
  });
  return response.items as Memory[];
}

export function useMemories() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["memory"],
    queryFn: fetchMemory,
  });

  return {
    data: data ?? [],
    error: error ? String(error) : null,
    loading: isLoading,
  };
}

// Custom hook for intersection observer-based lazy loading
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: {
    rootMargin?: string;
    threshold?: number;
    triggerOnce?: boolean;
  } = {}
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const ref = useRef<T>(null);

  const {
    rootMargin = "2000px", // Start loading 2000px before element enters viewport
    threshold = 0,
    triggerOnce = true,
  } = options;

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isElementIntersecting = entry.isIntersecting;
        setIsIntersecting(isElementIntersecting);

        if (isElementIntersecting && !hasIntersected) {
          setHasIntersected(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        }
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.unobserve(element);
    };
  }, [rootMargin, threshold, triggerOnce, hasIntersected]);

  return { ref, isIntersecting, hasIntersected };
}
