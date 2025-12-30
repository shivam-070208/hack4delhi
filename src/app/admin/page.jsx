import StatCard from "./components/StatCard";
import DashboardChart from "./components/DashboardChart";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-8 space-y-8 text-slate-800">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Admin Overview</h1>
          <p className="text-slate-500 mt-1">Welcome back, here is what's happening today.</p>
        </div>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-md shadow-indigo-200">
          Download Report
        </button>
      </header>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Employees" value="120" trend="+4%" icon="users" />
        <StatCard title="HR Department" value="15" trend="Stable" icon="briefcase" />
        <StatCard title="Salary Disbursed" value="₹25L" trend="+12%" icon="wallet" />
        <StatCard title="Active Now" value="98" trend="Live" icon="pulse" />
      </div>

      {/* CHART SECTION */}
      <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-hover hover:shadow-md">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Analytics Overview</h3>
          <select className="bg-slate-50 border-none text-sm font-medium rounded-md focus:ring-2 focus:ring-indigo-500">
            <option>Last 30 Days</option>
            <option>Last 6 Months</option>
          </select>
        </div>
        <DashboardChart />
      </div>
    </div>
  );
}
