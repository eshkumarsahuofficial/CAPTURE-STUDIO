import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

interface FloatingWhatsAppProps {
  whatsappNumber: string;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ whatsappNumber }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const defaultMsg = encodeURIComponent(
    'Hello Capture Studio! I want to enquire about your photography services. Please share your details and packages.'
  );
  const waUrl = `https://wa.me/${whatsappNumber}?text=${defaultMsg}`;

  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-3">
      {/* Tooltip prompt */}
      {showTooltip && (
        <div className="relative bg-[#0E1016] border border-[#D4AF37]/30 rounded-xl p-3 shadow-2xl text-xs text-white max-w-xs animate-fadeIn flex items-start gap-2">
          <div>
            <span className="font-bold text-[#E5C05B] block font-display">Chat With Us</span>
            <span className="text-[11px] text-slate-300">Need quick quotes or check dates? Click to chat directly on WhatsApp!</span>
          </div>
          <button
            onClick={() => setShowTooltip(false)}
            className="text-slate-500 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      <a
        href={waUrl}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setShowTooltip(true)}
        className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center shadow-2xl shadow-emerald-900/50 hover:scale-105 transition-all group relative border-2 border-emerald-400/40"
        aria-label="Chat on WhatsApp with Capture Studio"
        title="Chat on WhatsApp"
      >
        <MessageSquare className="w-7 h-7 fill-current" />
        {/* Real-time online indicator dot (clean static indicator per skill guidelines) */}
        <span className="absolute top-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-300 border-2 border-[#08090C]" />
      </a>
    </div>
  );
};
