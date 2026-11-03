# CAPTURE STUDIO – Premium 3D Cinematic Photography Website

> **"Turning Your Precious Moments Into Timeless Memories."**

A modern, full-stack, luxury photography and cinematography studio website and operational booking platform created for **CAPTURE STUDIO** (Gaindatola).

---

## 📸 Business Overview

- **Studio Name**: CAPTURE STUDIO
- **Location**: In Front of Police Station, Gaindatola, Chhattisgarh, India
- **Contact Numbers**: `+91 9131537800` | `+91 9993522453`
- **Primary Offerings**:
  1. Wedding & Pre-Wedding Photography & Cinematography
  2. Candid & Traditional Event Coverage (Haldi, Mehendi, Sangeet, Birthdays)
  3. Baby Milestone & Portrait Studio Shoots
  4. Handcrafted Flush-Mount Acrylic Photo Albums
  5. Photo Framing & Fine Art Prints
  6. Sublimated Personalized Gifts (Mugs, T-Shirts, Keyrings, Plaques)
  7. Commercial Flex, Star Banner & ID/Visiting Card Designing

---

## ✨ Key Features

### 1. Interactive 3D Camera Hero (Three.js)
- Procedural multi-part 50mm f/1.2 cinema camera lens with metallic casing, knurled focus grips, and realistic optical glass reflections.
- Real-time **iris aperture blades rotation** (from f/1.2 wide-open bokeh to f/16 pinpoint sharpness).
- **Exploded optical view** showing inner glass elements.
- Smooth mouse parallax and orientation tracking.
- Collapsible bottom control dock with finish presets (Obsidian Matte, Champagne Gold, Titanium).

### 2. Comprehensive 16-Service Catalog
- All 16 studio offerings with pricing badges, deliverables checklists, and dedicated detail inspection modals.
- Filter categories: Weddings & Cinema, Events & Studio, Printing & Albums, Graphic & Commercial.

### 3. Visual Archive & Darkroom EXIF Lightbox
- 10 portfolio categories: Wedding, Pre-Wedding, Candid, Haldi, Mehendi, Engagement, Couple, Baby Shoot, Birthday, Portraits.
- Fullscreen darkroom lightbox displaying shoot camera parameters: Camera model, lens, focal length, aperture, shutter speed, ISO, and venue.
- Direct "Inquire About This Style" quick booking handoff.

### 4. Direct Booking Engine & Automated WhatsApp Handoff
- Form validation for customer name, mobile, WhatsApp, service selection, event date, venue, package choice, and notes.
- Generates a unique tracking reference (e.g. `CS-948123`).
- Instant 1-click **WhatsApp handoff** pre-filled with client event details sent to `+91 9131537800`.
- Clear client disclosure that booking inquiries require studio approval before date reservation.

### 5. Secure Admin Command Center (`/admin`)
- Protected login (`admin` / `capture2026!`).
- **Overview Dashboard**: Inquiry statistics, new, pending, and approved counts.
- **Bookings Kanban**: Status updates (`new`, `pending`, `approved`, `completed`, `cancelled`) with internal staff notes.
- **Portfolio Manager**: Add and categorize photographs with EXIF data.
- **Service & Package Editor**: Modify starting prices, package deliverables, and active toggles.
- **Website Settings**: Update studio phone numbers, address, WhatsApp number, and counters.
- **Supabase SQL Exporter**: 1-click copy of the production PostgreSQL schema.

### 6. Payment Integration (Razorpay Test Mode)
- Optional booking advance payment deposit toggle in Admin Settings.
- Server-side order generation and status tracking.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS v4, Motion, Lucide Icons
- **3D Graphics**: Three.js (r183+) with procedural geometries & RoomEnvironment reflections
- **Backend**: Express REST API running on Port 3000
- **Database**:
  - Embedded JSON document store (`data/studio_store.json`) for instant out-of-the-box operation.
  - Complete PostgreSQL schema with RLS policies (`supabase/schema.sql`) for Supabase deployment.
- **SEO**: Schema.org `PhotographyBusiness` & `LocalBusiness` JSON-LD structured data.

---

## 🚀 Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Run full-stack dev server (starts Express & Vite on Port 3000)
npm run dev

# 3. Build for production
npm run build

# 4. Run production server
npm start
```

---

## ☁️ Deployment Instructions

### Deploying to Supabase (Database & Auth)
1. Log in to [Supabase](https://supabase.com) and create a new project.
2. Navigate to the **SQL Editor**.
3. Open `supabase/schema.sql` in this project, copy all lines, and click **Run**.
4. All 12 tables (`profiles`, `services`, `portfolio_images`, `packages`, `bookings`, `booking_notes`, `enquiries`, `testimonials`, `blog_posts`, `payments`, `website_settings`), indexes, and RLS policies will be instantly created.

### Deploying to Vercel / Cloud Run
1. Connect your GitHub repository to Vercel or Google Cloud Run.
2. Build command: `npm run build`
3. Start command: `npm start`
4. Set environment variables from `.env.example`.
