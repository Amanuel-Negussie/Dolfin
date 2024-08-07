//AccountsPage.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import { useLocation, useNavigate } from 'react-router-dom';
import { useAccounts, useLink } from "../services";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import LaunchLink from "@/components/LaunchLink";
import { Trash, Plus } from 'lucide-react';
import { AccountType } from "@/components/types";
import { deleteAccountById } from "@/services/api";

interface GroupedAccounts {
    [key: string]: AccountType[];
}

const accountTypes: string[] = [
    "Checking",
    "Savings",
    "Credit Card",
    "Investment",
]

export const AccountPage: React.FC = () => {
    const { accountsByUser, getAccountsByUser } = useAccounts();
    const [token, setToken] = useState('');
    const { generateLinkToken, linkTokens } = useLink();
    const [accountCollection, setAccountCollection] = useState<GroupedAccounts>({});
    const [isEditMode, setIsEditMode] = useState<boolean>(false);
    const location = useLocation();
    const navigate = useNavigate();

    const userId = 0;

    const initiateLink = async () => {
        // only generate a link token upon a click from enduser to add a bank;
        // if done earlier, it may expire before enduser actually activates Link to add a bank.
        await generateLinkToken(userId, null);
    };

    const deleteAccount = async (accountId: number) => {
        await deleteAccountById(accountId);
        window.location.reload();
    };

    useEffect(() => {
        getAccountsByUser(userId);
    }, [getAccountsByUser]);

    useEffect(() => {
        if (Object.keys(accountsByUser).length > 0) {
            const groupedAccounts: GroupedAccounts = accountTypes.reduce((acc: GroupedAccounts, type) => {
                acc[type] = Object.values(accountsByUser)[0].filter((account: AccountType) => account.subtype === type.toLowerCase());
                return acc;
            }, {} as GroupedAccounts);

            setAccountCollection(groupedAccounts);
        }
    }, [accountsByUser]);

    useEffect(() => {
        if (location.state && location.state.fromButton && !isNaN(userId)) {
            initiateLink();
            navigate(location.pathname, { replace: true, state: {} });
        }
    }, [location.state, userId]);

    useEffect(() => {
        if (userId != null) {
            setToken(linkTokens.byUser[userId]);
        }
    }, [linkTokens, userId]);

    const PlaidLink = <>
        {token != null && token.length > 0 && (
            // Link will not render unless there is a link token
            <LaunchLink token={token} userId={userId} itemId={null} />
        )}
    </>;

    return (
        <div className="flex-1 p-20 pt-6">
            <div className="flex justify-end">

            </div>
            {PlaidLink}
            <CardTitle className="text-4xl font-bold">Accounts</CardTitle>
            <Card className="border-none">
                <CardHeader className="p-0 pt-3 pr-6">
                    <div className="ml-auto grid gap-4 grid-cols-2">
                        <Button onClick={initiateLink} >Add Bank</Button>
                        <Button
                            onClick={() => setIsEditMode(!isEditMode)}
                            variant={isEditMode ? "destructive" : "secondary"}
                        >
                            Edit
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {accountTypes.map((type, index) => (
                        <div key={index} className="grid gap-4 pt-3 pb-3">
                            <CardTitle className="text-2xl font-bold">{type}</CardTitle>
                            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4">
                                {accountCollection[type] && accountCollection[type].map(account => (
                                    <Card key={account.id} className="flex flex-col min-h-[165px]">
                                        <CardHeader>
                                            <CardTitle>{account.name} ({account.mask})</CardTitle>
                                            <CardDescription>{account.official_name}</CardDescription>
                                        </CardHeader>
                                        <CardContent className="flex-grow flex items-center justify-between text-3xl font-bold">
                                            ${account.current_balance.toFixed(2)}
                                            <Button
                                                variant="destructive"
                                                size="icon"
                                                onClick={() => deleteAccount(account.id)}
                                                className={isEditMode ? "ml-auto" : "ml-auto invisible"}>
                                                <Trash className="w-5 h-5" />
                                            </Button>
                                        </CardContent>
                                    </Card>
                                ))}
                                <Card className="flex flex-col items-center justify-center min-h-[165px]">
                                    <Button size="icon" onClick={initiateLink} className="">
                                        <Plus className="w-5 h-5" />
                                    </Button>
                                </Card>
                            </div>
                            <Separator />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}