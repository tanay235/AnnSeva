"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  List,
  InboxIcon,
  MapPin,
  User,
  LogOut,
  Leaf,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/listings", label: "Inventory Search", icon: List },
  { href: "#requests", label: "Requests", icon: InboxIcon },
  { href: "#", action: "map", label: "Map View", icon: MapPin },
  { href: "#", action: "profile", label: "Profile", icon: User },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 bg-white border-r border-border flex flex-col z-30 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-5 border-b border-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200">
            <Leaf className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-extrabold text-gray-900 tracking-tight">
              Clear<span className="text-green-600">Stock</span>
            </span>
            <p className="text-[10px] text-gray-400 -mt-0.5 font-medium">Inventory Liquidation Platform</p>
          </div>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-3 text-[10px] font-semibold tracking-widest text-gray-400 uppercase">
          Navigation
        </p>
        {navLinks.map(({ href, label, icon: Icon, action }) => (
          <Link
            key={label}
            href={href}
            onClick={(e) => {
              if (action) {
                e.preventDefault();
                alert(`${label} feature coming soon!`);
              }
            }}
            className={cn(
              "sidebar-link group",
              pathname === href && "active"
            )}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      {/* User card + Logout */}
      <div className="px-3 py-4 border-t border-border space-y-1">
        <div className="flex items-center gap-3 px-3 py-2 mb-1 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
            AR
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Aryan Sharma</p>
            <p className="text-[10px] text-gray-400 truncate">aryan@example.com</p>
          </div>
        </div>
        <button onClick={() => alert("Logging out...")} className="sidebar-link w-full !text-red-400 hover:!text-red-600 hover:!bg-red-50">
          <LogOut className="w-4 h-4 shrink-0" />
          Logout
        </button>
      </div>
    </aside>
  );
}
