import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { Transaction } from "./types";
import { format } from "date-fns";



interface TransactionCardProps {
    transactions: Transaction[] | null;
};

export const TransactionsCard: React.FC<TransactionCardProps> = ({transactions = null}) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions && transactions.map((transaction) => (
                        <div key={transaction.id} className="flex items-center" >
                            <Avatar className="h-9 w-9">
                                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                                <AvatarFallback>TH</AvatarFallback>
                            </Avatar>
                            <div className="ml-4 space-y-1">
                                <p className="text-sm font-medium leading-none">{transaction.name}</p>
                                <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), 'yyyy-MM-dd')}</p>
                            </div>
                            <div className="ml-auto font-medium">{transaction.amount}</div>
                        </div>
                    ))}
                    {!transactions && <p>You have no transactions to display.</p>}
                </CardContent>
            </Card>
        </>
    )
}