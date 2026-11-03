import React, { useState } from 'react';
import { Camera, Lock, Menu, X, PhoneCall } from 'lucide-react';

interface NavbarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
  primaryPhone: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSection,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
  primaryPhone,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'packages', label: 'Packages' },
    { id: 'about', label: 'About' },
    { id: 'blog', label: 'Journal' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNavClick = (id: string) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08090C]/90 backdrop-blur-md border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single Text Element) */}
        <button
          onClick={() => handleNavClick('home')}
          className="text-left group flex items-center gap-2.5 whitespace-nowrap shrink-0 focus:outline-none"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#997920] flex items-center justify-center shadow-lg shadow-[#D4AF37]/15">
            <Camera className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-xl font-bold font-display tracking-wider text-white group-hover:text-[#D4AF37] transition-colors">
              CAPTURE STUDIO
            </span>
            <span className="block text-[9px] font-mono tracking-widest text-[#D4AF37] uppercase">
              GAINDATOLA
            </span>
          </div>
        </button>

        {/* Zone 2: Navigation Links (Clean typography, whitespace-nowrap) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 text-[13px] tracking-wide ${
                  isActive
                    ? 'text-[#D4AF37] border-[#D4AF37] font-semibold'
                    : 'text-slate-300 hover:text-white border-transparent'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Actions (CTA + Direct Call + Admin Portal Access) */}
        <div className="flex items-center gap-3 shrink-0">
          <a
            href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
            className="hidden lg:flex items-center gap-1.5 text-xs font-mono text-slate-300 hover:text-[#D4AF37] transition-colors px-3 py-2 border border-white/10 rounded-lg bg-white/5"
            title="Call Studio Directly"
          >
            <PhoneCall className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{primaryPhone}</span>
          </a>

          <button
            onClick={onOpenBooking}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-[#D4AF37] hover:bg-[#E5C05B] rounded-lg transition-all shadow-md shadow-[#D4AF37]/20 whitespace-nowrap shrink-0"
          >
            Book a Shoot
          </button>

          <button
            onClick={onOpenAdmin}
            aria-label="Admin Dashboard"
            title="Studio Admin Portal"
            className="p-2 text-slate-400 hover:text-[#D4AF37] hover:bg-white/5 rounded-lg transition-colors border border-transparent hover:border-white/10"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Mobile hamburger menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0D0F14] border-b border-white/10 px-6 py-4 space-y-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className="block w-full text-left py-2 text-sm font-medium text-slate-200 hover:text-[#D4AF37]"
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2">
            <a
              href={`tel:${primaryPhone.replace(/\s+/g, '')}`}
              className="flex items-center gap-2 text-xs font-mono text-slate-300 py-1"
            >
              <PhoneCall className="w-4 h-4 text-[#D4AF37]" />
              <span>{primaryPhone}</span>
            </a>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="text-left text-xs font-mono text-slate-400 py-1 flex items-center gap-2"
            >
              <Lock className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Studio Staff Login</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
