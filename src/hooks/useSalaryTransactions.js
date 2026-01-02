import { useQuery } from "@tanstack/react-query";

export function useSalaryTransactions(month = null) {
  return useQuery({
    queryKey: ["salary-transactions", { month }],
    queryFn: async () => {
      const query = month ? `?month=${month}` : "";
      const response = await fetch(`/api/salary/pay${query}`);
      if (!response.ok) throw new Error("Failed to fetch salary transactions");
      return response.json();
    },
    enabled: true,
  });
}

export function useMonthlySalaryTotal(month = null) {
  const {
    data: transactions = [],
    isLoading,
    error,
  } = useSalaryTransactions(month);

  const total = transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0);

  return { total, isLoading, error, transactions };
}
