import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomLineChart } from "./CustomLineChart"

const dataWeekly = [
  {
    lastweek: 189,
    thisweek: 139,
  },
  {
    lastweek: 200,
    thisweek: 240,
  },
  {
    lastweek: 239,
    thisweek: 390,
  },
  {
    lastweek: 278,
    thisweek: 980,
  },
  {
    lastweek: 300,
    thisweek: null,
  },
  {
    lastweek: 349,
    thisweek: null,
  },
  {
    lastweek: 400,
    thisweek: null,
  },
]

const dataMonthly = [
  {
    lastweek: 189,
    thisweek: 139,
  },
  {
    lastweek: 200,
    thisweek: 240,
  },
  {
    lastweek: 239,
    thisweek: 390,
  },
  {
    lastweek: 278,
    thisweek: 980,
  },
  {
    lastweek: 300,
    thisweek: 1080,
  },
  {
    lastweek: 349,
    thisweek: 1150,
  },
  {
    lastweek: 400,
    thisweek: 1348,
  },
  {
    lastweek: 500,
    thisweek: 1548,
  },
  {
    lastweek: 550,
    thisweek: 1621,
  },
  {
    lastweek: 550,
    thisweek: 1675,
  },
  {
    lastweek: 550,
    thisweek: 2265,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
  {
    lastweek: 550,
    thisweek: null,
  },
]

export const TransactionTrendsCard: React.FC = () => {
  return (
    <Card>
      <Tabs defaultValue="weekly">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          </TabsList>
          <TabsContent value="weekly">
            <CardDescription>Weekly trend of your expenses</CardDescription>
          </TabsContent>
          <TabsContent value="monthly">
            <CardDescription>Monthly trend of your expenses</CardDescription>
          </TabsContent>
        </CardHeader>
        <CardContent>
          <TabsContent value="weekly">
            <CustomLineChart data={dataWeekly} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Spending This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$980.00</div>
              <p className="text-xs text-muted-foreground">
                +352.52% from last week
              </p>
            </CardContent>
          </TabsContent>
          <TabsContent value="monthly">
            <CustomLineChart data={dataMonthly} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Spending This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$2265.00</div>
              <p className="text-xs text-muted-foreground">
                +411.82% from last month
              </p>
            </CardContent>
          </TabsContent>

        </CardContent>
      </Tabs>
    </Card>
  )
}