'use client';

import { useEffect, useRef } from 'react';

const aiFeatures = [
  {
    title: 'Smart Food Description',
    description:
      'Type a rough description like "rice and dal, 40 plates" — AI converts it into structured data: category, estimated servings, allergen tags, and recommended recipients.',
    tag: 'NLP Processing',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
  },
  {
    title: 'Expiry Risk Scoring',
    description:
      'AI evaluates urgency based on expiry time, quantity, and perishability. High-risk listings are flagged and pushed to the top for immediate pickup.',
    tag: 'Priority Engine',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
    ),
  },
  {
    title: 'Smart NGO Matching',
    description:
      'The matching engine identifies the best-suited receiver for each donation based on distance, capacity, past history, and food preferences.',
    tag: 'Matching Algorithm',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>
    ),
  },
  {
    title: 'Spam & Fraud Detection',
    description:
      'AI automatically detects duplicate listings, invalid food descriptions, and suspicious activity to keep the platform trustworthy for all users.',
    tag: 'Safety Filter',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </svg>
    ),
  },
  {
    title: 'Image Verification',
    description:
      'Donors can upload a photo of the food. AI checks whether the image contains food and flags listings that appear inconsistent or potentially unsafe.',
    tag: 'Vision AI',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
        <polyline points="21 15 16 10 5 21"/>
      </svg>
    ),
  },
  {
    title: 'Donation Analytics',
    description:
      'Donors receive monthly AI-generated impact reports: meals donated, CO₂ saved, most active hours, and tips to maximize donation efficiency.',
    tag: 'Insights',
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/>
        <line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>
      </svg>
    ),
  },
];

export default function AIFeatureSection() {
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
    <section id="ai-features" ref={sectionRef} className="py-24 lg:py-32 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* ── Header — no robot emoji ── */}
        <div className="text-center mb-16 reveal">
          <span className="section-label">AI-Powered</span>
          <h2 className="section-title">
            Intelligent at Every Step
          </h2>
          <p className="section-subtitle mx-auto">
            Every AI feature in AnnSeva solves a real coordination bottleneck —
            powered by the Gemini API with no model training required.
          </p>
        </div>

        {/* ── AI Features Grid — SVG icons, better animations ── */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiFeatures.map((feature, i) => (
            <div
              key={feature.title}
              className="ai-card reveal"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Icon box */}
              <div className="ai-card-icon">
                {feature.icon}
              </div>

              {/* Tag */}
              <span className="inline-block bg-gray-100 text-muted text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full mb-3">
                {feature.tag}
              </span>

              {/* Title + Description */}
              <h3 className="font-bold text-dark text-base mb-2">{feature.title}</h3>
              <p className="text-muted text-sm leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
