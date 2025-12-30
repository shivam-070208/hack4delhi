"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  UserCircle,
  Users,
  Briefcase,
  CalendarCheck,
  Shuffle,
  IndianRupee,
  BarChart3,
  MessageSquareWarning,
  LogOut,
} from "lucide-react";

export default function HRSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/HR", icon: UserCircle },
    { name: "Employee Management", href: "/hr/employees", icon: Users },
    { name: "Recruitment", href: "/HR/recruitment", icon: Briefcase },
    { name: "Attendance", href: "/HR/attendance", icon: CalendarCheck },
    { name: "Transfer & Posting", href: "/HR/transfer-posting", icon: Shuffle },
    { name: "Salary Management", href: "/HR/salary", icon: IndianRupee },
    { name: "Reports & Analytics", href: "/HR/reports", icon: BarChart3 },
    { name: "Grievance Redressal", href: "/HR/grievance", icon: MessageSquareWarning },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-72 border-r border-slate-200 bg-white">
      
      {/* LOGO */}
      <div className="flex items-center gap-3 p-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <div className="h-4 w-4 rotate-45 rounded-sm bg-white" />
        </div>
        <span className="text-xl font-bold">
          Nexus<span className="text-indigo-600">HR</span>
        </span>
      </div>

      {/* MENU */}
      <nav className="space-y-1 px-3">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 transition ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* LOGOUT */}
      <div className="absolute bottom-4 w-full px-3">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 hover:bg-red-50 hover:text-red-600">
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
