import React, { useState } from 'react';
import { Camera, Film, Printer, Sparkles, ArrowRight, Check } from 'lucide-react';
import { ServiceItem } from '../types/index.ts';
import { ServiceDetailModal } from './ServiceDetailModal.tsx';

interface ServicesSectionProps {
  services: ServiceItem[];
  onBookService: (service: ServiceItem) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({ services, onBookService }) => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);

  const filters = [
    { id: 'all', label: 'All Services (16)' },
    { id: 'wedding', label: 'Weddings & Cinema' },
    { id: 'events', label: 'Events & Studio' },
    { id: 'printing', label: 'Printing & Albums' },
    { id: 'commercial', label: 'Graphic & Commercial' },
  ];

  const filteredServices = services.filter((srv) => {
    if (!srv.active) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'wedding') {
      return ['wedding', 'cinematography', 'pre_wedding', 'candid'].includes(srv.category);
    }
    if (activeFilter === 'events') {
      return ['events', 'portrait'].includes(srv.category);
    }
    if (activeFilter === 'printing') {
      return srv.category === 'printing_gifts';
    }
    if (activeFilter === 'commercial') {
      return srv.category === 'commercial';
    }
    return true;
  });

  return (
    <section id="services" className="py-24 bg-[#0A0C11] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>CRAFTED IN GAINDATOLA</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Photography, Films & <span className="text-gold-gradient">Creative Print</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl font-body">
              From monumental multi-day royal weddings to custom sublimated ceramic gifts and flex banners, our studio delivers end-to-end creative excellence.
            </p>
          </div>

          {/* Filter Pills / Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  activeFilter === f.id
                    ? 'bg-[#D4AF37] text-slate-950 font-semibold shadow-md shadow-[#D4AF37]/20'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* 16 Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="group flex flex-col justify-between bg-[#111319] border border-white/10 rounded-2xl overflow-hidden hover:border-[#D4AF37]/40 hover:shadow-xl hover:shadow-[#D4AF37]/10 transition-all duration-300"
            >
              {/* Image & Price Banner */}
              <div className="relative h-48 w-full overflow-hidden bg-black/40">
                <img
                  src={service.heroImage}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#111319] via-transparent to-transparent" />
                <div className="absolute top-3 right-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md text-[11px] font-mono text-[#E5C05B] border border-white/10">
                  {service.startingPrice}
                </div>
              </div>

              {/* Content Area */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-lg font-bold font-display text-white group-hover:text-[#D4AF37] transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-3 font-body leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                {/* Key feature checklist (anti-slop clean unboxed bullets) */}
                {service.features && service.features.length > 0 && (
                  <div className="space-y-1.5 pt-2 border-t border-white/5">
                    {service.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-300 truncate">
                        <Check className="w-3.5 h-3.5 text-[#D4AF37] shrink-0" />
                        <span className="truncate">{feat}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Card Action Buttons */}
                <div className="pt-3 flex items-center justify-between gap-2 border-t border-white/5">
                  <button
                    onClick={() => setSelectedService(service)}
                    className="text-xs text-slate-300 hover:text-white font-medium py-1.5 px-2 transition-colors"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => onBookService(service)}
                    className="px-3.5 py-1.5 bg-[#D4AF37]/15 hover:bg-[#D4AF37] text-[#D4AF37] hover:text-slate-950 font-semibold text-xs rounded-lg transition-all flex items-center gap-1.5 border border-[#D4AF37]/30 hover:border-[#D4AF37]"
                  >
                    <span>Enquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Detail Modal */}
      <ServiceDetailModal
        service={selectedService}
        onClose={() => setSelectedService(null)}
        onBookService={onBookService}
      />
    </section>
  );
};
