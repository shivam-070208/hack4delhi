"use client";

import { useState } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Legend,
);

/* ---------------- ATTENDANCE DATA ---------------- */

const attendanceData = {
  labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
  datasets: [
    {
      label: "Employees Present",
      data: [
        80, 82, 85, 90, 88, 92, 95, 93, 94, 96, 97, 95, 96, 94, 93, 92, 90, 91,
        92, 94, 95, 96, 97, 96, 95, 94, 93, 92, 91, 90,
      ],
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59,130,246,0.2)",
      tension: 0.3,
    },
  ],
};

/* ================= PAYROLL COMBO DATA ================= */

const payrollComboData = {
  labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
  datasets: [
    {
      type: "bar",
      label: "Processed Salary",
      data: [1200000, 1300000, 1250000, 1280000, 1350000, 1400000],
      backgroundColor: "#22c55e",
      stack: "salary",
      borderRadius: 4,
      barPercentage: 0.4, // smaller width
      categoryPercentage: 0.5,
    },
    {
      type: "bar",
      label: "Pending Salary",
      data: [300000, 200000, 250000, 220000, 150000, 100000],
      backgroundColor: "#f97316",
      stack: "salary",
      borderRadius: 4,
      barPercentage: 0.4,
      categoryPercentage: 0.5,
    },
    {
      type: "line",
      label: "Employees Paid",
      data: [95, 100, 98, 99, 102, 105],
      borderColor: "#3b82f6",
      backgroundColor: "#3b82f6",
      tension: 0.3,
      yAxisID: "employees",
      borderWidth: 3,
      pointRadius: 5,
      pointHoverRadius: 7,
      pointBackgroundColor: "#3b82f6",
    },
  ],
};

/* ================= PAYROLL OPTIONS ================= */

const payrollOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false,
  },
  plugins: {
    tooltip: {
      callbacks: {
        label: function (context) {
          const datasetLabel = context.dataset.label || "";
          const value = context.raw;
          if (datasetLabel === "Processed Salary") {
            const pending = context.chart.data.datasets.find(
              (d) => d.label === "Pending Salary",
            ).data[context.dataIndex];
            const percent = ((value / (value + pending)) * 100).toFixed(1);
            return `${datasetLabel}: ₹${value.toLocaleString()} (${percent}%)`;
          }
          if (datasetLabel === "Pending Salary") {
            return `${datasetLabel}: ₹${value.toLocaleString()}`;
          }
          return `${datasetLabel}: ${value}`;
        },
      },
    },
    legend: {
      position: "top",
    },
  },
  scales: {
    x: {
      stacked: true,
      ticks: {
        font: {
          weight: "500",
        },
      },
    },
    y: {
      stacked: true,
      title: {
        display: true,
        text: "Salary Amount (₹)",
      },
    },
    employees: {
      position: "right",
      grid: {
        drawOnChartArea: false,
      },
      title: {
        display: true,
        text: "Employees Paid",
      },
    },
  },
};

/* ---------------- COMPONENT ---------------- */

export default function HrDashboardChart() {
  const [active, setActive] = useState("attendance");

  return (
    <div className="bg-card border-border rounded-2xl border p-6 shadow-sm">
      {/* TOGGLE */}
      <div className="mb-6 flex gap-3">
        <button
          onClick={() => setActive("attendance")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            active === "attendance"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          Monthly Attendance
        </button>

        <button
          onClick={() => setActive("payroll")}
          className={`rounded-full px-4 py-1.5 text-sm transition ${
            active === "payroll"
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-accent"
          }`}
        >
          Payroll Overview
        </button>
      </div>

      {/* GRAPH */}
      <div className="h-[340px]">
        {active === "attendance" ? (
          <Line
            data={attendanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        ) : (
          <Bar
            data={payrollComboData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                y: {
                  stacked: true,
                  title: {
                    display: true,
                    text: "Payroll Count",
                  },
                },
                y1: {
                  position: "right",
                  grid: {
                    drawOnChartArea: false,
                  },
                  title: {
                    display: true,
                    text: "Employees Paid",
                  },
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
}
