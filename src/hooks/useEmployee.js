"use client";
import { useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";

export const useEmployee = (id) =>
  useQuery({
    queryKey: ["employee", id],
    enabled: !!id,
    suspense: true,
    queryFn: async () => {
      const res = await fetch(`/api/hr/employee/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch employee");
      }
      return res.json();
    },
  });




export const useAddEmployee = () =>
  useMutation({
    mutationFn: async (employeeData) => {
      const res = await fetch("/api/hr/employee/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || "Failed to add employee");
      }
      return res.json();
    },
  });