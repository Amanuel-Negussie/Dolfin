import { TransactionType } from '../components/types';

/**
 * Identifies recurring transactions.
 *
 * @param {TransactionType[]} transactions an array of transactions.
 * @returns {TransactionType[]} an array of recurring transactions.
 */
export const identifyRecurringTransactions = (transactions: TransactionType[]): TransactionType[] => {
  const recurringTransactions: TransactionType[] = [];
  const allowedIntervals = [7, 14, 21, 28]; // Allowed intervals for recurring transactions
  const amountVariance = 1.00; // Allowable variance in amount

  // Group transactions by name and round amounts
  const groupedTransactions = transactions.reduce((acc, transaction) => {
    const merchantName = transaction.name;
    const roundedAmount = Math.round(transaction.amount * 100) / 100;
    if (!acc[merchantName]) {
      acc[merchantName] = [];
    }
    acc[merchantName].push({ ...transaction, amount: roundedAmount });
    return acc;
  }, {} as Record<string, TransactionType[]>);

  // Process each merchant's transactions
  for (const [merchantName, trans] of Object.entries(groupedTransactions)) {
    trans.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    for (let i = 0; i < trans.length - 1; i++) {
      const date1 = new Date(trans[i].date);
      const date2 = new Date(trans[i + 1].date);
      const amount1 = trans[i].amount;
      const amount2 = trans[i + 1].amount;

      const daysDifference = Math.abs((date2.getTime() - date1.getTime()) / (1000 * 60 * 60 * 24));
      const amountDifference = Math.abs(amount1 - amount2);

      if (allowedIntervals.includes(daysDifference) && amountDifference <= amountVariance) {
        recurringTransactions.push({
          ...trans[i],
          frequency: allowedIntervals.find(interval => interval === daysDifference) as number,
          last_transaction_date: trans[i + 1].date
        });
      }
    }
  }

  return recurringTransactions;
};

  module.exports = {
    identifyRecurringTransactions,
  };