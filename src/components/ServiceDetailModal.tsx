import React from 'react';
import { X, CheckCircle, ArrowRight, Sparkles, Tag } from 'lucide-react';
import { ServiceItem } from '../types/index.ts';

interface ServiceDetailModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBookService: (service: ServiceItem) => void;
}

export const ServiceDetailModal: React.FC<ServiceDetailModalProps> = ({
  service,
  onClose,
  onBookService,
}) => {
  if (!service) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
      <div className="relative max-w-2xl w-full bg-[#0E1016] border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header Image with Gradient */}
        <div className="relative h-56 sm:h-64 w-full shrink-0">
          <img
            src={service.heroImage}
            alt={service.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E1016] via-[#0E1016]/40 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Price badge */}
          <div className="absolute bottom-4 left-6 flex items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-[#D4AF37] text-slate-950 font-bold font-mono text-xs flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" /> Starts from {service.startingPrice}
            </span>
            <span className="text-xs font-mono text-slate-300 bg-black/60 px-2.5 py-1 rounded border border-white/10">
              {service.category.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          <div>
            <h3 className="text-2xl font-bold font-display text-white">
              {service.title}
            </h3>
            <p className="text-slate-300 text-sm mt-2 leading-relaxed font-body">
              {service.fullDescription}
            </p>
          </div>

          {/* Highlights / Features */}
          {service.features && service.features.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-xs font-mono tracking-wider text-[#D4AF37] uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> What Makes Our Craft Unique
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {service.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2 text-xs text-slate-300">
                    <CheckCircle className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Deliverables */}
          {service.deliverables && service.deliverables.length > 0 && (
            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/5 space-y-2">
              <h4 className="text-xs font-mono tracking-wider text-slate-300 uppercase">
                Included Deliverables
              </h4>
              <ul className="space-y-1.5">
                {service.deliverables.map((d, i) => (
                  <li key={i} className="text-xs text-slate-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Booking CTA button */}
          <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/10">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-xs text-slate-400 hover:text-white"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookService(service);
              }}
              className="px-6 py-2.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <span>Book This Service</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
