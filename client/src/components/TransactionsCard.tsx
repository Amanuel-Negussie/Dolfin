import {
    Card,
    CardContent,
    CardDescription,
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
    transactions: Transaction[] | null;
};

const getAvatarDetails = (name: string, logoUrl: string | null) => {
    if (logoUrl) {
        return { src: logoUrl, fallback: null };
    } else {
        const initials = name.split(' ').map(word => word[0]).slice(0, 2).join('');
        return { src: null, fallback: initials };
    }
};

const formatAmount = (amount: number): string => {
    return amount >= 0 ? `$${amount.toFixed(2)}` : `-$${Math.abs(amount).toFixed(2)}`;
};

export const TransactionsCard: React.FC<TransactionCardProps> = ({ transactions = null }) => {
    // Get the most recent 10 transactions
    const recentTransactions = transactions?.flat().slice(0, 10);

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent className="min-h-[350px]">
                    {recentTransactions && recentTransactions?.length > 0 && recentTransactions.map((transaction) => {
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
                                <div className="ml-auto font-medium">{formatAmount(transaction.amount)}</div>
                            </div>
                        );
                    })}
                    {!recentTransactions?.length &&
                        <div className="min-h-[350px] flex items-center justify-center">
                            <CardDescription className="text-center">You have no transactions to display.</CardDescription>
                        </div>}
                </CardContent>
            </Card>
        </>
    );
};
