'use client';

import { useEffect, useRef } from 'react';

export default function AboutUsSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
          }
        });
      },
      { threshold: 0.1 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" ref={sectionRef} className="py-24 lg:py-32 bg-gray-50 border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Content Side */}
          <div className="lg:w-1/2 reveal">
            <span className="section-label">💡 About ClearStock</span>
            <h2 className="section-title">
              Turn Expiring Inventory into Revenue
            </h2>
            <p className="section-subtitle mb-6 text-lg">
              ClearStock is a smart liquidation platform designed to help industries recover value from near-expiry and surplus packaged inventory.
            </p>
            <p className="text-muted leading-relaxed text-base mb-8">
              Instead of letting usable stock sit unsold or go to waste, the platform connects sellers with wholesalers and helps them move inventory quickly through AI-powered pricing and structured buyer discovery.
            </p>
            <ul className="space-y-4">
              {['AI-powered pricing limits risk', 'Direct wholesaler matching', 'Zero food/product waste'].map((item) => (
                <li key={item} className="flex items-center gap-3 font-medium text-dark">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Image Side */}
          <div className="lg:w-1/2 relative reveal reveal-delay-2 w-full max-w-lg mx-auto">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3]">
              <img 
                src="https://images.unsplash.com/photo-1553413077-190dd305871c?w=800&q=80" 
                alt="Warehouse logistics" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark/60 via-transparent to-transparent pointer-events-none" />
            </div>
            
            {/* Floating stat card */}
            <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-gray-100 flex items-center gap-4 animate-float">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-muted">Value Recovered</p>
                <p className="text-2xl font-black text-dark">₹4.2M+</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
