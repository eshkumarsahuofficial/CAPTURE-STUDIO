-- ==============================================================================
-- CAPTURE STUDIO – SUPABASE POSTGRESQL PRODUCTION DATABASE SCHEMA
-- Business: Capture Studio, In Front of Police Station, Gaindatola
-- Contacts: +91 9131537800, +91 9993522453
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES (Admin & Staff Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('super_admin', 'admin', 'staff', 'photographer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. SERVICES CATALOG (16 Distinct Photography, Printing & Design Offerings)
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_description TEXT NOT NULL,
  full_description TEXT NOT NULL,
  hero_image TEXT NOT NULL,
  starting_price TEXT NOT NULL,
  features JSONB DEFAULT '[]'::jsonb,
  deliverables JSONB DEFAULT '[]'::jsonb,
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PORTFOLIO CATEGORIES
CREATE TABLE IF NOT EXISTS portfolio_categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PORTFOLIO IMAGES (Gallery with EXIF Metadata)
CREATE TABLE IF NOT EXISTS portfolio_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  thumbnail_url TEXT,
  aspect_ratio TEXT NOT NULL DEFAULT 'landscape' CHECK (aspect_ratio IN ('landscape', 'portrait', 'square')),
  is_featured BOOLEAN NOT NULL DEFAULT false,
  event_date DATE,
  client_names TEXT,
  exif_data JSONB DEFAULT '{}'::jsonb, -- camera, lens, focalLength, aperture, shutterSpeed, iso
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. PACKAGES & PRICING
CREATE TABLE IF NOT EXISTS packages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  tagline TEXT NOT NULL,
  price TEXT NOT NULL,
  price_numeric NUMERIC NOT NULL DEFAULT 0,
  category TEXT NOT NULL,
  duration TEXT NOT NULL,
  deliverables JSONB DEFAULT '[]'::jsonb,
  highlights JSONB DEFAULT '[]'::jsonb,
  is_popular BOOLEAN NOT NULL DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. BOOKINGS (Customer Event Shoot Enquiries)
CREATE TABLE IF NOT EXISTS bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  enquiry_number TEXT UNIQUE NOT NULL, -- e.g. CS-948123
  customer_name TEXT NOT NULL,
  mobile TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  email TEXT,
  service_id TEXT NOT NULL,
  service_title TEXT NOT NULL,
  event_date DATE NOT NULL,
  event_location TEXT NOT NULL,
  event_type TEXT NOT NULL,
  package_id TEXT,
  package_name TEXT,
  estimated_budget TEXT,
  additional_requirements TEXT,
  reference_images JSONB DEFAULT '[]'::jsonb,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'pending', 'approved', 'completed', 'cancelled')),
  whatsapp_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. BOOKING NOTES (Internal studio notes for each booking)
CREATE TABLE IF NOT EXISTS booking_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  note_text TEXT NOT NULL,
  author_name TEXT NOT NULL DEFAULT 'Admin',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. ENQUIRIES (General contact form submissions)
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_interest TEXT NOT NULL,
  message TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'resolved')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. TESTIMONIALS (Customer Reviews)
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_name TEXT NOT NULL,
  event_type TEXT NOT NULL,
  event_date TEXT NOT NULL,
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT 'Gaindatola',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. BLOG POSTS (SEO Articles & Photography Advice)
CREATE TABLE IF NOT EXISTS blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  read_time TEXT NOT NULL DEFAULT '5 min read',
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  image_url TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Capture Studio Team',
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. PAYMENTS (Advance booking transactions via Razorpay)
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
  enquiry_number TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  currency TEXT NOT NULL DEFAULT 'INR',
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed')),
  razorpay_order_id TEXT,
  razorpay_payment_id TEXT,
  razorpay_signature TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. WEBSITE SETTINGS (Single row for Studio Information)
CREATE TABLE IF NOT EXISTS website_settings (
  id INT PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  studio_name TEXT NOT NULL DEFAULT 'CAPTURE STUDIO',
  tagline TEXT NOT NULL DEFAULT 'Turning Your Precious Moments Into Timeless Memories.',
  address TEXT NOT NULL DEFAULT 'In Front of Police Station, Gaindatola',
  primary_phone TEXT NOT NULL DEFAULT '+91 9131537800',
  secondary_phone TEXT NOT NULL DEFAULT '+91 9993522453',
  whatsapp_number TEXT NOT NULL DEFAULT '919131537800',
  email TEXT NOT NULL DEFAULT 'contact@capturestudio.in',
  business_hours TEXT NOT NULL DEFAULT 'Monday – Sunday: 9:00 AM – 9:00 PM',
  google_maps_url TEXT,
  stats JSONB DEFAULT '{"weddingsCaptured": 450, "happyClients": 1250, "eventsCovered": 780, "yearsExperience": 12}'::jsonb,
  advance_payment_enabled BOOLEAN NOT NULL DEFAULT true,
  advance_amount NUMERIC NOT NULL DEFAULT 2000,
  razorpay_key_id TEXT,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category);
CREATE INDEX IF NOT EXISTS idx_services_active ON services(is_active);
CREATE INDEX IF NOT EXISTS idx_portfolio_category ON portfolio_images(category);
CREATE INDEX IF NOT EXISTS idx_portfolio_featured ON portfolio_images(is_featured);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(event_date);
CREATE INDEX IF NOT EXISTS idx_bookings_number ON bookings(enquiry_number);
CREATE INDEX IF NOT EXISTS idx_blog_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_published ON blog_posts(is_published);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_settings ENABLE ROW LEVEL SECURITY;

-- Public can READ active services, portfolio, packages, testimonials, published blogs, website settings
CREATE POLICY "Public can view active services" ON services FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view portfolio images" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Public can view active packages" ON packages FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view active testimonials" ON testimonials FOR SELECT USING (is_active = true);
CREATE POLICY "Public can view published blogs" ON blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public can view website settings" ON website_settings FOR SELECT USING (true);

-- Public can INSERT bookings & contact enquiries (cannot view or read other people's bookings)
CREATE POLICY "Public can insert bookings" ON bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public can insert enquiries" ON enquiries FOR INSERT WITH CHECK (true);

-- Authenticated Admin staff can read & write all tables
CREATE POLICY "Admins full access to profiles" ON profiles FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to services" ON services FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to portfolio" ON portfolio_images FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to packages" ON packages FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to bookings" ON bookings FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to booking_notes" ON booking_notes FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to enquiries" ON enquiries FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to testimonials" ON testimonials FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to blog_posts" ON blog_posts FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to payments" ON payments FOR ALL TO authenticated USING (true);
CREATE POLICY "Admins full access to website_settings" ON website_settings FOR ALL TO authenticated USING (true);
