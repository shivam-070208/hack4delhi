"use client";
import { useQuery } from "@tanstack/react-query";

export function useEmployees({ search = "", page = 1, limit = 10 } = {}) {
  return useQuery({
    queryKey: ["hr-employees", { search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({ search, page, limit });
      const res = await fetch(`/api/hr/employee/list?${params.toString()}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch employee list");
      }
      return res.json();
    },
    keepPreviousData: true,
  });
}
