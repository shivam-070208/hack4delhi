import HrStatCard from "./components/HrStatCard";
import HrDashboardChart from "./components/HrDashboardChart";

export default function HrPage() {
  return (
    // Background color ko soft slate kiya hai aur padding badha di hai
    <section className="min-h-screen w-full space-y-10 bg-[#fbfcfd] p-6 md:p-10">
      
      {/* Page Title Section */}
      <div className="relative">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          HR Dashboard
        </h1>
        <p className="mt-2 text-base font-medium text-slate-500">
          Overview of employees, recruitment, approvals and reports
        </p>
        {/* Decorative element for modern feel */}
        <div className="absolute -left-6 top-0 h-full w-1 rounded-r-full bg-indigo-600 shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
      </div>

      {/* STAT CARDS - Grid spacing aur layouts improve kiye hain */}
      <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        <HrStatCard
          title="Employee Management"
          icon="users"
          accentColor="bg-blue-500"
          items={[
            "Total Employees: 120",
            "Present Today: 95",
            "On Leave Today: 10",
          ]}
        />

        <HrStatCard
          title="Recruitment Status"
          icon="briefcase"
          accentColor="bg-emerald-500"
          items={[
            "Approved Vacancies: 8",
            "Interviews Today: 3",
            "Pending Requests: 5",
          ]}
        />

        <HrStatCard
          title="Pending Approvals"
          icon="pulse"
          accentColor="bg-amber-500"
          items={[
            "Leave Approval",
            "Transfer Request",
            "Payroll Approval",
          ]}
        />

        <HrStatCard
          title="Reports & Downloads"
          icon="wallet"
          accentColor="bg-rose-500"
          items={[
            "Attendance Report",
            "Payroll Report",
          ]}
        />
      </div>

      {/* GRAPH SECTION - Card container with glass effect */}
      <div className="w-full rounded-[2rem] border border-slate-200/60 bg-white p-8 shadow-xl shadow-slate-200/40">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-800">Analytics Overview</h3>
            <p className="text-sm text-slate-400">Monthly tracking performance</p>
          </div>
          <button className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 transition-all hover:bg-slate-50 active:scale-95">
            View Full Report
          </button>
        </div>
        
        <div className="relative min-h-[300px] w-full">
          <HrDashboardChart />
        </div>
      </div>

    </section>
  );
}