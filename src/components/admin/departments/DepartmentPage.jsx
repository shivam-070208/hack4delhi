"use client";
import { useState } from "react";
import { useAdminDepartmentsList } from "@/hooks/useAdmin";
import AddDepartmentModal from "./AddDepartmentModal";
import DepartmentTable from "./DepartmentTable";
import Loader from "@/components/common/loader";

const PAGE_SIZE = 10;

export default function DepartmentPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError } = useAdminDepartmentsList({
    search,
    page,
    limit: PAGE_SIZE,
  });

  const total = data?.total || 0;
  const deps = data?.departments || [];
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
        <h1 className="text-2xl font-bold">Departments</h1>
        <AddDepartmentModal />
      </div>
      <div className="mb-4 flex">
        <input
          type="text"
          value={search}
          onChange={handleSearchChange}
          placeholder="Search departments by name or code"
          className="w-64 rounded border border-gray-300 px-3 py-2"
        />
      </div>
      {isLoading ? (
        <Loader />
      ) : isError ? (
        <div className="text-red-600">Error loading departments.</div>
      ) : (
        <>
          {deps.length === 0 ? (
            <div className="mb-6 w-full rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center font-semibold text-yellow-700 shadow-sm">
              No department here.
            </div>
          ) : (
            <DepartmentTable departments={deps} />
          )}
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
            <span className="ml-4 text-sm text-gray-500">
              {total} departments
            </span>
          </div>
        </>
      )}
    </div>
  );
}
