'use client';

import { useState } from 'react';
import Link       from 'next/link';

export default function SignupPage() {
  const [role, setRole] = useState('buyer');

  return (
    <div className="bg-white rounded-3xl shadow-xl border border-gray-100 flex flex-col lg:flex-row overflow-hidden w-full max-w-6xl h-auto lg:h-[800px]">
      
      {/* Left side: Form */}
      <div className="w-full lg:w-1/2 p-8 lg:p-14 overflow-y-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-primary font-bold mb-8 hover:opacity-80 transition-opacity">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Home
        </Link>
        
        <h1 className="text-3xl lg:text-4xl font-extrabold text-dark mb-2">Create an Account</h1>
        <p className="text-muted mb-8">Join the ClearStock B2B network today.</p>

        {/* Role Selector */}
        <div className="flex bg-gray-50 p-1.5 rounded-xl mb-8">
          <button
            onClick={() => setRole('buyer')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              role === 'buyer' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            Buyer / Wholesaler
          </button>
          <button
            onClick={() => setRole('seller')}
            className={`flex-1 py-3 px-4 rounded-lg text-sm font-bold transition-all duration-300 ${
              role === 'seller' ? 'bg-white text-primary shadow-sm' : 'text-muted hover:text-dark'
            }`}
          >
            Seller / Industry
          </button>
        </div>

        <form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark">First Name</label>
              <input 
                type="text" 
                placeholder="John" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark">Last Name</label>
              <input 
                type="text" 
                placeholder="Doe" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Organization / Company Name</label>
            <input 
              type="text" 
              placeholder="Acme Distribution Corp" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Work Email</label>
            <input 
              type="email" 
              placeholder="john@acme.com" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark">GST Number</label>
              <input 
                type="text" 
                placeholder="Optional" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-dark">Phone Number</label>
              <input 
                type="tel" 
                placeholder="+91 90000 00000" 
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-dark">Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-dark placeholder:text-gray-400"
            />
          </div>

          <button type="submit" className="btn-primary w-full py-4 text-lg justify-center shadow-lg shadow-primary/30 mt-4 outline-none">
            Register as {role === 'buyer' ? 'Buyer' : 'Seller'}
          </button>
        </form>

        <p className="text-center text-sm text-muted mt-8">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-primary hover:underline hover:text-primary-dark transition-colors">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right side: Image showcase */}
      <div className="hidden lg:block lg:w-1/2 relative bg-dark">
        <img 
          src="https://images.unsplash.com/photo-1586528116311-ad8ed7c50a04?w=1200&q=80" 
          alt="Logistics warehouse" 
          className="w-full h-full object-cover opacity-60" 
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 to-dark/80 mix-blend-multiply" />
        
        {/* Value Proposition Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end p-14 mb-10">
          <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl text-white">
            <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/40 mb-6">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
            </div>
            <h3 className="text-2xl font-bold mb-3">Secure B2B Liquidations</h3>
            <p className="text-white/80 leading-relaxed">
              ClearStock provides industries and wholesalers a verified platform to recover value on surplus inventory up to 40% faster.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
