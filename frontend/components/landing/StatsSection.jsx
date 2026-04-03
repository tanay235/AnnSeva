'use client';

import { useEffect, useRef, useState } from 'react';

const stats = [
  { value: 4.2, suffix: 'M+', label: 'Value Recovered' },
  { value: 1200,  suffix: '+', label: 'Active Sellers' },
  { value: 380,   suffix: '+', label: 'Wholesale Buyers' },
  { value: 85,    suffix: '+', label: 'Cities Active' },
];

function useCountUp(target, duration = 2000, isVisible) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isVisible) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [isVisible, target, duration]);
  return count;
}

function StatItem({ stat, isVisible, delay }) {
  const count = useCountUp(stat.value, 2000, isVisible);
  return (
    <div
      className="stats-item reveal"
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="stat-number">
        {isVisible ? count.toLocaleString() : '0'}
        {stat.suffix}
      </div>
      <p className="text-muted font-medium text-sm mt-1">{stat.label}</p>
    </div>
  );
}

export default function StatsSection() {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Also reveal children
          entry.target.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
        }
      },
      { threshold: 0.3 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="stats" ref={sectionRef} className="py-16 bg-white border-b border-gray-100">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <p className="text-center text-muted text-sm font-semibold uppercase tracking-widest mb-10">
          Our Impact So Far
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 divide-gray-100 lg:divide-x-0">
          {stats.map((stat, i) => (
            <div key={stat.label} className="relative">
              <StatItem stat={stat} isVisible={isVisible} delay={i * 100} />
              {i < stats.length - 1 && (
                <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-12 bg-gray-200" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
