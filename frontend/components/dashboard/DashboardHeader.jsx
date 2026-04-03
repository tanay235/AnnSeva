"use client";

import Link from "next/link";
import { Bell, Plus, Search } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between gap-4 mb-8">
      {/* Left: Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
          Welcome back, Aryan 👋
        </h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your inventory listings and track buyer requests.
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification */}
        <button onClick={() => alert("You have 3 new notifications!")} className="relative w-9 h-9 rounded-xl border border-border bg-white hover:bg-gray-50 flex items-center justify-center transition-colors shadow-sm">
          <Bell className="w-4 h-4 text-gray-500" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
            3
          </span>
        </button>

        {/* Add Product CTA */}
        <Link href="/food/add">
          <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200">
            <Plus className="w-4 h-4" strokeWidth={2.5} />
            Add Product
          </button>
        </Link>


      </div>
    </header>
  );
}
