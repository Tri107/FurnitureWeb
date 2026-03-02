import { Card, CardContent } from "@/components/ui/card";
import { ShoppingCart, Calendar, Users } from "lucide-react";

export default function StatCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
      {/* Card 1 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Doanh thu hôm nay</p>
            <p className="text-2xl font-bold">10,400,000đ</p>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </div>
          <ShoppingCart className="text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Card 2 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Đơn hàng mới</p>
            <p className="text-2xl font-bold">23</p>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </div>
          <Calendar className="text-muted-foreground" />
        </CardContent>
      </Card>

      {/* Card 3 */}
      <Card className="w-full">
        <CardContent className="p-6 flex justify-between items-center">
          <div>
            <p className="text-muted-foreground">Người dùng mới</p>
            <p className="text-2xl font-bold">17</p>
            <p className="text-sm text-muted-foreground">Tổng đơn hàng</p>
          </div>
          <Users className="text-muted-foreground" />
        </CardContent>
      </Card>
    </div>
  );
}
