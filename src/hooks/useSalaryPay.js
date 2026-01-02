"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useSalaryPay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ employeeId, amount, month }) => {
      const res = await fetch("/api/salary/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, amount, month }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to process salary payment");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wallet-balance"] });
      queryClient.invalidateQueries({ queryKey: ["hr-employees"] });
      queryClient.invalidateQueries({ queryKey: ["salary-transactions"] });
    },
  });
}
