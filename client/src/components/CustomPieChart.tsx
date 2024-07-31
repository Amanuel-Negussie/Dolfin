import React from 'react';
import { Pie, PieChart, ResponsiveContainer, Tooltip, Cell } from 'recharts';

interface CustomPieChartProps {
  data: { name: string; value: number }[]; // Data should include name and value
  title: string;
  aspect?: number; // Optional aspect ratio prop
}

const COLORS = ['#8884d8', '#82ca9d', '#FFBB28', '#FF8042']; // Default colors

export const CustomPieChart: React.FC<CustomPieChartProps> = ({ data, title, aspect = 1 }) => {
  const total = data.reduce((acc, item) => acc + item.value, 0);

  const generateColors = (numColors: number) => {
    const hueStep = 360 / numColors;
    return Array.from({ length: numColors }).map((_, index) => `hsl(${index * hueStep}, 70%, 50%)`);
  };

  let colors: string[];
  if (data.length <= COLORS.length) {
    colors = COLORS.slice(0, data.length);
  } else {
    colors = [...COLORS];
    const remainingColorsNeeded = data.length - COLORS.length;
    const dynamicColors = generateColors(remainingColorsNeeded);
    colors = [...colors, ...dynamicColors];
  }

  return (
    <div style={{ width: '80%', aspectRatio: aspect, margin: '0 auto' }}>
      <div className="text-center mt-2 font-bold text-xl">{title}</div>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={({ name, value }) => {
              const percentage = (value / total) * 100;
              // Show label if percentage is 10% or more
              return percentage >= 10 ? `${name}: $${formatter(value)}` : null;
            }}
            labelLine={({ name, value }) => {
              const percentage = (value / total) * 100;
              // Show label lines only if the label is visible
              return percentage >= 10;
            }}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => `$${formatter(value)}`}
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="flex flex-col">
                      <span className="text-[0.70rem] uppercase text-muted-foreground">
                        {payload[0].name}
                      </span>
                      <span className="font-bold">
                        {formatter(payload[0].value)}
                      </span>
                    </div>
                  </div>
                );
              }

              return null;
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

// Formatter function to convert the number to a currency string with commas for thousands
const formatter = (value: number) => value.toLocaleString();
