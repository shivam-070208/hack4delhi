"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  UserSquare2, 
  Settings, 
  LogOut 
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "HR Management", href: "/admin/hr", icon: UserSquare2 },
    { name: "Employees", href: "/admin/employee", icon: Users },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="w-72 bg-white border-r border-slate-200 h-screen flex flex-col sticky top-0">
      {/* Brand Logo */}
      <div className="p-8 flex items-center gap-3">
        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
          <div className="w-4 h-4 bg-white rounded-sm rotate-45" />
        </div>
        <span className="font-bold text-xl tracking-tight text-slate-900">
          Nexus<span className="text-indigo-600">HR</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2">
        <p className="px-4 text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4">
          Main Menu
        </p>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                isActive 
                  ? "bg-indigo-50 text-indigo-600" 
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`} />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout Section */}
      <div className="p-4 mt-auto border-t border-slate-100">
        <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors">
          <LogOut className="w-5 h-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}