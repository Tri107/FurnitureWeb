import StatCards from "../../components/ui/StatCards";
import RevenueChart from "../../components/ui/RevenueChart";
import OrderChart from "../../components/ui/OrderChart";
import RecentOrders from "../../components/ui/RecentOrders";

export default function Dashboard() {
  return (
    <div className="w-full space-y-6">

      {/* Title */}
      <h1 className="text-3xl font-bold">
        Trang quản lý
      </h1>

      {/* Stat cards */}
      <StatCards />

      {/* Charts */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <RevenueChart />
        <OrderChart />
      </div>

      {/* Table */}
      <RecentOrders />

    </div>
  );
}