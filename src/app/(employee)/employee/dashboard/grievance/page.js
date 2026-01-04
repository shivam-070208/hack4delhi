"use client";
import React, { useEffect, useState } from "react";

export default function GrievancePage() {
  // 'form' keeps subject and message fields
  const [form, setForm] = useState({ subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [grievances, setGrievances] = useState([]);

  // Fetch all grievances for the logged-in employee
  useEffect(() => {
    fetch("/api/employee/grievance")
      .then((r) => r.json())
      .then((d) => {
        // API returns array of grievances
        setGrievances(Array.isArray(d) ? d : d.data || []);
      });
  }, []);

  // When submitting the grievance, 'subject' (form.subject) and 'message' (form.message) are posted;
  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      const r = await fetch("/api/employee/grievance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject: form.subject, message: form.message }),
      });
      const d = await r.json();
      if (!r.ok) throw new Error(d.error || "Failed to submit");

      setSuccess("Grievance submitted");
      setForm({ subject: "", message: "" });
      // returned object has: _id, subject, description, status, createdAt, updatedAt
      // but our component expects message to show inside the table, so we harmonize it below
      setGrievances((prev) => [
        {
          ...d,
          message: d.description, // use description as message for UI display
        },
        ...prev,
      ]);
    } catch (e) {
      setError(e.message || "Error");
    }
    setLoading(false);
  }

  // Render
  return (
    <section className="min-h-screen flex-1 space-y-10 bg-[#fbfcfd] p-4 md:p-10">
      <div className="mx-auto w-full max-w-5xl">
        <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          My Grievances
        </h1>
        <div className="flex flex-col gap-8 md:flex-row">
          {/* Grievance submission form */}
          <form
            onSubmit={handleSubmit}
            className="mb-6 flex-1 space-y-6 rounded-2xl border bg-white p-8 shadow-lg"
            style={{ minWidth: "320px", maxWidth: 440 }}
          >
            <h2 className="mb-4 text-lg font-bold text-slate-800">
              Submit a Grievance
            </h2>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full rounded-lg border border-slate-200 px-4 py-2 text-base shadow-sm transition focus:border-indigo-500 focus:outline-none"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Enter subject"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full resize-none rounded-lg border border-slate-200 px-4 py-2 text-base shadow-sm transition focus:border-indigo-500 focus:outline-none"
                value={form.message}
                onChange={(e) =>
                  setForm((f) => ({ ...f, message: e.target.value }))
                }
                placeholder="Describe your grievance..."
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full rounded-lg py-3 text-base font-bold shadow-sm transition-colors ${
                loading
                  ? "cursor-not-allowed bg-indigo-300 text-white"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Grievance"}
            </button>
            <div className="min-h-[24px]">
              {error && (
                <div className="mt-2 text-center text-sm text-red-500">
                  {error}
                </div>
              )}
              {success && (
                <div className="mt-2 text-center text-sm text-green-600">
                  {success}
                </div>
              )}
            </div>
          </form>

          {/* Grievance list/table */}
          <div className="w-full flex-1">
            <div className="overflow-x-auto rounded-2xl border bg-white shadow-lg">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-5 py-4 text-left font-semibold text-slate-700">
                      Date
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-slate-700">
                      Subject
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-slate-700">
                      Message
                    </th>
                    <th className="px-5 py-4 text-left font-semibold text-slate-700">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(!grievances || grievances.length === 0) && (
                    <tr>
                      <td
                        colSpan={4}
                        className="py-8 text-center text-base font-medium text-slate-500"
                      >
                        No grievances found.
                      </td>
                    </tr>
                  )}

                  {grievances &&
                    grievances.map((g, i) => (
                      <tr
                        key={g._id || i}
                        className={`border-b last:border-b-0 ${
                          i % 2 === 0 ? "bg-white" : "bg-slate-50"
                        }`}
                      >
                        <td className="px-5 py-3 text-sm whitespace-nowrap text-slate-700">
                          {g.createdAt
                            ? new Date(g.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="max-w-xs px-5 py-3 text-sm font-semibold whitespace-nowrap text-slate-900">
                          {g.subject || "-"}
                        </td>
                        <td
                          className="max-w-xl px-5 py-3 text-sm break-words text-slate-700"
                          style={{ wordBreak: "break-word" }}
                        >
                          {
                            // Prefer g.message, but if missing use g.description (produced by API)
                            g.message || g.description || "-"
                          }
                        </td>
                        <td className="px-5 py-3">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold tracking-wide ${
                              g.status === "resolved"
                                ? "bg-green-100 text-green-700"
                                : g.status === "rejected"
                                  ? "bg-rose-100 text-rose-700"
                                  : "bg-slate-100 text-slate-700"
                            }`}
                          >
                            {g.status
                              ? g.status.charAt(0).toUpperCase() +
                                g.status.slice(1)
                              : "Pending"}
                          </span>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
