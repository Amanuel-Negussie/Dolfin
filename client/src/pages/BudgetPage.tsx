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
      <h2 className="text-3xl font-bold tracking-tight">Budgeting</h2>
      <BudgetSection userId={userId} onOpenDialogs={handleOpenDialogs} />
      {showDialogs && <BudgetDialogs userId={userId} />}
    </>
  );
};
