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
import { format, addDays, differenceInDays, differenceInHours, differenceInMonths } from "date-fns";

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

const getDueInLabel = (lastPaymentDate: string | undefined, frequency: number | undefined): string => {
    if (!lastPaymentDate || !frequency) return "N/A";
    const now = new Date();
    const nextDueDate = addDays(new Date(lastPaymentDate), frequency);

    const hoursDiff = differenceInHours(nextDueDate, now);
    if (hoursDiff < 24) {
        return `Due in ${hoursDiff} hours`;
    }

    const daysDiff = differenceInDays(nextDueDate, now);
    if (daysDiff < 30) {
        return `Due in ${daysDiff} days`;
    }

    const monthsDiff = differenceInMonths(nextDueDate, now);
    return `Due in ${monthsDiff} months`;
};

export const RecurringCard: React.FC<TransactionCardProps> = ({ transactions }) => {
    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Subscriptions</CardTitle>
                </CardHeader>
                <CardContent>
                    {transactions.map((transaction) => {
                        const { name, logo_url: logoUrl, frequency, last_transaction_date, official_name} = transaction;
                        const { src, fallback } = getAvatarDetails(name, logoUrl);

                        return (
                            <div key={transaction.id} className="grid grid-cols-4 gap-4 items-center mb-4">
                                <div className="flex items-center">
                                    <Avatar className="h-9 w-9">
                                        {src ? <AvatarImage src={src} alt={name} /> : <AvatarFallback>{fallback}</AvatarFallback>}
                                    </Avatar>
                                    <div className="ml-4 space-y-1">
                                        <p className="text-sm font-medium leading-none">{transaction.name}</p>
                                        <p className="text-sm text-muted-foreground text-left">{getFrequencyLabel(frequency)}</p>
                                    </div>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium leading-none">Due</p>
                                    <p className="text-sm text-muted-foreground text-left">{getDueInLabel(last_transaction_date, frequency)}</p>
                                </div>
                                <div className="text-left">
                                    <p className="text-sm font-medium leading-none">Account</p>
                                    <p className="text-sm text-muted-foreground text-left">{transaction.official_name}</p>
                                </div>
                                <div className="text-right font-medium">
                                    {formatAmount(transaction.amount)}
                                </div>
                            </div>
                        );
                    })}
                </CardContent>
            </Card>
        </>
    );
};
