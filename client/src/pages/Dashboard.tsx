import { AccountSummaryCard } from "@/components/AccountSummaryCard";
import { TransactionTrendsCard } from "@/components/TransactionTrendsCard";
import { TransactionsCard } from "@/components/TransactionsCard";
import { Transaction } from "@/components/types";
import useLogin from "@/hooks/useLogin";
import { useAccounts, useTransactions } from "@/services";
import { useEffect, useState } from "react";

export const Dashboard: React.FC = () => {
    const { getTransactionsByUser, transactionsByUser } = useTransactions();
    const { getAccountsByUser, accountsByUser } = useAccounts();
    const [isLoading, setIsLoading] = useState(true);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const userId = Number(useLogin());

    useEffect(() => {
        if (!isNaN(userId)) {
            getTransactionsByUser(userId);
            getAccountsByUser(userId);
        }
    }, [userId]);

    useEffect(() => {
        if(Object.keys(transactionsByUser).length > 0) {
            setTransactions(Object.values(transactionsByUser)[0]);
            setIsLoading(false);
        }
    }, [transactionsByUser]);

    useEffect(() => {
        if(Object.keys(accountsByUser).length > 0) {
            //console.log(accountsByUser);
        }
    }, [accountsByUser]);

    if(isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="hidden flex-col md:flex">
            <div className="flex-1 space-y-4 p-20 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div>
                    <AccountSummaryCard />
                </div>
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                    <TransactionTrendsCard />

                    <TransactionsCard transactions={transactions}/>
                </div>
            </div>
        </div>
    );
}
