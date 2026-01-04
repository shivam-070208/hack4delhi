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
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-6">
          My Grievances
        </h1>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Grievance submission form */}
          <form
            onSubmit={handleSubmit}
            className="flex-1 mb-6 bg-white border rounded-2xl p-8 shadow-lg space-y-6"
            style={{ minWidth: "320px", maxWidth: 440 }}
          >
            <h2 className="font-bold text-lg text-slate-800 mb-4">
              Submit a Grievance
            </h2>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Subject
              </label>
              <input
                type="text"
                required
                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-base shadow-sm focus:outline-none focus:border-indigo-500 transition"
                value={form.subject}
                onChange={(e) =>
                  setForm((f) => ({ ...f, subject: e.target.value }))
                }
                placeholder="Enter subject"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2 text-slate-700">
                Message
              </label>
              <textarea
                required
                rows={5}
                className="w-full border border-slate-200 rounded-lg px-4 py-2 text-base shadow-sm resize-none focus:outline-none focus:border-indigo-500 transition"
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
              className={`w-full py-3 rounded-lg font-bold text-base transition-colors shadow-sm ${
                loading
                  ? "bg-indigo-300 text-white cursor-not-allowed"
                  : "bg-indigo-600 text-white hover:bg-indigo-700"
              }`}
            >
              {loading ? "Submitting..." : "Submit Grievance"}
            </button>
            <div className="min-h-[24px]">
              {error && (
                <div className="text-red-500 mt-2 text-sm text-center">{error}</div>
              )}
              {success && (
                <div className="text-green-600 mt-2 text-sm text-center">
                  {success}
                </div>
              )}
            </div>
          </form>

          {/* Grievance list/table */}
          <div className="flex-1 w-full">
            <div className="bg-white border rounded-2xl shadow-lg overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-100">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="py-4 px-5 text-left text-slate-700 font-semibold">Date</th>
                    <th className="py-4 px-5 text-left text-slate-700 font-semibold">Subject</th>
                    <th className="py-4 px-5 text-left text-slate-700 font-semibold">Message</th>
                    <th className="py-4 px-5 text-left text-slate-700 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {(!grievances || grievances.length === 0) && (
                    <tr>
                      <td colSpan={4} className="py-8 text-slate-500 text-center text-base font-medium">
                        No grievances found.
                      </td>
                    </tr>
                  )}

                  {grievances &&
                    grievances.map((g, i) => (
                      <tr
                        key={g._id || i}
                        className={`border-b last:border-b-0 ${
                          i % 2 === 0 ? 'bg-white' : 'bg-slate-50'
                        }`}
                      >
                        <td className="py-3 px-5 whitespace-nowrap text-slate-700 text-sm">
                          {g.createdAt
                            ? new Date(g.createdAt).toLocaleDateString()
                            : "-"}
                        </td>
                        <td className="py-3 px-5 whitespace-nowrap max-w-xs text-slate-900 font-semibold text-sm">
                          {g.subject || "-"}
                        </td>
                        <td className="py-3 px-5 break-words max-w-xl text-slate-700 text-sm" style={{ wordBreak: "break-word" }}>
                          {
                            // Prefer g.message, but if missing use g.description (produced by API)
                            g.message || g.description || "-"
                          }
                        </td>
                        <td className="py-3 px-5">
                          <span
                            className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide ${
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
