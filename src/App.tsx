import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { ThreeCameraHero } from './components/ThreeCameraHero.tsx';
import { ProofStrip } from './components/ProofStrip.tsx';
import { ServicesSection } from './components/ServicesSection.tsx';
import { PortfolioGallery } from './components/PortfolioGallery.tsx';
import { PackagesSection } from './components/PackagesSection.tsx';
import { AboutSection } from './components/AboutSection.tsx';
import { TestimonialsSection } from './components/TestimonialsSection.tsx';
import { BlogSection } from './components/BlogSection.tsx';
import { ContactSection } from './components/ContactSection.tsx';
import { Footer } from './components/Footer.tsx';
import { FloatingWhatsApp } from './components/FloatingWhatsApp.tsx';
import { BookingPortal } from './components/BookingPortal.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import {
  ServiceItem,
  PortfolioItem,
  PricingPackage,
  Testimonial,
  BlogPost,
  WebsiteSettings,
} from './types/index.ts';

// Default fallback settings in case initial fetch is in flight
const defaultSettings: WebsiteSettings = {
  studioName: 'CAPTURE STUDIO',
  tagline: 'Turning Your Precious Moments Into Timeless Memories.',
  address: 'In Front of Police Station, Gaindatola',
  primaryPhone: '+91 9131537800',
  secondaryPhone: '+91 9993522453',
  whatsappNumber: '919131537800',
  email: 'capturestudiogaindatola@gmail.com',
  businessHours: 'Monday – Sunday: 9:00 AM – 9:00 PM',
  googleMapsEmbedUrl:
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14878.502984180416!2d80.8!3d21.15!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a29486c9d749451%3A0xb3280c25cf62a93!2sGaindatola%2C%20Chhattisgarh!5e0!3m2!1sen!2sin!4v1700000000000',
  stats: {
    weddingsCaptured: 450,
    happyClients: 1250,
    eventsCovered: 780,
    yearsExperience: 12,
  },
  advancePaymentEnabled: true,
  advanceAmount: 2000,
  razorpayKeyId: 'rzp_test_CaptureStudioKey',
};

export default function App() {
  const [settings, setSettings] = useState<WebsiteSettings>(defaultSettings);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Navigation & Modals
  const [activeSection, setActiveSection] = useState('home');
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<ServiceItem | null>(null);
  const [selectedPackageForBooking, setSelectedPackageForBooking] = useState<PricingPackage | null>(null);

  // Load all public studio data
  const fetchAllData = async () => {
    try {
      const [setRes, srvRes, portRes, pkgRes, testRes, blogRes] = await Promise.all([
        fetch('/api/settings'),
        fetch('/api/services'),
        fetch('/api/portfolio'),
        fetch('/api/packages'),
        fetch('/api/testimonials'),
        fetch('/api/blog'),
      ]);

      if (setRes.ok) setSettings(await setRes.json());
      if (srvRes.ok) setServices(await srvRes.json());
      if (portRes.ok) setPortfolio(await portRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (testRes.ok) setTestimonials(await testRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
    } catch (err) {
      console.error('Error fetching studio data, using defaults:', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    } else if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleOpenBookingWithService = (service: ServiceItem) => {
    setSelectedServiceForBooking(service);
    setSelectedPackageForBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingWithPackage = (pkg: PricingPackage) => {
    setSelectedPackageForBooking(pkg);
    setSelectedServiceForBooking(null);
    setIsBookingModalOpen(true);
  };

  const handleOpenBookingStyle = (item: PortfolioItem) => {
    const matched = services.find((s) => s.category === item.category);
    if (matched) {
      setSelectedServiceForBooking(matched);
    }
    setSelectedPackageForBooking(null);
    setIsBookingModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#08090C] text-slate-100 flex flex-col font-sans selection:bg-[#D4AF37]/30 selection:text-[#E5C05B]">
      {/* 1. Premium 3-Zone Navigation Bar */}
      <Navbar
        activeSection={activeSection}
        onNavigate={handleNavigate}
        onOpenBooking={() => {
          setSelectedServiceForBooking(null);
          setSelectedPackageForBooking(null);
          setIsBookingModalOpen(true);
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        primaryPhone={settings.primaryPhone}
      />

      {/* 2. Cinematic 3D Hero Section (Three.js Lens & Aperture) */}
      <ThreeCameraHero
        onBookClick={() => {
          setSelectedServiceForBooking(null);
          setSelectedPackageForBooking(null);
          setIsBookingModalOpen(true);
        }}
        onExplorePortfolio={() => handleNavigate('portfolio')}
      />

      {/* 3. Verified Studio Statistics Strip */}
      <ProofStrip stats={settings.stats} />

      {/* 4. Complete Photography & Printing Services Catalog (16 Offerings) */}
      <ServicesSection
        services={services}
        onBookService={handleOpenBookingWithService}
      />

      {/* 5. Portfolio Masonry Gallery with Darkroom EXIF Lightbox */}
      <PortfolioGallery
        items={portfolio}
        onBookStyle={handleOpenBookingStyle}
      />

      {/* 6. Pricing Packages & Custom Quotes */}
      <PackagesSection
        packages={packages}
        onSelectPackage={handleOpenBookingWithPackage}
        onCustomQuote={() => {
          setSelectedServiceForBooking(null);
          setSelectedPackageForBooking(null);
          setIsBookingModalOpen(true);
        }}
      />

      {/* 7. About Studio, Creative Philosophy & Equipment */}
      <AboutSection
        settings={settings}
        onExplorePortfolio={() => handleNavigate('portfolio')}
      />

      {/* 8. Genuine Customer Testimonials */}
      <TestimonialsSection testimonials={testimonials} />

      {/* 9. Photography Journal & Tips Articles */}
      <BlogSection posts={blogPosts} />

      {/* 10. Contact Section with Gaindatola Studio Map */}
      <ContactSection settings={settings} />

      {/* 11. Luxury Footer */}
      <Footer
        settings={settings}
        onNavigate={handleNavigate}
        onOpenBooking={() => setIsBookingModalOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
      />

      {/* 12. Floating WhatsApp Consultation Button */}
      <FloatingWhatsApp whatsappNumber={settings.whatsappNumber} />

      {/* 13. Booking Enquiry Modal */}
      {isBookingModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-6 animate-fadeIn">
          <BookingPortal
            services={services}
            packages={packages}
            settings={settings}
            selectedService={selectedServiceForBooking}
            selectedPackage={selectedPackageForBooking}
            onClose={() => setIsBookingModalOpen(false)}
            isModal={true}
          />
        </div>
      )}

      {/* 14. Full-Featured Admin Dashboard Control Center */}
      {isAdminOpen && (
        <AdminDashboard
          onClose={() => setIsAdminOpen(false)}
          onDataUpdated={fetchAllData}
          initialSettings={settings}
        />
      )}
    </div>
  );
}
