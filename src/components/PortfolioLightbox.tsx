import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Camera, Aperture, Clock, Zap, MapPin, Calendar, HeartHandshake } from 'lucide-react';
import { PortfolioItem } from '../types/index.ts';

interface PortfolioLightboxProps {
  item: PortfolioItem | null;
  items: PortfolioItem[];
  onClose: () => void;
  onSelectNext: () => void;
  onSelectPrev: () => void;
  onBookStyle: (item: PortfolioItem) => void;
}

export const PortfolioLightbox: React.FC<PortfolioLightboxProps> = ({
  item,
  onClose,
  onSelectNext,
  onSelectPrev,
  onBookStyle,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onSelectNext();
      if (e.key === 'ArrowLeft') onSelectPrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onSelectNext, onSelectPrev]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-4 sm:p-6 transition-all animate-fadeIn">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close Lightbox"
      >
        <X className="w-6 h-6" />
      </button>

      {/* Navigation Arrows */}
      <button
        onClick={onSelectPrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white transition-all hover:scale-105"
        aria-label="Previous photo"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={onSelectNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-black/60 hover:bg-black/90 border border-white/10 text-white transition-all hover:scale-105"
        aria-label="Next photo"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Main Container */}
      <div className="relative max-w-6xl w-full max-h-[90vh] flex flex-col lg:flex-row gap-6 items-center justify-center">
        {/* Photo Container */}
        <div className="relative flex-1 flex items-center justify-center max-h-[75vh] lg:max-h-[85vh] overflow-hidden rounded-xl bg-black/50 border border-white/10">
          <img
            src={item.imageUrl}
            alt={item.title}
            className="max-h-[75vh] lg:max-h-[85vh] w-auto object-contain rounded-lg"
          />
        </div>

        {/* Details & Darkroom EXIF Side Panel */}
        <div className="w-full lg:w-96 shrink-0 bg-[#0E1016] border border-white/10 rounded-2xl p-6 text-slate-200 space-y-5">
          <div>
            <div className="text-[11px] font-mono tracking-wider text-[#D4AF37] uppercase">
              {item.category.replace('_', ' ')}
            </div>
            <h3 className="text-xl font-bold font-display text-white mt-1">
              {item.title}
            </h3>
            {item.clientNames && (
              <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{item.clientNames}</span>
                {item.eventDate && <span>· {item.eventDate}</span>}
              </p>
            )}
          </div>

          {/* EXIF Darkroom Data Card */}
          <div className="p-4 rounded-xl bg-black/60 border border-white/5 space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-[#D4AF37] border-b border-white/5 pb-2">
              <Camera className="w-3.5 h-3.5" />
              <span>SHOOT EXIF METADATA</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 text-[11px] font-mono">
              <div>
                <span className="text-slate-500 block">Camera</span>
                <span className="text-slate-200 font-semibold">{item.exif.camera}</span>
              </div>
              <div>
                <span className="text-slate-500 block">Lens</span>
                <span className="text-slate-200 font-semibold">{item.exif.lens}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Aperture className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{item.exif.aperture}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>{item.exif.shutterSpeed}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>ISO {item.exif.iso}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span className="truncate">{item.exif.location || 'Gaindatola'}</span>
              </div>
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-2">
            <button
              onClick={() => onBookStyle(item)}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#D4AF37]/20"
            >
              <HeartHandshake className="w-4 h-4" />
              <span>Inquire About This Style</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
