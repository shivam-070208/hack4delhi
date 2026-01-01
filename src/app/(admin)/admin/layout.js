import Sidebar, { SidebarProvider } from "@/components/admin/dashboard/Sidebar";
import Topbar from "@/components/admin/dashboard/Topbar";
import { authRequire } from "@/lib/auth-utils";

export default async function AdminLayout({ children }) {
  await authRequire("admin");
  return (
    <SidebarProvider>
      <div className="flex h-screen overflow-hidden">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <Topbar />

          <main className="bg-background flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
