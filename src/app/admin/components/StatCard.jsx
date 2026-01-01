import { TrendingUp, Users, Briefcase, Wallet, Activity } from "lucide-react";

export default function StatCard({ title, value, trend, icon }) {
  // Map icons to names for easy use
  const icons = {
    users: <Users className="w-5 h-5 text-indigo-600" />,
    briefcase: <Briefcase className="w-5 h-5 text-emerald-600" />,
    wallet: <Wallet className="w-5 h-5 text-amber-600" />,
    pulse: <Activity className="w-5 h-5 text-rose-600" />,
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
            {value}
          </h2>
        </div>
        
        {/* Icon Container with dynamic background */}
        <div className={`p-3 rounded-xl transition-colors group-hover:scale-110 duration-300 ${
          icon === 'users' ? 'bg-indigo-50' : 
          icon === 'briefcase' ? 'bg-emerald-50' : 
          icon === 'wallet' ? 'bg-amber-50' : 'bg-rose-50'
        }`}>
          {icons[icon]}
        </div>
      </div>

      {/* Trend Indicator */}
      {trend && (
        <div className="mt-4 flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </div>
          <span className="text-xs text-slate-400 font-medium">vs last month</span>
        </div>
      )}
    </div>
  );
}