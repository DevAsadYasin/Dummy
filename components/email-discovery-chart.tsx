'use client'

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { EmailDiscoveryData } from "@/services/dashboard.service"

interface EmailDiscoveryChartProps {
  data: EmailDiscoveryData[]
  isWeekly: boolean
}

export function EmailDiscoveryChart({ data, isWeekly }: EmailDiscoveryChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-blue-100 bg-white p-3 shadow-lg">
          <p className="text-sm font-medium text-blue-900">{label}</p>
          <p className="text-sm text-blue-600">
            {payload[0].value.toLocaleString()} searches
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="border-blue-100">
      <CardHeader className="border-b border-blue-50 bg-gradient-to-r from-blue-50 to-white">
        <div className="flex flex-col space-y-1">
          <CardTitle className="text-blue-900">Email Discovery Trend</CardTitle>
          <CardDescription>
            {isWeekly ? "Weekly email search activity (current month)" : "Monthly email search activity"}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis
              dataKey="date"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              padding={{ left: 20, right: 20 }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => value.toLocaleString()}
            />
            <Tooltip 
              content={CustomTooltip}
              cursor={{ fill: 'rgba(59, 130, 246, 0.05)' }}
            />
            <Bar
              dataKey="count"
              radius={[4, 4, 0, 0]}
              fill="url(#colorGradient)"
            />
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity={1} />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.8} />
              </linearGradient>
            </defs>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

