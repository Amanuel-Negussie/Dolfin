import { AccountSummaryCard } from "@/components/AccountSummaryCard";
import { TransactionTrendsCard } from "@/components/TransactionTrendsCard";
import { TransactionsCard } from "@/components/TransactionsCard";
import useLogin from "@/hooks/useLogin";
import { useAccounts, useTransactions } from "@/services";
import { useEffect } from "react";

export const Dashboard: React.FC = () => {
    const { getTransactionsByUser, transactionsByUser } = useTransactions();
    const { getAccountsByUser, accountsByUser } = useAccounts();
    const userId = Number(useLogin());

    useEffect(() => {
        if (!isNaN(userId)) {
            getTransactionsByUser(userId);
            getAccountsByUser(userId);
        }
    }, [userId]);

    useEffect(() => {
        if(Object.keys(transactionsByUser).length > 0) {
            console.log(transactionsByUser);
        }
    }, [transactionsByUser]);

    useEffect(() => {
        if(Object.keys(accountsByUser).length > 0) {
            console.log(accountsByUser);
        }
    }, [accountsByUser]);

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
