"use client";

import { useState } from "react";
import {
  LayoutGrid,
  CheckCircle,
  Clock4,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
  Inbox,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import FoodCard from "@/components/food/FoodCard";
import RequestCard from "@/components/requests/RequestCard";

/* ─── Static Dummy Data ─── */
const INITIAL_PRODUCT_LISTINGS = [
  {
    id: 1,
    name: "Lay's Classic Salted Chips",
    category: "Snacks",
    units: 500,
    mrp: 20,
    ourPrice: 11,
    expiry: "Expiry: 18 Apr 2026",
    status: "active",
    location: "Koramangala Warehouse, Bengaluru",
    image: "/products/lays.png",
  },
  {
    id: 2,
    name: "Kurkure Masala Munch",
    category: "Snacks",
    units: 250,
    mrp: 10,
    ourPrice: 6,
    expiry: "Expires in 18 days",
    status: "reserved",
    location: "Indiranagar, Bengaluru",
    image: "https://images.unsplash.com/photo-1621447504864-d8686e12698c?w=400&q=80",
  },
  {
    id: 3,
    name: "Britannia Good Day",
    category: "Biscuits",
    units: 400,
    mrp: 30,
    ourPrice: 15,
    expiry: "Expiry: 22 May 2026",
    status: "active",
    location: "JP Nagar Warehouse, Bengaluru",
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80",
  },
  {
    id: 4,
    name: "Coca-Cola 500ml",
    category: "Beverages",
    units: 200,
    mrp: 40,
    ourPrice: 20,
    expiry: "Expires in 5 days",
    status: "sold",
    location: "Whitefield, Bengaluru",
    image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=400&q=80",
  },
  {
    id: 5,
    name: "Parle-G Family Pack",
    category: "Biscuits",
    units: 1500,
    mrp: 50,
    ourPrice: 30,
    expiry: "Expiry: 10 Aug 2026",
    status: "active",
    location: "HSR Layout, Bengaluru",
    image: "/products/parleg.png",
  },
  {
    id: 6,
    name: "Bingo Mad Angles",
    category: "Snacks",
    units: 350,
    mrp: 15,
    ourPrice: 8,
    expiry: "Expires in 12 days",
    status: "reserved",
    location: "Bellandur, Bengaluru",
    image: "/products/bingo.png",
  },
];

const INITIAL_REQUESTS = [
  {
    id: 1,
    buyerName: "Metro Wholesale Traders",
    location: "Koramangala, Bengaluru",
    productName: "Lay's Classic Salted Chips",
    quantity: 300,
    pickupTime: "5:00 PM Today",
    note: "Need for retail distribution this weekend.",
    status: "pending",
  },
  {
    id: 2,
    buyerName: "Seva Retail Supply",
    location: "Indiranagar, Bengaluru",
    productName: "Kurkure Masala Munch",
    quantity: 250,
    pickupTime: "4:00 PM Today",
    note: "For quick moving store stock.",
    status: "accepted",
  },
  {
    id: 3,
    buyerName: "City Retail Supply",
    location: "JP Nagar, Bengaluru",
    productName: "Britannia Good Day",
    quantity: 400,
    pickupTime: "7:00 PM Today",
    note: "Looking for repeat bulk purchase.",
    status: "pending",
  },
  {
    id: 4,
    buyerName: "ValueMart Wholesale",
    location: "Whitefield, Bengaluru",
    productName: "Coca-Cola 500ml",
    quantity: 200,
    pickupTime: "6:30 PM Today",
    note: "Urgent for store replenishment.",
    status: "pending",
  },
];

const FILTER_OPTIONS = ["All", "Active", "Reserved", "Sold"];

export default function DonorDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");

  const [listings, setListings] = useState(INITIAL_PRODUCT_LISTINGS);
  const [requests, setRequests] = useState(INITIAL_REQUESTS);

  const filteredListings = listings.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter.toLowerCase().replace(" ", "_");
  });

  const STATS = [
    { title: "Total Listings", value: listings.length, icon: LayoutGrid, color: "purple", trend: "Active inventory listings" },
    { title: "Active Deals", value: listings.filter(l => l.status === "active").length, icon: CheckCircle, color: "green", trend: "Currently available for sale" },
    { title: "Reserved", value: listings.filter(l => l.status === "reserved").length, icon: Clock4, color: "amber", trend: "Under buyer review" },
    { title: "Sold", value: listings.filter(l => l.status === "sold").length, icon: Package, color: "blue", trend: "Successfully cleared" },
  ];

  const handleDeleteListing = (id) => {
    setListings(listings.filter((l) => l.id !== id));
  };

  const handleRequestStatusChange = (id, newStatus) => {
    setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  return (
    <div className="animate-fade-in space-y-10">

      {/* Stats */}
      <section>
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <StatsCard key={stat.title} {...stat} />
          ))}
        </div>
      </section>

      {/* My Food Listings */}
      <section id="listings" className="scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">My Product Listings</h2>
            <p className="text-xs text-gray-400 mt-0.5">{filteredListings.length} active inventory items</p>
          </div>

          <div className="flex items-center gap-2">
            {/* Filter pills */}
            <div className="hidden sm:flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
              {FILTER_OPTIONS.map((f) => (
                <button
                  key={f}
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150 ${
                    activeFilter === f
                      ? "bg-white text-green-700 shadow-sm"
                      : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Sort */}
            <button
              onClick={() => setSortOrder(sortOrder === "newest" ? "oldest" : "newest")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border bg-white text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              {sortOrder === "newest" ? "Newest" : "Oldest"}
            </button>
          </div>
        </div>

        {filteredListings.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredListings.map((item) => (
              <FoodCard
                key={item.id}
                item={item}
                onDelete={handleDeleteListing}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-14 h-14 rounded-2xl bg-gray-100 flex items-center justify-center mb-3">
              <Inbox className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">No listings found</p>
            <p className="text-xs text-gray-400 mt-1">Try a different filter or add a new listing.</p>
          </div>
        )}
      </section>

      {/* Incoming Requests */}
      <section id="requests" className="pb-10 scroll-mt-8">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Buyer Requests</h2>
            <p className="text-xs text-gray-400 mt-0.5">{requests.length} active buyer inquiries</p>
          </div>
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-700 text-xs font-bold">
            {requests.filter((r) => r.status === "pending").length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-5">
          {requests.map((req) => (
            <RequestCard key={req.id} request={req} onStatusChange={handleRequestStatusChange} />
          ))}
        </div>
      </section>
    </div>
  );
}
