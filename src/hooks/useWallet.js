"use client";
import { useQuery } from "@tanstack/react-query";

export function useWallet() {
  return useQuery({
    queryKey: ["wallet-balance"],
    queryFn: async () => {
      const res = await fetch("/api/wallet/balance");
      if (!res.ok) {
        throw new Error("Failed to fetch wallet balance");
      }
      return res.json();
    },
  });
}
