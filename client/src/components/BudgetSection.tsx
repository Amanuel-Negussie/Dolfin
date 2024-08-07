import React, { useEffect } from "react";
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
import { Button } from "@/components/ui/button";
import useAccounts from "../services/accounts";
import useBudgetCategories from "../services/budget";

const BudgetSection: React.FC<{ userId: number; onOpenDialogs: () => void }> = ({ userId, onOpenDialogs }) => {
  const { getIncomeBillsByUser, incomeBills } = useAccounts();
  const { getBudgetCategoriesByUser, budgetCategories } = useBudgetCategories();

  useEffect(() => {
    getIncomeBillsByUser(userId);
    getBudgetCategoriesByUser(userId);
  }, [getIncomeBillsByUser, getBudgetCategoriesByUser, userId]);

  return (
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
          <Button variant="outline" onClick={onOpenDialogs} className="w-full mx-2">
            Start
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default BudgetSection;
