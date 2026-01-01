import HRSidebar, { HRSidebarProvider } from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function HRLayout({ children }) {
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
