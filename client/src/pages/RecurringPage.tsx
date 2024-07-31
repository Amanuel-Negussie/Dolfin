import * as React from "react";
import { RecurringCalendar } from "@/components/RecurringCalendar";
import useTransactions from "../services/transactions";
import { TransactionType } from "../components/types";
import { RecurringCard } from "@/components/RecurringCard";


export const RecurringPage: React.FC = () => {
  const { getRecurringTransactionsByUser, recurringTransactions } = useTransactions();
  const [next7DaysTransactions, setNext7DaysTransactions] = React.useState<TransactionType[]>([]);
  const [comingLaterTransactions, setComingLaterTransactions] = React.useState<TransactionType[]>([]);

  React.useEffect(() => {
    const fetchRecurringTransactions = async () => {
      await getRecurringTransactionsByUser(17); // Adjust the accountId as needed

      const now = new Date();
      const next7Days = recurringTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      });

      const later = recurringTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.date);
        return transactionDate > new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
      });

      setNext7DaysTransactions(next7Days);
      setComingLaterTransactions(later);
    };

    fetchRecurringTransactions();
  }, [getRecurringTransactionsByUser, recurringTransactions]);

  return (
    <>
      <div className="hidden flex-col md:flex h-full">
        <div className="flex-1 space-y-4 p-20 pt-6 h-full">
          <h2 className="text-3xl font-bold tracking-tight">
            Recurring Payments
          </h2>

          <div className="flex gap-4 h-full">
            <div className="flex flex-col flex-grow space-y-4">
              <div className="space-y-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
                  Next 7 Days
                </h4>
                <RecurringCard transactions={next7DaysTransactions} />
              </div>
              <div className="space-y-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
                  Coming later
                </h4>
                <RecurringCard transactions={comingLaterTransactions} />
              </div>
            </div>
            <div className="flex-shrink-0 self-start mt-12">
              <RecurringCalendar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};