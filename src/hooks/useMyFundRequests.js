"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useMyFundRequests() {
  return useQuery({
    queryKey: ["my-fund-requests"],
    queryFn: async () => {
      const res = await fetch("/api/funds/my-requests");
      if (!res.ok) {
        throw new Error("Failed to fetch fund requests");
      }
      return res.json();
    },
  });
}

export function useCreateFundRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const res = await fetch("/api/funds/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create fund request");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-fund-requests"] });
    },
  });
}
