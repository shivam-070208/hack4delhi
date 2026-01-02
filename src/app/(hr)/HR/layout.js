import HRSidebar, { HRSidebarProvider } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import { authRequire } from "@/lib/auth-utils";
export default async function HRLayout({ children }) {
  await authRequire("hr")
  return (
    <div className="flex">
      <HRSidebarProvider>
        <HRSidebar />

        <div className="flex-1">
          <Topbar />
          <main className={`p-8 transition-all duration-300`}>{children}</main>
        </div>
      </HRSidebarProvider>
    </div>
  );
}
