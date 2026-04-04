"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { formatAddress } from "@/lib/helpers";
import { 
  ArrowLeft, 
  MapPin, 
  Package, 
  Clock, 
  ShieldCheck, 
  ShieldAlert, 
  Info, 
  Sparkles, 
  ChevronRight,
  Building2,
  Phone,
  Tag,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getListingById } from "@/services/inventoryService";
import { createRequest } from "@/services/requestService";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

const CATEGORY_IMAGES = {
  'Snacks & Confectionery': 'https://images.unsplash.com/photo-1599490659223-eb157cbef92a?w=1000&q=80',
  'Beverages': 'https://images.unsplash.com/photo-1551028150-64b9f398f678?w=1000&q=80',
  'Staples & Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=1000&q=80',
  'Packaged Meals': 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?w=1000&q=80',
  'Dairy & Perishables': 'https://images.unsplash.com/photo-1550583724-125581cc25ab?w=1000&q=80',
  'Other': 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=1000&q=80'
};

export default function ListingDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Request Form State
  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getListingById(id);
        setListing(data);
      } catch (error) {
        console.error("Failed to fetch listing:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [id]);

  const handleRequest = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await createRequest({
        inventoryId: id,
        quantityRequested: quantity,
        expectedPriceTotal: quantity * listing.listingPrice,
        pickupDeliveryTime: "5:00 PM Today",
        note
      });
      setIsSuccess(true);
      setTimeout(() => {
        router.push("/dashboard/buyer");
      }, 2000);
    } catch (error) {
      console.error("Failed to create request:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10 animate-pulse">
        <Sparkles className="w-12 h-12 text-green-500 mb-4 animate-bounce" />
        <h2 className="text-xl font-bold text-gray-900 tracking-tight">Syncing Product Details...</h2>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-10">
        <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="w-10 h-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-black text-gray-900">Listing Not Found</h2>
        <p className="text-gray-500 mt-2">This deal may have expired or been removed.</p>
        <Link href="/listings" className="mt-8 px-6 py-3 bg-gray-900 text-white rounded-2xl font-bold text-sm shadow-xl shadow-gray-200 transition-all hover:bg-gray-800">
           Back to Marketplace
        </Link>
      </div>
    );
  }

  const urgency = new Date(listing.expiryDate) - new Date() < 10*24*60*60*1000 ? "High" : "Medium";

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex items-center gap-2 mb-8">
          <button 
            onClick={() => router.back()}
            className="p-2.5 rounded-xl bg-white border border-border text-gray-400 hover:text-gray-900 hover:shadow-md transition-all group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div className="flex items-center gap-1.5 text-sm font-medium text-gray-400">
            <Link href="/listings" className="hover:text-green-600 transition-colors">Marketplace</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-bold">{listing.productName}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Left: Product Images & Details */}
          <div className="lg:col-span-12 xl:col-span-12 grid grid-cols-1 lg:grid-cols-12 gap-10">
             {/* Main Image Gallery Cluster */}
             <div className="lg:col-span-7 space-y-6">
                <div className="relative aspect-[16/10] bg-white rounded-[3rem] border border-border overflow-hidden shadow-2xl shadow-gray-200/50">
                   <img 
                    src={listing.productImage || CATEGORY_IMAGES[listing.category] || CATEGORY_IMAGES.Other} 
                    alt={listing.productName} 
                    className="w-full h-full object-cover"
                   />
                   <div className="absolute top-6 left-6 flex gap-3">
                      <span className="px-4 py-1.5 rounded-full bg-white/90 backdrop-blur-md text-[11px] font-black uppercase tracking-widest text-gray-900 shadow-xl border border-white/20">
                         {listing.category}
                      </span>
                      <span className={cn(
                        "px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest shadow-xl border border-white/20 backdrop-blur-md",
                        urgency === "High" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"
                      )}>
                         <Clock className="w-3.5 h-3.5 inline mr-1 -mt-0.5" />
                         {urgency} Urgency
                      </span>
                   </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-10 border border-border shadow-sm">
                   <h2 className="text-2xl font-black text-gray-900 mb-6">Product Insight</h2>
                   <div className="prose prose-sm max-w-none text-gray-500 leading-relaxed space-y-4">
                      <p>{listing.description || "The seller has listed this stock for quick liquidation. All items have been verified for quality and expiry compliance. Ideal for retail distribution or bulk consumer use."}</p>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-red-50 rounded-2xl">
                               <Clock className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Expiry Date</p>
                               <p className="text-lg font-black text-gray-900">{new Date(listing.expiryDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                            </div>
                         </div>
                         <div className="flex items-start gap-4">
                            <div className="p-3 bg-blue-50 rounded-2xl">
                               <MapPin className="w-6 h-6 text-blue-500" />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Warehouse Location</p>
                               <p className="text-lg font-black text-gray-900">{formatAddress(listing.sellerId?.address) || "Jaipur, Rajasthan"}</p>
                            </div>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Right: Pricing & Order Card */}
             <div className="lg:col-span-5 space-y-6">
                {/* Pricing Card */}
                <div className="bg-white rounded-[2.5rem] p-10 border border-border shadow-xl shadow-gray-200/50">
                   <div className="flex items-center justify-between mb-8">
                      <div>
                         <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Stock Price</p>
                         <div className="flex items-baseline gap-2">
                            <span className="text-5xl font-black text-gray-900">₹{listing.listingPrice}</span>
                            <span className="text-lg font-medium text-gray-400 line-through">₹{listing.mrpPerUnit}</span>
                         </div>
                      </div>
                      <div className="px-4 py-2 bg-green-50 rounded-2xl border border-green-100">
                         <p className="text-[10px] font-bold text-green-600 uppercase tracking-widest">Savings</p>
                         <p className="text-lg font-black text-green-700">{Math.round(((listing.mrpPerUnit - listing.listingPrice) / listing.mrpPerUnit) * 100)}% OFF</p>
                      </div>
                   </div>

                   <form onSubmit={handleRequest} className="space-y-6">
                      <div className="space-y-2">
                         <div className="flex justify-between items-center px-1">
                            <label className="text-xs font-bold text-gray-700 uppercase tracking-widest">Order Quantity</label>
                            <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full uppercase">
                               {listing.quantityAvailable} units left
                            </span>
                         </div>
                         <div className="relative">
                            <input 
                              type="number" 
                              min="1" 
                              max={listing.quantityAvailable}
                              value={quantity}
                              onChange={(e) => setQuantity(Math.min(listing.quantityAvailable, Math.max(1, e.target.value)))}
                              className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-5 text-xl font-black focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                            />
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400 uppercase">
                               Units
                            </div>
                         </div>
                      </div>

                      <div className="p-6 bg-gray-900 rounded-[2rem] text-white">
                         <div className="flex justify-between items-center text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-3">
                            <span>TOTAL SETTLEMENT</span>
                            <Info className="w-3.5 h-3.5" />
                         </div>
                         <div className="flex justify-between items-baseline">
                            <span className="text-sm font-bold text-gray-400">{quantity} × ₹{listing.listingPrice}/u</span>
                            <span className="text-3xl font-black text-green-400 tracking-tight">₹{quantity * listing.listingPrice}</span>
                         </div>
                      </div>

                      <div className="space-y-2">
                         <label className="text-xs font-bold text-gray-700 uppercase tracking-widest px-1">Special Instructions (Note)</label>
                         <textarea 
                           placeholder="Any specific delivery or retail requirements..."
                           value={note}
                           onChange={(e) => setNote(e.target.value)}
                           rows={3}
                           className="w-full bg-gray-50 border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                         />
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting || isSuccess}
                        className={cn(
                          "w-full py-6 rounded-[2rem] font-black text-lg transition-all flex items-center justify-center gap-3 shadow-xl active:scale-[0.98]",
                          isSuccess 
                            ? "bg-green-500 text-white shadow-green-200" 
                            : "bg-green-600 text-white hover:bg-green-700 shadow-green-200"
                        )}
                      >
                         {isSubmitting ? "Processing..." : isSuccess ? (
                           <>
                              <CheckCircle className="w-6 h-6" />
                              Order Requested!
                           </>
                         ) : (
                           <>
                              Send Purchase Request
                              <ChevronRight className="w-5 h-5" />
                           </>
                         )}
                      </button>
                   </form>
                </div>

                {/* Seller Trust Card */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-border shadow-sm flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[1.5rem] bg-gray-100 flex items-center justify-center border border-gray-100">
                      <Building2 className="w-8 h-8 text-gray-600" />
                   </div>
                   <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-black text-gray-900 text-lg uppercase tracking-tight">{listing.sellerId?.organizationName || "Verified Seller"}</h3>
                        <ShieldCheck className="w-5 h-5 text-blue-500" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                         <MapPin className="w-3 h-3 text-green-600" />
                         {formatAddress(listing.sellerId?.address) || "Jaipur Hub"}
                      </p>
                   </div>
                </div>

                <div className="p-8 bg-amber-50/50 border border-amber-100 rounded-[2.5rem] flex gap-4">
                   <ShieldAlert className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                   <div>
                      <p className="text-sm font-black text-amber-800 uppercase tracking-tight mb-1">ClearStock Guarantee</p>
                      <p className="text-xs text-amber-700 leading-relaxed font-medium">All deals on our platform undergo verified shelf-life audits. Liquidation prices are guaranteed lower than distributors' standard wholesale rates.</p>
                   </div>
                </div>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}
