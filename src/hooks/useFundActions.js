"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useApproveFundRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId) => {
      const res = await fetch(`/api/funds/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "APPROVED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to approve fund request");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
}

export function useRejectFundRequest() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (requestId) => {
      const res = await fetch(`/api/funds/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "REJECTED" }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to reject fund request");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["funds"] });
    },
  });
}
