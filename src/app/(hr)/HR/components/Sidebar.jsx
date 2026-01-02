"use client";
import React, { createContext, useContext, useState, useCallback } from "react";
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
  X as CloseIcon,
} from "lucide-react";
import { signOut } from "next-auth/react";

const HRSidebarContext = createContext();

export function HRSidebarProvider({ children }) {
  const [open, setOpen] = useState(false);

  const openSidebar = useCallback(() => setOpen(true), []);
  const closeSidebar = useCallback(() => setOpen(false), []);

  return (
    <HRSidebarContext.Provider
      value={{ open, closeSidebar, openSidebar, setOpen }}
    >
      {children}
    </HRSidebarContext.Provider>
  );
}

export function useHRSidebar() {
  const context = useContext(HRSidebarContext);
  if (!context)
    throw new Error("useHRSidebar must be used within HRSidebarProvider");
  return context;
}

const menuItems = [
  { name: "Dashboard", href: "/hr/dashboard", icon: UserCircle },
  { name: "Employee Management", href: "/hr/dashboard/employees", icon: Users },

  {
    name: "Fund Requests",
    href: "/hr/dashboard/funds",
    icon: IndianRupee,
  },
  {
    name: "Salary Management",
    href: "/hr/salary",
    icon: IndianRupee,
  },
{
  name:"Attendance Reports",
  href:"/hr/dashboard/attendance",
  icon: BarChart3,
}
];

export default function HRSidebar() {
  const { open, closeSidebar, setOpen } = useHRSidebar();
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-gray-900/30 backdrop-blur-sm transition-opacity md:hidden"
          onClick={closeSidebar}
          aria-label="Sidebar overlay"
        />
      )}
      <aside
        aria-label="Sidebar"
        className={`fixed top-0 left-0 z-50 h-screen w-72 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ${open ? "flex translate-x-0" : "flex -translate-x-full"} `}
        style={{ willChange: "transform" }}
      >
        {/* Close Icon on mobile */}
        <button
          aria-label="Close sidebar"
          className="absolute top-3 right-3 rounded-lg p-2 hover:bg-slate-100 focus:outline-none"
          onClick={() => setOpen(false)}
        >
          <CloseIcon className="h-5 w-5 text-slate-500" />
        </button>

        {/* Brand Logo */}
        <div className="flex items-center gap-3 p-8 pt-8 pb-6">
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
                onClick={() => setOpen(false)}
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

        {/* Bottom Logout Section */}
        <div className="mt-auto border-t border-slate-100 p-4">
          <button
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
            onClick={signOut}
            type="button"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
