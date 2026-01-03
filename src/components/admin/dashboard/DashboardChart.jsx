"use client";

import { Line } from "react-chartjs-2";
import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { useAdminDashboard } from "@/hooks/useAdmin";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
);

export default function DashboardChart() {
  const [type, setType] = useState("employee");
  const { data } = useAdminDashboard();
  const chartdata = data?.data?.chartData;

  // Fallback labels if no API data present
  const fallbackLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
  const fallbackDATA = {
    employee: [20, 40, 60, 80, 100, 120],
    hr: [2, 4, 6, 8, 10, 15],
    salary: [5, 10, 15, 20, 22, 25],
  };

  // Use API data if present, otherwise fallback
  const labels = chartdata?.months ?? fallbackLabels;
  const DATA = {
    employee: chartdata?.employee ?? fallbackDATA.employee,
    hr: chartdata?.hr ?? fallbackDATA.hr,
    salary: chartdata?.salary ?? fallbackDATA.salary,
  };

  return (
    <div className="bg-card rounded-xl p-4 shadow">
      {/* TOGGLE BUTTONS */}
      <div className="mb-3 flex gap-2">
        {["employee", "hr", "salary"].map((item) => (
          <button
            key={item}
            onClick={() => setType(item)}
            className={`rounded px-3 py-1 text-sm ${
              type === item ? "bg-primary text-primary-foreground" : "bg-muted"
            }`}
          >
            {item.toUpperCase()}
          </button>
        ))}
      </div>

      {/* FIXED HEIGHT WRAPPER (MOST IMPORTANT) */}
      <div className="h-[280px]">
        <Line
          data={{
            labels: labels,
            datasets: [
              {
                label: type.toUpperCase(),
                data: DATA[type],
                borderColor: "#3b82f6",
                backgroundColor: "rgba(59,130,246,0.2)",
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
          }}
        />
      </div>
    </div>
  );
}
