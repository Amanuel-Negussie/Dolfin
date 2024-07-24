import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomLineChart } from "./CustomLineChart";
import { CustomPieChart } from "./CustomPieChart";

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
];

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
];

const AssetData = [
    { name: "Group A", value: 400.25 },
    { name: "Group B", value: 300.5 },
    { name: "Group C", value: 300.75 },
    { name: "Group D", value: 200.4 },
    { name: "Group E", value: 200.4 },
    { name: "Group F", value: 200.4 }
];

const DebtData = [
    { name: 'Credit Card', value: 12000.75 },
    { name: 'Mortgage', value: 3200.5 },
    { name: 'Car Loan', value: 900.3 },
    { name: 'Personal Loan', value: 1500.4 },
    { name: 'Student Loan', value: 12600.32}
  ];

// Calculate the total value
const totalAssetValue = AssetData.reduce(
    (total, item) => total + item.value,
    0
);

// Calculate the total debt
const totalDebtValue = DebtData.reduce((total, item) => total + item.value, 0);

export const NetworthSummaryCard: React.FC = () => {
    // Function to format numbers with commas for thousands and two decimal places
    const formatNumber = (value: number) => value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return (
        <Card>
            <Tabs defaultValue="summary">
                <CardHeader>
                    <TabsList className="grid w-full grid-cols-3">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="assets">Assets</TabsTrigger>
                        <TabsTrigger value="debt">Debt</TabsTrigger>
                    </TabsList>
                    <TabsContent value="summary">
                        <CardDescription>Summary of Networth</CardDescription>
                    </TabsContent>
                    <TabsContent value="assets">
                        <CardDescription>Summary of your Assets</CardDescription>
                    </TabsContent>
                    <TabsContent value="debt">
                        <CardDescription>Summary of your Debt</CardDescription>
                    </TabsContent>
                </CardHeader>
                <CardContent>
                    <TabsContent value="summary">
                        <CustomPieChart data={AssetData} title="Total Asset" aspect={2} />
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Assets
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                ${formatNumber(totalAssetValue)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                +352.52% from last week
                            </p>
                        </CardContent>
                        <CustomPieChart data={DebtData} title = 'Total Debt' aspect={2}/>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Debt
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600" >
                                ${formatNumber(totalDebtValue)}
                            </div>
                            <p className="text-xs text-red-600">
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
    );
};