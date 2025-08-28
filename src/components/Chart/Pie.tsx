import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type PieData = {
  name: string;
  value: number;
};

interface PieChartProps {
  data: PieData[];
  colors?: string[];
}

const defaultColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AA00FF"];

export const CustomPieChart: React.FC<PieChartProps> = ({ data, colors }) => {
  const chartColors = colors || defaultColors;

  return (
    <div className="w-full h-[400px] p-4 bg-white rounded-2xl shadow">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={chartColors[index % chartColors.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
