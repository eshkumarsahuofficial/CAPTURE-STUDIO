import React from 'react';
import { Check, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { PricingPackage } from '../types/index.ts';

interface PackagesSectionProps {
  packages: PricingPackage[];
  onSelectPackage: (pkg: PricingPackage) => void;
  onCustomQuote: () => void;
}

export const PackagesSection: React.FC<PackagesSectionProps> = ({
  packages,
  onSelectPackage,
  onCustomQuote,
}) => {
  return (
    <section id="packages" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center justify-center gap-2">
            <Sparkles className="w-4 h-4" />
            <span>TRANSPARENT PRICING</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Curated Shoot <span className="text-gold-gradient">Packages</span>
          </h2>
          <p className="text-slate-400 text-sm sm:text-base font-body">
            Configured for luxury weddings, intimate milestones, and scenic couple shoots. All packages can be tailored to match your specific multi-day itinerary.
          </p>
        </div>

        {/* Packages Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {packages.map((pkg) => {
            const isGold = pkg.isPopular;
            return (
              <div
                key={pkg.id}
                className={`relative flex flex-col justify-between rounded-2xl p-7 transition-all duration-300 ${
                  isGold
                    ? 'bg-gradient-to-b from-[#161821] to-[#0E1015] border-2 border-[#D4AF37] shadow-2xl shadow-[#D4AF37]/15 scale-100 lg:-translate-y-2'
                    : 'bg-[#101218] border border-white/10 hover:border-white/20'
                }`}
              >
                {/* Popular Ribbon */}
                {isGold && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#D4AF37] text-slate-950 text-[10px] font-mono font-bold tracking-widest uppercase shadow-md shadow-[#D4AF37]/30 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-black" />
                    <span>MOST POPULAR CHOICE</span>
                  </div>
                )}

                <div className="space-y-6">
                  {/* Category & Title */}
                  <div>
                    <span className="text-[11px] font-mono tracking-wider text-[#D4AF37] uppercase">
                      {pkg.category}
                    </span>
                    <h3 className="text-2xl font-bold font-display text-white mt-1">
                      {pkg.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 font-body leading-relaxed">
                      {pkg.tagline}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="pt-4 border-t border-white/10">
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-bold font-mono text-white tracking-tight tabular-nums">
                        {pkg.price}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        / {pkg.duration}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#E5C05B] font-mono mt-1 block">
                      *Customizable on inquiry
                    </span>
                  </div>

                  {/* Deliverables List */}
                  <div className="space-y-2.5 pt-2">
                    <div className="text-[11px] font-mono tracking-wider text-slate-300 uppercase">
                      What's Included
                    </div>
                    <ul className="space-y-2">
                      {pkg.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-slate-300 font-body">
                          <Check className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Card CTA */}
                <div className="pt-8 mt-6 border-t border-white/5 space-y-2.5">
                  <button
                    onClick={() => onSelectPackage(pkg)}
                    className={`w-full py-3 rounded-xl font-semibold text-xs tracking-wider transition-all flex items-center justify-center gap-2 ${
                      isGold
                        ? 'bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 shadow-lg shadow-[#D4AF37]/20'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>Reserve This Package</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    onClick={onCustomQuote}
                    className="w-full py-2 text-[11px] font-mono text-slate-400 hover:text-white transition-colors"
                  >
                    Get Custom Quote Instead
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom Quote Banner */}
        <div className="mt-16 p-8 rounded-2xl bg-gradient-to-r from-[#14161F] via-[#101217] to-[#14161F] border border-[#D4AF37]/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h4 className="text-xl font-bold font-display text-white">
              Planning a Destination or Custom Multi-Day Wedding?
            </h4>
            <p className="text-slate-300 text-xs sm:text-sm font-body max-w-xl">
              We specialize in custom itineraries with dedicated candid teams, specialized drone directors, and live LED wall broadcast.
            </p>
          </div>
          <button
            onClick={onCustomQuote}
            className="px-6 py-3 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-xl hover:bg-[#E5C05B] transition-all whitespace-nowrap shrink-0 shadow-lg shadow-[#D4AF37]/20 flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Request Custom Proposal</span>
          </button>
        </div>
      </div>
    </section>
  );
};
