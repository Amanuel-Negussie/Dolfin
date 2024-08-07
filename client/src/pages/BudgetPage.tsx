import React, { useState } from "react";
import BudgetSection from "@/components/BudgetSection";
import BudgetDialogs from "@/components/BudgetDialogs";
import useLogin from "@/hooks/useLogin";

export const BudgetPage: React.FC = () => {
  const userId = Number(useLogin());

  const [showDialogs, setShowDialogs] = useState(false);

  const handleOpenDialogs = () => {
    setShowDialogs(true);
  };

  return (
    <>
      <div className="flex flex-col min-h-screen h-screen">
        <div className="flex-1 flex flex-col space-y-4 p-20 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">
            Budget
          </h2>
          <BudgetSection userId={userId} onOpenDialogs={handleOpenDialogs} />
          {showDialogs && <BudgetDialogs userId={userId} />}
        </div>
      </div>
    </>
  );
};
