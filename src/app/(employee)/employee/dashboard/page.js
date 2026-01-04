"use client";
import React, { useEffect, useState } from "react";

// StatCard remains unchanged
function StatCard({ title, value, icon, accentColor, items }) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-100 bg-white p-6 shadow">
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentColor} text-lg text-white`}
        >
          <span>{icon}</span>
        </div>
        <div>
          <div className="text-md font-bold text-slate-900">{title}</div>
          {value && <div className="text-xs text-slate-500">{value}</div>}
        </div>
      </div>
      {items && (
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {items.map((item, idx) => (
            <li key={idx}>• {item}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

const icons = {
  attendance: "🗓️",
  salary: "💸",
  leave: "🌴",
  grievance: "📝",
};

const accentColors = {
  attendance: "bg-indigo-500",
  salary: "bg-green-500",
  leave: "bg-yellow-500",
  grievance: "bg-rose-500",
};

export default function EmployeeDashboard() {
  const [stats, setStats] = useState(null);
  const [chartRaw, setChartRaw] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      const [s, c] = await Promise.all([
        fetch("/api/employee/dashboard").then((r) => r.json()),
        fetch("/api/employee/attendance/monthly").then((r) => r.json()),
      ]);
      setStats(s);
      setChartRaw(c);
      setLoading(false);
    }
    fetchData();
  }, []);

  // Defensive helper to safely access nested values with fallback
  function safe(obj, path, fallback = "N/A") {
    if (!obj) return fallback;
    try {
      return (
        path.split(".").reduce((o, k) => (o ? o[k] : undefined), obj) ??
        fallback
      );
    } catch {
      return fallback;
    }
  }

  // --- Chart Transform ---
  // Accepts chartRaw ({ chart: [ { date, status, ... } ] }) and converts to format for <AttendanceBarChart data={...}>
  function getChartBarData(monthlyData) {
    // Defensive: API can be shape { chart: [...] } or { data: [...] }
    const chartArray =
      (monthlyData && Array.isArray(monthlyData.chart) && monthlyData.chart) ||
      (monthlyData && Array.isArray(monthlyData.data) && monthlyData.data);

    if (!Array.isArray(chartArray) || chartArray.length === 0) return [];

    // Limit label clutter: only show 1, 5, 10, ... etc, but bar for every day
    // Count present, absent, leave in this month
    const statusColor = {
      present: "#6366f1", // indigo-500
      absent: "#e5e7eb", // slate-200
      leave: "#fde68a", // yellow-300
      halfday: "#38bdf8", // sky-400
    };

    return chartArray.map((rec, idx) => {
      // Allow for status 'present', 'absent', 'leave'
      let barColor = statusColor[rec.status] || "#e5e7eb";
      // Default height scale: 100 for present, 60 for halfday/leave, 10 for absent
      let value =
        rec.status === "present"
          ? 32
          : rec.status === "halfday"
            ? 18
            : rec.status === "leave"
              ? 24
              : 8;
      // Label only for 1st, 5th, 10th, 15th, 20th, 25th, last day
      let label = "";
      const dayNum = parseInt(rec.date?.slice(-2), 10);
      if (
        idx === 0 ||
        (dayNum % 5 === 0 && dayNum <= 25) ||
        idx === chartArray.length - 1
      ) {
        label = `${dayNum}`;
      }
      return {
        label,
        value,
        status: rec.status,
        color: barColor,
        raw: rec,
      };
    });
  }

  // Only convert if loaded and chartRaw is present
  const chartBarData = !loading && chartRaw ? getChartBarData(chartRaw) : null;

  return (
    <section className="min-h-screen flex-1 space-y-10 bg-[#fbfcfd] p-6 md:p-10">
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Employee Dashboard
        </h1>
        <p className="mt-2 text-base font-medium text-slate-500">
          Welcome! Overview of your activities, payroll, and attendance.
        </p>
        <div className="absolute top-0 -left-6 h-full w-1 rounded-r-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
      </div>

      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Attendance"
          icon={icons.attendance}
          accentColor={accentColors.attendance}
          items={
            loading || !stats
              ? ["Loading..."]
              : [
                  `Present Days: ${safe(stats, "attendance.present", 0)}`,
                  `Absent: ${safe(stats, "attendance.absent", 0)}`,
                  `Leaves: ${safe(stats, "attendance.leaves", 0)}`,
                ]
          }
        />
        <StatCard
          title="Salary"
          icon={icons.salary}
          accentColor={accentColors.salary}
          items={
            loading || !stats
              ? ["Loading..."]
              : stats.salary
                ? [
                    `Month: ${safe(stats, "salary.month", "N/A")}`,
                    `Amount: ₹${safe(stats, "salary.amount", "N/A")}`,
                    `Status: ${safe(stats, "salary.status", "N/A")}`,
                  ]
                : ["No salary record found."]
          }
        />
        <StatCard
          title="Leave Balance"
          icon={icons.leave}
          accentColor={accentColors.leave}
          items={
            loading || !stats
              ? ["Loading..."]
              : stats.leave
                ? [
                    `Annual: ${safe(stats, "leave.annual", 0)} available`,
                    `Sick: ${safe(stats, "leave.sick", 0)} available`,
                    `Casual: ${safe(stats, "leave.casual", 0)} available`,
                  ]
                : ["No leave data."]
          }
        />
        <StatCard
          title="Grievances"
          icon={icons.grievance}
          accentColor={accentColors.grievance}
          items={
            loading || !stats
              ? ["Loading..."]
              : stats.grievance
                ? [
                    `Open: ${safe(stats, "grievance.open", 0)}`,
                    `Resolved: ${safe(stats, "grievance.resolved", 0)}`,
                  ]
                : ["No grievance data."]
          }
        />
      </div>

      <div className="w-full rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">
              Monthly Attendance Overview
            </h3>
            <p className="text-sm text-slate-400">
              Track your attendance this month
            </p>
          </div>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
            Download Report
          </button>
        </div>
        <div className="flex h-64 items-center justify-center text-slate-400">
          {loading || !chartBarData ? (
            <span>Loading chart...</span>
          ) : (
            <AttendanceBarChart data={chartBarData} />
          )}
        </div>
      </div>
    </section>
  );
}

// Improved chart: Shows daily attendance as a colored bar per-day,
// uses different colors and bar heights for present/absent/leave
function AttendanceBarChart({ data }) {
  if (!Array.isArray(data) || data.length === 0) {
    return <span>No data</span>;
  }

  return (
    <div className="flex h-full w-full items-end gap-[2px]">
      {data.map((d, i) => (
        <div
          key={i}
          className="flex flex-1 flex-col items-center"
          title={d.raw?.date + (d.status ? `: ${d.status}` : "")}
        >
          {/* Bar */}
          <div
            className="w-full rounded-t-md"
            style={{
              height: `${d.value * 5}px`,
              minHeight: "6px",
              background: d.color,
              transition: "background 0.2s",
            }}
          ></div>
          {/* Label on selected days only */}
          <div className="mt-1 text-[10px] text-slate-400">{d.label}</div>
        </div>
      ))}
    </div>
  );
}
