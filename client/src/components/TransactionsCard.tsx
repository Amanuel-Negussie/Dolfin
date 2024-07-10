import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { TransactionDataTable } from "./TransactionDataTable"

export const columns: ColumnDef<Payment>[] = [
    {
        accessorKey: "date",
        header: "Date",
    },
    {
        accessorKey: "name",
        header: "Name",
    },
    {
        accessorKey: "amount",
        header: "Amount",
    },
]

import {
    ColumnDef,
} from "@tanstack/react-table"

type Payment = {
    id: string
    amount: number
    status: string
    name: string
}

export const payments: Payment[] = [
    {
        id: "728ed52f",
        amount: 100,
        status: "7/2",
        name: "Uber",
    },
    {
        id: "489e1d42",
        amount: 125,
        status: "7/2",
        name: "Steam",
    },
]

export const TransactionsCard: React.FC = () => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    <TransactionDataTable columns={columns} data={payments} />
                </CardContent>
            </Card>
        </>
    )
}