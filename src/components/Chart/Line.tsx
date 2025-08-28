import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type ChartProps = {
  chartData: { month: string; value: number }[];
};

export function VisitorsLineChart({ chartData }: ChartProps) {
  return (
    <div className="w-full h-[500px] rounded-2xl border bg-white shadow-md p-4">
      <h2 className="text-lg font-semibold mb-2">Visitors Overview</h2>
      <p className="text-sm text-zinc-500 mb-4">Últimos meses</p>

      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData} margin={{ top: 20, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="month" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
