"use client";

import { useState } from "react";
import HRSidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function HRLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex">
      <HRSidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      <div className="flex-1">
        <Topbar collapsed={collapsed} />
        <main
          className={`p-8 transition-all duration-300 ${
            collapsed ? "ml-20" : "ml-72"
          }`}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
