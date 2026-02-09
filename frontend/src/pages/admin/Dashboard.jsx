import StatCards from "./components/StatCards";
import RevenueChart from "./components/RevenueChart";
import OrderChart from "./components/OrderChart";
import RecentOrders from "./components/RecentOrders";

export default function Dashboard() {
  return (
    <div className="w-full space-y-6">
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
