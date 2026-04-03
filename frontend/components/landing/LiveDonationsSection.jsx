'use client';

import { useState, useEffect, useRef } from 'react';

const categories = ['All', 'Vegetarian', 'Non-Veg', 'Events', 'Urgent'];

const allListings = {
  All: [
    { id: 1, name: 'Dal Fry & Steamed Rice', org: 'Hotel Sunrise', location: 'Koramangala, Bengaluru', qty: '80 plates', type: 'Veg', timeLeft: '2h 15m', status: 'Available', color: '#E8F5E9', dot: '#4CAF50' },
    { id: 2, name: 'Paneer Butter Masala', org: 'Spice Garden', location: 'Banjara Hills, Hyderabad', qty: '45 plates', type: 'Veg', timeLeft: '3h 40m', status: 'Available', color: '#FFF9C4', dot: '#F9A825' },
    { id: 3, name: 'Biryani & Raita', org: 'Grand Pavilion', location: 'Connaught Place, Delhi', qty: '120 plates', type: 'Non-Veg', timeLeft: '1h 30m', status: 'Reserved', color: '#FFF3E0', dot: '#FF9800' },
    { id: 4, name: 'Sambar & Idli', org: 'Saravana Bhavan', location: 'T. Nagar, Chennai', qty: '200 plates', type: 'Veg', timeLeft: '4h', status: 'Available', color: '#E3F2FD', dot: '#2196F3' },
    { id: 5, name: 'Chole Bhature', org: 'Amritsari Dhaba', location: 'Sector 17, Chandigarh', qty: '60 plates', type: 'Veg', timeLeft: '2h 50m', status: 'Available', color: '#F3E5F5', dot: '#9C27B0' },
  ],
  Vegetarian: [
    { id: 6, name: 'Mixed Veg Thali', org: 'Om Sai Mess', location: 'Andheri, Mumbai', qty: '150 plates', type: 'Veg', timeLeft: '3h', status: 'Available', color: '#E8F5E9', dot: '#4CAF50' },
    { id: 7, name: 'Rajma Chawal', org: 'Punjabi Zaika', location: 'Dwarka, Delhi', qty: '90 plates', type: 'Veg', timeLeft: '2h 20m', status: 'Available', color: '#FFF9C4', dot: '#F9A825' },
    { id: 8, name: 'Poha & Jalebi', org: 'Sanjay Hotel', location: 'MG Road, Indore', qty: '100 portions', type: 'Veg', timeLeft: '45m', status: 'Available', color: '#FFEBEE', dot: '#E63327' },
    { id: 9, name: 'Upma & Coconut Chutney', org: 'Udupi Palace', location: 'Jayanagar, Bengaluru', qty: '80 plates', type: 'Veg', timeLeft: '1h 10m', status: 'Available', color: '#E3F2FD', dot: '#2196F3' },
    { id: 10, name: 'Khichdi & Pickle', org: 'City Mess', location: 'Ellis Bridge, Ahmedabad', qty: '200 plates', type: 'Veg', timeLeft: '3h 30m', status: 'Available', color: '#F3E5F5', dot: '#9C27B0' },
  ],
  'Non-Veg': [
    { id: 11, name: 'Chicken Curry & Rice', org: 'Barbecue Nation', location: 'Whitefield, Bengaluru', qty: '60 plates', type: 'Non-Veg', timeLeft: '2h', status: 'Available', color: '#FFF3E0', dot: '#FF9800' },
    { id: 12, name: 'Mutton Biryani', org: 'Paradise Restaurant', location: 'Secunderabad, Hyderabad', qty: '40 plates', type: 'Non-Veg', timeLeft: '1h 20m', status: 'Reserved', color: '#FFEBEE', dot: '#E63327' },
    { id: 13, name: 'Fish Curry & Rice', org: 'Coastal Kitchen', location: 'Bandra, Mumbai', qty: '50 plates', type: 'Non-Veg', timeLeft: '3h', status: 'Available', color: '#E3F2FD', dot: '#2196F3' },
    { id: 14, name: 'Egg Curry & Chapati', org: 'New Delhi Dhaba', location: 'Paharganj, Delhi', qty: '100 plates', type: 'Non-Veg', timeLeft: '2h 40m', status: 'Available', color: '#FFF9C4', dot: '#F9A825' },
    { id: 15, name: 'Prawn Masala', org: 'The Fisherman', location: 'Fort Kochi, Kerala', qty: '35 plates', type: 'Non-Veg', timeLeft: '1h 50m', status: 'Available', color: '#E8F5E9', dot: '#4CAF50' },
  ],
  Events: [
    { id: 16, name: 'Wedding Surplus — Mixed', org: 'Sharma Wedding', location: 'Saket, Delhi', qty: '500 plates', type: 'Mixed', timeLeft: '3h 30m', status: 'Available', color: '#F3E5F5', dot: '#9C27B0' },
    { id: 17, name: 'Conference Lunch Boxes', org: 'TechSummit 2025', location: 'Hi-Tech City, Hyderabad', qty: '200 boxes', type: 'Veg', timeLeft: '4h', status: 'Available', color: '#E3F2FD', dot: '#2196F3' },
    { id: 18, name: 'Pooja Prasadam', org: 'Ram Mandir Trust', location: 'Karol Bagh, Delhi', qty: '300 portions', type: 'Veg', timeLeft: '1h', status: 'Available', color: '#FFF9C4', dot: '#F9A825' },
    { id: 19, name: 'Birthday Party Food', org: 'Private Host', location: 'Juhu, Mumbai', qty: '80 plates', type: 'Mixed', timeLeft: '2h 10m', status: 'Reserved', color: '#FFF3E0', dot: '#FF9800' },
    { id: 20, name: 'College Canteen Surplus', org: 'IIT Bombay Canteen', location: 'Powai, Mumbai', qty: '150 plates', type: 'Veg', timeLeft: '1h 40m', status: 'Available', color: '#E8F5E9', dot: '#4CAF50' },
  ],
  Urgent: [
    { id: 21, name: 'Cooked Rice & Dal', org: 'Hotel Raj Palace', location: 'Varanasi, UP', qty: '60 plates', type: 'Veg', timeLeft: '28m', status: 'Available', color: '#FFEBEE', dot: '#E63327' },
    { id: 22, name: 'Bread & Butter Portions', org: 'Oberoi Patisserie', location: 'Churchgate, Mumbai', qty: '120 portions', type: 'Veg', timeLeft: '40m', status: 'Available', color: '#FFF3E0', dot: '#FF9800' },
    { id: 23, name: 'Chicken Biryani Box', org: 'Biryani Blues', location: 'Cyber City, Gurugram', qty: '30 boxes', type: 'Non-Veg', timeLeft: '35m', status: 'Available', color: '#FFEBEE', dot: '#E63327' },
    { id: 24, name: 'Mixed Snacks Tray', org: 'Cafe Coffee Day', location: 'MG Road, Pune', qty: '80 pieces', type: 'Veg', timeLeft: '50m', status: 'Available', color: '#FFF9C4', dot: '#F9A825' },
    { id: 25, name: 'Rotis & Sabzi', org: 'Annapurna Mess', location: 'Tilak Nagar, Delhi', qty: '100 plates', type: 'Veg', timeLeft: '45m', status: 'Available', color: '#E8F5E9', dot: '#4CAF50' },
  ],
};

function ListingCard({ listing, scale = 1, isCenter }) {
  return (
    <div
      className="listing-card"
      style={{
        transform: `scale(${scale})`,
        opacity: isCenter ? 1 : 0.6,
        filter: isCenter ? 'none' : 'blur(1px)',
        transition: 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        zIndex: isCenter ? 2 : 1,
        background: listing.color,
      }}
    >
      {/* Header stripe */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ background: listing.dot }} />
          <span className="text-xs font-bold uppercase tracking-wider text-gray-500">{listing.type}</span>
        </div>
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{
            background: listing.status === 'Available' ? '#DCFCE7' : '#FEF3C7',
            color: listing.status === 'Available' ? '#15803D' : '#92400E',
          }}
        >
          {listing.status}
        </span>
      </div>

      {/* Food name */}
      <h3 className="text-lg font-bold text-dark mb-1 leading-tight">{listing.name}</h3>
      <p className="text-sm text-gray-500 mb-4">{listing.org}</p>

      {/* Details */}
      <div className="space-y-2 mb-5">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
          {listing.location}
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          Expires in <span className="font-semibold text-dark ml-1">{listing.timeLeft}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          <span className="font-semibold text-dark">{listing.qty}</span> available
        </div>
      </div>

      {/* CTA */}
      <a href="#" className="block text-center text-sm font-semibold py-2.5 rounded-xl transition-all duration-300" style={{ background: '#E63327', color: 'white' }}>
        Request Pickup
      </a>
    </div>
  );
}

export default function LiveDonationsSection() {
  const [activeTab, setActiveTab] = useState('All');
  const [activeIndex, setActiveIndex] = useState(0);
  const [animating, setAnimating] = useState(false);
  const sectionRef = useRef(null);
  const intervalRef = useRef(null);

  const listings = allListings[activeTab];

  const startInterval = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % listings.length);
    }, 3500);
  };

  useEffect(() => {
    startInterval();
    return () => clearInterval(intervalRef.current);
  }, [activeTab]);

  useEffect(() => {
    setAnimating(true);
    const t = setTimeout(() => setAnimating(false), 350);
    return () => clearTimeout(t);
  }, [activeIndex, activeTab]);

  const handleTab = (tab) => {
    setActiveTab(tab);
    setActiveIndex(0);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + listings.length) % listings.length);
    startInterval();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % listings.length);
    startInterval();
  };

  // show 3 cards: prev, center, next
  const getCard = (offset) => listings[(activeIndex + offset + listings.length) % listings.length];

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
    <section id="live-feed" ref={sectionRef} className="py-24 lg:py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14 reveal">
          <span className="section-label">Live Activity</span>
          <h2 className="section-title">
            Food Moving in Real Time
          </h2>
          <p className="section-subtitle mx-auto">
            Every listing below is updated in real time. Browse nearby donations
            by category and request a pickup before it expires.
          </p>
        </div>

        {/* Category Tabs — like feedingindia's day tabs */}
        <div className="flex justify-center mb-12 reveal">
          <div className="flex bg-gray-100 rounded-full p-1.5 gap-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => handleTab(cat)}
                className="px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300"
                style={{
                  background: activeTab === cat ? '#E63327' : 'transparent',
                  color: activeTab === cat ? 'white' : '#6B7280',
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 3-Card Carousel */}
        <div className="relative flex items-center justify-center gap-4 lg:gap-6 mb-10 reveal">

          {/* Prev arrow */}
          <button
            onClick={handlePrev}
            className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 flex-shrink-0 shadow-sm z-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>

          {/* Cards */}
          <div className="flex items-center gap-4 lg:gap-6 overflow-hidden"
            style={{ perspective: '1000px' }}>

            {/* Left card */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <ListingCard listing={getCard(-1)} scale={0.9} isCenter={false} />
            </div>

            {/* Center card */}
            <div
              className="w-80 flex-shrink-0"
              style={{
                opacity: animating ? 0 : 1,
                transform: animating ? 'translateY(16px)' : 'translateY(0)',
                transition: 'opacity 0.35s ease, transform 0.35s ease',
              }}
            >
              <ListingCard listing={getCard(0)} scale={1} isCenter={true} />
            </div>

            {/* Right card */}
            <div className="hidden md:block w-72 flex-shrink-0">
              <ListingCard listing={getCard(1)} scale={0.9} isCenter={false} />
            </div>
          </div>

          {/* Next arrow */}
          <button
            onClick={handleNext}
            className="hidden sm:flex w-10 h-10 rounded-full border border-gray-200 bg-white items-center justify-center hover:border-primary hover:text-primary transition-all duration-300 flex-shrink-0 shadow-sm z-10"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Dot indicators */}
        <div className="flex justify-center gap-2 mb-12 reveal">
          {listings.map((_, i) => (
            <button
              key={i}
              onClick={() => { setActiveIndex(i); startInterval(); }}
              className="rounded-full transition-all duration-300"
              style={{
                width: i === activeIndex ? '24px' : '8px',
                height: '8px',
                background: i === activeIndex ? '#E63327' : '#D1D5DB',
              }}
            />
          ))}
        </div>

        {/* Mobile prev/next */}
        <div className="flex sm:hidden justify-center gap-4 mb-8">
          <button onClick={handlePrev}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <button onClick={handleNext}
            className="w-10 h-10 rounded-full border border-gray-200 bg-white flex items-center justify-center shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Bottom CTA */}
        <div className="text-center reveal">
          <p className="text-muted text-sm mb-5">
            Showing live listings near you · Updated every 30 seconds
          </p>
          <a href="#" className="btn-outline-dark inline-flex">
            View All Listings →
          </a>
        </div>
      </div>
    </section>
  );
}
