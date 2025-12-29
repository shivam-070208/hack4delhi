import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

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

