import * as React from "react";
import { RecurringCalendar } from "@/components/RecurringCalendar";
import useTransactions from "../services/transactions";
import { TransactionType } from "../components/types";
import { RecurringCard } from "@/components/RecurringCard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { addDays } from "date-fns";
import useLogin from "@/hooks/useLogin";

export const RecurringPage: React.FC = () => {
  const { getRecurringTransactionsByUser, recurringTransactions } = useTransactions();
  const [next7DaysTransactions, setNext7DaysTransactions] = React.useState<TransactionType[]>([]);
  const [comingLaterTransactions, setComingLaterTransactions] = React.useState<TransactionType[]>([]);
  const [highlightedDates, setHighlightedDates] = React.useState<Date[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const userId = Number(useLogin());

  React.useEffect(() => {
    if (!isNaN(userId)) {
      const fetchRecurringTransactions = async () => {
        setIsLoading(true);
        console.log('userID', userId);
        await getRecurringTransactionsByUser(userId); // Adjust the accountId as needed
        setIsLoading(false);
      };

      fetchRecurringTransactions();
    }
  }, [userId, getRecurringTransactionsByUser]);

  React.useEffect(() => {
    if (recurringTransactions.length > 0) {
      const now = new Date();
      const next7Days: { transaction: TransactionType, nextDueDate: Date }[] = [];
      const later: { transaction: TransactionType, nextDueDate: Date }[] = [];
      const dates: Date[] = [];

      recurringTransactions.forEach(transaction => {
        const lastTransactionDate = transaction.last_transaction_date ? new Date(transaction.last_transaction_date) : new Date();
        const nextDueDate = addDays(lastTransactionDate, transaction.frequency || 0);

        dates.push(nextDueDate);

        if (nextDueDate <= new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)) {
          next7Days.push({ transaction, nextDueDate });
        } else {
          later.push({ transaction, nextDueDate });
        }
      });

      next7Days.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
      later.sort((a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime());
      console.log(next7Days);
      setNext7DaysTransactions(next7Days.map(item => item.transaction));
      setComingLaterTransactions(later.map(item => item.transaction));
      setHighlightedDates(dates);
    }
  }, [recurringTransactions]);

  if (isLoading) {
    return (
      <div>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen h-screen">
      <div className="flex-1 flex flex-col space-y-4 p-20 pt-6">
        <h2 className="text-3xl font-bold tracking-tight">
          Recurring Payments
        </h2>

        <div className="flex flex-1 gap-4">
          <div className="flex flex-col flex-grow space-y-4">
            <div className="space-y-2">
              <h4 className="text-xl font-semibold tracking-tight mb-4">
                Next 7 Days
              </h4>
              {next7DaysTransactions.length > 0 ? (
                <RecurringCard transactions={next7DaysTransactions} />
              ) : (
                <div className="p-8 bg-gray-100 text-center rounded-md">
                  <p className="text-xl font-semibold">Nothing due soon</p>
                  <p className="text-gray-600">You can relax, you have nothing due within the next 7 days.</p>
                </div>
              )}
            </div>
            {comingLaterTransactions.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xl font-semibold tracking-tight mb-4">
                  Coming later
                </h4>
                <RecurringCard transactions={comingLaterTransactions} />
              </div>
            )}
          </div>
          <div className="flex-shrink-0 self-start mt-0">
            <RecurringCalendar highlightedDates={highlightedDates} />
          </div>
        </div>
      </div>
    </div>
  );
};
