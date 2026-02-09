import { Menu } from "lucide-react";

export default function Header() {
  return (
    <header className="h-16 bg-background border-b flex items-center justify-between px-6">
      <h1 className="text-2xl font-bold">Trang quản lý</h1>
      <Menu className="cursor-pointer text-muted-foreground" />
    </header>
  );
}
