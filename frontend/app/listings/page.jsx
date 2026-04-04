"use client";

import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Package,
  Navigation,
  ChevronRight,
  Info,
  Sparkles,
  Clock,
  Building2,
  Phone,
  Tag,
  AlertCircle,
  IndianRupee,
  Leaf,
  X,
  Check,
  LayoutDashboard,
  Send,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { getNearbyDeals } from "@/services/inventoryService";
import { createRequest } from "@/services/requestService";
import { useAuth } from "@/context/AuthContext";
import ChatWindow from "@/components/chat/ChatWindow";

const CATEGORY_IMAGES = {
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1599490659223-eb157cbef92a?w=400&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&q=80',
  'Staples & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'Packaged Meals': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80',
  'Dairy & Perishables': 'https://images.unsplash.com/photo-1550583724-125581cc25ab?w=400&q=80',
  'Other': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
};

const CATEGORIES = ["All", "Snacks & Confectionery", "Beverages", "Staples & Grains", "Packaged Meals", "Dairy & Perishables"];
const FILTERS = ["Expiring Soon", "High Discount", "Under ₹100"];

export default function ListingsPage() {
  const { user } = useAuth();
  const [sellers, setSellers] = useState([]);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Recommended");
  const [loading, setLoading] = useState(true);
  
  // Purchase Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [purchaseItem, setPurchaseItem] = useState(null);
  const [purchaseQuantity, setPurchaseQuantity] = useState(1);
  const [purchaseNote, setPurchaseNote] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeRequest, setActiveRequest] = useState(null);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    async function fetchListings() {
      try {
        const deals = await getNearbyDeals();
        
        // Group flat inventory by Seller
        const sellersMap = {};
        deals.forEach(deal => {
          const sellerId = deal.sellerId?._id || 'unknown';
          if (!sellersMap[sellerId]) {
            sellersMap[sellerId] = {
              id: sellerId,
              name: deal.sellerId?.organizationName || 'Independent Seller',
              location: "Jaipur, Rajasthan",
              distance: "Nearby",
              listingsCount: 0,
              businessType: "Verified Distributor",
              address: deal.sellerId?.address || "Address Not Shared",
              phone: deal.sellerId?.phoneNumber || "Contact Shared on Request",
              inventory: []
            };
          }
          
          sellersMap[sellerId].inventory.push({
            id: deal._id,
            name: deal.productName,
            units: deal.quantityAvailable,
            mrp: deal.mrpPerUnit,
            recommendedPrice: deal.listingPrice,
            expiry: `${Math.ceil((new Date(deal.expiryDate) - new Date()) / (1000 * 60 * 60 * 24))} days`,
            category: deal.category,
            urgency: new Date(deal.expiryDate) - new Date() < 10*24*60*60*1000 ? "High" : "Medium",
            aiInsight: deal.description || "Fresh stock from warehouse. Optimal for retail resale.",
            image: deal.productImages?.[0] || CATEGORY_IMAGES[deal.category] || CATEGORY_IMAGES.Other
          });
          sellersMap[sellerId].listingsCount++;
        });

        const sellersList = Object.values(sellersMap);
        setSellers(sellersList);
        if (sellersList.length > 0) setSelectedSeller(sellersList[0]);
      } catch (error) {
        console.error("Failed to fetch marketplace data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchListings();
  }, []);

  const handleOpenPurchaseModal = (item) => {
    setPurchaseItem(item);
    setPurchaseQuantity(1);
    setPurchaseNote("");
    setIsSuccess(false);
    setIsModalOpen(true);
  };

  const handleConfirmPurchase = async () => {
    if (!purchaseItem || !selectedSeller) return;
    setIsSubmitting(true);
    try {
      const requestData = {
        sellerId: selectedSeller.id,
        inventoryId: purchaseItem.id,
        quantityRequested: purchaseQuantity,
        unit: 'Units',
        expectedPriceTotal: purchaseQuantity * purchaseItem.recommendedPrice,
        pickupDeliveryTime: '5:00 PM Today',
        note: purchaseNote
      };

      const result = await createRequest(requestData);
      
      // Store the result for chat context
      setActiveRequest({
        ...result,
        productName: purchaseItem.name,
        sellerName: selectedSeller.name,
        totalPrice: requestData.expectedPriceTotal,
        quantity: purchaseQuantity
      });

      setIsSuccess(true);
      // Don't close immediately, let user see success and potentially open chat
    } catch (error) {
      console.error("Failed to send purchase request:", error);
      alert(error.response?.data?.message || "Failed to send request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = seller.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         seller.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const sortedInventory = [...(selectedSeller?.inventory || [])]
    .filter(item => activeCategory === "All" || item.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "Price: Low to High") {
        return a.recommendedPrice - b.recommendedPrice;
      }
      if (sortBy === "Expiry: Soonest") {
        return parseInt(a.expiry) - parseInt(b.expiry);
      }
      return 0;
    });

  return (
    <div className="flex min-h-screen bg-gray-50/50">
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* TOP SECTION — SEARCH & FILTER BAR */}
        <header className="bg-white border-b border-border px-8 py-4 space-y-4 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Logo Section (kept from Sidebar) */}
              <Link href="/dashboard/buyer" className="flex items-center gap-2.5">
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
              <div className="h-8 w-px bg-gray-100" />
              <h1 className="text-xl font-bold text-gray-900">Inventory Discovery Marketplace</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/dashboard/buyer">
                <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-white text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                  <LayoutDashboard className="w-4 h-4" />
                  Buyer Dashboard
                </button>
              </Link>
              <div className="flex items-center gap-2 text-xs font-medium text-gray-500">
                <Navigation className="w-3.5 h-3.5 text-green-600" />
                <span>Bengaluru, Karnataka</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1 group">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-green-600 transition-colors" />
              <input
                type="text"
                placeholder="Search by location, warehouse, or seller name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
              />
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">
                <IndianRupee className="w-4 h-4" />
                Price Range
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all",
                  activeCategory === cat
                    ? "bg-green-600 text-white shadow-md shadow-green-200"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                )}
              >
                {cat}
              </button>
            ))}
            <div className="w-px h-4 bg-gray-200 mx-2" />
            {FILTERS.map((f) => (
              <button
                key={f}
                className="px-4 py-1.5 rounded-full bg-orange-50 text-orange-700 text-xs font-semibold border border-orange-100 whitespace-nowrap hover:bg-orange-100 transition-all"
              >
                {f}
              </button>
            ))}
          </div>
        </header>

        <div className="flex flex-1 overflow-hidden">
          {/* LEFT SIDE — SELLERS LIST */}
          <aside className="w-[380px] border-r border-border bg-white overflow-y-auto p-4 space-y-4">
            <div className="px-2 pb-2 border-b border-gray-50">
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Nearby Sellers</p>
            </div>
            {loading ? (
              <div className="p-10 text-center space-y-4 animate-pulse">
                <div className="w-12 h-12 bg-gray-100 rounded-2xl mx-auto" />
                <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto" />
              </div>
            ) : filteredSellers.map((seller) => (
              <div
                key={seller.id}
                onClick={() => setSelectedSeller(seller)}
                className={cn(
                  "p-4 rounded-2xl border transition-all cursor-pointer group relative overflow-hidden",
                  selectedSeller?.id === seller.id
                    ? "bg-green-50/50 border-green-200 shadow-sm"
                    : "bg-white border-transparent hover:border-gray-200 hover:bg-gray-50/50"
                )}
              >
                {selectedSeller?.id === seller.id && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-600" />
                )}
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 rounded-xl bg-gray-50 border border-gray-100 group-hover:bg-white transition-colors">
                    <Building2 className="w-5 h-5 text-gray-600" />
                  </div>
                  <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                    <Navigation className="w-3 h-3" />
                    {seller.distance}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">{seller.name}</h3>
                  <div className="mt-2 space-y-1.5">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <MapPin className="w-3.5 h-3.5" />
                      <span className="truncate">{seller.address}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Package className="w-3.5 h-3.5" />
                      <span className="font-semibold text-green-600">{seller.listingsCount} Active Listings</span>
                    </div>
                  </div>
                </div>
                <button 
                  className={cn(
                    "w-full mt-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5",
                    selectedSeller?.id === seller.id
                      ? "bg-green-600 text-white shadow-lg shadow-green-200"
                      : "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                  )}
                >
                  View Inventory
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {!loading && filteredSellers.length === 0 && (
              <div className="p-10 text-center">
                <p className="text-sm font-bold text-gray-400">No sellers matching your search.</p>
              </div>
            )}
          </aside>

          {/* RIGHT SIDE — SLIDING PANEL */}
          <section className="flex-1 bg-gray-50/50 overflow-y-auto p-8">
            {selectedSeller ? (
              <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
                {/* SELLER INFO SECTION */}
                <div className="bg-white rounded-3xl p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-green-700" />
                      </div>
                      <div>
                        <h2 className="text-2xl font-black text-gray-900">{selectedSeller.name}</h2>
                        <p className="text-sm font-medium text-gray-500">{selectedSeller.businessType}</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-4 pt-2">
                      <div className="flex items-center gap-1.5 text-xs text-gray-500">
                        <MapPin className="w-4 h-4 text-green-600" />
                        {selectedSeller.address}
                      </div>
                      {selectedSeller.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-gray-500">
                          <Phone className="w-4 h-4 text-green-600" />
                          {selectedSeller.phone}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div className="px-4 py-2 rounded-2xl bg-green-50 border border-green-100 text-center">
                      <p className="text-[10px] font-bold text-green-600 uppercase tracking-wider">Reliability</p>
                      <p className="text-lg font-black text-green-700">98%</p>
                    </div>
                    <div className="px-4 py-2 rounded-2xl bg-blue-50 border border-blue-100 text-center">
                      <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Total Sales</p>
                      <p className="text-lg font-black text-blue-700">1.2k</p>
                    </div>
                  </div>
                </div>

                {/* INVENTORY CARDS */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">Available Inventory</h3>
                      <p className="text-xs text-gray-400 mt-0.5">Showing {selectedSeller.inventory.length} items from this seller</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sort by:</span>
                      <select 
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-transparent text-xs font-bold text-gray-600 outline-none cursor-pointer"
                      >
                        <option>Recommended</option>
                        <option>Price: Low to High</option>
                        <option>Expiry: Soonest</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {sortedInventory.length > 0 ? (
                      sortedInventory.map((item) => (
                        <div key={item.id} className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                          <div className="relative h-48 overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute top-4 left-4 flex gap-2">
                              <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-sm text-[10px] font-bold text-gray-700 shadow-sm">
                                {item.category}
                              </span>
                              <span className={cn(
                                "px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1",
                                item.urgency === "High" ? "bg-red-500 text-white" : 
                                item.urgency === "Medium" ? "bg-orange-500 text-white" : "bg-green-500 text-white"
                              )}>
                                <Clock className="w-3 h-3" />
                                {item.urgency} Urgency
                              </span>
                            </div>
                          </div>
                          
                          <div className="p-5 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-4">
                              <div>
                                <h4 className="text-lg font-bold text-gray-900 leading-tight">{item.name}</h4>
                                <p className="text-xs font-medium text-gray-400 mt-1 flex items-center gap-1">
                                  <Package className="w-3.5 h-3.5" />
                                  {item.units} units available
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 mb-5">
                              <div className="p-3 rounded-2xl bg-gray-50 border border-gray-100">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Price / Unit</p>
                                <div className="flex items-baseline gap-1.5">
                                  <span className="text-lg font-black text-gray-900">₹{item.recommendedPrice}</span>
                                  <span className="text-xs font-medium text-gray-400 line-through">₹{item.mrp}</span>
                                </div>
                              </div>
                              <div className="p-3 rounded-2xl bg-orange-50/50 border border-orange-100">
                                <p className="text-[10px] font-bold text-orange-600 uppercase tracking-wider mb-1">Expiry</p>
                                <p className="text-lg font-black text-orange-700">{item.expiry}</p>
                              </div>
                            </div>

                            {/* AI Insight */}
                            <div className="mb-6 p-4 rounded-2xl bg-green-50 border border-green-100/50 relative overflow-hidden group/ai">
                              <div className="absolute top-0 right-0 p-2">
                                <Sparkles className="w-4 h-4 text-green-300 animate-pulse" />
                              </div>
                              <div className="flex gap-3 items-start">
                                <div className="w-8 h-8 rounded-lg bg-green-200/50 flex items-center justify-center shrink-0 mt-0.5">
                                  <Info className="w-4 h-4 text-green-700" />
                                </div>
                                <div>
                                  <p className="text-[10px] font-bold text-green-700 uppercase tracking-widest mb-1">AI Smart Insight</p>
                                  <p className="text-xs text-green-800 leading-relaxed font-medium">
                                    {item.aiInsight}
                                  </p>
                                </div>
                              </div>
                            </div>

                            <button 
                              onClick={() => handleOpenPurchaseModal(item)}
                              className="w-full py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all active:scale-[0.98] shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group/btn mt-auto"
                            >
                              Request Purchase
                              <ChevronRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="col-span-2 py-20 flex flex-col items-center justify-center text-center">
                        <div className="w-20 h-20 rounded-3xl bg-gray-100 flex items-center justify-center mb-4">
                          <Package className="w-10 h-10 text-gray-300" />
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">No active inventory</h4>
                        <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">This seller currently has no items listed for liquidation. Check back later!</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 rounded-full bg-green-50 flex items-center justify-center mb-6">
                  <Building2 className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-2xl font-black text-gray-900">Select a seller to view inventory</h2>
                <p className="text-gray-500 mt-2 max-w-md mx-auto">Browse through manufacturers and distributors on the left to find the best deals for your retail or wholesale business.</p>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* PURCHASE MODAL */}
      {isModalOpen && purchaseItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Overlay */}
          <div 
            className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => !isSuccess && setIsModalOpen(false)}
          />
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-up">
            {isSuccess ? (
              <div className="p-12 text-center space-y-6">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="w-10 h-10 text-green-600" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-black text-gray-900">Request Sent!</h3>
                  <p className="text-gray-500 text-sm">Your purchase request for <strong>{purchaseQuantity} units</strong> of {purchaseItem.name} has been sent to {selectedSeller.name}.</p>
                </div>
                
                <div className="flex flex-col gap-3 pt-4">
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsChatOpen(true);
                    }}
                    className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-200 flex items-center justify-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    Message Seller
                  </button>
                  <button 
                    onClick={() => {
                      setIsModalOpen(false);
                      setIsSuccess(false);
                    }}
                    className="w-full py-4 bg-gray-100 text-gray-600 rounded-2xl font-bold text-sm hover:bg-gray-200 transition-all"
                  >
                    Back to Marketplace
                  </button>
                </div>
              </div>
            ) : (
              <>
                <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                      <Package className="w-5 h-5 text-green-700" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900">Request Purchase</h3>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{purchaseItem.name}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>

                <div className="p-8 space-y-6">
                  {/* Quantity Input */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Quantity to Buy</label>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        {purchaseItem.units} units available
                      </span>
                    </div>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max={purchaseItem.units}
                        value={purchaseQuantity}
                        onChange={(e) => setPurchaseQuantity(Math.min(purchaseItem.units, Math.max(1, parseInt(e.target.value) || 0)))}
                        className="w-full pl-4 pr-12 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-lg font-bold focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">Units</span>
                    </div>
                  </div>

                  {/* Price Calculation */}
                  <div className="p-5 rounded-[1.5rem] bg-gray-900 text-white space-y-3">
                    <div className="flex justify-between items-center text-xs font-medium text-gray-400">
                      <span>Unit Price</span>
                      <span>₹{purchaseItem.recommendedPrice} / unit</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold">Total Price</span>
                      <span className="text-2xl font-black text-green-400">₹{purchaseQuantity * purchaseItem.recommendedPrice}</span>
                    </div>
                  </div>

                  {/* Note Area */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Add a Note (Optional)</label>
                    <textarea
                      placeholder="Special instructions for the seller..."
                      value={purchaseNote}
                      onChange={(e) => setPurchaseNote(e.target.value)}
                      rows={3}
                      className="w-full p-4 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all resize-none"
                    />
                  </div>

                  <button 
                    onClick={handleConfirmPurchase}
                    disabled={isSubmitting}
                    className="w-full py-5 bg-green-600 text-white rounded-2xl font-black text-base hover:bg-green-700 transition-all shadow-xl shadow-green-200 flex items-center justify-center gap-2 group/confirm disabled:opacity-50"
                  >
                    {isSubmitting ? "Sending Request..." : "Confirm Purchase Request"}
                    <ChevronRight className="w-5 h-5 group-hover/confirm:translate-x-1 transition-transform" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* CHAT WINDOW */}
      {isChatOpen && activeRequest && user && (
        <div className="fixed bottom-6 right-6 z-50 w-[400px] max-w-[calc(100vw-3rem)]">
          <ChatWindow 
            request={activeRequest}
            currentUser={user}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}
    </div>
  );
}
