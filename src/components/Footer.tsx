import React from 'react';
import { Camera, Phone, MapPin, Mail, Lock } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface FooterProps {
  settings: WebsiteSettings;
  onNavigate: (section: string) => void;
  onOpenBooking: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  settings,
  onNavigate,
  onOpenBooking,
  onOpenAdmin,
}) => {
  return (
    <footer className="bg-[#050608] border-t border-white/[0.08] text-slate-400 text-xs font-body pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/[0.08]">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#D4AF37] to-[#997920] flex items-center justify-center">
                <Camera className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-bold font-display tracking-wider text-white">
                {settings.studioName}
              </span>
            </div>

            <p className="text-slate-400 text-xs font-body max-w-sm leading-relaxed">
              "{settings.tagline}"
            </p>

            <p className="text-slate-500 text-[11px] font-body max-w-sm leading-relaxed">
              Premier destination for royal wedding cinematography, candid storytelling, archival album designing, flex printing, and customized gifts in Gaindatola and Chhattisgarh.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={onOpenBooking}
                className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-lg hover:bg-[#E5C05B] transition-colors"
              >
                Inquire For Shoot
              </button>
              <button
                onClick={onOpenAdmin}
                className="p-2 text-slate-500 hover:text-[#D4AF37] transition-colors"
                title="Studio Staff Portal"
              >
                <Lock className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
              Navigation
            </span>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-white transition-colors">
                  Home
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors">
                  Our Services
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors">
                  Portfolio Gallery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-white transition-colors">
                  Pricing Packages
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-white transition-colors">
                  About Studio
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('blog')} className="hover:text-white transition-colors">
                  Photography Journal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-white transition-colors">
                  Contact & Map
                </button>
              </li>
            </ul>
          </div>

          {/* Core Photography Offerings */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
              Specialties
            </span>
            <ul className="space-y-2 text-[11px] text-slate-400">
              <li>Royal Wedding Photography</li>
              <li>4K Drone Cinematography</li>
              <li>Pre-Wedding Destination Shoots</li>
              <li>Candid & Mandap Moments</li>
              <li>Haldi & Sangeet Celebrations</li>
              <li>Baby Milestones & Cake Smash</li>
              <li>Fine Art Studio Portraits</li>
            </ul>
          </div>

          {/* Printing & Contact Details */}
          <div className="space-y-3">
            <span className="text-xs font-mono font-semibold text-white uppercase tracking-wider block">
              Gaindatola Studio
            </span>
            <div className="space-y-2.5 text-[11px]">
              <div className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>{settings.address}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings.primaryPhone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-400 font-mono">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                <span>{settings.secondaryPhone}</span>
              </div>
              <div className="text-slate-500 font-mono pt-1">
                Hours: {settings.businessHours}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © {new Date().getFullYear()} {settings.studioName}. All rights reserved.
          </div>
          <div className="flex items-center gap-6">
            <span>Gaindatola, Chhattisgarh</span>
            <span>·</span>
            <span>Photography & Creative Printing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
