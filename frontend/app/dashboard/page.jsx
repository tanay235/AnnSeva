import DonorDashboard from "@/components/dashboard/DonorDashboard";
import Sidebar from "@/components/common/Sidebar";
import FloatingActionButton from "@/components/common/FloatingActionButton";

export const metadata = {
  title: "Seller Dashboard – ClearStock",
  description: "Manage your inventory listings and track wholesale requests.",
};

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main content — offset by sidebar width */}
      <main className="flex-1 ml-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <DonorDashboard />
        </div>
      </main>

      {/* Floating Action Button */}
      <FloatingActionButton />
    </div>
  );
}
