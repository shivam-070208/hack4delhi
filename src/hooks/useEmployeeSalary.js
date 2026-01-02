"use client";
import { useQuery } from "@tanstack/react-query";

export function useEmployeeSalary(employeeId) {
  return useQuery({
    queryKey: ["employee-salary", employeeId],
    queryFn: async () => {
      const res = await fetch(
        `/api/salary/employee/details?employeeId=${employeeId}`,
      );
      if (!res.ok) {
        throw new Error("Failed to fetch employee salary");
      }
      return res.json();
    },
    enabled: !!employeeId,
  });
}
