import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CustomLineChart } from './CustomLineChart';
import { StyledLineChart } from './StyledLineChart';

interface TransactionTrendsOverviewProps {
  transactionAssets: any[];  // Replace `any` with the actual type if available
  transactionLiabilities: any[];  // Replace `any` with the actual type if available
}

const TransactionTrendsOverview: React.FC<TransactionTrendsOverviewProps> = ({
  transactionAssets,
  transactionLiabilities,
}) => {
  return (
    <Card>
      <Tabs defaultValue="weekly">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="weekly">Weekly Trends</TabsTrigger>
            <TabsTrigger value="monthly">Monthly Trends</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="weekly">
            <div>
        
              <StyledLineChart data={transactionAssets} title = 'Weekly Asset Trends' />
             
              <StyledLineChart data={transactionLiabilities} title = 'Weekly Liability Trends' />
            </div>
          </TabsContent>
          <TabsContent value="monthly">
            <div>
          
              <StyledLineChart data={transactionAssets} title = 'Monthly Asset Trends' /> 
      
              <StyledLineChart data={transactionLiabilities} title = 'Monthly Liability Trends' /> 
            </div>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};

export default TransactionTrendsOverview;
