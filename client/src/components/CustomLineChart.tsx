import { Line, LineChart, ResponsiveContainer, Tooltip, YAxis } from "recharts"

interface CustomLineChartProps {
  data: any[]
  timePeriod: string
}

export const CustomLineChart: React.FC<CustomLineChartProps> = ({ data, timePeriod }) => {
  return (
    <div className="h-[350px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: 10,
            bottom: 0,
          }}
        >
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          Last {timePeriod}
                        </span>
                        <span className="font-bold text-muted-foreground">
                          {payload[0].value}
                        </span>
                      </div>
                      {payload[1] && <div className="flex flex-col">
                        <span className="text-[0.70rem] uppercase text-muted-foreground">
                          This {timePeriod}
                        </span>
                        <span className="font-bold">
                          {payload[1].value}
                        </span>
                      </div>}
                    </div>
                  </div>
                )
              }

              return null
            }}
          />
          <YAxis domain={[-1, 'auto']} />
          <Line
            type="monotone"
            strokeWidth={2}
            dataKey={"last" + timePeriod}
            dot={{
              r: 2.5,
            }}
            activeDot={{
              r: 6,
              style: { fill: "#8884d8", opacity: 0.25 },
            }}
            style={
              {
                stroke: "#8884d8",
                opacity: 0.25,
              } as React.CSSProperties
            }
          />
          <Line
            type="monotone"
            dataKey={"this" + timePeriod}
            strokeWidth={2}
            dot={{
              r: 2.5,
            }}
            activeDot={{
              r: 8,
              style: { fill: "#82ca9d" },
            }}
            style={
              {
                stroke: "#82ca9d",
              } as React.CSSProperties
            }
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}