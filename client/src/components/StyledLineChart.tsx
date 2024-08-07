import React, { useEffect, useRef, useState } from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card';

interface StyledLineChartProps {
  data: { date: string; amount: number }[];
  title: string; // Prop for custom title
}

export const StyledLineChart: React.FC<StyledLineChartProps> = ({ data, title }) => {
  const [leftMargin, setLeftMargin] = useState(10);
  const yAxisRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (yAxisRef.current) {
      const maxLabelWidth = Math.max(...data.map(d => {
        const span = document.createElement('span');
        span.style.visibility = 'hidden';
        span.style.position = 'absolute';
        span.innerText = `$${d.amount.toFixed(2)}`;
        document.body.appendChild(span);
        const width = span.getBoundingClientRect().width;
        document.body.removeChild(span);
        return width;
      }));
      setLeftMargin(maxLabelWidth + 10);
    }
  }, [data]);

  return (
    <Card className="shadow-lg rounded-lg border border-gray-200 bg-white">
      <CardContent>
        <div className = "mb-4"></div>
        <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
        <div className="mt-4 h-[300px]" ref={yAxisRef}> {/* Added top margin */}
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: leftMargin, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
              />
              <YAxis 
                tick={{ fontSize: 12, fill: '#6b7280' }} 
                tickFormatter={(value) => `$${value.toFixed(2)}`} 
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-white p-2 shadow-lg">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-500">Date</span>
                          <span className="font-semibold">{payload[0].payload.date}</span>
                          <span className="text-sm text-gray-500">Amount</span>
                          <span className="font-semibold">{`$${payload[0].value.toFixed(2)}`}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="amount"
                strokeWidth={2}
                stroke="#82ca9d"
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
