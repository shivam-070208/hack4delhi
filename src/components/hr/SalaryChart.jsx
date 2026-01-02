"use client";
import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

export default function SalaryChart({ records = [] }) {
  const labels = records.map((r) => r.month).reverse();
  const data = {
    labels,
    datasets: [
      {
        label: "Paid",
        data: records.map((r) => r.amount).reverse(),
        backgroundColor: "rgba(37,99,235,0.7)",
      },
    ],
  };
  return (
    <div className="p-2">
      <div className="relative">
        <Bar data={data} />
        {records.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70">
            <div className="text-gray-600">No salary provided yet</div>
          </div>
        )}
      </div>
    </div>
  );
}
