"use client";
import { useQuery } from "@tanstack/react-query";

export function useFunds() {
  return useQuery({
    queryKey: ["funds"],
    queryFn: async () => {
      const res = await fetch("/api/funds");
      if (!res.ok) {
        throw new Error("Failed to fetch funds");
      }
      return res.json();
    },
  });
}

export function useFundRequests() {
  return useQuery({
    queryKey: ["fund-requests"],
    queryFn: async () => {
      const res = await fetch("/api/funds");
      if (!res.ok) {
        throw new Error("Failed to fetch fund requests");
      }
      return res.json();
    },
  });
}
