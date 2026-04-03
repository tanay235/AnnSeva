'use client';

import Link from 'next/link';

import { useEffect, useRef } from 'react';

export default function HeroSection() {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.play().catch(() => {
      // autoplay blocked — poster image shows as fallback
    });
  }, []);

  return (
    <section id="home" className="relative h-screen min-h-[600px] flex flex-col items-center justify-center overflow-hidden">

      {/* ── Video Background ── */}
      <div className="hero-video-container">
        <video
          ref={videoRef}
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="https://images.unsplash.com/photo-1586528116311-ad8ed7c50a04?w=1920&q=80"
        >
          {/* Pexels warehouse logistics / inventory videos */}
          <source src="https://videos.pexels.com/video-files/3163534/3163534-uhd_2560_1440_30fps.mp4" type="video/mp4" />
          <source src="https://videos.pexels.com/video-files/6169862/6169862-uhd_2560_1440_24fps.mp4" type="video/mp4" />
        </video>
        <div className="hero-overlay" />
      </div>

      {/* ── Hero Content ── */}
      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">

        {/* Live badge removed */}

        {/* Headline */}
        <h1
          className="text-white font-extrabold leading-tight mb-6"
          style={{
            fontSize: 'clamp(2.4rem, 6vw, 4.5rem)',
            animation: 'fadeUp 0.7s ease-out 0.4s both',
          }}
        >
          Turn Expiring Inventory<br />
          <span style={{ color: '#10B981' }}>Into Revenue</span>
        </h1>

        {/* Subheadline */}
        <p
          className="text-white/80 text-lg lg:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: 'fadeUp 0.7s ease-out 0.6s both' }}
        >
          A smart B2B marketplace where industries can liquidate near-expiry and surplus packaged stock using AI-powered pricing and buyer discovery.
        </p>

        <div
          className="flex flex-col items-center justify-center gap-6"
          style={{ animation: 'fadeUp 0.7s ease-out 0.8s both' }}
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/signup" className="btn-primary text-base px-9 py-4 shadow-lg shadow-primary/30">
              Sell Inventory
            </Link>
            <Link href="/login" className="btn-outline text-base px-9 py-4">
              Browse Deals
            </Link>
          </div>
          <p className="text-white/60 text-sm font-medium tracking-wide uppercase">
            Built for manufacturers, distributors, and wholesalers
          </p>
        </div>

        {/* Trust bar removed */}
      </div>
    </section>
  );
}
