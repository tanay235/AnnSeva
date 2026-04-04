"use client";

import Link from "next/link";
import { 
  Package, 
  Clock, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Building2,
  X,
  CreditCard,
  MapPin,
  CheckCircle,
  Truck,
  Phone,
  Info,
  MessageSquare
} from "lucide-react";
import StatsCard from "./StatsCard";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import ChatWindow from "@/components/chat/ChatWindow";
import { getNearbyDeals } from "@/services/inventoryService";
import { getMyRequests, cancelRequest, getRequestDetails } from "@/services/requestService";

const CATEGORY_IMAGES = {
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1599490659223-eb157cbef92a?w=400&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=400&q=80',
  'Staples & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&q=80',
  'Packaged Meals': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=400&q=80',
  'Dairy & Perishables': 'https://images.unsplash.com/photo-1550583724-125581cc25ab?w=400&q=80',
  'Other': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80'
};

export default function ReceiverDashboard() {
  const { user } = useAuth();
  const [deals, setDeals] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Tracking Modal State
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [trackingLoading, setTrackingLoading] = useState(false);
  const [isCancelLoading, setIsCancelLoading] = useState(false);

  // Chat State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [activeChatRequest, setActiveChatRequest] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      console.log("[ReceiverDashboard] Fetching data...");
      setLoading(true);
      
      const dealsRes = await getNearbyDeals();
      setDeals(dealsRes || []);
      
      const requestsRes = await getMyRequests();
      setRequests(requestsRes || []);
      
    } catch (error) {
      console.error("[ReceiverDashboard] Sync Error:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleTrackStatus = async (requestId) => {
    setTrackingLoading(true);
    try {
      const details = await getRequestDetails(requestId);
      setSelectedRequest(details);
    } catch (error) {
      console.error("Failed to fetch tracking details:", error);
    } finally {
      setTrackingLoading(false);
    }
  };

  const handleCancel = async (requestId) => {
    if (!window.confirm("Are you sure you want to cancel this request?")) return;
    setIsCancelLoading(true);
    try {
      await cancelRequest(requestId);
      await fetchData(); // Refresh list
    } catch (error) {
      console.error("Failed to cancel request:", error);
      alert("Only pending requests can be cancelled.");
    } finally {
      setIsCancelLoading(false);
    }
  };

  const stats = [
    { title: "Available Deals", value: deals.length, icon: TrendingUp, color: "green", trend: "Opportunities nearby" },
    { title: "My Requests", value: requests.length, icon: Package, color: "blue", trend: "Ongoing negotiations" },
    { title: "Reserved", value: requests.filter(r => r.status === 'Accepted').length, icon: Clock, color: "amber", trend: "Awaiting pickup" },
    { title: "Completed", value: requests.filter(r => r.status === 'Sold').length, icon: CheckCircle2, color: "purple", trend: "Successful orders" },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-bold text-gray-500 mt-4 uppercase tracking-widest">Syncing with Marketplace...</p>
      </div>
    );
  }

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
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Recommended Deals</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-tight">Hand-picked inventory opportunities for you</p>
          </div>
          <Link href="/listings" className="group flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700 transition-colors bg-green-50 px-3 py-1.5 rounded-lg border border-green-100">
            Browse All Deals
            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {deals.length === 0 ? (
            <div className="col-span-full p-20 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/50">
               <Package className="w-12 h-12 text-gray-200 mx-auto mb-4" />
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">No deals available nearby</h3>
               <p className="text-xs text-gray-400 mt-1 max-w-[200px] mx-auto">Check back soon for new inventory liquidation deals.</p>
            </div>
          ) : deals.slice(0, 3).map((deal) => {
            const urgency = new Date(deal.expiryDate).getTime() - Date.now() < 10 * 24 * 60 * 60 * 1000 ? "High" : "Mid";
            return (
              <div key={deal._id} className="bg-white rounded-3xl border border-border overflow-hidden flex flex-col group hover:shadow-xl hover:shadow-gray-200/50 transition-all duration-300">
                <Link href="/listings" className="relative h-44 overflow-hidden block">
                  <img src={deal.productImages?.[0] || CATEGORY_IMAGES[deal.category] || CATEGORY_IMAGES.Other} alt={deal.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-4 left-4">
                    <span className={cn(
                      "px-3 py-1 rounded-full text-[10px] font-bold shadow-sm flex items-center gap-1 border border-white/20 backdrop-blur-md",
                      urgency === "High" ? "bg-red-500 text-white" : "bg-green-500 text-white"
                    )}>
                      <Clock className="w-3 h-3" />
                      {urgency} Urgency
                    </span>
                  </div>
                </Link>
                <div className="p-5 flex-1 flex flex-col">
                  <div className="mb-4">
                    <Link href="/listings" className="hover:text-green-600 transition-colors inline-block">
                      <h4 className="text-base font-bold text-gray-900 leading-tight">{deal.productName}</h4>
                    </Link>
                    <p className="text-[11px] font-medium text-gray-400 mt-1 flex items-center gap-1">
                      <Building2 className="w-3 h-3" />
                      {deal.sellerId?.organizationName || "Verified Wholesale Seller"}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="p-2.5 rounded-2xl bg-gray-50 border border-gray-100">
                      <p className="text-[9px] font-bold text-gray-400 uppercase tracking-wider">Unit Price</p>
                      <p className="text-sm font-black text-gray-900">₹{deal.listingPrice}</p>
                    </div>
                    <div className="p-2.5 rounded-2xl bg-orange-50/50 border border-orange-100">
                      <p className="text-[9px] font-bold text-orange-600 uppercase tracking-wider">Stock Left</p>
                      <p className="text-sm font-black text-orange-700">{deal.quantityAvailable} {deal.unit}</p>
                    </div>
                  </div>
                  <Link href="/listings" className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-900 rounded-xl font-bold text-xs hover:bg-gray-100 transition-all flex items-center justify-center gap-2 group/btn mt-auto">
                    View Deal
                    <ChevronRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* My Requests Section */}
      <section className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="text-xl font-bold text-gray-900">My Requests / Orders</h2>
            <p className="text-xs text-gray-400 mt-0.5 font-medium tracking-tight">Track your active deal negotiations and order history</p>
          </div>
          <button className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors px-3 py-1.5">View All</button>
        </div>

        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request._id} className="bg-white p-4 rounded-3xl border border-border flex items-center gap-5 hover:border-green-200 transition-all group shadow-sm hover:shadow-gray-100/50">
              <div className="w-16 h-16 rounded-2xl overflow-hidden shrink-0 border border-gray-100">
                <img 
                  src={request.inventoryId?.productImages?.[0] || CATEGORY_IMAGES[request.inventoryId?.category] || CATEGORY_IMAGES.Other} 
                  alt={request.inventoryId?.productName} 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-sm font-bold text-gray-900 truncate">{request.inventoryId?.productName}</h4>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tight",
                    request.status === "Accepted" ? "bg-green-100 text-green-700" : 
                    request.status === "Rejected" ? "bg-red-100 text-red-700" :
                    request.status === "Sold" ? "bg-blue-100 text-blue-700" :
                    "bg-amber-100 text-amber-700"
                  )}>
                    {request.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[11px] text-gray-400 font-medium">
                  <span className="flex items-center gap-1 whitespace-nowrap"><Building2 className="w-3 h-3" /> {request.sellerId?.organizationName || "Wholesale Partner"}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap"><Package className="w-3 h-3" /> {request.quantityRequested} {request.inventoryId?.unit}</span>
                  <span className="flex items-center gap-1 whitespace-nowrap"><Clock className="w-3 h-3" /> {new Date(request.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-black text-gray-900">₹{request.expectedPriceTotal}</p>
                <div className="flex items-center gap-3 mt-1 justify-end">
                  <button 
                    onClick={() => {
                      setActiveChatRequest({
                        ...request,
                        productName: request.inventoryId?.productName,
                        sellerName: request.sellerId?.organizationName || "Wholesale Partner",
                        totalPrice: request.expectedPriceTotal,
                        quantity: request.quantityRequested
                      });
                      setIsChatOpen(true);
                    }}
                    className="text-[11px] font-bold text-green-600 hover:underline flex items-center gap-1 uppercase tracking-tight"
                  >
                    <MessageSquare className="w-3 h-3" />
                    Chat
                  </button>
                  {request.status === "Pending" && (
                     <button 
                       onClick={() => handleCancel(request._id)}
                       className="text-[11px] font-bold text-red-500 hover:text-red-700 transition-colors uppercase tracking-tight"
                     >
                       Cancel
                     </button>
                   )}
                   <button 
                     onClick={() => handleTrackStatus(request._id)}
                     className="text-[11px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-tight"
                   >
                     Track
                   </button>
                </div>
              </div>
              <button 
                onClick={() => handleTrackStatus(request._id)}
                className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-green-50 hover:text-green-600 transition-all"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          ))}
          {requests.length === 0 && (
            <div className="p-16 border-2 border-dashed border-gray-100 rounded-[2.5rem] text-center bg-gray-50/30">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-sm border border-gray-100">
                  <Clock className="w-6 h-6 text-gray-300" />
               </div>
               <h3 className="text-sm font-bold text-gray-900 uppercase tracking-tight">No active requests found</h3>
               <p className="text-xs text-gray-400 mt-1 max-w-[240px] mx-auto">Your purchase requests and deal tracking will appear here.</p>
            </div>
          )}
        </div>
      </section>

      {/* CHAT WINDOW */}
      {isChatOpen && activeChatRequest && user && (
        <div className="fixed bottom-6 right-6 z-[60] w-[400px] max-w-[calc(100vw-3rem)]">
          <ChatWindow 
            request={activeChatRequest}
            currentUser={user}
            onClose={() => setIsChatOpen(false)}
          />
        </div>
      )}


      {/* TRACKING MODAL */}
      {selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
           {/* Overlay */}
           <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)} />
           
           {/* Content */}
           <div className="relative bg-white rounded-[2rem] w-full max-w-xl overflow-hidden shadow-2xl animate-fade-up">
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-gray-50/30">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
                       <Truck className="w-5 h-5 text-green-700" />
                    </div>
                    <div className="min-w-0">
                       <h3 className="font-bold text-gray-900 truncate">{selectedRequest.inventoryId?.productName}</h3>
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order Tracking</p>
                    </div>
                 </div>
                 <button onClick={() => setSelectedRequest(null)} className="p-2 hover:bg-gray-200/50 rounded-xl transition-colors">
                    <X className="w-5 h-5 text-gray-400" />
                 </button>
              </div>

              <div className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                 {/* Timeline */}
                 <div className="space-y-10 relative before:absolute before:left-[17px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                    
                    <div className="flex gap-4 relative">
                       <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center z-10 border-4 border-white">
                          <Package className="w-4 h-4 text-white" />
                       </div>
                       <div>
                          <p className="text-sm font-black text-gray-900">Purchase Request Sent</p>
                          <p className="text-xs text-gray-400">{new Date(selectedRequest.createdAt).toLocaleString()}</p>
                          <p className="text-[11px] font-medium text-gray-500 mt-1 italic">Order for {selectedRequest.quantityRequested} units placed at ₹{selectedRequest.inventoryId?.listingPrice}/unit</p>
                       </div>
                    </div>

                    <div className="flex gap-4 relative">
                       <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white",
                          ["Accepted", "Sold"].includes(selectedRequest.status) ? "bg-green-500" : selectedRequest.status === "Rejected" ? "bg-red-500" : "bg-gray-200"
                       )}>
                          <Clock className="w-4 h-4 text-white" />
                       </div>
                       <div>
                          <p className={cn("text-sm font-black", ["Accepted", "Sold"].includes(selectedRequest.status) ? "text-gray-900" : "text-gray-400")}>
                             {selectedRequest.status === "Rejected" ? "Request Rejected" : "Seller Confirmation"}
                          </p>
                          <p className="text-xs text-gray-400">
                             {selectedRequest.status === "Pending" ? "Awaiting seller response..." : selectedRequest.status === "Accepted" ? "Deal accepted by seller!" : selectedRequest.status === "Sold" ? "Order finalized" : "Seller declined this request"}
                          </p>
                       </div>
                    </div>

                    <div className="flex gap-4 relative">
                       <div className={cn(
                          "w-9 h-9 rounded-full flex items-center justify-center z-10 border-4 border-white",
                          selectedRequest.status === "Sold" ? "bg-green-500" : "bg-gray-200"
                       )}>
                          <CheckCircle className="w-4 h-4 text-white" />
                       </div>
                       <div>
                          <p className={cn("text-sm font-black", selectedRequest.status === "Sold" ? "text-gray-900" : "text-gray-400")}>Order Completed</p>
                          <p className="text-xs text-gray-400">{selectedRequest.status === "Sold" ? "Inventory successfully transferred" : "Waiting for final settlement"}</p>
                       </div>
                    </div>

                 </div>

                 {/* Seller Contact */}
                 <div className="p-6 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center border border-gray-200 shadow-sm">
                       <Building2 className="w-6 h-6 text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                       <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-none mb-1">Fulfillment Partner</p>
                       <h4 className="font-black text-gray-900 truncate uppercase tracking-tight">{selectedRequest.sellerId?.organizationName || "Verified Wholesale Partner"}</h4>
                       <p className="text-xs text-gray-500 flex items-center gap-1 mt-1 truncate"><MapPin className="w-3.5 h-3.5 text-green-600" /> {selectedRequest.sellerId?.address || "Warehouse Hub, Jaipur"}</p>
                    </div>
                    {selectedRequest.status === "Accepted" && (
                       <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setSelectedRequest(null);
                              setActiveChatRequest({
                                ...selectedRequest,
                                productName: selectedRequest.inventoryId?.productName,
                                sellerName: selectedRequest.sellerId?.organizationName || "Wholesale Partner",
                                totalPrice: selectedRequest.expectedPriceTotal,
                                quantity: selectedRequest.quantityRequested
                              });
                              setIsChatOpen(true);
                            }}
                            className="px-4 py-2 bg-green-600 text-white rounded-xl font-bold text-[10px] shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-1.5 uppercase whitespace-nowrap"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            Chat with Seller
                          </button>
                          <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-xl font-bold text-[10px] hover:bg-gray-200 transition-all flex items-center gap-1.5 uppercase whitespace-nowrap">
                            <Phone className="w-3.5 h-3.5" />
                            Call Seller
                          </button>
                       </div>
                    )}
                 </div>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}
