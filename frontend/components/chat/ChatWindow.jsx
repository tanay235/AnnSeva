"use client";

import { useState, useEffect, useRef } from "react";
import { 
  X, 
  Send, 
  User, 
  Building2, 
  Package, 
  Clock,
  MoreVertical,
  Check,
  CheckCheck,
  Paperclip,
  Smile,
  ChevronLeft,
  MessageSquare
} from "lucide-react";
import { cn } from "@/lib/utils";
import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

/**
 * @param {Object} props
 * @param {Object} props.request - The request object this chat is linked to
 * @param {Object} props.currentUser - The logged-in user
 * @param {Function} props.onClose - Function to close the chat
 */
export default function ChatWindow({ request, currentUser, onClose }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef(null);

  // Determine the other party
  const isBuyer = currentUser.role === 'customer' || currentUser.role === 'buyer';
  const otherPartyName = request.sellerName || request.buyerName || "Partner";
  const otherPartyRole = isBuyer ? "Seller" : "Buyer";
  const otherPartyId = isBuyer ? request.sellerId : request.buyerId;

  // Fetch messages from backend
  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_URL}/chat/${request.id || request._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setMessages(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
      // Fallback to mock messages if API fails
      if (messages.length === 0) {
        setMessages([
          {
            id: 1,
            senderId: "system",
            text: `Conversation started regarding ${request.productName}`,
            createdAt: new Date().toISOString(),
            isRead: true
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
    
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [request.id || request._id]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const tempMessage = {
      id: Date.now(),
      senderId: currentUser.id || currentUser._id,
      text: newMessage,
      createdAt: new Date().toISOString(),
      isRead: false,
      isTemp: true
    };

    setMessages([...messages, tempMessage]);
    setNewMessage("");

    try {
      const token = localStorage.getItem("token");
      await axios.post(`${API_URL}/chat/send`, {
        requestId: request.id || request._id,
        receiverId: otherPartyId?._id || otherPartyId,
        text: tempMessage.text
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchMessages(); // Refresh messages to get the real one from DB
    } catch (error) {
      console.error("Failed to send message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="flex flex-col h-[550px] w-full max-w-md bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 animate-fade-up ring-1 ring-black/5">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-white sticky top-0 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-700 shadow-inner">
            {isBuyer ? <Building2 className="w-5 h-5" /> : <User className="w-5 h-5" />}
          </div>
          <div>
            <h3 className="text-sm font-bold text-gray-900 leading-none mb-1">{otherPartyName}</h3>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{otherPartyRole} • Active Now</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <MoreVertical className="w-5 h-5 text-gray-400" />
          </button>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </div>

      {/* Request Context Bar */}
      <div className="px-5 py-3 bg-gray-50/80 border-b border-gray-100 flex items-center justify-between backdrop-blur-sm">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-white border border-gray-200 flex items-center justify-center shrink-0 shadow-sm">
            <Package className="w-5 h-5 text-green-600" />
          </div>
          <div className="truncate">
            <p className="text-[10px] font-bold text-gray-400 uppercase leading-none mb-1">Inquiry for</p>
            <p className="text-xs font-black text-gray-800 truncate">{request.productName || "Inventory Item"}</p>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[11px] font-black text-green-700">₹{request.totalPrice || request.expectedPriceTotal || 0}</p>
          <p className="text-[9px] font-bold text-gray-400 uppercase">{request.quantity || request.quantityRequested || 0} units</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-hide bg-gray-50/30">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600" />
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Loading Conversation...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            <div className="w-16 h-16 rounded-3xl bg-green-50 flex items-center justify-center mb-4">
              <MessageSquare className="w-8 h-8 text-green-200" />
            </div>
            <h4 className="text-sm font-bold text-gray-900">Start a conversation</h4>
            <p className="text-xs text-gray-500 mt-1 leading-relaxed">Ask questions or discuss pickup details with the {otherPartyRole.toLowerCase()}.</p>
          </div>
        ) : (
          messages.map((msg, index) => {
            const senderId = msg.senderId?._id || msg.senderId;
            const currentUserId = currentUser.id || currentUser._id;
            const isMe = senderId === currentUserId;
            const showDate = index === 0 || 
              new Date(messages[index-1].createdAt).toDateString() !== new Date(msg.createdAt).toDateString();

            if (senderId === "system") {
               return (
                  <div key={msg.id || index} className="flex justify-center my-4">
                     <span className="px-3 py-1 rounded-full bg-gray-100 text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-200/50">
                        {msg.text}
                     </span>
                  </div>
               );
            }

            return (
              <div key={msg.id || msg._id || index} className="space-y-2">
                {showDate && (
                  <div className="flex justify-center my-4">
                    <span className="px-3 py-1 rounded-full bg-white text-[9px] font-bold text-gray-400 uppercase tracking-widest border border-gray-100">
                      {new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                )}
                <div className={cn(
                  "flex w-full animate-fade-in",
                  isMe ? "justify-end" : "justify-start"
                )}>
                  <div className={cn(
                    "max-w-[85%] px-4 py-3 rounded-[1.5rem] text-sm shadow-sm transition-all",
                    isMe 
                      ? "bg-green-600 text-white rounded-tr-none shadow-green-100" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none shadow-gray-100"
                  )}>
                    <p className="leading-relaxed">{msg.text}</p>
                    <div className={cn(
                      "flex items-center gap-1 mt-1.5",
                      isMe ? "justify-end" : "justify-start"
                    )}>
                      <span className={cn(
                        "text-[9px] font-medium opacity-70",
                        isMe ? "text-white" : "text-gray-400"
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        msg.isRead ? <CheckCheck className="w-3 h-3 text-white/80" /> : <Check className="w-3 h-3 text-white/80" />
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        <form onSubmit={handleSendMessage} className="flex items-center gap-3">
          <button type="button" className="p-2.5 hover:bg-gray-100 rounded-xl transition-colors text-gray-400 shrink-0">
            <Paperclip className="w-5 h-5" />
          </button>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="w-full pl-4 pr-10 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all placeholder:text-gray-400 font-medium"
            />
            <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300 hover:text-green-600 transition-colors">
              <Smile className="w-5 h-5" />
            </button>
          </div>
          <button 
            type="submit"
            disabled={!newMessage.trim()}
            className="w-12 h-12 rounded-2xl bg-green-600 text-white flex items-center justify-center shadow-lg shadow-green-200 hover:bg-green-700 transition-all active:scale-95 disabled:opacity-50 disabled:shadow-none shrink-0"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
