import StatCard from "./components/StatCard";
import DashboardChart from "./components/DashboardChart";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen space-y-8 bg-[#f8fafc] p-8 text-slate-800">
      {/* Header Section */}
      <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Admin Overview
          </h1>
          <p className="mt-1 text-slate-500">
            Welcome back, here is what's happening today.
          </p>
        </div>
        <button className="rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white shadow-md shadow-indigo-200 transition-all hover:bg-indigo-700">
          Download Report
        </button>
      </header>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Employees"
          value="120"
          trend="+4%"
          icon="users"
        />
        <StatCard
          title="HR Department"
          value="15"
          trend="Stable"
          icon="briefcase"
        />
        <StatCard
          title="Salary Disbursed"
          value="₹25L"
          trend="+12%"
          icon="wallet"
        />
        <StatCard title="Active Now" value="98" trend="Live" icon="pulse" />
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
