import React, { useState } from 'react';
import {
  Calendar,
  MapPin,
  Phone,
  Mail,
  User,
  MessageSquare,
  CheckCircle2,
  Send,
  AlertCircle,
  Copy,
  Check,
  CreditCard,
  X,
} from 'lucide-react';
import { ServiceItem, PricingPackage, BookingEnquiry, WebsiteSettings } from '../types/index.ts';

interface BookingPortalProps {
  services: ServiceItem[];
  packages: PricingPackage[];
  settings: WebsiteSettings;
  selectedService?: ServiceItem | null;
  selectedPackage?: PricingPackage | null;
  onClose?: () => void;
  isModal?: boolean;
}

export const BookingPortal: React.FC<BookingPortalProps> = ({
  services,
  packages,
  settings,
  selectedService,
  selectedPackage,
  onClose,
  isModal = false,
}) => {
  // Form State
  const [customerName, setCustomerName] = useState('');
  const [mobile, setMobile] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [sameAsMobile, setSameAsMobile] = useState(true);
  const [email, setEmail] = useState('');
  const [serviceId, setServiceId] = useState(selectedService?.slug || services[0]?.slug || 'wedding-photography');
  const [eventDate, setEventDate] = useState('');
  const [eventLocation, setEventLocation] = useState('');
  const [eventType, setEventType] = useState(selectedService?.title || 'Wedding Celebration');
  const [packageId, setPackageId] = useState(selectedPackage?.id || '');
  const [estimatedBudget, setEstimatedBudget] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [referenceUrl, setReferenceUrl] = useState('');

  // UI State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [completedBooking, setCompletedBooking] = useState<{
    booking: BookingEnquiry;
    enquiryNumber: string;
    whatsappUrl: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState(false);

  // Sync selected props if they change
  React.useEffect(() => {
    if (selectedService) {
      setServiceId(selectedService.slug);
      setEventType(selectedService.title);
    }
  }, [selectedService]);

  React.useEffect(() => {
    if (selectedPackage) {
      setPackageId(selectedPackage.id);
    }
  }, [selectedPackage]);

  const handleMobileChange = (val: string) => {
    setMobile(val);
    if (sameAsMobile) {
      setWhatsapp(val);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !mobile.trim() || !eventDate || !eventLocation.trim()) {
      setErrorMsg('Please fill in your name, mobile number, event date, and location.');
      return;
    }

    const matchedService = services.find((s) => s.slug === serviceId);
    const matchedPackage = packages.find((p) => p.id === packageId);

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName,
          mobile,
          whatsapp: sameAsMobile ? mobile : whatsapp,
          email,
          serviceId,
          serviceTitle: matchedService ? matchedService.title : eventType,
          eventDate,
          eventLocation,
          eventType,
          packageId: matchedPackage ? matchedPackage.id : undefined,
          packageName: matchedPackage ? matchedPackage.name : undefined,
          estimatedBudget,
          additionalRequirements,
          referenceImageUrls: referenceUrl ? [referenceUrl] : [],
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit booking enquiry');
      }

      setCompletedBooking({
        booking: data.booking,
        enquiryNumber: data.enquiryNumber,
        whatsappUrl: data.whatsappUrl,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'An error occurred during booking. Please try again or call us.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  // Content for completed booking
  if (completedBooking) {
    return (
      <div className={`${isModal ? 'p-6 sm:p-8' : 'max-w-2xl mx-auto my-12 p-8'} bg-[#0E1016] border border-[#D4AF37]/40 rounded-2xl shadow-2xl text-center space-y-6 animate-fadeIn`}>
        <div className="w-16 h-16 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37] flex items-center justify-center mx-auto text-[#D4AF37]">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono tracking-widest text-[#D4AF37] uppercase">
            ENQUIRY RECORDED SUCCESSFULLY
          </span>
          <h3 className="text-2xl sm:text-3xl font-bold font-display text-white">
            Thank You, {completedBooking.booking.customerName}!
          </h3>
          <p className="text-slate-300 text-sm font-body max-w-md mx-auto">
            Your photography enquiry has been safely received by our Gaindatola studio desk.
          </p>
        </div>

        {/* Enquiry ID Box */}
        <div className="p-4 rounded-xl bg-black/60 border border-white/10 max-w-sm mx-auto flex items-center justify-between">
          <div className="text-left">
            <span className="text-[10px] font-mono text-slate-400 uppercase block">Enquiry Reference ID</span>
            <span className="text-xl font-bold font-mono text-[#E5C05B] tracking-wider">
              {completedBooking.enquiryNumber}
            </span>
          </div>
          <button
            onClick={() => handleCopyId(completedBooking.enquiryNumber)}
            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
            title="Copy Enquiry ID"
          >
            {copiedId ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Notice on Reservation */}
        <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 max-w-md mx-auto flex items-start gap-2.5 text-left">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <span>
            <strong>Note:</strong> A submitted inquiry is not a confirmed reservation until our studio team verifies date availability and approves it.
          </span>
        </div>

        {/* Action Buttons: WhatsApp Handoff (Primary) + Razorpay Advance (Optional) */}
        <div className="space-y-3 pt-2 max-w-md mx-auto">
          <a
            href={completedBooking.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-sm rounded-xl transition-all flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-900/30"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Chat on WhatsApp with Pre-filled Details</span>
          </a>

          {settings.advancePaymentEnabled && (
            <button
              onClick={() => {
                alert(`Test Payment Mode: Simulating advance booking deposit of ₹${settings.advanceAmount} for ${completedBooking.enquiryNumber}. In production, this opens Razorpay gateway.`);
              }}
              className="w-full py-3 bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 font-medium text-xs rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <CreditCard className="w-4 h-4 text-[#D4AF37]" />
              <span>Pay Advance Deposit (₹{settings.advanceAmount} - Razorpay Test Mode)</span>
            </button>
          )}

          {isModal && onClose && (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-white pt-2 block mx-auto"
            >
              Close Window
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isModal ? 'max-w-3xl w-full bg-[#0E1016] border border-white/10 rounded-2xl p-6 sm:p-8 max-h-[92vh] overflow-y-auto' : 'max-w-4xl mx-auto py-12 px-6'}`}>
      {isModal && onClose && (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="text-xs font-mono tracking-widest text-[#D4AF37] uppercase flex items-center gap-2">
          <Calendar className="w-3.5 h-3.5" />
          <span>DIRECT ENQUIRY PORTAL</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold font-display text-white">
          Book Your <span className="text-gold-gradient">Photography Shoot</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 font-body">
          Tell us about your upcoming celebration. We will review date availability and connect with you directly on WhatsApp with our custom proposal.
        </p>
      </div>

      {errorMsg && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Booking Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Personal Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Customer Full Name <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="e.g. Ramesh Sahu"
                className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Mobile Contact Number <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => handleMobileChange(e.target.value)}
                placeholder="+91 91315XXXXX"
                className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* WhatsApp & Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-mono text-slate-300">
                WhatsApp Number <span className="text-[#D4AF37]">*</span>
              </label>
              <label className="flex items-center gap-1.5 text-[10px] text-slate-400 cursor-pointer">
                <input
                  type="checkbox"
                  checked={sameAsMobile}
                  onChange={(e) => {
                    setSameAsMobile(e.target.checked);
                    if (e.target.checked) setWhatsapp(mobile);
                  }}
                  className="rounded border-slate-700 text-[#D4AF37] focus:ring-0"
                />
                <span>Same as mobile</span>
              </label>
            </div>
            <div className="relative">
              <MessageSquare className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="tel"
                required
                disabled={sameAsMobile}
                value={sameAsMobile ? mobile : whatsapp}
                onChange={(e) => setWhatsapp(e.target.value)}
                placeholder="WhatsApp Phone Number"
                className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 disabled:opacity-60 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Email Address <span className="text-slate-500">(Optional)</span>
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="client@example.com"
                className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Shoot & Service Details */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Photography Service <span className="text-[#D4AF37]">*</span>
            </label>
            <select
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              {services.map((s) => (
                <option key={s.id} value={s.slug} className="bg-[#13151D]">
                  {s.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Event Date <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Event Venue / City <span className="text-[#D4AF37]">*</span>
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                required
                value={eventLocation}
                onChange={(e) => setEventLocation(e.target.value)}
                placeholder="Gaindatola, Rajnandgaon, etc."
                className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Package & Estimated Budget */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Choose Package <span className="text-slate-500">(Optional)</span>
            </label>
            <select
              value={packageId}
              onChange={(e) => setPackageId(e.target.value)}
              className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37] transition-colors"
            >
              <option value="" className="bg-[#13151D]">
                -- Select package or leave for custom quote --
              </option>
              {packages.map((pkg) => (
                <option key={pkg.id} value={pkg.id} className="bg-[#13151D]">
                  {pkg.name} ({pkg.price})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Estimated Budget <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="text"
              value={estimatedBudget}
              onChange={(e) => setEstimatedBudget(e.target.value)}
              placeholder="e.g. ₹25,000 - ₹50,000"
              className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Additional Requirements / Reference Link */}
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Additional Requirements or Shot Preferences
            </label>
            <textarea
              rows={3}
              value={additionalRequirements}
              onChange={(e) => setAdditionalRequirements(e.target.value)}
              placeholder="e.g. Need 4K drone coverage for the baraat, traditional mandap photos, and 1 acrylic family photobook."
              className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 mb-1.5">
              Reference Pinterest / Drive Link <span className="text-slate-500">(Optional)</span>
            </label>
            <input
              type="url"
              value={referenceUrl}
              onChange={(e) => setReferenceUrl(e.target.value)}
              placeholder="https://drive.google.com/..."
              className="w-full bg-[#13151D] border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#D4AF37] transition-colors"
            />
          </div>
        </div>

        {/* Submission Button */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#D4AF37]/25 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isSubmitting ? (
              <span>Saving Enquiry...</span>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>Submit Booking Enquiry & Continue to WhatsApp</span>
              </>
            )}
          </button>
          <p className="text-[11px] text-slate-500 text-center mt-2.5 font-mono">
            *No payment required upfront to inquire. We respond within 2-4 hours.
          </p>
        </div>
      </form>
    </div>
  );
};
