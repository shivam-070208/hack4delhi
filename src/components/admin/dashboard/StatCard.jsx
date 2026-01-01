import { TrendingUp, Users, Briefcase, Wallet, Activity } from "lucide-react";

export default function StatCard({ title, value, trend, icon }) {
  // Map icons to names for easy use
  const icons = {
    users: <Users className="h-5 w-5 text-indigo-600" />,
    briefcase: <Briefcase className="h-5 w-5 text-emerald-600" />,
    wallet: <Wallet className="h-5 w-5 text-amber-600" />,
    pulse: <Activity className="h-5 w-5 text-rose-600" />,
  };

  return (
    <div className="group cursor-default rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md">
      <div className="flex items-start justify-between">
        <div>
          <p className="mb-1 text-sm font-medium text-slate-500">{title}</p>
          <h2 className="text-3xl font-bold tracking-tight text-slate-900">
            {value}
          </h2>
        </div>

        {/* Icon Container with dynamic background */}
        <div
          className={`rounded-xl p-3 transition-colors duration-300 group-hover:scale-110 ${
            icon === "users"
              ? "bg-indigo-50"
              : icon === "briefcase"
                ? "bg-emerald-50"
                : icon === "wallet"
                  ? "bg-amber-50"
                  : "bg-rose-50"
          }`}
        >
          {icons[icon]}
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1 rounded-lg bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-600">
            <TrendingUp className="h-3 w-3" />
            {trend}
          </div>
          <span className="text-xs font-medium text-slate-400">
            vs last month
          </span>
        </div>
      )}
    </div>
  );
}
