"use client";
import { Bell, MenuIcon, ChevronDown } from "lucide-react";
import { useSidebar } from "./Sidebar";
import { useSession } from "next-auth/react";

function getInitials(name) {
  if (!name) return "U";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0][0] || "U";
  return (
    (parts[0][0] || "") +
    (parts[parts.length - 1][0] || "")
  ).toUpperCase();
}

export default function Topbar() {
  const { open, setOpen } = useSidebar();
  const { data: session } = useSession();

  const user = session?.user || {};
  const userName = user.name || "Unknown User";
  const userRole = user.role || "Admin";
  const userImg =
    user.image ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(userName)}&background=6366f1&color=fff`;

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-slate-100 bg-white/80 px-8 backdrop-blur-md">
      {/* Close Button (for mobile, visible if sidebar is open) */}
      <button
        aria-label="Close sidebar"
        className="absolute top-1/2 left-4 -translate-y-1/2 rounded-lg p-2 hover:bg-slate-100 focus:outline-none"
        onClick={() => setOpen(true)}
      >
        <MenuIcon className="h-5 w-5 text-slate-500" />
      </button>

      <div className="ml-auto flex items-center gap-6">
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
              {userName}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {userRole}
            </p>
          </div>

          <div className="relative">
            <img
              src={userImg}
              alt={userName}
              className="h-10 w-10 rounded-xl object-cover ring-2 ring-transparent transition-all group-hover:ring-indigo-100"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  "https://ui-avatars.com/api/?name=" +
                  encodeURIComponent(userName) +
                  "&background=6366f1&color=fff";
              }}
            />
            <div className="absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
          </div>

          <ChevronDown className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-600" />
        </div>
      </div>
    </header>
  );
}
