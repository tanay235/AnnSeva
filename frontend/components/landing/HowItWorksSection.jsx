'use client';

import { useEffect, useRef } from 'react';

const donorSteps = [
  {
    step: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    ),
    title: 'Upload Inventory',
    desc: 'Add product details like quantity, MRP, and expiry date in minutes.',
  },
  {
    step: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5"></path>
        <path d="M8.5 8.5v.01"></path>
        <path d="M16 15.5v.01"></path>
        <path d="M12 12v.01"></path>
        <path d="M11 17l-1.5-1.5"></path>
        <path d="M15 11l-1.5-1.5"></path>
      </svg>
    ),
    title: 'Get AI Pricing',
    desc: 'Receive smart pricing and urgency recommendations to maximize value.',
  },
  {
    step: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
      </svg>
    ),
    title: 'Sell Faster',
    desc: 'List inventory for direct sale or auction and connect with verified buyers.',
  },
];

const receiverSteps = [
  {
    step: '01',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 17a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9.5C2 7 4 5 6.5 5H18c2.2 0 4 1.8 4 4v8Z"></path>
        <polyline points="15 9 18 9 18 11"></polyline>
        <path d="M6.5 5C9 5 11 7 11 9.5V17a2 2 0 0 1-2 2v0"></path>
        <line x1="6" y1="10" x2="6" y2="10.01"></line>
      </svg>
    ),
    title: 'Browse Deals',
    desc: 'Explore discounted and near-expiry packaged inventory suited to your needs.',
  },
  {
    step: '02',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    title: 'Compare & Request',
    desc: 'Check product details, quantity, pricing options, and view seller information.',
  },
  {
    step: '03',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13"></rect>
        <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
        <circle cx="5.5" cy="18.5" r="2.5"></circle>
        <circle cx="18.5" cy="18.5" r="2.5"></circle>
      </svg>
    ),
    title: 'Buy in Bulk',
    desc: 'Request or purchase stock at heavy liquidation rates safely and securely.',
  },
];

function ProcessTrack({ title, icon, steps }) {
  return (
    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Track Header */}
      <div className="flex items-center gap-3 mb-8 pb-5 border-b border-gray-100">
        <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl"
          style={{ background: '#FFF0EB' }}>
          {icon}
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-primary mb-0.5">Process</p>
          <h3 className="text-xl font-bold text-dark">{title}</h3>
        </div>
      </div>

      {/* Steps */}
      <div className="space-y-1">
        {steps.map((s, i) => (
          <div key={s.step} className="relative">
            <div className="process-step">
              {/* Number circle */}
              <div className="step-number flex-shrink-0">{s.step}</div>

              {/* Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2 text-primary">
                  {s.icon}
                  <h4 className="font-bold text-dark text-sm">{s.title}</h4>
                </div>
                <p className="text-muted text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>

            {/* Connector line (not last) */}
            {i < steps.length - 1 && (
              <div
                className="absolute left-5 w-0.5 bg-gradient-to-b from-primary/40 to-transparent"
                style={{ top: '44px', height: '40px' }}
              />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default function HowItWorksSection() {
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
    <section id="how-it-works" ref={sectionRef} className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">How It Works</span>
          <h2 className="section-title">
            Simple. Fast.<br />
            <span className="gradient-text">Life-Changing.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            From inventory listing to bulk purchase — the entire process takes minutes.
            Here's how it works for both sides of the B2B marketplace.
          </p>
        </div>

        {/* ── Two Process Tracks ── */}
        <div className="grid lg:grid-cols-2 gap-8">
          <div className="reveal reveal-delay-1">
            <ProcessTrack
              title="For Seller / Industry"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                  <polyline points="9 22 9 12 15 12 15 22"></polyline>
                </svg>
              }
              steps={donorSteps}
            />
          </div>
          <div className="reveal reveal-delay-2">
            <ProcessTrack
              title="For Buyer / Wholesaler"
              icon={
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="9" cy="7" r="4"></circle>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
              }
              steps={receiverSteps}
            />
          </div>
        </div>

        <div
          className="mt-16 rounded-3xl overflow-hidden reveal"
          style={{
            background: 'linear-gradient(135deg, #1A1A2E 0%, #2D1F3D 50%, #1A1A2E 100%)',
            padding: '48px 40px',
          }}
        >
          <div className="flex flex-col items-center justify-center text-center gap-8">
            <div>
              <h3 className="text-white text-2xl lg:text-3xl font-bold mb-3">
                Ready to improve supply efficiency?
              </h3>
              <p className="text-white/70 max-w-lg mx-auto">
                Join hundreds of manufacturers and wholesalers already using ClearStock to liquidate and save on B2B inventory.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
