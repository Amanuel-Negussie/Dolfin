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
import { getTransactionTrendsByUser } from "@/services/api"
import { useEffect, useState } from "react"

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

interface TransactionTrend {
  date: string;
  amount: number;
}

interface WeeklyTrendData {
  lastWeek: number;
  thisWeek: number | null;
}

interface MonthlyTrendData {
  lastMonth: number;
  thisMonth: number | null;
}

export const TransactionTrendsCard: React.FC = () => {
  const [loading, setLoading] = useState(true)
  const [noData, setNoData] = useState(false);

  const [dataWeekly, setDataWeekly] = useState<WeeklyTrendData[]>([])
  const [currentWeekSpending, setCurrentWeekSpending] = useState<number>(0);
  const [lastWeekSpending, setLastWeekSpending] = useState<number>(0);

  const [dataMonthly, setDataMonthly] = useState<MonthlyTrendData[]>([])
  const [currentMonthSpending, setCurrentMonthSpending] = useState<number>(0);
  const [lastMonthSpending, setLastMonthSpending] = useState<number>(0);

  const processMonthlyTransactionTrends = (data: TransactionTrend[]) => {
    const today = new Date();

    // Start date: Beginning of last month in UTC
    const startLastMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() - 1, 1));

    // End date: Last day of last month in UTC
    const endLastMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 0));
    endLastMonth.setUTCHours(23, 59, 59, 999);

    // Start date: Beginning of current month in UTC
    const startThisMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), 1));

    // End date: Last day of the current month in UTC
    const endThisMonth = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth() + 1, 0));
    endThisMonth.setUTCHours(23, 59, 59, 999);

    // Convert date to UTC string without time part
    const toUTCDateString = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    // Create a map with the dates and their corresponding amounts
    const dateMap = new Map();
    data.forEach(item => {
      const utcDate = toUTCDateString(new Date(item.date));
      dateMap.set(utcDate, item.amount);
    });

    const calculateCumulativeSums = (startDate: Date, endDate: Date) => {
      let cumulativeSum = 0;
      const result = [];
      for (let date = new Date(startDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
        const dateString = toUTCDateString(date);
        if (date > today) {
          result.push(null);
        } else {
          const amount = dateMap.get(dateString) || 0;
          cumulativeSum += amount;
          result.push(cumulativeSum);
        }
      }
      return result;
    };

    const lastMonthSums = calculateCumulativeSums(startLastMonth, endLastMonth);
    const thisMonthSums = calculateCumulativeSums(startThisMonth, endThisMonth);

    // Create the result structure
    const dataMonthly = [];
    const maxLength = Math.max(lastMonthSums.length, thisMonthSums.length);
    for (let i = 0; i < maxLength; i++) {
      dataMonthly.push({
        lastMonth: lastMonthSums[i] || 0,
        thisMonth: thisMonthSums[i] || null,
      });
    }

    //Get last non-null value index
    const lastNonNullIndex = thisMonthSums.filter((value) => value !== null).length - 1;
    setCurrentMonthSpending(thisMonthSums[lastNonNullIndex] || 0);
    setLastMonthSpending(lastMonthSums[lastNonNullIndex] || 0);

    return dataMonthly;
  };

  const processWeeklyTransactionTrends = (data: TransactionTrend[]) => {
    const today = new Date();

    // Start date: Beginning of last week in UTC (last Sunday)
    const startLastWeek = new Date(today);
    startLastWeek.setUTCDate(today.getUTCDate() - today.getUTCDay() - 7);
    startLastWeek.setUTCHours(0, 0, 0, 0);

    // End date: End of last week in UTC (last Saturday)
    const endLastWeek = new Date(today);
    endLastWeek.setUTCDate(today.getUTCDate() - today.getUTCDay() - 1);
    endLastWeek.setUTCHours(23, 59, 59, 999);

    // Start date: Beginning of this week in UTC (this Sunday)
    const startThisWeek = new Date(today);
    startThisWeek.setUTCDate(today.getUTCDate() - today.getUTCDay());
    startThisWeek.setUTCHours(0, 0, 0, 0);

    // End date: End of this week in UTC (this Saturday)
    const endThisWeek = new Date(today);
    endThisWeek.setUTCDate(today.getUTCDate() - today.getUTCDay() + 6);
    endThisWeek.setUTCHours(23, 59, 59, 999);

    // Convert date to UTC string without time part
    const toUTCDateString = (date: Date) => {
      return date.toISOString().split('T')[0];
    };

    // Create a map with the dates and their corresponding amounts
    const dateMap = new Map();
    data.forEach(item => {
      const utcDate = toUTCDateString(new Date(item.date));
      dateMap.set(utcDate, item.amount);
    });

    const calculateCumulativeSums = (startDate: Date, endDate: Date) => {
      let cumulativeSum = 0;
      const result = [];
      for (let date = new Date(startDate); date <= endDate; date.setUTCDate(date.getUTCDate() + 1)) {
        const dateString = toUTCDateString(date);
        if (date > today) {
          result.push(null);
        } else {
          const amount = dateMap.get(dateString) || 0;
          cumulativeSum += amount;
          result.push(cumulativeSum);
        }
      }
      return result;
    };

    const lastWeekSums = calculateCumulativeSums(startLastWeek, endLastWeek);
    const thisWeekSums = calculateCumulativeSums(startThisWeek, endThisWeek);

    // Create the result structure
    const dataWeekly = [];
    const maxLength = Math.max(lastWeekSums.length, thisWeekSums.length);
    for (let i = 0; i < maxLength; i++) {
      dataWeekly.push({
        lastWeek: lastWeekSums[i] || 0,
        thisWeek: thisWeekSums[i] || null,
      });
    }

    // Get last non-null value index
    const lastNonNullIndex = thisWeekSums.filter((value) => value !== null).length - 1;
    setCurrentWeekSpending(thisWeekSums[lastNonNullIndex] || 0);
    setLastWeekSpending(lastWeekSums[lastNonNullIndex] || 0);

    return dataWeekly;
  };

  useEffect(() => {
    getTransactionTrendsByUser().then((response) => {
      setLoading(false)
      setNoData(response.data.length === 0)
      const processedMonthlyData = processMonthlyTransactionTrends(response.data)
      const processedWeeklyData = processWeeklyTransactionTrends(response.data)
      setDataMonthly(processedMonthlyData)
      setDataWeekly(processedWeeklyData)
      console.log(processedMonthlyData)
    })
  }, []);

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
            {!noData && <CustomLineChart data={dataWeekly} timePeriod="Week" />}
            {noData && <div className="min-h-[350px] flex items-center justify-center">
              <CardDescription className="text-center">No data available</CardDescription>
            </div>}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Spending This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentWeekSpending}</div>
              <p className={`text-xs text-muted-foreground ${lastWeekSpending === 0 ? 'hidden' : ''}`}>
                {currentWeekSpending > lastWeekSpending && "+"}{(((currentWeekSpending / lastWeekSpending) - 1) * 100).toFixed(2)}% from last week
              </p>
            </CardContent>
          </TabsContent>
          <TabsContent value="monthly">
            {!noData && <CustomLineChart data={dataMonthly} timePeriod="Month" />}
            {noData && <div className="min-h-[350px] flex items-center justify-center">
              <CardDescription className="text-center">No data available</CardDescription>
            </div>}
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Current Spending This Month
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${currentMonthSpending}</div>
              <p className={`text-xs text-muted-foreground ${lastMonthSpending === 0 ? 'hidden' : ''}`}>
                {currentMonthSpending > lastMonthSpending && "+"}{(((currentMonthSpending / lastMonthSpending) - 1) * 100).toFixed(2)}% from last month
              </p>
            </CardContent>
          </TabsContent>

        </CardContent>
      </Tabs>
    </Card>
  )
}