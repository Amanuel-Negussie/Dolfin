import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { Card, CardContent, CardTitle } from '@/components/ui/card'; // Use UI components for styling
import { format } from 'date-fns'; // Date formatting library

interface StyledLineChartProps {
  data: { date: string; amount: number }[];
  title: string; // Prop for custom title
}

const formatDate = (date: string) => {
  // Format the date to a more readable format
  return format(new Date(date), 'MMM dd, yyyy');
};

export const StyledLineChart: React.FC<StyledLineChartProps> = ({ data, title }) => {
  return (
    <Card className="shadow-lg rounded-lg border border-gray-200 bg-white">
      <CardContent>
        <CardTitle className="text-xl font-semibold text-gray-800">{title}</CardTitle>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ top: 10, right: 10, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="date" 
                tickFormatter={formatDate}
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
                stroke="#4a90e2"
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};
