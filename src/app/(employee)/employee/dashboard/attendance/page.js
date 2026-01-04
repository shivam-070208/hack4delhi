"use client";
import React, { useEffect, useState, useCallback } from "react";

// Robustly check if a record's date (string, Date, or ISO) is today
function isToday(dateStr) {
  if (!dateStr) return false;
  let d = typeof dateStr === "string" ? new Date(dateStr) : dateStr;
  if (isNaN(d.getTime())) return false; // invalid
  const now = new Date();
  return (
    d.getUTCFullYear() === now.getUTCFullYear() &&
    d.getUTCMonth() === now.getUTCMonth() &&
    d.getUTCDate() === now.getUTCDate()
  );
}

export default function AttendancePage() {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [error, setError] = useState(null);

  const getTodayRecord = useCallback(() => {
    return attendance && attendance.find((r) => r && r.date && isToday(r.date));
  }, [attendance]);
  const todayRecord = getTodayRecord();
  const todayMarked = !!todayRecord;

  // Always refetch attendance after marking
  const fetchAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employee/attendance");
      let data = await res.json();
      let arr =
        Array.isArray(data) && data.length && typeof data[0] === "object"
          ? data
          : data.attendance && Array.isArray(data.attendance)
            ? data.attendance
            : [];
      setAttendance(arr);
    } catch (e) {
      setError("Failed to load attendance data.");
      setAttendance([]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAttendance();
  }, [fetchAttendance]);

  async function handleMarkAttendance() {
    setMarking(true);
    setError(null);
    try {
      const res = await fetch("/api/employee/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "present" }),
      });
      // If error, show error.
      if (!res.ok) {
        const result = await res.json().catch(() => ({}));
        throw new Error(result.error || "Failed to mark attendance");
      }
      // Refetch attendance from server to show today's record
      await fetchAttendance();
    } catch (e) {
      setError(e?.message || "Failed to mark attendance.");
    } finally {
      setMarking(false);
    }
  }

  return (
    <section className="min-h-screen flex-1 space-y-10 bg-[#fbfcfd] p-6 md:p-10">
      <h1 className="mb-3 text-3xl font-extrabold tracking-tight text-slate-900">
        Attendance Log
      </h1>

      {/* Attendance action button and error */}
      {!loading && !todayMarked && (
        <div className="mb-6">
          <button
            onClick={handleMarkAttendance}
            disabled={marking}
            className={`rounded-md px-5 py-2 font-semibold transition-colors ${
              marking
                ? "cursor-not-allowed bg-indigo-300 text-white"
                : "bg-indigo-600 text-white hover:bg-indigo-700"
            }`}
          >
            {marking ? "Marking Attendance..." : "Mark Today's Attendance"}
          </button>
          {error && <div className="mt-2 text-sm text-red-500">{error}</div>}
        </div>
      )}

      {/* Show "Attendance for today already marked" message */}
      {!loading && todayMarked && (
        <div className="mb-6">
          <span className="inline-block rounded bg-green-100 px-4 py-2 font-medium text-green-700 shadow-sm">
            You have marked your attendance for today.
            {todayRecord?.status === "present" ? " (Present)" : ""}
          </span>
        </div>
      )}

      {/* Error if loading fails */}
      {!loading && !attendance?.length && error && (
        <div className="mb-6 text-sm text-red-500">{error}</div>
      )}

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full rounded-xl border border-slate-200 bg-white">
            <thead>
              <tr>
                <th className="border-b bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                  Date
                </th>
                <th className="border-b bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                  Status
                </th>
                <th className="border-b bg-slate-50 px-4 py-3 text-left font-semibold text-slate-700">
                  Hours
                </th>
              </tr>
            </thead>
            <tbody>
              {!attendance || attendance.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-4 text-center text-slate-500">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                attendance.map((record) => (
                  <tr key={record._id || record.date}>
                    <td className="border-b px-4 py-2">
                      {record?.date
                        ? new Date(record.date).toLocaleDateString()
                        : ""}
                    </td>
                    <td className="border-b px-4 py-2 capitalize">
                      {record.status || ""}
                    </td>
                    <td className="border-b px-4 py-2">
                      {typeof record.hours === "number" ? record.hours : ""}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
