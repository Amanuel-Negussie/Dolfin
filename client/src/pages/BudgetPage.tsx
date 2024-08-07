import React, { useState, useEffect } from "react";
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
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import useAccounts from "../services/accounts"; // Ensure the path is correct
import useBudgetCategories from "../services/budget"; // Ensure the path is correct

export const BudgetPage: React.FC = () => {
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openBillsDialog, setOpenBillsDialog] = useState(false);
  const [income, setIncome] = useState("");
  const [bills, setBills] = useState("");
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { addIncomeBills, getIncomeBillsByUser, incomeBills } = useAccounts(); // Use the Accounts context
  const { getBudgetCategoriesByUser, budgetCategories } = useBudgetCategories(); // Use the BudgetCategories context
  const userId = 19; // Replace with actual user ID

  useEffect(() => {
    const fetchData = async () => {
      await getIncomeBillsByUser(userId);
      await getBudgetCategoriesByUser(userId);
    };
    fetchData();
  }, [getIncomeBillsByUser, getBudgetCategoriesByUser, userId]);

  useEffect(() => {
    console.log("Updated budget categories:", budgetCategories); // Log budget categories whenever they update
  }, [budgetCategories]);

  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => {
    setOpenIncomeDialog(false);
    setOpenBillsDialog(true);
  };
  const handleCloseBillsDialog = async () => {
    await addIncomeBills(userId, parseFloat(income.replace(/,/g, "")), parseFloat(bills.replace(/,/g, "")));
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
      <h2 className="text-3xl font-bold tracking-tight">Budgeting</h2>
      <Card className="max-w-md mx-auto mt-4">
        <CardHeader>
          <CardTitle>Setting up your budget is quick and easy.</CardTitle>
          <CardDescription>
            Your budget is the foundation for planning your spending and reaching your goals. Don't worry, we'll guide you through it!
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incomeBills && incomeBills.income && incomeBills.bills ? (
            <>
              <h3 className="text-xl font-bold">Budget Basics</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Income</TableHead>
                    <TableHead>Bills</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell>{incomeBills.income}</TableCell>
                    <TableCell>{incomeBills.bills}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
              <h3 className="text-xl font-bold">Budget Categories</h3>
              {budgetCategories && Object.keys(budgetCategories).length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Budgeted Value</TableHead>
                      <TableHead>Actual Value</TableHead>
                      <TableHead>Remaining Value</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.values(budgetCategories).map((category) => (
                      <TableRow key={category.id}>
                        <TableCell>{category.category}</TableCell>
                        <TableCell>{category.budgetedValue}</TableCell>
                        <TableCell>{category.actualValue}</TableCell>
                        <TableCell>{category.remainingValue}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <p>No budget categories set up yet.</p>
              )}
            </>
          ) : (
            <Button
              variant="outline"
              onClick={handleOpenIncomeDialog}
              className="w-full mx-2"
            >
              Start
            </Button>
          )}
        </CardContent>
      </Card>

      <Dialog open={openIncomeDialog} onOpenChange={setOpenIncomeDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Income</DialogTitle>
            <DialogDescription>
              Please enter your monthly income.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="income" className="text-right">
                Income
              </Label>
              <Input
                id="income"
                className="col-span-3"
                value={income}
                onChange={handleIncomeChange}
                placeholder="1,000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCloseIncomeDialog}>
              Next
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={openBillsDialog} onOpenChange={setOpenBillsDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Bills</DialogTitle>
            <DialogDescription>
              Please enter your monthly bills.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bills" className="text-right">
                Bills
              </Label>
              <Input
                id="bills"
                className="col-span-3"
                value={bills}
                onChange={handleBillsChange}
                placeholder="1,000"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleCloseBillsDialog}>
              Submit
            </Button>
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
            <Button type="button" onClick={() => setShowConfirmation(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
