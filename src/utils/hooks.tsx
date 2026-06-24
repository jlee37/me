"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { LocalMemorySummary } from "../../types/journal";
import { WritingEntryRow, MenagerieEntryRow } from "../../lib/schema";

async function fetchWriting(): Promise<WritingEntryRow[]> {
  const res = await fetch("/api/writing");
  if (!res.ok) return [];
  return res.json();
}

export function useWriting() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["writing"],
    queryFn: fetchWriting,
    staleTime: Infinity,
    gcTime: Infinity,
  });
  return {
    data: data ?? [],
    error: error ? String(error) : null,
    loading: isLoading,
  };
}

async function fetchMenagerie(): Promise<MenagerieEntryRow[]> {
  const res = await fetch("/api/menagerie");
  if (!res.ok) return [];
  return res.json();
}

export function useMenagerie() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["menagerie"],
    queryFn: fetchMenagerie,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return {
    data: data ?? [],
    error: error ? String(error) : null,
    loading: isLoading,
  };
}


async function fetchLocalMemories(): Promise<LocalMemorySummary[]> {
  const res = await fetch("/api/memories");
  if (!res.ok) return [];
  return res.json();
}

export function useLocalMemories() {
  const { data, error, isLoading } = useQuery({
    queryKey: ["localMemories"],
    queryFn: fetchLocalMemories,
    staleTime: Infinity,
    gcTime: Infinity,
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
