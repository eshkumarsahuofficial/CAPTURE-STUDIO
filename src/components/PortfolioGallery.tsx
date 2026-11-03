import React, { useState } from 'react';
import { Camera, Eye, Sparkles } from 'lucide-react';
import { PortfolioItem, PortfolioCategory } from '../types/index.ts';
import { PortfolioLightbox } from './PortfolioLightbox.tsx';

interface PortfolioGalleryProps {
  items: PortfolioItem[];
  onBookStyle: (item: PortfolioItem) => void;
}

export const PortfolioGallery: React.FC<PortfolioGalleryProps> = ({ items, onBookStyle }) => {
  const [activeCategory, setActiveCategory] = useState<PortfolioCategory>('all');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const categories: { id: PortfolioCategory; label: string }[] = [
    { id: 'all', label: 'All Works' },
    { id: 'wedding', label: 'Wedding' },
    { id: 'pre_wedding', label: 'Pre-Wedding' },
    { id: 'candid', label: 'Candid' },
    { id: 'haldi', label: 'Haldi' },
    { id: 'mehendi', label: 'Mehendi' },
    { id: 'engagement', label: 'Engagement' },
    { id: 'couple', label: 'Couples' },
    { id: 'baby', label: 'Baby & Kids' },
    { id: 'birthday', label: 'Birthdays' },
    { id: 'portrait', label: 'Portraits' },
  ];

  const filteredItems = activeCategory === 'all'
    ? items
    : items.filter((item) => item.category === activeCategory);

  const currentItem = selectedItemIndex !== null ? filteredItems[selectedItemIndex] : null;

  const handleNext = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex + 1) % filteredItems.length);
    }
  };

  const handlePrev = () => {
    if (selectedItemIndex !== null) {
      setSelectedItemIndex((selectedItemIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="portfolio" className="py-24 bg-[#08090C] relative">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header with Refined Typography & Anti-Slop Discipline */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3">
            <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
              <Camera className="w-4 h-4" />
              <span>THE VISUAL ARCHIVE</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
              Curated <span className="text-gold-gradient">Masterpieces</span>
            </h2>
            <p className="text-slate-400 text-sm sm:text-base max-w-xl font-body">
              Every frame reflects our obsession with light, authentic human connection, and artistic storytelling across India's richest ceremonies.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <span>Showing</span>
            <span className="font-bold text-[#D4AF37] tabular-nums">{filteredItems.length}</span>
            <span>of {items.length} works</span>
          </div>
        </div>

        {/* Category Filter Bar (Interactive segmented controls) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#D4AF37] text-slate-950 font-semibold shadow-md shadow-[#D4AF37]/20'
                    : 'bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Masonry / Bento Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, index) => {
            const isWide = item.aspectRatio === 'landscape' && index % 4 === 0;
            return (
              <div
                key={item.id}
                onClick={() => setSelectedItemIndex(index)}
                className={`group relative overflow-hidden rounded-2xl bg-[#111319] border border-white/10 cursor-pointer transition-all duration-300 hover:border-[#D4AF37]/40 hover:shadow-2xl hover:shadow-[#D4AF37]/10 ${
                  isWide ? 'lg:col-span-2' : 'col-span-1'
                }`}
              >
                {/* Photo with zoom effect */}
                <div className="relative aspect-[4/3] sm:aspect-auto sm:h-80 w-full overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  {/* Subtle Darkroom Vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity" />
                </div>

                {/* Card Overlay Metadata */}
                <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                  {/* Top Kicker */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono tracking-wider px-2.5 py-1 rounded bg-black/60 text-[#E5C05B] border border-white/10 uppercase">
                      {item.category.replace('_', ' ')}
                    </span>
                    {item.featured && (
                      <span className="text-[10px] font-mono tracking-wider px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/40 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>

                  {/* Bottom Title & EXIF Preview */}
                  <div className="space-y-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-lg font-bold font-display text-white leading-snug">
                      {item.title}
                    </h3>

                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
                      <span>{item.exif.camera}</span>
                      <span>·</span>
                      <span className="text-[#D4AF37]">{item.exif.aperture}</span>
                      <span>·</span>
                      <span>{item.exif.lens}</span>
                    </div>

                    <div className="pt-1 flex items-center gap-1.5 text-xs text-[#D4AF37] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Inspect Details & EXIF</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16 border border-dashed border-white/10 rounded-2xl">
            <Camera className="w-10 h-10 text-slate-600 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No photographs found in this category.</p>
          </div>
        )}
      </div>

        {/* Lightbox Modal */}
      <PortfolioLightbox
        item={currentItem}
        items={filteredItems}
        onClose={() => setSelectedItemIndex(null)}
        onSelectNext={handleNext}
        onSelectPrev={handlePrev}
        onBookStyle={(styleItem) => {
          setSelectedItemIndex(null);
          onBookStyle(styleItem);
        }}
      />
    </section>
  );
};
