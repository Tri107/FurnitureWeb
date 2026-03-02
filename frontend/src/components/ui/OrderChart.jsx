import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const data = [
  { name: "Đã hoàn tất", value: 70 },
  { name: "Đã hủy", value: 30 },
];

const COLORS = ["#0f2a71", "#0ea5e9"];

export default function OrderChart() {
  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-center">
          Thống Kê Đơn Hàng
        </CardTitle>
      </CardHeader>

      <CardContent className="flex items-center justify-center h-[300px]">
        {/* Wrapper để canh giữa chart + legend */}
        <div className="flex items-center gap-10">
          {/* Chart */}
          <div className="relative w-[220px] h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  innerRadius={65}
                  outerRadius={95}
                  dataKey="value"
                  paddingAngle={3}
                >
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index]} />
                  ))}
                </Pie>

                {/* Center text */}
                <text
                  x="50%"
                  y="46%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-2xl font-bold fill-gray-900"
                >
                  245
                </text>
                <text
                  x="50%"
                  y="58%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-sm fill-gray-500"
                >
                  Đơn hàng
                </text>
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend */}
          <div className="space-y-4 text-sm">
            {data.map((item, index) => (
              <div key={item.name} className="flex items-center gap-3">
                <span
                  className="w-4 h-2 rounded-full"
                  style={{ backgroundColor: COLORS[index] }}
                />
                <span className="font-medium">{item.name}</span>
                <span className="text-muted-foreground">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
