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

export const AccountSummaryCard: React.FC = () => {
    const navigate = useNavigate();

    const navigateToTarget = () => {
        navigate('/accounts', { state: { fromButton: true } });
      };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle>Account Summary</CardTitle>
                </CardHeader>

                <CardContent>
                    <div className="flex justify-between">
                        <div>
                            <div className="text-2xl font-bold">Checking</div>
                            <CardDescription>Current Balance</CardDescription>
                            <CardDescription className="text-3xl font-bold">$1,000.00</CardDescription>
                        </div>
                    </div>

                </CardContent>
            </Card>
        </>
    )
}