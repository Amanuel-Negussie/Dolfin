import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Separator } from "@/components/ui/separator"
import { Routes, Route, Outlet } from 'react-router-dom';

const accountTypes = [
    "Checking",
    "Credit Card",
    "Savings",
    "Investment",
]


export const AccountPage: React.FC = () => {
    return (
        <div>
            <Routes>
                <Route path="add" element={"Plaid Popup"} />
            </Routes>
            <Outlet />
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