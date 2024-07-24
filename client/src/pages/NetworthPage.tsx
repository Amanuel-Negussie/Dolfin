import { NetworthSummaryCard } from "@/components/NetworthSummaryCard";

export const NetworthPage: React.FC = () => {

    return (
        <div className="hidden flex-col md:flex">
        <div className="flex-1 space-y-4 p-20 pt-6">
            <h2 className="text-3xl font-bold tracking-tight">Networth</h2>
            <div>
                <NetworthSummaryCard />
            </div>
        <div>
        Summary, Assets, Debt
        </div>
        </div>
    </div>
    );
}