import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "./ui/input";
import { ColumnDef } from "@tanstack/react-table";
import { Transaction } from "./types";
import { format } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { OurDataTable } from "./OurDataTable";

interface TransactionCardProps {
    transactions: Transaction[];
}

const formatAmount = (amount: string): string => {
    const num = parseFloat(amount);
    return num >= 0 ? `$${num.toFixed(2)}` : `-$${Math.abs(num).toFixed(2)}`;
};

const getAvatarDetails = (name: string, logoUrl: string | null) => {
    if (logoUrl) {
        return { src: logoUrl, fallback: null };
    } else {
        const initials = name.split(' ').map(word => word[0]).slice(0, 2).join('');
        return { src: null, fallback: initials };
    }
};

export const TransactionPageCard: React.FC<TransactionCardProps> = ({ transactions }) => {
    const [nameFilter, setNameFilter] = useState<string>('');
    const [amountFilter, setAmountFilter] = useState<string>('');
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>(transactions);

    useEffect(() => {
        setFilteredTransactions(transactions.flat().length == 0 ? [] : transactions.filter(transaction => {
            const matchesNameOrDate = transaction.name.toLowerCase().includes(nameFilter.toLowerCase()) ||
                format(new Date(transaction.date), 'yyyy-MM-dd').includes(nameFilter);
            const matchesAmount = transaction.amount.toString().includes(amountFilter);
            return matchesNameOrDate && matchesAmount;
        }));
    }, [nameFilter, amountFilter, transactions]);

    const columns: ColumnDef<Transaction>[] = transactions.flat().length == 0 ? [] : [
        {
            header: 'Avatar',
            accessorKey: 'logo_url',
            cell: ({ row }) => {
                const { name, logo_url: logoUrl } = row.original;
                const { src, fallback } = getAvatarDetails(name, logoUrl);

                return (
                    <Avatar className="h-9 w-9">
                        {src ? <AvatarImage src={src} alt={name} /> : <AvatarFallback>{fallback}</AvatarFallback>}
                    </Avatar>
                );
            },
            enableSorting: false,
        },
        {
            header: 'Name',
            accessorKey: 'name',
            cell: ({ row }) => row.getValue("name"),
            enableSorting: true,
        },
        {
            header: 'Date',
            accessorKey: 'date',
            cell: ({ row }) => format(new Date(row.getValue("date")), 'yyyy-MM-dd'),
            enableSorting: true,
        },
        {
            header: 'Amount',
            accessorKey: 'amount',
            cell: ({ row }) => {
                const amount = row.getValue("amount") as string;
                return formatAmount(amount);
            },
            enableSorting: true,
            sortingFn: (rowA, rowB) => {
                const amountA = parseFloat(rowA.original.amount as unknown as string);
                const amountB = parseFloat(rowB.original.amount as unknown as string);
                return amountA - amountB;
            },
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
                    <OurDataTable
                        columns={columns}
                        data={filteredTransactions}
                    />
                </CardContent>
            </Card>
        </>
    );
};
