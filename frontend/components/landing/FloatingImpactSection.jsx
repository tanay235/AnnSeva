'use client';

import { useEffect, useRef } from 'react';

const floatingImages = [
  {
    src: 'https://images.unsplash.com/photo-1542810634-71277d95dcbb?w=400&q=80',
    alt: 'Children smiling',
    className: 'absolute top-[35%] left-[2%] md:left-[8%] w-32 md:w-44 lg:w-56 aspect-square rounded-[30%] object-cover shadow-2xl',
    animationDelay: '0s',
    rotation: '-12deg'
  },
  {
    src: 'https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=400&q=80',
    alt: 'Child eating',
    className: 'absolute top-[15%] left-[25%] md:left-[28%] w-28 md:w-40 lg:w-52 aspect-square rounded-[30%] object-cover shadow-2xl',
    animationDelay: '1s',
    rotation: '8deg'
  },
  {
    src: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=400&q=80',
    alt: 'Happy kids',
    className: 'absolute top-[8%] right-[25%] w-36 md:w-48 lg:w-64 aspect-square rounded-[30%] object-cover shadow-2xl',
    animationDelay: '2s',
    rotation: '-4deg'
  },
  {
    src: 'https://images.unsplash.com/photo-1593113630400-ea4288922497?w=400&q=80',
    alt: 'People eating',
    className: 'absolute top-[40%] right-[2%] md:right-[8%] w-32 md:w-44 lg:w-56 aspect-square rounded-[30%] object-cover shadow-2xl',
    animationDelay: '1.5s',
    rotation: '-8deg'
  }
];

export default function FloatingImpactSection() {
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      },
      { threshold: 0.2 }
    );
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] bg-white overflow-hidden flex flex-col items-center justify-end pb-12 lg:pb-20">
      
      {/* Floating Images Arch */}
      <div 
        ref={containerRef}
        className="absolute inset-0 w-full max-w-[1400px] mx-auto opacity-0 transition-opacity duration-1000 ease-in-out [&.visible]:opacity-100"
      >
        {floatingImages.map((img, i) => (
          <div
            key={i}
            className={img.className}
            style={{
              transform: `rotate(${img.rotation})`,
              animation: `floatUpAndDown 6s ease-in-out infinite alternate ${img.animationDelay}`,
            }}
          >
            <img 
              src={img.src} 
              alt={img.alt} 
              className="w-full h-full object-cover rounded-[inherit]"
            />
          </div>
        ))}
      </div>

      {/* Center Branding */}
      <div className="relative z-10 text-center flex flex-col items-center mb-8">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.3"/>
              <path d="M7 13c0 2.76 2.24 5 5 5s5-2.24 5-5H7z" fill="white"/>
              <path d="M12 7c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="white"/>
              <path d="M9 10h6v2H9v-2z" fill="white" fillOpacity="0.8"/>
              <path d="M12 4c.55 0 1-.45 1-1V2h-2v1c0 .55.45 1 1 1z" fill="white"/>
            </svg>
          </div>
          <span className="text-3xl font-extrabold tracking-tight text-dark">
            Ann<span className="text-primary">Seva</span>
          </span>
        </div>
      </div>

    </section>
  );
}
