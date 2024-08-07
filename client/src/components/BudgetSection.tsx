import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import useAccounts from "../services/accounts";
import useBudgetCategories from "../services/budget";

const categories = [
  "Auto & Transport",
  "Dining & Drinks",
  "Business",
  "Cash & Checks",
  "Charitable Donations",
  "Education",
  "Entertainment & Rec.",
  "Family Care",
  "Fees",
  "Gifts",
  "Groceries",
  "Health & Wellness",
  "Home & Garden",
  "Legal",
  "Loan Payment",
  "Medical",
  "Personal Care",
  "Pets",
  "Shopping",
  "Software & Tech",
  "Taxes",
  "Travel & Vacation",
];

const BudgetSection: React.FC<{ userId: number; onOpenDialogs: () => void }> = ({ userId, onOpenDialogs }) => {
  const { getIncomeBillsByUser, updateIncomeBills, incomeBills } = useAccounts();
  const { getBudgetCategoriesByUser, addBudgetCategory, updateBudgetCategory, budgetCategories } = useBudgetCategories();

  const [income, setIncome] = useState<string>("");
  const [bills, setBills] = useState<string>("");
  const [editedCategories, setEditedCategories] = useState<{ [key: string]: { budgetedValue: string } }>({});
  const [openAddCategoryDialog, setOpenAddCategoryDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (userId && !isNaN(userId)) {
      getIncomeBillsByUser(userId);
      getBudgetCategoriesByUser(userId);
    }
  }, [getIncomeBillsByUser, getBudgetCategoriesByUser, userId]);

  useEffect(() => {
    if (incomeBills) {
      setIncome(incomeBills.income.toString());
      setBills(incomeBills.bills.toString());
    }
  }, [incomeBills]);

  useEffect(() => {
    if (budgetCategories) {
      const initialEditedCategories = Object.values(budgetCategories).reduce((acc, category) => {
        acc[category.category] = {
          budgetedValue: category.budgetedValue.toString()
        };
        return acc;
      }, {} as { [key: string]: { budgetedValue: string } });
      setEditedCategories(initialEditedCategories);
    }
  }, [budgetCategories]);

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => setIncome(e.target.value);
  const handleBillsChange = (e: React.ChangeEvent<HTMLInputElement>) => setBills(e.target.value);

  const handleCategoryChange = (categoryName: string, field: "budgetedValue") => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCategories(prev => ({
      ...prev,
      [categoryName]: {
        ...prev[categoryName],
        [field]: e.target.value
      }
    }));
  };

  const handleSaveIncomeBills = async () => {
    await updateIncomeBills(userId, parseFloat(income), parseFloat(bills));
    getIncomeBillsByUser(userId); // Refresh after update
  };

  const handleSaveCategory = async (categoryName: string) => {
    const { budgetedValue } = editedCategories[categoryName];
    await updateBudgetCategory(userId, categoryName, parseFloat(budgetedValue), 0);
    getBudgetCategoriesByUser(userId); // Refresh after update
  };

  const handleAddCategory = async () => {
    if (selectedCategory) {
      await addBudgetCategory(userId, selectedCategory, 0, 0);
      getBudgetCategoriesByUser(userId); // Refresh after update
      setOpenAddCategoryDialog(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, saveFunction: () => void) => {
    if (e.key === 'Enter') {
      saveFunction();
    }
  };

  const availableCategories = useMemo(() => {
    if (!budgetCategories) return categories;
    return categories.filter(category => !Object.keys(budgetCategories).includes(category));
  }, [budgetCategories]);

  const spendingBudget = useMemo(() => {
    if (!budgetCategories) return 0;
    return Object.values(budgetCategories).reduce((sum, category) => sum + category.budgetedValue, 0);
  }, [budgetCategories]);

  const actualSpending = useMemo(() => {
    if (!budgetCategories) return 0;
    return Object.values(budgetCategories).reduce((sum, category) => sum + category.actualValue, 0);
  }, [budgetCategories]);

  const remainingSpending = useMemo(() => {
    if (!budgetCategories) return 0;
    return Object.values(budgetCategories).reduce((sum, category) => sum + category.remainingValue, 0);
  }, [budgetCategories]);

  const projectedSavings = useMemo(() => {
    if (!incomeBills) return 0;
    return incomeBills.income - incomeBills.bills - spendingBudget;
  }, [incomeBills, spendingBudget]);

  return (
    <div className="max-w-md mx-auto mt-4">
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
                <TableCell>
                  <Input
                    value={income}
                    onChange={handleIncomeChange}
                    onBlur={handleSaveIncomeBills}
                    onKeyDown={(e) => handleKeyDown(e, handleSaveIncomeBills)}
                  />
                </TableCell>
                <TableCell>
                  <Input
                    value={bills}
                    onChange={handleBillsChange}
                    onBlur={handleSaveIncomeBills}
                    onKeyDown={(e) => handleKeyDown(e, handleSaveIncomeBills)}
                  />
                </TableCell>
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
                  <TableRow key={category.category}>
                    <TableCell>{category.category}</TableCell>
                    <TableCell>
                      <Input
                        value={editedCategories[category.category]?.budgetedValue || ""}
                        onChange={handleCategoryChange(category.category, "budgetedValue")}
                        onBlur={() => handleSaveCategory(category.category)}
                        onKeyDown={(e) => handleKeyDown(e, () => handleSaveCategory(category.category))}
                      />
                    </TableCell>
                    <TableCell>{category.actualValue}</TableCell>
                    <TableCell>{category.remainingValue}</TableCell>
                  </TableRow>
                ))}
                <TableRow>
                  <TableCell className="font-bold">Spending Budget</TableCell>
                  <TableCell>{spendingBudget}</TableCell>
                  <TableCell>{actualSpending}</TableCell>
                  <TableCell>{remainingSpending}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-bold">Projected Savings</TableCell>
                  <TableCell>{projectedSavings}</TableCell>
                  <TableCell></TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          ) : (
            <p>No budget categories set up yet.</p>
          )}
          <Button variant="outline" onClick={() => setOpenAddCategoryDialog(true)} className="w-full mx-2 mt-4">
            Add Budget Category
          </Button>
        </>
      ) : (
        <Button variant="outline" onClick={onOpenDialogs} className="w-full mx-2">
          Start
        </Button>
      )}

      <Dialog open={openAddCategoryDialog} onOpenChange={setOpenAddCategoryDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Budget Category</DialogTitle>
            <DialogDescription>
              Select a category to add to your budget.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 max-h-[300px] overflow-auto">
            {availableCategories.map((category) => (
              <div key={category} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={category}
                  onChange={() => setSelectedCategory(category)}
                  checked={selectedCategory === category}
                  className="mr-2"
                />
                <Label>{category}</Label>
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button type="button" onClick={handleAddCategory} disabled={!selectedCategory}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BudgetSection;
