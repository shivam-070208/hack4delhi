"use client";
import React from "react";

function dayColor(status) {
  if (!status) return "bg-gray-200";
  if (status === "present") return "bg-green-500";
  if (status === "halfday") return "bg-yellow-400";
  return "bg-red-500";
}

export default function AttendanceGrid({ records = [] }) {
  const map = new Map(
    records.map((r) => [new Date(r.date).toDateString(), r.status]),
  );
  const today = new Date();
  const start = new Date();
  start.setFullYear(today.getFullYear() - 1);
  const days = [];
  for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
    days.push(new Date(d));
  }
  if (records.length === 0)
    return <div className="p-4">No attendance recorded yet</div>;
  return (
    <div className="p-4 max-h-20 overflow-scroll">
      <div
        className="grid grid-cols-3 gap-1"
        style={{ gridAutoColumns: "12px" }}
      >
        {days.map((d) => {
          const key = d.toDateString();
          const status = map.get(key);
          return (
            <div
              key={key}
              title={key}
              className={`h-3 w-3 ${dayColor(status)} rounded-sm`}
            />
          );
        })}
      </div>
    </div>
  );
}
