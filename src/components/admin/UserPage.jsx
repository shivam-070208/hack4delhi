"use client";
import { useState } from "react";
import { useAdminList } from "@/hooks/useAdmin";
import AddUserModal from "./AddHrModel";
import UserTable from "./UserTable";

const PAGE_SIZE = 10;

const UserPage = () => {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminList({
    search,
    page,
    limit: PAGE_SIZE,
  });

  const total = data?.total || 0;
  const users = data?.users || [];
  const totalPages = Math.ceil(total / PAGE_SIZE);

  const handlePrev = () => setPage((p) => Math.max(p - 1, 1));
  const handleNext = () => setPage((p) => Math.min(p + 1, totalPages));
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="p-6">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">HR & Employees</h1>
        <AddUserModal />
      </div>
      <div className="mb-4 flex">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search users by name or email"
          className="w-64 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      {isLoading ? (
        <div>Loading...</div>
      ) : isError ? (
        <div className="text-red-600">Error loading users.</div>
      ) : (
        <>
          <UserTable users={users} />
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              className="rounded border px-3 py-1 disabled:opacity-50"
              disabled={page === 1}
              onClick={handlePrev}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages || 1}
            </span>
            <button
              className="rounded border px-3 py-1 disabled:opacity-50"
              disabled={page === totalPages || totalPages === 0}
              onClick={handleNext}
            >
              Next
            </button>
            <span className="ml-4 text-sm text-gray-500">{total} users</span>
          </div>
        </>
      )}
    </div>
  );
};

export default UserPage;
