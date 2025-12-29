"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  Settings,
  LogOut,
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
    <aside className="sticky top-0 flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
      {/* Brand Logo */}
      <div className="flex items-center gap-3 p-8">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
        </div>
        <span className="text-xl font-bold tracking-tight text-slate-900">
          Nexus<span className="text-indigo-600">HR</span>
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 px-4">
        <p className="mb-4 px-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
          Main Menu
        </p>

        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <item.icon
                className={`h-5 w-5 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"}`}
              />
              <span className="font-medium">{item.name}</span>
              {isActive && (
                <div className="ml-auto h-1.5 w-1.5 rounded-full bg-indigo-600" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom Profile/Logout Section */}
      <div className="mt-auto border-t border-slate-100 p-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-5 w-5" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
}
