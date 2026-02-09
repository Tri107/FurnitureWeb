import Sidebar from "./Sidebar";
import Header from "./Header";
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen w-screen bg-muted/40">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        <Header />

        <main className="flex-1 p-6 w-full max-w-none">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
