import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function RecentOrders() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          Đơn hàng gần đây
        </CardTitle>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-6 py-3 text-left font-medium">ID</th>
                <th className="px-6 py-3 text-left font-medium">
                  Khách hàng
                </th>
                <th className="px-6 py-3 text-left font-medium">
                  Ngày đặt
                </th>
                <th className="px-6 py-3 text-right font-medium">
                  Tổng tiền
                </th>
                <th className="px-6 py-3 text-center font-medium">
                  Trạng thái
                </th>
              </tr>
            </thead>

            <tbody>
              <Row
                id="#001"
                name="Nguyễn Văn A"
                date="28/04/2026"
                price="6,900,000đ"
                status="Hoàn tất"
              />
              <Row
                id="#002"
                name="Nguyễn Văn B"
                date="30/01/2026"
                price="10,100,000đ"
                status="Đang xử lý"
              />
              <Row
                id="#003"
                name="Nguyễn Văn C"
                date="26/07/2026"
                price="2,600,000đ"
                status="Đang xử lý"
              />
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

function Row({ id, name, date, price, status }) {
  const isDone = status === "Hoàn tất";

  return (
    <tr className="border-t hover:bg-muted/40 transition">
      <td className="px-6 py-4 font-medium">{id}</td>
      <td className="px-6 py-4">{name}</td>
      <td className="px-6 py-4 text-muted-foreground">
        {date}
      </td>
      <td className="px-6 py-4 text-right font-semibold">
        {price}
      </td>
      <td className="px-6 py-4 text-center">
        <Badge
          className={
            isDone
              ? "bg-emerald-500/15 text-emerald-600 border border-emerald-500/30"
              : "bg-amber-500/15 text-amber-600 border border-amber-500/30"
          }
        >
          {status}
        </Badge>
      </td>
    </tr>
  );
}
