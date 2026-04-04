"use client";

import {
  LayoutGrid,
  CheckCircle,
  Clock4,
  Package,
  SlidersHorizontal,
  ArrowUpDown,
  Inbox,
  Sparkles,
} from "lucide-react";

import DashboardHeader from "@/components/dashboard/DashboardHeader";
import StatsCard from "@/components/dashboard/StatsCard";
import FoodCard from "@/components/food/FoodCard";
import RequestCard from "@/components/requests/RequestCard";
import { useEffect, useState, useCallback } from "react";
import { getMyListings, deleteInventoryListing } from "@/services/inventoryService";
import { getIncomingRequests, updateRequestStatus } from "@/services/requestService";

const CATEGORY_IMAGES = {
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1599490659223-eb157cbef92a?w=400&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&q=80',
  'Staples & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'Packaged Meals': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80',
  'Dairy & Perishables': 'https://images.unsplash.com/photo-1550583724-125581cc25ab?w=400&q=80',
  'Other': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
};
const FILTER_OPTIONS = ["All", "Active", "Reserved", "Sold"];

export default function DonorDashboard() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("newest");
  const [listings, setListings] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const [listingsData, requestsData] = await Promise.all([
        getMyListings(),
        getIncomingRequests()
      ]);
      setListings(listingsData || []);
      setRequests(requestsData || []);
    } catch (error) {
      console.error("Failed to fetch donor data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredListings = listings.filter((item) => {
    if (activeFilter === "All") return true;
    return item.status === activeFilter.toLowerCase().replace(" ", "_");
  });

  const STATS = [
    { 
      title: "Total Listings", 
      value: listings.length, 
      icon: LayoutGrid, 
      color: "purple", 
      trend: "Total unique products in catalog" 
    },
    { 
      title: "Active Deals", 
      value: listings.filter(l => l.status === "active").length, 
      icon: CheckCircle, 
      color: "green", 
      trend: "Available and on the shelf" 
    },
    { 
      title: "Pending Actions", 
      value: requests.filter(r => r.status === "Pending").length, 
      icon: Clock4, 
      color: "amber", 
      trend: "Buyer inquiries awaiting you" 
    },
    { 
      title: "Completed", 
      value: requests.filter(r => r.status === "Sold").length, 
      icon: Package, 
      color: "blue", 
      trend: "Successful liquidations" 
    },
  ];

  const handleRequestStatusChange = async (id, newStatus) => {
    try {
      await updateRequestStatus(id, newStatus);
      // Re-fetch all data to ensure Inventory stats (Active/Reserved/Sold) are in sync
      await fetchData();
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this listing? This action cannot be undone.")) return;

    try {
      await deleteInventoryListing(itemId);
      setListings(listings.filter(l => l._id !== itemId));
    } catch (error) {
      console.error("Failed to delete listing:", error);
      alert("Failed to delete the listing. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 animate-pulse">
        <Sparkles className="w-10 h-10 text-green-500 mb-4 animate-bounce" />
        <h3 className="text-lg font-bold text-gray-900">Syncing Warehouse Data...</h3>
        <p className="text-sm text-gray-400 mt-1">Fetching your live inventory and buyer interest</p>
      </div>
    );
  }

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
            {filteredListings.map((item) => {
              // Map DB fields to FoodCard expectations
              const cardItem = {
                ...item,
                id: item._id,
                name: item.productName,
                units: item.quantityAvailable,
                mrp: item.mrpPerUnit,
                ourPrice: item.listingPrice,
                expiry: `Expiry: ${new Date(item.expiryDate).toLocaleDateString()}`,
                image: item.productImages?.[0] || CATEGORY_IMAGES[item.category] || CATEGORY_IMAGES.Other,
                location: item.location?.coordinates 
                  ? `Lat: ${item.location.coordinates[1]}, Lng: ${item.location.coordinates[0]}` 
                  : "Indiranagar, Bengaluru"
              };
              return (
                <FoodCard
                  key={item._id}
                  item={cardItem}
                  onDelete={() => handleDelete(item._id)}
                />
              );
            })}
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
          {requests.map((req) => {
             // Map DB fields to RequestCard expectations
             const cardRequest = {
               ...req,
               id: req._id,
               buyerName: `${req.buyerId?.firstName} ${req.buyerId?.lastName}`,
               productName: req.inventoryId?.productName,
               quantity: req.quantityRequested,
               pickupTime: req.pickupDeliveryTime,
               status: req.status.toLowerCase()
             };
             return <RequestCard key={req._id} request={cardRequest} onStatusChange={handleRequestStatusChange} />;
          })}
          {requests.length === 0 && (
            <div className="p-10 bg-gray-50 border-2 border-dashed border-gray-100 rounded-3xl text-center col-span-full">
              <p className="text-sm font-bold text-gray-400">No buyer requests yet.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
