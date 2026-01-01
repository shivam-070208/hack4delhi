"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useAdminUser, useAdminDeleteUser } from "@/hooks/useAdmin";
import Image from "next/image";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip as ChartTooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { confirmAlert } from "react-confirm-alert";

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

const barColors = [
  "#2563eb",
  "#ec4899",
  "#f59e42",
  "#22c55e",
  "#6366f1",
  "#f43f5e",
  "#14b8a6",
];

function UserChart({ data }) {
  if (!data || !data.length || Math.max(...data.map((d) => d.value), 0) === 0) {
    return (
      <div className="flex h-36 w-full items-center justify-center rounded border border-neutral-300 bg-white">
        <span className="text-sm font-semibold text-neutral-400">
          No chart data
        </span>
      </div>
    );
  }

  const labels = data.map((item) => item.label);

  const chartJsData = {
    labels,
    datasets: [
      {
        label: "Amount",
        data: data.map((item) => item.value),
        backgroundColor: data.map((_, i) => barColors[i % barColors.length]),
        borderRadius: 6,
        barPercentage: 0.68,
        categoryPercentage: 0.56,
        borderWidth: 0,
        hoverBackgroundColor: "#0284c7",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#222",
        titleColor: "#60a5fa",
        bodyColor: "#facc15",
        padding: 12,
        callbacks: {
          label: (context) => ` ₹${context.parsed.y}`,
        },
      },
    },
    layout: {
      padding: {
        right: 18,
        left: 10,
        top: 2,
        bottom: 2,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: "600",
          },
          color: "#22223b",
        },
        border: {
          display: false,
        },
      },
      y: {
        grid: {
          color: "#e5e7eb",
          borderDash: [4, 2],
        },
        ticks: {
          callback: (value) => `₹${value}`,
          font: {
            size: 13,
            family: "Inter, sans-serif",
            weight: "500",
          },
          color: "#737373",
        },
        border: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="flex h-60 w-full items-center rounded-lg border border-neutral-200 bg-white px-4 py-4 shadow-sm">
      <div style={{ width: "100%", height: "190px" }}>
        <Bar data={chartJsData} options={options} />
      </div>
    </div>
  );
}

export default function UserviewPage({ id }) {
  const router = useRouter();
  const { data } = useAdminUser(id);
  const del = useAdminDeleteUser();
  if (!data) {
    return (
      <Card className="mx-auto mt-16 max-w-xl border border-neutral-200 bg-white p-7 shadow-lg">
        <CardContent>
          <Alert
            variant="destructive"
            className="rounded-md border border-neutral-200 bg-white shadow-sm"
          >
            <AlertTitle className="text-xl font-semibold text-rose-600">
              No Data
            </AlertTitle>
            <AlertDescription className="text-base text-neutral-700">
              User information not found.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  const { user = {}, chartData = [], total = 0 } = data;

  const handleDelete = async () => {
    const handleReactConfirm = () => {
      confirmAlert({
        title: (
          <span style={{ color: "#e11d48", fontWeight: "bold" }}>
            Delete this HR user?
          </span>
        ),
        message: (
          <span style={{ color: "#22223b" }}>This cannot be undone.</span>
        ),
        buttons: [
          {
            label: "Delete",
            className: "react-confirm-alert-button--danger",
            style: { background: "#e11d48", color: "#fff" },
            onClick: async () => {
              try {
                await del.mutateAsync(id);
                toast.success("User deleted successfully");
                router.push("/admin/dashboard/users");
              } catch (e) {
                toast.error("Failed to delete user");
              }
            },
          },
          {
            label: "Cancel",
            className: "react-confirm-alert-button--cancel",
            style: { background: "#64748b", color: "#fff" },
            onClick: () => {},
          },
        ],
        closeOnClickOutside: true,
      });
    };
    handleReactConfirm();
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl flex-1 space-y-9 rounded-xl bg-white p-7 shadow-none">
      <Card className="rounded-lg border border-neutral-200 bg-white shadow-md">
        <CardHeader className="flex flex-row items-center gap-7 pb-3">
          <div>
            <Image
              src={user.image || "/profile-placeholder.png"}
              alt="avatar"
              width={90}
              height={90}
              className="h-24 w-24 rounded-xl border-2 border-neutral-200 bg-neutral-100 object-cover shadow-sm"
            />
          </div>
          <div className="flex-1 space-y-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold tracking-tight text-neutral-800">
              <span>{user.name}</span>
              <Badge
                variant="outline"
                className={
                  user.status === "active"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                    : user.status === "inactive"
                      ? "border-yellow-400 bg-yellow-50 text-yellow-700"
                      : "border-neutral-300 bg-neutral-100 text-neutral-600"
                }
              >
                {user.status || "-"}
              </Badge>
            </CardTitle>
            <div className="text-[15px] font-medium text-neutral-500">
              {user.email}
            </div>
            <div className="text-[15px] font-semibold text-blue-700 capitalize">
              Role: <span className="font-semibold">{user.role}</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="mb-0.5 text-[15px] font-semibold text-[#334155]">
              Total {user.role === "HR" ? "Funds" : "Paid"}:
            </div>
            <div className="text-2xl font-bold text-blue-600">
              ₹ {total ?? 0}
            </div>
          </div>
        </CardHeader>
        <Separator className="bg-neutral-200" />
        <CardContent>
          <div className="py-5">
            <h3 className="mb-2 text-lg font-semibold text-blue-700">
              {user.role === "HR" ? "Funds Over Time" : "Payouts Over Time"}
            </h3>
            <UserChart data={chartData} />
          </div>
          <Separator className="my-6 bg-neutral-200" />
          <div className="space-y-2">
            <h3 className="mb-2 text-[17px] font-semibold text-[#444b5d]">
              Details
            </h3>
            <ul className="space-y-1 text-[15px]">
              <li className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">Name:</span>
                <span className="text-neutral-900">{user.name}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">Email:</span>
                <span className="text-neutral-900">{user.email}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="font-semibold text-neutral-700">Role:</span>
                <span className="text-blue-700">{user.role}</span>
              </li>
            </ul>
          </div>
          {user.role === "HR" && (
            <>
              <Separator className="my-7 bg-neutral-200" />
              <div className="flex justify-end">
                <Button
                  variant="destructive"
                  onClick={handleDelete}
                  disabled={del.isLoading}
                  className="rounded-md bg-rose-600 px-7 py-2 text-base font-semibold text-white shadow transition hover:bg-rose-700"
                >
                  {del.isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-5 w-5 animate-spin text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8z"
                        />
                      </svg>
                      Deleting...
                    </span>
                  ) : (
                    "Delete HR"
                  )}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
