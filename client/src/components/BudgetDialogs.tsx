import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAccounts from "../services/accounts";
import useBudgetCategories from "../services/budget";

const BudgetDialogs: React.FC<{ userId: number }> = ({ userId }) => {
  const [openIncomeDialog, setOpenIncomeDialog] = useState(true); // Set to true to open initially
  const [openBillsDialog, setOpenBillsDialog] = useState(false);
  const [income, setIncome] = useState("");
  const [bills, setBills] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addIncomeBills } = useAccounts();
  const { addBudgetCategory } = useBudgetCategories();

  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => {
    setOpenIncomeDialog(false);
    setOpenBillsDialog(true);
  };
  const handleCloseBillsDialog = async () => {
    const incomeValue = parseFloat(income.replace(/,/g, ""));
    const billsValue = parseFloat(bills.replace(/,/g, ""));
    await addIncomeBills(userId, incomeValue, billsValue);

    const everythingElseBudget = (incomeValue - billsValue) * 0.8;
    await addBudgetCategory(userId, "Everything Else", everythingElseBudget, 0);

    setShowConfirmation(true);
    setOpenBillsDialog(false);
  };

  const formatNumber = (value: string) => {
    const number = parseFloat(value.replace(/,/g, ""));
    if (isNaN(number)) return "";
    return number.toLocaleString();
  };

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setIncome(formatNumber(value));
  };

  const handleBillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setBills(formatNumber(value));
  };

  return (
    <>
      <Dialog open={openIncomeDialog} onOpenChange={setOpenIncomeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Income</DialogTitle>
            <DialogDescription>Please enter your monthly income.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="income" className="text-right">Income</Label>
              <Input id="income" className="col-span-3" value={income} onChange={handleIncomeChange} placeholder="1,000" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCloseIncomeDialog}>Next</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openBillsDialog} onOpenChange={setOpenBillsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bills</DialogTitle>
            <DialogDescription>Please enter your monthly bills.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bills" className="text-right">Bills</Label>
              <Input id="bills" className="col-span-3" value={bills} onChange={handleBillsChange} placeholder="1,000" />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCloseBillsDialog}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Success</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>A budget has been set up.</p>
          </div>
          <DialogFooter>
            <Button type="button" onClick={() => setShowConfirmation(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default BudgetDialogs;
