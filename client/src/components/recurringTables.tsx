import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"

import { TransactionType } from "./types";
import { format } from "date-fns";

interface TransactionCardProps {
    transactions: TransactionType[];
};

export const RecurringCard: React.FC<TransactionCardProps> = ({ transactions }) => {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
            </CardHeader>
            <CardContent>
                {transactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center">
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
            </CardContent>
        </Card>
    );
};
