import { AccountSummaryCard } from "@/components/AccountSummaryCard";
import { TransactionTrendsCard } from "@/components/TransactionTrendsCard";
import { TransactionsCard } from "@/components/TransactionsCard";
import { AccountType, Transaction } from "@/components/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import useLogin from "@/hooks/useLogin";
import { useAccounts, useTransactions } from "@/services";
import { useEffect, useState } from "react";

export const Dashboard: React.FC = () => {
    const { getAccountsByUser, accountsByUser, isComplete: isCompleteFetchingAccount } = useAccounts();
    const { getTransactionsByUser, transactionsByUser, isComplete: isFetchingTransactions } = useTransactions();
    const [isLoadingAccounts, setIsLoadingAccounts] = useState(true);
    const [isLoadingTransactions, setIsLoadingTransactions] = useState(true);
    const [accounts, setAccounts] = useState<AccountType[]>([]);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const userId = Number(useLogin());

    useEffect(() => {
        if (!isNaN(userId)) {
            getTransactionsByUser(0);
            getAccountsByUser(0);
            setIsLoadingAccounts(true);
            setIsLoadingTransactions(true);
        }
    }, [userId]);

    useEffect(() => {
        if (isCompleteFetchingAccount) {
            if (Object.keys(accountsByUser).length > 0) {
                setAccounts(Object.values(accountsByUser)[0]);
            }
            setIsLoadingAccounts(false);
        }
    }, [accountsByUser]);

    useEffect(() => {
        if (isFetchingTransactions) {
            if (Object.keys(transactionsByUser).length > 0) {
                setTransactions(Object.values(transactionsByUser)[0]);
            }
            setIsLoadingTransactions(false);
        }
    }, [transactionsByUser]);

    if (isLoadingAccounts || isLoadingTransactions) {
        return <div>
            <LoadingSpinner />
        </div>
    }

    return (
        <div className="hidden flex-col md:flex flex-1">
            <div className="flex-1 space-y-4 p-20 pt-6">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <div>
                    <AccountSummaryCard accounts={accounts} />
                </div>
                <div className="grid gap-4 lg:grid-cols-1 2xl:grid-cols-2">
                    <TransactionTrendsCard />
                    <TransactionsCard transactions={transactions} />
                </div>
            </div>
        </div>
    );
}
