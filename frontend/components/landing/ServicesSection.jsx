'use client';

import { useEffect, useRef } from 'react';

const services = [
  {
    id: 'sell',
    tag: 'For Sellers',
    title: 'Sell Inventory',
    description:
      'List near-expiry or surplus packaged products and liquidate stock before it turns into a complete loss.',
    features: [
      'Quick bulk listing',
      'Set liquidation deadlines',
      'Direct buyer negotiations',
      'Secure transaction records',
    ],
    cta: 'Start Selling',
    href: '#',
  },
  {
    id: 'buy',
    tag: 'For Wholesalers',
    title: 'Find Bulk Deals',
    description:
      'Allow wholesalers and retailers to discover discounted packaged inventory and buy it in bulk.',
    features: [
      'Browse discounted stock',
      'Filter by category & expiry',
      'Compare bulk prices',
      'Connect with manufacturers',
    ],
    cta: 'Browse Deals',
    href: '#',
  },
  {
    id: 'ai',
    tag: 'Smart Pricing',
    title: 'AI Price Suggestion',
    description:
      'Get smart selling price recommendations based on expiry, quantity, and urgency to maximize recovery.',
    features: [
      'Dynamic pricing engine',
      'Urgency-based discounts',
      'Market demand analytics',
      'Maximize recovered value',
    ],
    cta: 'Learn More',
    href: '#',
  },
];

const additionalCards = [
  {
    title: 'AI-Powered Matching',
    description: 'Our engine ranks surplus inventory by expiry risk, category, and local demand to connect you with the right buyers fast.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  {
    title: 'Secure Transactions',
    description: 'Keep internal ledgers of your B2B liquidation sales with verifiable buyer and seller histories to ensure completely safe deals.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
      </svg>
    ),
  },
  {
    title: 'Instant Email Alerts',
    description: 'Wholesalers get notified the moment a manufacturer lists new bulk inventory matching their specific category interests.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
      </svg>
    ),
  },
  {
    title: 'Real-time Analytics',
    description: 'Track how much value you have recovered over time, monitor best-selling products, and optimize your supply chain.',
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
  },
];

export default function ServicesSection() {
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
    <section id="services" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">Our Services</span>
          <h2 className="section-title">
            One Platform,{' '}
            <span className="gradient-text">Two Powerful Roles</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Whether you have surplus stock to clear or you're looking for discounted wholesale deals, ClearStock makes B2B liquidation fast, transparent, and profitable.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {services.map((service, i) => (
            <div
              key={service.id}
              className="service-card reveal"
              style={{ transitionDelay: `${i * 150}ms` }}
            >
              <div className="section-label w-fit mb-5">{service.tag}</div>

              <h3 className="text-2xl font-bold text-dark leading-tight mb-4">
                {service.title}
              </h3>

              <p className="text-muted leading-relaxed mb-6 text-base">
                {service.description}
              </p>

              <ul className="space-y-3 mb-8">
                {service.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm text-dark">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <a href={service.href} className="btn-primary">
                {service.cta} →
              </a>
            </div>
          ))}
        </div>

        {/* ── Additional Feature Cards ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {additionalCards.map((card, i) => (
            <div
              key={card.title}
              className="bg-gray-50 border border-gray-100 rounded-2xl p-6 group hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-400 reveal"
              style={{ transitionDelay: `${(i + 2) * 100}ms` }}
            >
              <div className="w-10 h-10 rounded-xl bg-white border border-gray-100 flex items-center justify-center mb-4 group-hover:border-primary/20 transition-colors duration-300 shadow-sm">
                {card.icon}
              </div>
              <h4 className="font-bold text-dark mb-2 text-base">{card.title}</h4>
              <p className="text-muted text-sm leading-relaxed">{card.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
