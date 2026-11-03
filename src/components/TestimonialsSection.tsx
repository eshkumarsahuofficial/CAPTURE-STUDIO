import React from 'react';
import { Star, MessageSquareQuote } from 'lucide-react';
import { Testimonial } from '../types/index.ts';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  const activeReviews = testimonials.filter((t) => t.active);

  return (
    <section className="py-24 bg-[#0A0C11] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase">
            AUTHENTIC TESTIMONIALS
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Words of <span className="text-gold-gradient">Gratitude</span>
          </h2>
          <p className="text-slate-400 text-sm font-body">
            Real feedback from couples and families whose most intimate milestones we had the honor of documenting.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeReviews.map((review) => (
            <div
              key={review.id}
              className="p-6 rounded-2xl bg-[#111319] border border-white/10 flex flex-col justify-between space-y-6 hover:border-[#D4AF37]/30 transition-all duration-300"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <MessageSquareQuote className="w-6 h-6 text-slate-600" />
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-body leading-relaxed italic">
                  "{review.comment}"
                </p>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="font-bold text-sm text-white font-display">
                  {review.clientName}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                  {review.eventType} · {review.location}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
