"use client";

import Link from "next/link";
import { Bell, Plus, Search, Leaf, Home, List, User, LogOut, Settings, Check, Clock, Package, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { getNotifications, markAsRead } from "@/services/notificationService";

export default function DashboardHeader({ isBuyer }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const { user, logout } = useAuth();
  
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const data = await getNotifications();
        setNotifications(data || []);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    }
    if (user) fetchNotifications();
  }, [user]);

  const handleMarkRead = async (id) => {
    try {
      await markAsRead(id);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const dashboardHref = isBuyer ? "/dashboard/buyer" : "/dashboard/seller";
  
  return (
    <header className="flex items-center justify-between py-4 border-b border-border bg-white px-8 sticky top-0 z-30 w-full shadow-sm">
      {/* Left: Logo Section */}
      <Link href={dashboardHref} className="flex items-center gap-2.5 group">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-md shadow-green-200 group-hover:scale-105 transition-transform duration-200">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-lg font-extrabold text-gray-900 tracking-tight">
            Clear<span className="text-green-600">Stock</span>
          </span>
          <p className="text-[10px] text-gray-400 -mt-0.5 font-medium tracking-tight">Inventory Liquidation Platform</p>
        </div>
      </Link>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Notification */}
        <div className="relative">
          <button 
            onClick={() => setIsNotifyOpen(!isNotifyOpen)} 
            className={cn(
              "relative w-10 h-10 rounded-xl border flex items-center justify-center transition-all shadow-sm active:scale-95",
              isNotifyOpen ? "bg-green-50 border-green-200" : "bg-white border-border hover:bg-gray-50"
            )}
          >
            <Bell className={cn("w-4.5 h-4.5", isNotifyOpen ? "text-green-600" : "text-gray-500")} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-600 text-white text-[10px] font-black rounded-lg flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {isNotifyOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setIsNotifyOpen(false)}></div>
              <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-white border border-border rounded-2xl shadow-2xl z-20 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                  <h3 className="font-black text-xs text-gray-900 uppercase tracking-widest">Recent Alerts</h3>
                  <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full uppercase">
                    {unreadCount} New
                  </span>
                </div>
                
                <div className="max-h-[70vh] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-10 text-center space-y-3">
                      <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto">
                        <Bell className="w-6 h-6 text-gray-300" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">No notifications yet</p>
                    </div>
                  ) : notifications.map((n) => (
                    <div 
                      key={n._id}
                      onClick={() => !n.isRead && handleMarkRead(n._id)}
                      className={cn(
                        "p-4 border-b border-gray-50 flex gap-4 hover:bg-gray-50 transition-colors cursor-pointer group relative",
                        !n.isRead && "bg-green-50/30"
                      )}
                    >
                      {!n.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500" />
                      )}
                      
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border",
                        n.type === 'request' ? "bg-amber-50 border-amber-100" : "bg-blue-50 border-blue-100"
                      )}>
                         {n.type === 'request' ? <Package className="w-5 h-5 text-amber-600" /> : <Clock className="w-5 h-5 text-blue-600" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                           <h4 className="text-sm font-black text-gray-900 truncate">{n.title}</h4>
                           <span className="text-[9px] font-bold text-gray-400 uppercase">{new Date(n.createdAt).toLocaleDateString()}</span>
                        </div>
                        <p className="text-[11px] text-gray-500 font-medium leading-relaxed italic line-clamp-2">
                           "{n.message}"
                        </p>
                        {!n.isRead && (
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(n._id);
                            }}
                            className="mt-2 text-[9px] font-black text-green-600 hover:text-green-700 uppercase tracking-widest flex items-center gap-1 group/mark"
                          >
                            <Check className="w-3 h-3" />
                            Mark as Read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-3 border-t border-gray-100 bg-gray-50/50 text-center">
                   <button className="text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">
                      View All Activity (Order History)
                   </button>
                </div>
              </div>
            </>
          )}
        </div>

        {isBuyer ? (
          /* Buyer Specific CTA: Browse Deals */
          <Link href="/listings">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200">
              <List className="w-4 h-4" strokeWidth={2.5} />
              Browse Deals
            </button>
          </Link>
        ) : (
          /* Seller Specific CTA: Add Product */
          <Link href="/food/add">
            <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2.5 rounded-xl font-semibold text-sm shadow-md shadow-green-200 hover:shadow-lg hover:shadow-green-300 hover:-translate-y-0.5 transition-all duration-200">
              <Plus className="w-4 h-4" strokeWidth={2.5} />
              Add Product
            </button>
          </Link>
        )}

        {/* Profile Dropdown */}
        <div className="relative ml-2">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-full border-2 border-primary/10 bg-gray-50 flex items-center justify-center hover:border-primary/40 hover:bg-white transition-all overflow-hidden shadow-sm active:scale-95"
          >
            {user?.profileImage ? (
              <img src={user.profileImage} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-gray-400" />
            )}
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <>
              {/* Backdrop to close */}
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setIsDropdownOpen(false)}
              ></div>
              
              <div className="absolute right-0 mt-3 w-56 bg-white border border-border rounded-2xl shadow-2xl z-20 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="px-4 py-3 border-b border-border/60 mb-2">
                  <p className="text-xs font-semibold text-muted tracking-wider uppercase">Account</p>
                  <p className="text-sm font-bold text-dark truncate mt-0.5">{user?.firstName} {user?.lastName}</p>
                  <p className="text-[11px] text-gray-400 truncate">{user?.email}</p>
                </div>

                <Link 
                  href="/profile" 
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors mx-2 rounded-xl"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="w-4 h-4" />
                  View Profile
                </Link>

                <Link 
                  href={dashboardHref}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-primary transition-colors mx-2 rounded-xl"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </Link>

                <div className="h-px bg-border/60 my-2 mx-4"></div>

                <button 
                  onClick={() => {
                    setIsDropdownOpen(false);
                    logout();
                  }}
                  className="w-[calc(100%-1rem)] flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition-colors mx-2 rounded-xl group"
                >
                  <LogOut className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  Sign Out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
