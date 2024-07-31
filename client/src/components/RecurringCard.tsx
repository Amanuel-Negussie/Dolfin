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

import { TransactionType } from "./types";
import { format } from "date-fns";

interface TransactionCardProps {
    transactions: TransactionType[];
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

const getFrequencyLabel = (frequency: number | null | undefined): string => {
    if (frequency === 7) return "Weekly";
    if (frequency === 14) return "Biweekly";
    if (frequency === 30) return "Monthly";
    if (frequency === 90) return "Quarterly";
    if (frequency === 365) return "Yearly";
    return "One Time";
};

export const RecurringCard: React.FC<TransactionCardProps> = ({ transactions }) => {


    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Recent Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.map((transaction) => {
                        const { name, logo_url: logoUrl, frequency } = transaction;
                        const { src, fallback } = getAvatarDetails(name, logoUrl);

                        return (
                            <div key={transaction.id} className="flex items-center mb-4">
                                <Avatar className="h-9 w-9">
                                    {src ? <AvatarImage src={src} alt={name} /> : <AvatarFallback>{fallback}</AvatarFallback>}
                                </Avatar>
                                <div className="ml-4 space-y-1">
                                    <p className="text-sm font-medium leading-none">{transaction.name}</p>
                                    <p className="text-sm text-muted-foreground">{getFrequencyLabel(frequency)}</p>
                                </div>
                                <div className="ml-auto font-medium">{formatAmount(transaction.amount)}</div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </>
    );
};
