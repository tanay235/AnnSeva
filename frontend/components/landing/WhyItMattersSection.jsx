'use client';

import { useEffect, useRef } from 'react';

const impactItems = [
  {
    stat: 'Reduce',
    statLabel: 'Waste',
    title: 'Reduce Waste',
    description:
      'Prevent usable packaged products from being discarded unnecessarily. ClearStock intercepts surplus stock before it turns into dead inventory.',
    color: '#10B981',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
  {
    stat: 'Recover',
    statLabel: 'Value',
    title: 'Recover Value',
    description:
      'Help industries convert dead or slow-moving stock into revenue. Regain capital that would otherwise be lost to expiry write-offs.',
    color: '#059669',
    bg: '#F0FDF4',
    border: '#86EFAC',
  },
  {
    stat: 'Improve',
    statLabel: 'Efficiency',
    title: 'Supply Efficiency',
    description:
      'Enable faster movement of surplus inventory through a structured B2B channel, connecting supply directly with wholesale demand.',
    color: '#0F172A',
    bg: '#F8FAFC',
    border: '#E2E8F0',
  },
];

const testimonials = [
  {
    name: 'Vikram Singh',
    role: 'Operations Head, FMCG Corp',
    quote: 'We used to write off lakhs in near-expiry stock every quarter. ClearStock helped us connect with regional wholesalers rapidly. It feels amazing to turn a loss into revenue.',
    avatar: 'VS',
  },
  {
    name: 'Rahul Mehta',
    role: 'Bulk Wholesaler, Pune',
    quote: 'Before ClearStock, finding discounted bulk inventory was a challenge that took all week. Now I get notified on my phone and can secure truckloads of stock within an hour.',
    avatar: 'RM',
  },
  {
    name: 'Anjali Desai',
    role: 'Distributor, FreshSnacks',
    quote: 'The platform is incredibly easy to use. I post slow-moving inventory in 2 minutes, and it is always purchased before it expires. Pricing AI is incredibly accurate.',
    avatar: 'AD',
  },
];

export default function WhyItMattersSection() {
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
      { threshold: 0.08 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="why-it-matters" ref={sectionRef} className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">💡 Why It Matters</span>
          <h2 className="section-title">
            The Problem Is Real.<br />
            <span className="gradient-text">So Is Our Solution.</span>
          </h2>
          <p className="section-subtitle mx-auto">
            Dead inventory is a financial drain. ClearStock provides a real-time,
            structured B2B marketplace to solve it.
          </p>
        </div>

        {/* ── Impact Cards ── */}
        <div className="grid md:grid-cols-3 gap-8 mb-20">
          {impactItems.map((item, i) => (
            <div
              key={item.title}
              className="impact-card reveal"
              style={{
                transitionDelay: `${i * 120}ms`,
                backgroundColor: item.bg,
                borderColor: item.border,
              }}
            >
              {/* Big Stat */}
              <div
                className="text-4xl lg:text-5xl font-black mb-1"
                style={{ color: item.color }}
              >
                {item.stat}
              </div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-5">
                {item.statLabel}
              </p>

              {/* Title */}
              <h3 className="text-xl font-bold text-dark mb-3">{item.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>

        {/* ── Problem Statement ── */}
        <div
          className="rounded-3xl p-8 lg:p-12 mb-20 reveal"
          style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%)', border: '1px solid #E2E8F0' }}
        >
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl lg:text-3xl font-bold text-dark mb-5">
              The Value Leakage Problem
            </h3>
            <p className="text-muted leading-relaxed text-base lg:text-lg">
              Every day, massive amounts of perfectly usable packaged goods sit in warehouses
              depreciating in value as they near expiry. At the same time, wholesalers and
              discount retailers are actively searching for bulk deals. The core problem is the 
              <strong className="text-dark"> lack of a structured, fast B2B liquidation channel</strong>. 
              Stock often expires and is written off not because there is no demand, but because 
              there is no efficient way to connect surplus supply with wholesale demand before it's too late.
            </p>
          </div>
        </div>

        {/* ── Testimonials ── */}
        <div className="reveal">
          <p className="text-center text-sm font-bold uppercase tracking-widest text-muted mb-10">
            Real Stories. Real Impact.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div
                key={t.name}
                className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:shadow-md hover:-translate-y-1 transition-all duration-300 reveal"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Quote marks */}
                <div className="text-4xl font-black text-primary/20 leading-none mb-3">"</div>
                <p className="text-dark text-sm leading-relaxed mb-6 italic">
                  {t.quote}
                </p>
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
                  >
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-dark text-sm">{t.name}</p>
                    <p className="text-muted text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
