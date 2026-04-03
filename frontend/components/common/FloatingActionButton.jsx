"use client";

import Link from "next/link";
import { Plus } from "lucide-react";

export default function FloatingActionButton() {
  return (
    <div className="fixed bottom-7 right-7 z-50 group">
      {/* Tooltip */}
      <div className="absolute bottom-full mb-2.5 right-0 opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0 pointer-events-none">
        <div className="bg-gray-900 text-white text-xs font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg">
          Add Product
          <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900" />
        </div>
      </div>

      {/* FAB Button */}
      <Link href="/food/add">
        <button
          className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 text-white flex items-center justify-center shadow-xl shadow-green-300/50 hover:scale-110 active:scale-95 transition-all duration-200 hover:shadow-2xl hover:shadow-green-400/60"
          aria-label="Add Product"
        >
          <Plus className="w-6 h-6" strokeWidth={2.5} />
        </button>
      </Link>
    </div>
  );
}
