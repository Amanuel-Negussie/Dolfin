//AccountsPage.tsx
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { useCurrentUser, useLink } from "../services";
import { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@/components/ui/button";
import LaunchLink from "@/components/LaunchLink";
import useLogin from "@/hooks/useLogin";

const accountTypes = [
    "Checking",
    "Credit Card",
    "Savings",
    "Investment",
]

export const AccountPage: React.FC = () => {
    const [token, setToken] = useState('');
    const { generateLinkToken, linkTokens } = useLink();
    const location = useLocation();

    const userId = Number(useLogin());

    const initiateLink = async () => {
        // only generate a link token upon a click from enduser to add a bank;
        // if done earlier, it may expire before enduser actually activates Link to add a bank.
        await generateLinkToken(userId, null);
    };

    useEffect(() => {
        if (location.state && location.state.fromButton && !isNaN(userId)) {
            initiateLink();
        }
      }, [location.state, userId]);

    useEffect(() => {
        if (userId) {
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
        <div>
            <Button onClick={initiateLink}>Add Bank</Button>
            {PlaidLink}
            <Card>
                <CardHeader>
                    <CardTitle>Accounts</CardTitle>
                </CardHeader>
                <CardContent>
                    {accountTypes.map((type, index) => (
                        <div key={index}>
                            <CardTitle>{type}</CardTitle>
                            <Separator />
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}