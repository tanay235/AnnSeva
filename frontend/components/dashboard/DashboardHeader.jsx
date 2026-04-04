"use client";

import Link from "next/link";
import { Bell, Plus, Search, Leaf, Home } from "lucide-react";

export default function DashboardHeader() {
  return (
    <header className="flex items-center justify-between py-4 border-b border-border bg-white px-8 sticky top-0 z-30 w-full shadow-sm">
      {/* Left: Logo Section */}
      <Link href="/dashboard" className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 group-hover:scale-105 transition-transform duration-200">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            Clear<span className="text-green-600">Stock</span>
          </span>
          <p className="text-[10px] text-gray-400 -mt-0.5 font-medium tracking-tight">Inventory Liquidation Platform</p>
        </div>
      </Link>

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

        {/* Back to Home CTA */}
        <Link href="/">
          <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm active:scale-95">
            <Home className="w-4 h-4" />
            Go Home
          </button>
        </Link>
      </div>
    </header>
  );
}
