import Sidebar from "./Sidebar";
import { Outlet } from "react-router-dom";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function AdminLayout() {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-muted/40">

      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0 h-full">
        <ScrollArea className="flex-1 h-full w-full">
          <main className="p-6 w-full">
            <Outlet />
          </main>
        </ScrollArea>
      </div>
    </div>
  );
}