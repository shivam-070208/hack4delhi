import { Bell, Search, ChevronDown } from "lucide-react";

export default function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
      {/* Left Side: Search Bar */}
      <div className="relative hidden w-96 items-center md:flex">
        <Search className="absolute left-3 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search for employees, documents..."
          className="w-full rounded-xl border-none bg-slate-50 py-2 pr-4 pl-10 text-sm transition-all outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Right Side: Actions & Profile */}
      <div className="flex items-center gap-6">
        {/* Notifications */}
        <button className="relative rounded-lg p-2 text-slate-500 transition-colors hover:bg-slate-50">
          <Bell className="h-5 w-5" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full border-2 border-white bg-red-500"></span>
        </button>

        {/* Divider */}
        <div className="mx-2 h-8 w-[1px] bg-slate-200"></div>

        {/* User Profile */}
        <div className="group flex cursor-pointer items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-sm leading-none font-semibold text-slate-900">
              Alex Rivera
            </p>
            <p className="mt-1 text-xs text-slate-500">Super Admin</p>
          </div>

          <div className="relative">
            <img
              src="https://ui-avatars.com/api/?name=Alex+Rivera&background=6366f1&color=fff"
              alt="Admin Profile"
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-transparent transition-all group-hover:ring-indigo-100"
            />
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
}
