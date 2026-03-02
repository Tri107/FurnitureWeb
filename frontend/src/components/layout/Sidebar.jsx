import { NavLink } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  CreditCard,
  Users,
  Settings,
  Wrench,
  Truck,
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="w-64 border-r flex flex-col">

      {/* Header Admin */}
      <div className="h-16 px-6 flex items-center border-b bg-slate-900">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-white font-bold">
            A
          </div>
          <div className="leading-tight">
            <p className="font-semibold text-sm text-white">Admin</p>
            <p className="text-xs text-slate-300">admin@gmail.com</p>
          </div>
        </div>
      </div>
      {/* Menu */}
      <nav className="p-4 space-y-1 text-sm bg-slate-100 flex-1">
        <Item to="/admin" icon={<Home size={18} />} label="Trang chủ" end />
        <Item to="/admin/cart" icon={<ShoppingCart size={18} />} label="Giỏ hàng" />
        <Item to="/admin/products" icon={<Package size={18} />} label="Trang sản phẩm" />
        <Item to="/admin/payment" icon={<CreditCard size={18} />} label="Thanh toán" />
        <Item to="/admin/orders" icon={<Package size={18} />} label="Đơn hàng" />
        <Item to="/admin/users" icon={<Users size={18} />} label="Người dùng" />
        <Item to="/admin/settings" icon={<Settings size={18} />} label="Trang quản trị" />
        <Item to="/admin/crud" icon={<Wrench size={18} />} label="CRUD" />
        <Item to="/admin/shipping" icon={<Truck size={18} />} label="Shipping" />

      </nav>

    </aside>
  );
}

function Item({ to, icon, label, end }) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2 rounded-md transition
        ${
          isActive
            ? "bg-gray-200 text-black font-medium"
            : "text-black hover:bg-gray-200"
        }`
      }
    >
      {icon}
      <span>{label}</span>
    </NavLink>
  );
}