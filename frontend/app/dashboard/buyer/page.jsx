import ReceiverDashboard from "@/components/dashboard/ReceiverDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FloatingActionButton from "@/components/common/FloatingActionButton";

export const metadata = {
  title: "Buyer Dashboard – ClearStock",
  description: "Track your deal requests and discover inventory opportunities.",
};

export default function BuyerDashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <DashboardHeader isBuyer={true} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="animate-fade-in px-2 mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome back, Aryan 👋
            </h1>
            <p className="text-base text-gray-500 mt-1.5 font-medium">
              Track your deal requests and discover inventory opportunities.
            </p>
          </div>
          
          <ReceiverDashboard />
        </div>
      </main>

      <FloatingActionButton />
    </div>
  );
}
