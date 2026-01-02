"use client";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";

export function useMarkAttendance() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, date, status, hours }) => {
      const res = await fetch("/api/attendance/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, date, status, hours }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to mark attendance");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    },
  });
}

export function useAttendanceList(month, userId) {
  return useQuery({
    queryKey: ["attendance", { month, userId }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (month) params.append("month", month);
      if (userId) params.append("userId", userId);

      const res = await fetch(`/api/attendance/list?${params.toString()}`);
      if (!res.ok) {
        throw new Error("Failed to fetch attendance");
      }
      return res.json();
    },
  });
}

export function useEmployeeAttendanceThisMonth(userId, month) {
  const { data: records = [] } = useAttendanceList(month, userId);

  const stats = {
    total: records.length,
    present: records.filter((r) => r.status === "present").length,
    absent: records.filter((r) => r.status === "absent").length,
    halfday: records.filter((r) => r.status === "halfday").length,
  };

  return { records, stats };
}
