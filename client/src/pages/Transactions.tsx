import { TransactionPageCard } from "@/components/TransactionPageCard";
import { Transaction } from "@/components/types";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import useLogin from "@/hooks/useLogin";
import { useTransactions } from "@/services";
import { useEffect, useState } from "react";

export const Transactions: React.FC = () => {
  const { getTransactionsByUser, transactionsByUser } = useTransactions();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const userId = Number(useLogin());

  useEffect(() => {
    if (!isNaN(userId)) {
      getTransactionsByUser(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (Object.keys(transactionsByUser).length > 0) {
      setTransactions(Object.values(transactionsByUser)[0]);
      setIsLoading(false);
    }
  }, [transactionsByUser]);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="p-20 pt-6">
      <h2 className="text-3xl font-bold tracking-tight mb-4">Transactions</h2>
      <TransactionPageCard transactions={transactions} />
    </div>
  );
};
