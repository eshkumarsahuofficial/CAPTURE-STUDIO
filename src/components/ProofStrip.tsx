import React from 'react';
import { HeartHandshake, Award, Film, Users } from 'lucide-react';

interface ProofStripProps {
  stats: {
    weddingsCaptured: number;
    happyClients: number;
    eventsCovered: number;
    yearsExperience: number;
  };
}

export const ProofStrip: React.FC<ProofStripProps> = ({ stats }) => {
  const items = [
    {
      label: 'Weddings Captured',
      value: `${stats.weddingsCaptured}+`,
      subtext: 'Royal, candid & traditional rituals',
      icon: Film,
    },
    {
      label: 'Delighted Clients',
      value: `${stats.happyClients}+`,
      subtext: 'Across Gaindatola & CG region',
      icon: Users,
    },
    {
      label: 'Events & Functions',
      value: `${stats.eventsCovered}+`,
      subtext: 'Haldi, birthdays & stage galas',
      icon: HeartHandshake,
    },
    {
      label: 'Years of Experience',
      value: `${stats.yearsExperience}+`,
      subtext: 'Trusted master craftsmanship',
      icon: Award,
    },
  ];

  return (
    <section className="border-y border-white/[0.08] bg-[#0A0C10] py-8">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {items.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <div
                key={i}
                className="flex items-start gap-4 p-3 rounded-xl transition-all hover:bg-white/[0.02]"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#1C2029] to-[#12141A] border border-white/10 flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#D4AF37]" />
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight tabular-nums">
                    {stat.value}
                  </div>
                  <div className="text-xs font-semibold text-slate-200 mt-0.5 tracking-wide">
                    {stat.label}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5 font-sans">
                    {stat.subtext}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
