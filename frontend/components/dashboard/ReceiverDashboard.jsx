"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ArrowRight, 
  TrendingUp, 
  MapPin, 
  Building2,
  ChevronRight,
  Sparkles,
  Info
} from "lucide-react";
import StatsCard from "./StatsCard";
import { cn } from "@/lib/utils";

const RECOMMENDED_DEALS = [
  {
    id: "k1",
    name: "Lay's Classic Salted Chips",
    seller: "Khandelwal Distributors",
    units: 500,
    mrp: 20,
    recommendedPrice: 11,
    expiry: "18 days",
    category: "Snacks",
    urgency: "High",
    image: "https://images.unsplash.com/photo-1566478431375-704386ca0248?w=400&q=80",
    aiInsight: "High demand expected. Suggested for quick liquidation."
  },
  {
    id: "k2",
    name: "Kurkure Masala Munch",
    seller: "Khandelwal Distributors",
    units: 300,
    mrp: 15,
    recommendedPrice: 9,
    expiry: "12 days",
    category: "Snacks",
    urgency: "High",
    image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80",
    aiInsight: "Fast moving snack. High clearance probability."
  },
  {
    id: "m1",
    name: "Coca-Cola 500ml",
    seller: "Metro Wholesale Traders",
    units: 200,
    mrp: 40,
    recommendedPrice: 25,
    expiry: "30 days",
    category: "Beverages",
    urgency: "Low",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
    aiInsight: "Stable demand. Good for regular stock."
  }
];

const MY_REQUESTS = [
  {
    id: 1,
    productName: "Britannia Good Day",
    sellerName: "Khandelwal Distributors",
    quantity: 400,
    totalPrice: 7200,
    status: "Pending",
    time: "2 hours ago",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80"
  },
  {
    id: 2,
    productName: "Parle-G Family Pack",
    sellerName: "ValueMart Supply Chain",
    quantity: 100,
    totalPrice: 3000,
    status: "Accepted",
    time: "5 hours ago",
    image: "/products/parleg.png"
  }
];

export default function ReceiverDashboard() {
  const stats = [
    { title: "Available Deals", value: "24", icon: TrendingUp, color: "green", trend: "Opportunities nearby" },
    { title: "My Requests", value: "5", icon: Package, color: "blue", trend: "Ongoing negotiations" },
    { title: "Reserved", value: "2", icon: Clock, color: "amber", trend: "Awaiting pickup" },
    { title: "Completed", value: "3", icon: CheckCircle2, color: "purple", trend: "Successful orders" },
  ];

  return (
    <div className="animate-fade-in space-y-10 pb-10">
      {/* Stats Section */}
      <section className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <StatsCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* Recommended Deals Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recommended Deals</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-tight">Hand-picked inventory opportunities for you</p>
          </div>
          <Link href="/listings" className="group flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 transition-colors">
            Browse All Deals
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {RECOMMENDED_DEALS.map((deal) => (
            <div key={deal.id} className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
              <div className="relative h-44 overflow-hidden">
                <img src={deal.image} alt={deal.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute top-4 left-4">
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1",
                    deal.urgency === "High" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                  )}>
                    <Clock className="w-3 h-3" />
                    {deal.urgency} Urgency
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="mb-4">
                  <h4 className="text-base font-bold text-gray-900 leading-tight">{deal.name}</h4>
                  <p className="text-[11px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                    <Building2 className="w-3 h-3" />
                    {deal.seller}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Our Price</p>
                    <p className="text-sm font-black text-gray-900">₹{deal.recommendedPrice}</p>
                  </div>
                  <div className="p-2.5 rounded-2xl bg-orange-50/50 border border-orange-100">
                    <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">Expiry</p>
                    <p className="text-sm font-black text-orange-700">{deal.expiry}</p>
                  </div>
                </div>
                <Link href="/listings" className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group/btn mt-auto">
                  View Deal
                  <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* My Requests Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Requests / Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-tight">Track your active deal negotiations and order history</p>
          </div>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors">View All</button>
        </div>

        <div className="space-y-4">
          {MY_REQUESTS.map((request) => (
            <div key={request.id} className="bg-white p-4 rounded-3xl border border-border flex items-center gap-5 hover:border-green-200 transition-all group">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                <img src={request.image} alt={request.productName} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{request.productName}</h4>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-bold",
                    request.status === "Accepted" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"
                  )}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1"><Building2 className="w-3 h-3" /> {request.sellerName}</span>
                  <span className="flex items-center gap-1"><Package className="w-3 h-3" /> {request.quantity} units</span>
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {request.time}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-gray-900">₹{request.totalPrice}</p>
                <button className="text-[11px] font-bold text-green-600 hover:underline mt-1">Track Status</button>
              </div>
              <button className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      </section>


    </div>
  );
}
