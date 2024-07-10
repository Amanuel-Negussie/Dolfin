import { AccountSummaryCard } from "@/components/AccountSummaryCard";
import { TransactionTrendsCard } from "@/components/TransactionTrendsCard";
import { TransactionsCard } from "@/components/TransactionsCard";

export const Dashboard: React.FC = () => {

    return (
        <div className="hidden flex-col md:flex">
            <div className="flex-1 space-y-4 p-20 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div>
                    <AccountSummaryCard />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <TransactionTrendsCard />

                    <TransactionsCard />
                </div>
            </div>
        </div>
    );
}
