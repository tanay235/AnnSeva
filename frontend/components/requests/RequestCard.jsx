"use client";

import { useState } from "react";
import { Clock, MessageSquare, CheckCircle, XCircle, PackageCheck } from "lucide-react";
import StatusBadge from "@/components/requests/StatusBadge";
import { cn } from "@/lib/utils";

export default function RequestCard({ request, onStatusChange, onChatOpen }) {
  return (
    <div className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-md transition-all duration-200 p-5 flex flex-col gap-4 relative group">
      {/* Top row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          {/* Buyer Avatar */}
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm">
            {request.buyerName.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{request.buyerName}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">
              Buyer · {typeof request.location === 'object' && request.location?.coordinates 
                ? `Lat: ${request.location.coordinates[1].toFixed(2)}, Lng: ${request.location.coordinates[0].toFixed(2)}` 
                : (request.location || "Bengaluru")}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => onChatOpen(request)}
            className="p-2 bg-gray-50 text-gray-400 hover:bg-green-50 hover:text-green-600 rounded-xl transition-all shadow-sm border border-gray-100"
            title="Chat with Buyer"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <StatusBadge status={request.status} />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Product</p>
          <p className="text-sm font-semibold text-gray-800">{request.productName}</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100">
          <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Quantity Requested</p>
          <p className="text-sm font-semibold text-gray-800">{request.quantity} units</p>
        </div>
        <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2 col-span-1">
          <Clock className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Pickup / Delivery Time</p>
            <p className="text-sm font-semibold text-gray-800">{request.pickupTime}</p>
          </div>
        </div>
        {request.note && (
          <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 flex items-start gap-2 col-span-1">
            <MessageSquare className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
            <div>
              <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1">Offer / Note</p>
              <p className="text-sm text-gray-700 leading-snug">{request.note}</p>
            </div>
          </div>
        )}
      </div>

      {request.status === "pending" && (
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => onStatusChange(request.id, "accepted")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Accept
          </button>
          <button
            onClick={() => onStatusChange(request.id, "rejected")}
            className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold py-2.5 rounded-xl transition-colors"
          >
            <XCircle className="w-3.5 h-3.5" />
            Reject
          </button>
        </div>
      )}
      {request.status === "accepted" && (
        <button
          onClick={() => onStatusChange(request.id, "sold")}
          className="flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 text-xs font-semibold py-2.5 rounded-xl transition-colors w-full"
        >
          <PackageCheck className="w-3.5 h-3.5" />
          Mark as Sold
        </button>
      )}
      {(request.status === "sold" || request.status === "rejected") && (
        <div className="text-center text-xs text-gray-400 py-1">
          {request.status === "sold" ? "✅ Product successfully sold" : "❌ Request was rejected"}
        </div>
      )}
    </div>
  );
}
