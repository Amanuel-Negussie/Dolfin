import * as React from "react";
import { TransactionsCard } from "@/components/TransactionsCard";
import { RecurringCalendar } from "@/components/RecurringCalendar";

export const RecurringPage: React.FC = () => {
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
                <TransactionsCard />
              </div>
              <div className="space-y-2">
                <h4 className="scroll-m-20 text-xl font-semibold tracking-tight mb-4">
                  Coming later
                </h4>
                <TransactionsCard />
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
