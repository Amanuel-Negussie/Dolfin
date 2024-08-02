import React, { useMemo } from 'react';
import { CustomPieChart } from './CustomPieChart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AssetType, AccountType } from './types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Props {
  userId: number;
  assets: AssetType[];
  accounts: AccountType[];
}

export const NetworthSummaryCard: React.FC<Props> = ({ userId, assets, accounts }) => {
  // Calculate total asset and debt values
  const totalAssetValue = useMemo(
    () => assets.reduce((total, item) => total + item.value, 0) + accounts.reduce((total, account) => total + (account.type === 'depository' || account.type === 'investment' ? account.current_balance : 0), 0),
    [assets, accounts]
  );

  const totalDebtValue = useMemo(
    () => accounts.reduce((total, account) => total + (account.type === 'credit' || account.type === 'loan' ? account.current_balance : 0), 0),
    [accounts]
  );

  const formatNumber = (value: number) =>
    value.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  // Combine personal assets and banking data into a single dataset
  const assetData = useMemo(() => [
    ...assets.map(asset => ({
      name: asset.description,
      value: asset.value,
    })),
    ...accounts
      .filter(account => account.type === 'depository' || account.type === 'investment')
      .map(account => ({
        name: account.name,
        value: account.current_balance,
      }))
  ], [assets, accounts]);

  const creditData = useMemo(() => accounts
    .filter(account => account.type === 'credit' || account.type === 'loan')
    .map(account => ({
      name: account.name,
      value: account.current_balance,
    })), [accounts]);

  return (
    <Card>
      <Tabs defaultValue="summary">
        <CardHeader>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="summary" className="">Summary</TabsTrigger>
            <TabsTrigger value="assets" className="">Assets</TabsTrigger>
            <TabsTrigger value="debt" className="">Debt</TabsTrigger>
          </TabsList>
        </CardHeader>
        <CardContent>
          <TabsContent value="summary">
            <CardDescription>Summary of Networth</CardDescription>
            <CustomPieChart data={assetData} title="Total Assets" aspect={2} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Assets</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${formatNumber(totalAssetValue)}</div>
            </CardContent>
            <CustomPieChart data={creditData} title="Total Debt" aspect={2} />
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Debt</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">${formatNumber(totalDebtValue)}</div>
            </CardContent>
          </TabsContent>
          <TabsContent value="assets">
            <CardDescription>Summary of your Assets</CardDescription>
          </TabsContent>
          <TabsContent value="debt">
            <CardDescription>Summary of your Debt</CardDescription>
          </TabsContent>
        </CardContent>
      </Tabs>
    </Card>
  );
};
