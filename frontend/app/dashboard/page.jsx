import DonorDashboard from "@/components/dashboard/DonorDashboard";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import FloatingActionButton from "@/components/common/FloatingActionButton";

export const metadata = {
  title: "Seller Dashboard – ClearStock",
  description: "Manage your inventory listings and track wholesale requests.",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Proper Sticky Nav Bar - 0 Margin with Top */}
      <DashboardHeader />

      {/* Main content below Nav */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Welcome Message Section - Now properly below Nav */}
          <div className="animate-fade-in px-2 mb-10">
            <h1 className="text-3xl font-black text-gray-900 tracking-tight">
              Welcome back, Aryan 👋
            </h1>
            <p className="text-base text-gray-500 mt-1.5 font-medium">
              Manage your inventory listings and track buyer requests.
            </p>
          </div>
          
          <DonorDashboard />
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
