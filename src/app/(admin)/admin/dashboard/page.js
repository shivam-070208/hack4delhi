"use client"
import StatCard from "@/components/admin/dashboard/StatCard";
import DashboardChart from "@/components/admin/dashboard/DashboardChart";
import { useAdminDashboard } from "../../../../hooks/useAdmin";

export default function AdminDashboard() {
  const {data} = useAdminDashboard()
  const dashboardData = data?.data
  return (
    <div className="min-h-screen space-y-8 bg-[#f8fafc] p-8 text-slate-800">
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Overview
          </h1>
          <p className="mt-1 text-slate-500">
            Welcome back, here is what&apos;s happening today.
          </p>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value={`${dashboardData?.totalWorkingEmployees ?? 0}`}
          trend={
            dashboardData?.totalWorkingEmployeesTrend
              ? dashboardData.totalWorkingEmployeesTrend
              : "+0%"
          }
          icon="users"
        />
        <StatCard
          title="HR Department"
          value={`${dashboardData?.totalHR ?? 0}`}
          trend={
            dashboardData?.totalHRTrend
              ? dashboardData.totalHRTrend
              : "Stable"
          }
          icon="briefcase"
        />
        <StatCard
          title="Salary Disbursed"
          value={
            dashboardData?.totalSalaryDisbursed != null
              ? `₹${dashboardData.totalSalaryDisbursed}L`
              : "₹0L"
          }
          trend={
            dashboardData?.salaryDisbursedTrend
              ? dashboardData.salaryDisbursedTrend
              : "+0%"
          }
          icon="wallet"
        />
        <StatCard
          title="Active Now"
          value={`${dashboardData?.activeNow ?? 0}`}
          trend={dashboardData?.activeNowTrend ? dashboardData.activeNowTrend : "Live"}
          icon="pulse"
        />
      </div>

      {/* CHART SECTION */}
      <div className="transition-hover rounded-2xl border border-slate-100 bg-white p-6 shadow-sm hover:shadow-md">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <select className="rounded-md border-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-indigo-500">
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <DashboardChart />
      </div>
    </div>
  );
}
