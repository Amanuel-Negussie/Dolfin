import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "./dataTable";
import { Input } from "./ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./types";
import { format } from "date-fns";

interface TransactionCardProps {
    transactions: Transaction[];
};

const formatAmount = (amount: number): string => {
    return amount >= 0 ? `$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`;
};

export const TransactionPageCard: React.FC<TransactionCardProps> = ({ transactions }) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [amountFilter, setAmountFilter] = useState<string>('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

    useEffect(() => {
        setFilteredTransactions(transactions.filter(transaction => {
            const matchesNameOrDate = transaction.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
                format(new Date(transaction.date as string | number | Date), 'yyyy-MM-dd').includes(nameFilter);
            const matchesAmount = transaction.amount.toString().includes(amountFilter);
            return matchesNameOrDate && matchesAmount;
        }));
    }, [nameFilter, amountFilter, transactions]);

    const columns: ColumnDef<Transaction>[] = [
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => row.getValue("name"),
            enableSorting: true,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ row }) => <div className="font-normal">{format(new Date(row.getValue("date") as string | number | Date), 'yyyy-MM-dd')}</div>,
            enableSorting: true,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }) => {
                const amount = parseFloat(row.getValue("amount"));
                const formatted = new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                }).format(amount);
                return <div className="font-medium">{formatted}</div>;
            },
            enableSorting: true,
        },
    ];

    return (
        <>
            <div className="mb-4 flex space-x-4">
                <Input 
                    type="text"
                    placeholder="Filter by name or date"
                    value={nameFilter}
                    onChange={(e) => setNameFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
                <Input 
                    type="text"
                    placeholder="Filter by amount"
                    value={amountFilter}
                    onChange={(e) => setAmountFilter(e.target.value)}
                    className="p-2 border border-gray-300 rounded"
                />
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable 
                        columns={columns}
                        data={filteredTransactions}
                    />
                </CardContent>
            </Card>
        </>
    );
};