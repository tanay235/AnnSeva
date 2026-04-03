'use client';

const footerLinks = {
  Platform: [
    { label: 'Sell Inventory', href: '#' },
    { label: 'Browse Deals', href: '#' },
    { label: 'AI Pricing', href: '#' },
    { label: 'Seller Dashboard', href: '#' },
  ],
  'For Wholesalers': [
    { label: 'Register as Buyer', href: '#' },
    { label: 'Bulk Orders', href: '#' },
    { label: 'Request Stock', href: '#' },
  ],
  Company: [
    { label: 'About ClearStock', href: '#about' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Impact', href: '#why-it-matters' },
    { label: 'Contact Us', href: '#' },
  ],
};

const socialLinks = [
  { label: 'Twitter', icon: '𝕏', href: '#' },
  { label: 'LinkedIn', icon: 'in', href: '#' },
  { label: 'Instagram', icon: '📷', href: '#' },
  { label: 'GitHub', icon: '⌥', href: '#' },
];

export default function FooterSection() {
  return (
    <footer className="bg-dark text-white">
      
      {/* ── Top CTA Strip ── */}
      <div
        className="border-b border-white/10"
        style={{ background: 'linear-gradient(135deg, #1E1E3F 0%, #2D1F3D 100%)' }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
              Turn Expiring Inventory into Revenue.
            </h3>
            <p className="text-white/60 text-base">
              Join the marketplace to liquidate surplus packaged stock and buy bulk inventory securely.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <a href="#" className="btn-primary px-7 py-3.5 shadow-lg shadow-primary/30">
              Sell Inventory
            </a>
            <a href="#" className="btn-outline px-7 py-3.5 bg-white/5 border-white/20 text-white hover:bg-white hover:text-dark">
              Browse Deals
            </a>
          </div>
        </div>
      </div>

      {/* ── Main Footer ── */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Brand Column */}
          <div className="lg:col-span-2">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-2.5 mb-5 group w-fit">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-md">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="white" fillOpacity="0.3"/>
                  <path d="M7 13c0 2.76 2.24 5 5 5s5-2.24 5-5H7z" fill="white"/>
                  <path d="M12 7c-1.1 0-2 .9-2 2h4c0-1.1-.9-2-2-2z" fill="white"/>
                  <path d="M9 10h6v2H9v-2z" fill="white" fillOpacity="0.8"/>
                  <path d="M12 4c.55 0 1-.45 1-1V2h-2v1c0 .55.45 1 1 1z" fill="white"/>
                </svg>
              </div>
              <span className="text-xl font-extrabold tracking-tight">
                Clear<span className="text-primary">Stock</span>
              </span>
            </a>

            <p className="text-white/60 text-sm leading-relaxed mb-6 max-w-xs">
              A smart liquidation platform designed to help industries recover value from near-expiry and surplus packaged inventory using B2B matching and pricing intelligence.
            </p>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-white/60 hover:border-primary hover:text-primary hover:bg-primary/10 transition-all duration-300 text-sm font-bold"
                >
                  {s.icon}
                </a>
              ))}
            </div>

            {/* Contact */}
            <div className="mt-6 space-y-2 text-sm text-white/50">
              <p>📧 hello@clearstock.in</p>
              <p>📍 Jabalpur, Madhya Pradesh, India</p>
            </div>
          </div>

          {/* Links Columns */}
          {Object.entries(footerLinks).map(([group, links]) => (
            <div key={group}>
              <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-5">
                {group}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href} className="footer-link">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── Bottom Bar ── */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-sm">
            © {new Date().getFullYear()} ClearStock. All rights reserved. Built for B2B.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="footer-link text-xs">Terms of Service</a>
            <a href="#" className="footer-link text-xs">Privacy Policy</a>
            <a href="#" className="footer-link text-xs">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
