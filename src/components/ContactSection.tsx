import React, { useState } from 'react';
import { MapPin, Phone, Mail, Clock, Send, MessageSquare, CheckCircle, AlertCircle } from 'lucide-react';
import { WebsiteSettings } from '../types/index.ts';

interface ContactSectionProps {
  settings: WebsiteSettings;
}

export const ContactSection: React.FC<ContactSectionProps> = ({ settings }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [serviceInterest, setServiceInterest] = useState('Wedding Photography');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setErrorMsg('Please provide your name and phone number.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          email,
          serviceInterest,
          message,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setName('');
      setPhone('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred. Please call our studio directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const whatsappDirectUrl = `https://wa.me/${settings.whatsappNumber}?text=Hello%20Capture%20Studio!%20I%20want%20to%20enquire%20about%20your%20photography%20services.%20Please%20share%20details.`;

  return (
    <section id="contact" className="py-24 bg-[#0A0C11] border-t border-white/[0.08] relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center justify-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>STUDIO HEADQUARTERS</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display text-white tracking-tight">
            Connect With <span className="text-gold-gradient">Capture Studio</span>
          </h2>
          <p className="text-slate-400 text-sm font-body">
            Visit our studio in Gaindatola or reach out directly for instant quotes and date availability consultations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Info Cards & Google Maps */}
          <div className="lg:col-span-5 space-y-6">
            {/* Info Box */}
            <div className="p-6 rounded-2xl bg-[#111319] border border-white/10 space-y-5">
              <div className="space-y-1">
                <h3 className="text-xl font-bold font-display text-white">
                  {settings.studioName}
                </h3>
                <p className="text-xs text-[#D4AF37] font-body italic">
                  "{settings.tagline}"
                </p>
              </div>

              <div className="space-y-4 pt-2 border-t border-white/5 text-xs text-slate-300 font-body">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Studio Address</span>
                    <span className="text-slate-400">{settings.address}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Direct Phone Lines</span>
                    <a href={`tel:${settings.primaryPhone.replace(/\s+/g, '')}`} className="text-slate-300 hover:text-[#D4AF37] block font-mono">
                      {settings.primaryPhone}
                    </a>
                    <a href={`tel:${settings.secondaryPhone.replace(/\s+/g, '')}`} className="text-slate-400 hover:text-[#D4AF37] block font-mono">
                      {settings.secondaryPhone}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/10 flex items-center justify-center shrink-0 text-[#D4AF37]">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-white block">Business Hours</span>
                    <span className="text-slate-400 font-mono">{settings.businessHours}</span>
                  </div>
                </div>
              </div>

              {/* Instant WhatsApp Direct Button */}
              <div className="pt-2">
                <a
                  href={whatsappDirectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/20"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat With Studio on WhatsApp</span>
                </a>
              </div>
            </div>

            {/* Google Maps Embed */}
            <div className="h-64 rounded-2xl overflow-hidden border border-white/10 bg-[#111319]">
              <iframe
                title="Capture Studio Gaindatola Google Maps"
                src={settings.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0, filter: 'grayscale(0.7) invert(0.9) contrast(1.2)' }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-2xl bg-[#111319] border border-white/10">
            <h3 className="text-2xl font-bold font-display text-white mb-2">
              Send a Quick Message
            </h3>
            <p className="text-xs text-slate-400 font-body mb-6">
              Have questions regarding album printing, custom photo frames, flex banners, or event availability? Send us a message and our studio manager will assist you promptly.
            </p>

            {submitted ? (
              <div className="p-8 text-center space-y-4 bg-black/40 rounded-xl border border-[#D4AF37]/30">
                <CheckCircle className="w-12 h-12 text-[#D4AF37] mx-auto" />
                <h4 className="text-lg font-bold font-display text-white">
                  Message Sent Successfully
                </h4>
                <p className="text-xs text-slate-300 font-body">
                  Thank you for reaching out. We have received your note and will contact you via phone or WhatsApp.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white text-xs rounded-lg transition-colors"
                >
                  Send Another Note
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {errorMsg && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Anand Sharma"
                      className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 91315XXXXX"
                      className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Email Address (Optional)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your.email@example.com"
                      className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-300 mb-1">
                      Service Interest
                    </label>
                    <select
                      value={serviceInterest}
                      onChange={(e) => setServiceInterest(e.target.value)}
                      className="w-full bg-[#161822] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
                    >
                      <option value="Wedding Photography">Wedding Photography</option>
                      <option value="Wedding Cinematography">Wedding Cinematography</option>
                      <option value="Pre-Wedding Photography">Pre-Wedding Shoot</option>
                      <option value="Photo Album Designing">Photo Album Designing</option>
                      <option value="Photo Printing & Framing">Printing & Framing</option>
                      <option value="Personalized Gifts">Personalized Gifts (Mugs/T-Shirts)</option>
                      <option value="Flex & Banner Printing">Flex & Banner Printing</option>
                      <option value="ID & Visiting Card Designing">ID & Visiting Cards</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Your Message / Requirements
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your date, event venue, or printing requirements..."
                    className="w-full bg-[#161822] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#D4AF37]/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message to Studio'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
