export type ServiceCategory = 
  | 'wedding'
  | 'cinematography'
  | 'pre_wedding'
  | 'candid'
  | 'traditional'
  | 'portrait'
  | 'events'
  | 'printing_gifts'
  | 'commercial';

export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  category: ServiceCategory;
  shortDescription: string;
  fullDescription: string;
  heroImage: string;
  startingPrice: string;
  features: string[];
  deliverables: string[];
  active: boolean;
  order: number;
}

export type PortfolioCategory =
  | 'all'
  | 'wedding'
  | 'pre_wedding'
  | 'candid'
  | 'haldi'
  | 'mehendi'
  | 'engagement'
  | 'couple'
  | 'baby'
  | 'birthday'
  | 'events'
  | 'portrait';

export interface ExifData {
  camera: string;
  lens: string;
  focalLength: string;
  aperture: string;
  shutterSpeed: string;
  iso: string;
  location?: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  imageUrl: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
  featured: boolean;
  eventDate?: string;
  clientNames?: string;
  exif: ExifData;
  order: number;
}

export interface PricingPackage {
  id: string;
  name: string;
  tagline: string;
  price: string;
  priceNumeric: number;
  category: string;
  duration: string;
  deliverables: string[];
  highlights: string[];
  isPopular?: boolean;
  active: boolean;
}

export type BookingStatus = 'new' | 'pending' | 'approved' | 'completed' | 'cancelled';

export interface BookingNote {
  id: string;
  text: string;
  createdAt: string;
  author: string;
}

export interface BookingEnquiry {
  id: string;
  enquiryNumber: string; // e.g. CS-948123
  customerName: string;
  mobile: string;
  whatsapp: string;
  email?: string;
  serviceId: string;
  serviceTitle: string;
  eventDate: string;
  eventLocation: string;
  eventType: string;
  packageId?: string;
  packageName?: string;
  estimatedBudget?: string;
  additionalRequirements?: string;
  referenceImageUrls?: string[];
  status: BookingStatus;
  internalNotes?: BookingNote[];
  createdAt: string;
  updatedAt: string;
  whatsappSent?: boolean;
}

export interface ContactEnquiry {
  id: string;
  name: string;
  phone: string;
  email?: string;
  serviceInterest: string;
  message: string;
  status: 'new' | 'contacted' | 'resolved';
  createdAt: string;
}

export interface Testimonial {
  id: string;
  clientName: string;
  eventType: string;
  eventDate: string;
  rating: number;
  comment: string;
  location: string;
  active: boolean;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string;
  imageUrl: string;
  publishedAt: string;
  author: string;
  published: boolean;
}

export interface WebsiteSettings {
  studioName: string;
  tagline: string;
  address: string;
  primaryPhone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  businessHours: string;
  googleMapsEmbedUrl: string;
  stats: {
    weddingsCaptured: number;
    happyClients: number;
    eventsCovered: number;
    yearsExperience: number;
  };
  advancePaymentEnabled: boolean;
  advanceAmount: number;
  razorpayKeyId?: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  enquiryNumber: string;
  customerName: string;
  amount: number;
  currency: string;
  status: 'pending' | 'captured' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
}
