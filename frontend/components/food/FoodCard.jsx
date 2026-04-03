"use client";

import { useState } from "react";
import { Pencil, Trash2, Eye, Package, Clock, ShieldCheck, ShieldX, MapPin, Tag } from "lucide-react";
import StatusBadge from "@/components/requests/StatusBadge";
import { cn } from "@/lib/utils";

export default function FoodCard({ item, onDelete }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="bg-white rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all duration-200 overflow-hidden flex flex-col group"
    >
      {/* Image */}
      <div className="relative h-40 overflow-hidden bg-gray-100">
        <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Category Badge */}
        <div className={cn(
          "absolute top-2.5 left-2.5 flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-semibold shadow-sm bg-gray-800 text-white"
        )}>
          <Tag className="w-3 h-3" />
          {item.category || "Packaged Food"}
        </div>
        {/* Status Badge */}
        <div className="absolute top-2.5 right-2.5">
          <StatusBadge status={item.status} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <h3 className="font-bold text-gray-900 text-base mb-0.5">{item.name}</h3>
        <p className="text-sm text-gray-500 mb-3">{item.units} units available</p>

        {/* Meta row */}
        <div className="flex flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-1 text-xs text-gray-500 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
            MRP: <span className="line-through">₹{item.mrp}</span>
          </div>
          <div className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-lg border border-green-200">
            Our Price: ₹{item.ourPrice}
          </div>
          <div className="flex items-center gap-1 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
            <Clock className="w-3 h-3" />
            {item.expiry}
          </div>
        </div>

        {/* Location & Delete Action */}
        <div className="flex gap-2 items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100 flex-1">
            <MapPin className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{item.location || "Bengaluru"}</span>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onDelete) onDelete(item);
            }}
            className="flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 border border-red-200 transition-colors text-xs font-semibold shrink-0 shadow-sm"
            title="Delete Listing"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
