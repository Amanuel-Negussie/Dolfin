import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { AccountType } from "./types";
import { Separator } from "@/components/ui/separator";
import { useInstitutions, useItems } from "@/services";
import { ItemType } from "./types";

interface AccountSummaryCardProps {
    accounts: AccountType[] | null;
}

export const AccountSummaryCard: React.FC<AccountSummaryCardProps> = ({ accounts = null }) => {
    const { getInstitutionById, institutionsById } = useInstitutions();
    const { getItemsByUser, itemsByUser } = useItems();
    const [itemCollection, setItemCollection] = useState<ItemType[]>([]);

    const navigate = useNavigate();

    const navigateToTarget = () => {
        navigate('/accounts', { state: { fromButton: true } });
    };

    const [showCheckingInfo, setShowCheckingInfo] = useState(false);
    const [showCreditInfo, setShowCreditInfo] = useState(false);

    const toggleCheckingInfo = () => setShowCheckingInfo(!showCheckingInfo);
    const toggleCreditInfo = () => setShowCreditInfo(!showCreditInfo);

    const checkingAccounts = accounts?.filter((account) => account.subtype === 'checking');
    const totalCheckingBalance = checkingAccounts?.reduce((acc, account) => acc + account.current_balance, 0);

    const creditAccounts = accounts?.filter((account) => account.subtype === 'credit card');
    const totalCreditBalance = creditAccounts?.reduce((acc, account) => acc + account.current_balance, 0);

    useEffect(() => {
        getItemsByUser(0);
    }, [getItemsByUser]);

    useEffect(() => {
        if (Object.keys(itemsByUser).length > 0) {
            setItemCollection(Object.values(itemsByUser)[0]);
            Array.from(new Set(
                Object.values(itemsByUser)[0].map(item => item.plaid_institution_id)
            )).forEach((institutionId) => {
                getInstitutionById(institutionId);
            });
        }
    }, [itemsByUser]);

    useEffect(() => {
        if (itemCollection?.length != 0 && Object.keys(institutionsById).length == itemCollection?.length) {

        }
    }, [institutionsById]);

    const getInstitutionNameFromItemId = (itemId: number) => {
        const item = itemCollection?.find(item => item.id === itemId);
        const institution = institutionsById[String(item?.plaid_institution_id)];
        return institution?.name;
    }

    const getInstitutionLogoFromItemId = (itemId: number) => {
        const item = itemCollection?.find(item => item.id === itemId);
        const institution = institutionsById[String(item?.plaid_institution_id)];
        return institution?.logo;
    }

    return (
        <>
            <Card>
                <CardHeader className="grid grid-cols-2">
                    <CardTitle className="">Account Summary</CardTitle>
                    <Button onClick={navigateToTarget} className="ml-auto">Add Bank</Button>
                </CardHeader>
                <CardContent className="grid md:grid-csmols-1 lg:grid-cols-2 gap-4">
                    <div>
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle>Checking</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Total Balance</CardDescription>
                                <div className="text-3xl font-bold">${totalCheckingBalance?.toFixed(2)}</div>
                            </CardContent>
                            <Button onClick={toggleCheckingInfo} className="w-full rounded-none rounded-b-md">
                                {showCheckingInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </Button>
                            {showCheckingInfo && (
                                <CardContent>
                                    {checkingAccounts?.length == 0 ?
                                        <CardDescription className="text-center pt-5">No checking accounts to display.</CardDescription>
                                        :
                                        checkingAccounts?.map((account) => (
                                            <Card key={account.id} className="mt-2">
                                                <CardHeader>
                                                    <CardTitle>{getInstitutionNameFromItemId(account.item_id)} {account.name} ({account.mask})</CardTitle>
                                                    <CardDescription>{account.official_name}</CardDescription>
                                                </CardHeader>
                                                {/*<img src={"data:image/png;base64, " + getInstitutionLogoFromItemId(account.item_id)} alt="Institution Logo" className="w-20 h-20 mx-auto" />*/}
                                                <CardContent>
                                                    <CardDescription>Current Balance</CardDescription>
                                                    <CardDescription className="text-3xl font-bold">
                                                        $ {account?.current_balance != null ? account.current_balance.toFixed(2) : '0.00'}
                                                    </CardDescription>
                                                </CardContent>
                                               
                                            </Card>
                                        ))}
                                </CardContent>
                            )}
                        </Card>
                    </div>
                    <div>
                        <Card>
                            <CardHeader className="p-4">
                                <CardTitle>Credit Cards</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <CardDescription>Total Balance</CardDescription>
                                <div className="text-3xl font-bold">${totalCreditBalance?.toFixed(2)}</div>
                            </CardContent>
                            <Button onClick={toggleCreditInfo} className="w-full rounded-none rounded-b-md">
                                {showCreditInfo ? <ChevronUpIcon /> : <ChevronDownIcon />}
                            </Button>
                            {showCreditInfo && (
                                <CardContent>
                                    {creditAccounts?.length == 0 ?
                                        <CardDescription className="text-center pt-5">No credit card accounts to display.</CardDescription>
                                        :
                                        creditAccounts?.map((account) => (
                                            <Card key={account.id} className="mt-2">
                                                <CardHeader>
                                                    <CardTitle>{getInstitutionNameFromItemId(account.item_id)} {account.name} ({account.mask})</CardTitle>
                                                    <CardDescription>{account.official_name}</CardDescription>
                                                </CardHeader>
                                                <CardContent>
                                                    <CardDescription>Current Balance</CardDescription>
                                                    <CardDescription className="text-3xl font-bold">
                                                        $ {account?.current_balance != null ? account.current_balance.toFixed(2) : '0.00'}
                                                    </CardDescription>
                                                </CardContent>
                                                <Separator />
                                            </Card>
                                        ))}
                                </CardContent>
                            )}
                        </Card>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}