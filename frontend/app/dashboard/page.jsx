import { redirect } from "next/navigation";

export const metadata = {
  title: "Dashboard – ClearStock",
  description: "Manage your inventory listings or track your purchase requests.",
};

export default function DashboardPage({ searchParams }) {
  // Simulate checking user role from session/auth
  // For now, default to seller unless buyer is specified in params
  const isBuyer = searchParams?.role === "buyer";
  
  if (isBuyer) {
    redirect("/dashboard/buyer");
  } else {
    redirect("/dashboard/seller");
  }

  return null;
}
