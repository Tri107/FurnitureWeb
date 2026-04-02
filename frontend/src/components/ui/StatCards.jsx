import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, SquareChartGantt, Package, Users } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 w-full">
      {/* Card 1 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Doanh thu tuần này</p>
            <p className="text-2xl font-bold">10,400,000đ</p>
          </div>
          <ShoppingCart className="text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Card 2 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Đơn hàng trong tuần</p>
            <p className="text-2xl font-bold">23</p>
          </div>
          <SquareChartGantt className="text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Card 3 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Người dùng mới trong tuần</p>
            <p className="text-2xl font-bold">17</p>
 
          </div>
          <Users className="text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Card 4 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Số sản phẩm đã bán trong tuần</p>
            <p className="text-2xl font-bold">17</p>
          </div>
          <Package className="text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
