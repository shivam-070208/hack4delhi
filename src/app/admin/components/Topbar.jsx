import { Bell, Search, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-10 flex items-center justify-between px-8">
      {/* Left Side: Search Bar */}
      <div className="hidden md:flex items-center relative w-96">
        <Search className="absolute left-3 w-4 h-4 text-slate-400" />
        <input 
          type="text" 
          placeholder="Search for employees, documents..." 
          className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all outline-none"
        />
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative p-2 text-slate-500 hover:bg-slate-50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>

        {/* User Profile */}
        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-900 leading-none">Alex Rivera</p>
            <p className="text-xs text-slate-500 mt-1">Super Admin</p>
          </div>
          
          <div className="relative">
            <img 
              src="https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=fff" 
              alt="Admin Profile"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-transparent group-hover:ring-indigo-100 transition-all"
            />
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
          </div>
          
          <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
        </div>
      </div>
    </header>
  );
}
