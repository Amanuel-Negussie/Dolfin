import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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

export const BudgetPage: React.FC = () => {
  const [openIncomeDialog, setOpenIncomeDialog] = useState(false);
  const [openBillsDialog, setOpenBillsDialog] = useState(false);

  const handleOpenIncomeDialog = () => setOpenIncomeDialog(true);
  const handleCloseIncomeDialog = () => {
    setOpenIncomeDialog(false);
    setOpenBillsDialog(true);
  };
  const handleCloseBillsDialog = () => setOpenBillsDialog(false);

  return (
    <>
      <div className="flex flex-col min-h-screen h-screen">
        <div className="flex-1 flex flex-col space-y-4 p-20 pt-6">
          <h2 className="text-3xl font-bold tracking-tight">Budgeting</h2>
          <Card className="max-w-md mx-auto mt-4">
            <CardHeader>
              <CardTitle>Setting up your budget is quick and easy.</CardTitle>
              <CardDescription>
                Your budget is the foundation for planning your spending and
                reaching your goals. Don't worry, we'll guide you through it!
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="outline"
                onClick={handleOpenIncomeDialog}
                className="w-full mx-2"
              >
                Start
              </Button>
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
                  <Input id="income" className="col-span-3" />
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
                  <Input id="bills" className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" onClick={handleCloseBillsDialog}>
                  Submit
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
};
