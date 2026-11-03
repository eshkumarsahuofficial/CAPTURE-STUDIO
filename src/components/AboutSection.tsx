import React from 'react';
import { Camera, Film, Sparkles, CheckCircle, Award, Eye, Heart } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface AboutSectionProps {
  settings: WebsiteSettings;
  onExplorePortfolio: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, onExplorePortfolio }) => {
  const philosophies = [
    {
      title: 'Cinematic Storytelling',
      desc: 'We treat every ceremony as an emotional film with narrative arc, dramatic light, and licensed music scoring.',
      icon: Film,
    },
    {
      title: 'Stealth Candid Mastery',
      desc: 'Our artists operate with silent prime lenses, capturing natural tears and smiles without intrusive directing.',
      icon: Eye,
    },
    {
      title: 'Archival Print Longevity',
      desc: 'All photobooks and frames utilize 12-color pigment inks and shatterproof acrylic tested to resist fading for 100+ years.',
      icon: Award,
    },
    {
      title: 'Warm Regional Trust',
      desc: 'Deep roots in Gaindatola with an understanding of traditional Chhattisgarhi and royal Indian wedding customs.',
      icon: Heart,
    },
  ];

  return (
    <section id="about" className="py-24 bg-[#08090C] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Composition */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-[#111319]">
              <img
                src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80"
                alt="Capture Studio Team in Action"
                className="w-full h-[450px] sm:h-[520px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

              {/* Float Glass Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-xl bg-black/75 backdrop-blur-md border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono tracking-widest text-[#D4AF37] uppercase block">
                      HEADQUARTERS
                    </span>
                    <span className="text-sm font-bold text-white font-display">
                      {settings.address}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-mono text-slate-400 uppercase block">EXPERIENCE</span>
                    <span className="text-lg font-bold font-mono text-[#D4AF37]">
                      {settings.stats.yearsExperience}+ Years
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Gold Glow */}
            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-[#D4AF37]/15 rounded-full blur-[80px] pointer-events-none" />
          </div>

          {/* Right Column: Narrative & Values */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>ABOUT CAPTURE STUDIO</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight leading-tight">
                Crafting Timeless Heirlooms for Generations.
              </h2>
              <p className="text-slate-300 text-sm sm:text-base font-body leading-relaxed">
                Founded in Gaindatola, <strong>CAPTURE STUDIO</strong> has evolved into a premier full-service photography studio, high-definition cinematography agency, and precision printing lab.
              </p>
              <p className="text-slate-400 text-xs sm:text-sm font-body leading-relaxed">
                We believe a great photograph is not merely a record of how an event looked — it is a time portal to exactly how it felt. Combining Hollywood-grade cinema rigs, Sony G Master optics, licensed 4K aerial drones, and master album craft, we ensure your wedding, milestone celebrations, and brand visuals stand apart with distinction.
              </p>
            </div>

            {/* Core Philosophies Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {philosophies.map((p, i) => {
                const Icon = p.icon;
                return (
                  <div key={i} className="p-4 rounded-xl bg-[#111319] border border-white/5 space-y-2">
                    <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center text-[#D4AF37]">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="text-xs font-bold font-display text-white tracking-wide">
                      {p.title}
                    </h3>
                    <p className="text-[11px] text-slate-400 font-body leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="pt-2">
              <button
                onClick={onExplorePortfolio}
                className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium text-xs rounded-xl transition-all border border-white/10"
              >
                Inspect Selected Portfolio
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
