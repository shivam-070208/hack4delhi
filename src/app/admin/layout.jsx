import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

export default function AdminLayout({ children }) {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* TOPBAR */}
        <Topbar />

        {/* PAGE CONTENT */}
        <main className="bg-background flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
