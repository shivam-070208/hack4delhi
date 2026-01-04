import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useAdminDashboard = () =>
  useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: async () => {
      const res = await fetch(`/api/admin/dashboard/fetch`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user list");
      }
      return res.json();
    },
    keepPreviousData: true,
  });
export const useAdminList = ({ search = "", page = 1, limit = 10 } = {}) =>
  useQuery({
    queryKey: ["admin-users", { search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({ search, page, limit });
      const res = await fetch(`/api/admin/user/list?${params.toString()}`, {
        method: "GET",
      });
      if (!res.ok) {
        throw new Error("Failed to fetch user list");
      }
      return res.json();
    },
    keepPreviousData: true,
  });

export const useAdminAddUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const res = await fetch("/api/admin/hr/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to add user");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
  });
};

export const useAdminUser = (id) =>
  useQuery({
    queryKey: ["admin-user", id],
    enabled: !!id,
    suspense: true,
    queryFn: async () => {
      const res = await fetch(`/api/admin/user/${id}`);
      if (!res.ok) {
        throw new Error("Failed to fetch user");
      }
      return res.json();
    },
  });

export const useAdminDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/user/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete user");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-user"] });
    },
  });
};

export const useAdminDepartmentsList = ({
  search = "",
  page = 1,
  limit = 10,
} = {}) =>
  useQuery({
    queryKey: ["admin-departments", { search, page, limit }],
    queryFn: async () => {
      const params = new URLSearchParams({ search, page, limit });
      const res = await fetch(
        `/api/admin/departments/list?${params.toString()}`,
        {
          method: "GET",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to fetch departments list");
      }
      return res.json();
    },
    keepPreviousData: true,
  });

export const useAdminAddDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input) => {
      const res = await fetch("/api/admin/departments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to add department");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
    },
  });
};

export const useAdminDeleteDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/admin/departments/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "Failed to delete department");
      }
      return json;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-departments"] });
    },
  });
};
