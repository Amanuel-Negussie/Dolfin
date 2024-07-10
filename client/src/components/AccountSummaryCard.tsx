import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const AccountSummaryCard: React.FC = () => {
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