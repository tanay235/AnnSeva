'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isHero, setIsHero] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const heroHeight = window.innerHeight * 0.8;
      setScrolled(window.scrollY > 20);
      setIsHero(window.scrollY < heroHeight);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', href: '#home' },
    { label: 'About Us', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Why It Matters', href: '#why-it-matters' },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-400 ${
        scrolled ? 'navbar-scrolled' : 'bg-transparent'
      }`}
    >
      <div className="w-full mx-auto px-6 lg:px-12 xl:px-20 max-w-[1600px]">
        <div className="flex items-center justify-between h-16 lg:h-20">
          
          {/* Logo */}
          <a href="#home" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.3"/>
                <path d="M7 13c0 2.76 2.24 5 5 5s5-2.24 5-5H7z" fill="white"/>
                <path d="M12 7c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="white"/>
                <path d="M9 10h6v2H9v-2z" fill="white" fillOpacity="0.8"/>
                <path d="M12 4c.55 0 1-.45 1-1V2h-2v1c0 .55.45 1 1 1z" fill="white"/>
                <path d="M9 4.5L8 3.1l-1.5 1 1 1.4L9 4.5z" fill="white"/>
                <path d="M15 4.5l1.5-1L18 4.6l-1 1.4L15 4.5z" fill="white"/>
              </svg>
            </div>
            <span 
              className={`text-xl font-extrabold tracking-tight transition-colors duration-300 ${
                isHero && !scrolled ? 'text-white' : 'text-dark'
              }`}
            >
              Clear<span className="text-primary">Stock</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className={`nav-link ${isHero && !scrolled ? 'nav-link-hero' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              className={`font-semibold text-sm transition-colors duration-300 px-4 py-2 rounded-full ${
                isHero && !scrolled
                  ? 'text-white hover:text-white/80'
                  : 'text-dark hover:text-primary'
              }`}
            >
              Login
            </Link>
            <Link href="/signup" className="btn-primary text-sm px-6 py-3">
              Get Started →
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className={`lg:hidden flex flex-col gap-1.5 p-2 ${
              isHero && !scrolled ? 'text-white' : 'text-dark'
            }`}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''} ${isHero && !scrolled ? 'bg-white' : 'bg-dark'}`}></span>
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? 'opacity-0' : ''} ${isHero && !scrolled ? 'bg-white' : 'bg-dark'}`}></span>
            <span className={`block w-6 h-0.5 transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''} ${isHero && !scrolled ? 'bg-white' : 'bg-dark'}`}></span>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`mobile-menu lg:hidden ${menuOpen ? 'open' : ''}`}>
          <div className={`pb-4 pt-2 ${scrolled ? 'bg-white' : 'bg-dark/90 backdrop-blur-lg'} rounded-b-2xl`}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`block px-6 py-3 text-sm font-medium transition-colors ${
                  scrolled ? 'text-dark hover:text-primary' : 'text-white/90 hover:text-white'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3 px-6 pt-3">
              <Link href="/login" onClick={() => setMenuOpen(false)} className={`text-sm font-semibold px-4 py-2.5 rounded-full ${scrolled ? 'text-dark' : 'text-white'}`}>
                Login
              </Link>
              <Link href="/signup" onClick={() => setMenuOpen(false)} className="btn-primary text-sm px-5 py-2.5">
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
