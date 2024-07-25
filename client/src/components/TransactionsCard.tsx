import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar";

import { Transaction } from "./types";
import { format } from "date-fns";

interface TransactionCardProps {
    transactions: Transaction[];
};

const getAvatarDetails = (name: string, logoUrl: string | null) => {
    if (logoUrl) {
        return { src: logoUrl, fallback: null };
    } else {
        const initials = name.split(' ').map(word => word[0]).slice(0, 2).join('');
        return { src: null, fallback: initials };
    }
};

export const TransactionsCard: React.FC<TransactionCardProps> = ({ transactions }) => {
    // Get the most recent 10 transactions
    const recentTransactions = transactions.slice(-10);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {recentTransactions.map((transaction) => {
                        const { name, logo_url: logoUrl } = transaction;
                        const { src, fallback } = getAvatarDetails(name, logoUrl);

                        return (
                            <div key={transaction.id} className="flex items-center mb-4">
                                <Avatar className="h-9 w-9">
                                    {src ? <AvatarImage src={src} alt={name} /> : <AvatarFallback>{fallback}</AvatarFallback>}
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{transaction.name}</p>
                                    <p className="text-sm text-muted-foreground">{format(new Date(transaction.date), 'yyyy-MM-dd')}</p>
                                </div>
                                <div className="ml-auto font-medium">{transaction.amount}</div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </>
    );
};
