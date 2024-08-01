import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { StyledLineChart } from './StyledLineChart';
import { preprocessDailyData, preprocessWeeklyData, preprocessMonthlyData } from '../util/dataProcessing';

interface TransactionTrendsOverviewProps {
  transactionAssets: any[];
  transactionLiabilities: any[];
}

const TransactionTrendsOverview: React.FC<TransactionTrendsOverviewProps> = ({
  transactionAssets,
  transactionLiabilities,
}) => {
  const dailyAssets = preprocessDailyData(transactionAssets);
  const weeklyAssets = preprocessWeeklyData(transactionAssets);
  const monthlyAssets = preprocessMonthlyData(transactionAssets);

  const dailyLiabilities = preprocessDailyData(transactionLiabilities);
  const weeklyLiabilities = preprocessWeeklyData(transactionLiabilities);
  const monthlyLiabilities = preprocessMonthlyData(transactionLiabilities);

  return (
    <Card>
      <Tabs defaultValue="daily">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="daily">Daily Trends</TabsTrigger>
            <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="daily">
            <div>
              <StyledLineChart data={dailyAssets} title='Daily Asset Trends' />
              <StyledLineChart data={dailyLiabilities} title='Daily Liability Trends' />
            </div>
          </TabsContent>
          <TabsContent value="weekly">
            <div>
              <StyledLineChart data={weeklyAssets} title='Weekly Asset Trends' />
              <StyledLineChart data={weeklyLiabilities} title='Weekly Liability Trends' />
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div>
              <StyledLineChart data={monthlyAssets} title='Monthly Asset Trends' />
              <StyledLineChart data={monthlyLiabilities} title='Monthly Liability Trends' />
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default TransactionTrendsOverview;
