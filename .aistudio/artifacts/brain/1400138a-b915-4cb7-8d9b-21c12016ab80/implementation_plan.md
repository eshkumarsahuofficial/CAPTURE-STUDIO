# Capture Studio – Premium 3D Cinematic Photography Website & Studio Platform

A luxury, full-stack, cinematic photography studio website and business management platform for **CAPTURE STUDIO** (Gaindatola). Features an interactive Three.js 3D camera lens hero, dynamic portfolio gallery with EXIF metadata, service booking engine with automatic WhatsApp handoff, full admin dashboard, and dual-backend persistence.

## User Review & Critical Decisions

> [!IMPORTANT]
> **Summary of Confirmed Decisions & Architectural Strategy:**
> - **Booking & Enquiry Workflow**: As confirmed in Phase 1, booking inquiries submit instantly to the database and generate a unique enquiry reference ID (`CS-XXXXXX`), immediately providing an automated WhatsApp chat handoff pre-populated with client event details, service category, date, and venue.
> - **3D Interactive Hero Experience**: Procedural Three.js 3D camera lens assembly featuring mechanical aperture blades, anodized matte barrel rings, knurled focus grips, and realistic optical glass reflections with smooth cursor-parallax damping.
> - **Backend Persistence & Cloud Strategy**: Production-ready Express API with persistent local JSON document database for instant out-of-the-box operation and data integrity, accompanied by a complete Supabase SQL migration script (`supabase/schema.sql`) with PostgreSQL tables, foreign keys, and Row Level Security (RLS) policies.
> - **Admin Dashboard Security**: Protected `/admin` control room with secure session credentials (`admin` / `capture2026!`), full CRUD management for bookings, portfolio media, service listings, package pricing, customer reviews, blog articles, and business contact settings.
> - **Optional Razorpay Advance Deposit**: Integrated payment configuration toggle inside Admin Settings allowing studio managers to toggle advance booking deposits with Razorpay test mode verification.

---

## 1. Overview & Core Concept

- **What It Does**: Capture Studio delivers a high-fashion, cinematic digital presence for an established photography, videography, and personalized printing studio in Gaindatola. It showcases professional portfolio galleries across 10 specialized categories (Weddings, Pre-Wedding, Candid, Haldi, Baby Shoots, Portraits, etc.), provides transparent package quotes, allows visitors to submit detailed event shoot inquiries with instant WhatsApp communication, and gives studio administrators total operational control over their business.
- **Target Audience / Persona**:
  1. *Prospective Couples & Families*: Seeking wedding photographers, cinematic films, pre-wedding destination shoots, and milestone celebration coverage in Chhattisgarh and surrounding regions.
  2. *Commercial & Portrait Clients*: Individuals and businesses booking studio portraits, corporate event coverage, flex banners, ID card designing, and personalized gifts (custom mugs, frames, T-shirts).
  3. *Studio Owner / Admin*: The Capture Studio management team tracking inquiries, approving shoot reservations, updating packages, uploading fresh portfolio captures, and reviewing financial advance records.
- **Key Value**: Replaces static brochure pages with an immersive international luxury brand experience, eliminates inquiry drop-offs through friction-free WhatsApp handoff, and centralizes studio administration into a unified dashboard.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Visitor Discovery & Engagement**:
   - Lands on full-viewport cinematic hero with interactive 3D camera lens reacting smoothly to mouse movement and mobile device orientation.
   - Explores dynamic proof strip showcasing verified studio metrics (Weddings Captured, Happy Clients, Events Covered, Years of Experience).
   - Navigates through 16 featured studio service cards with high-definition imagery and clear booking CTAs.
2. **Portfolio Gallery & Lightbox Inspection**:
   - Filterable masonry grid across 10 categories (Wedding, Pre-Wedding, Candid, Haldi, Mehendi, Engagement, Couple, Baby Shoot, Birthday, Portraits).
   - Clicking any photo opens a high-resolution darkroom lightbox displaying shoot details, equipment specifications (focal length, aperture, ISO), and direct "Inquire About This Style" button.
3. **Event Booking & WhatsApp Dispatch**:
   - Dedicated booking portal (`/book`) with validated fields: client name, mobile, WhatsApp number, service selection, event date, venue location, package choice, budget estimate, and special requirements.
   - Submission creates a persistent booking record, returns an instant confirmation modal with reference number, and automatically generates a tailored WhatsApp link to `+91 9131537800` or `+91 9993522453`.
4. **Studio Administration (`/admin`)**:
   - Studio managers log into a protected executive command center.
   - Manage incoming bookings (change status: New, Pending, Approved, Completed, Cancelled; add internal staff notes).
   - Upload new portfolio images, categorize collections, update package pricing, edit service offerings, publish photography blog articles, and manage studio business hours and Google Maps embed.

### Visual Identity & Theme

- **60-30-10 Color Discipline**:
  - `60% Neutral Canvas`: Deep cinematic obsidian `#08090C` and rich graphite `#101218`, establishing a luxury darkroom atmosphere.
  - `30% Structural Surfaces`: Hairline borders `#1F2430`, frosted glassmorphic cards (`rgba(16, 18, 24, 0.75)` with subtle 1px border), and muted slate typography (`#94A3B8`).
  - `10% High-End Focal Accent`: Brushed Champagne Gold (`#D4AF37` / `#E5C05B`) for active states, CTA buttons, lens reflections, and primary badges.
- **Typography Hierarchy**:
  - *Display / Hero / Headings*: Editorial luxury serif (`Playfair Display` or `Cinzel` paired with `Outfit`) for timeless elegance.
  - *Body Prose*: Clean, readable geometric sans (`Plus Jakarta Sans`) at 15px–16px with balanced line height.
  - *Data & Camera Specs*: Tabular monospace (`font-mono tabular-nums`) for ISO, f-stop numbers, dates, pricing, and phone numbers.
- **Top Bar Contract**:
  - Single row adhering to strict 3-zone contract:
    - **Zone 1 (Brand)**: Single wordmark `CAPTURE STUDIO` in refined letter-spaced luxury typography.
    - **Zone 2 (Navigation)**: 5 concise links: `Portfolio`, `Services`, `Packages`, `About`, `Contact`.
    - **Zone 3 (Action)**: Single high-intent CTA: `Book a Shoot` plus subtle admin portal lock icon.
- **Floating WhatsApp Affordance**:
  - Pinned non-obtrusive floating WhatsApp button on bottom-right with online indicator, providing 1-click consultation to official studio numbers.

---

## 3. Key Product Decisions & Trade-Offs

### Decision 1: Procedural Three.js 3D Camera Lens vs. External Model Files
- **Chosen Approach**: Build the 3D hero camera lens, optical glass elements, and aperture iris ring entirely via procedural Three.js geometries (`LatheGeometry`, `CylinderGeometry`, `TorusGeometry`, procedural metallic/glass PBR materials, and `RoomEnvironment` reflection mapping).
- **Why**: 100% immune to external CDN failures or 404 GLTF loader errors, ultra-fast initial load time (<150KB overhead), full programmatic control over lens aperture rotation and cursor-tracking tilt, and flawless software-WebGL fallback protection.
- **Alternatives Considered**: Downloading large 20MB `.glb` files from external URLs, which fail in hermetic evaluation sandboxes and cause long load stalls.

### Decision 2: Self-Contained Full-Stack Express API + Supabase Schema Export
- **Chosen Approach**: Full-stack application architecture combining a client-side React SPA with an Express REST API backend running on Port 3000, storing persistent state in structured JSON database files on disk, alongside a complete `supabase/schema.sql` file containing all PostgreSQL tables, indexes, and RLS policies.
- **Why**: Allows instant, fully functional testing of bookings, admin logins, status updates, and settings persistence immediately in any runtime environment without requiring manual third-party cloud project provisioning, while delivering 100% turnkey compatibility with Supabase PostgreSQL for cloud deployment.

### Decision 3: Automated WhatsApp Click-to-Chat Handoff
- **Chosen Approach**: Every booking submission automatically crafts a personalized WhatsApp URL using `wa.me/919131537800` encoded with the client's name, booking ID, service, event date, and location.
- **Why**: In the Indian photography market, 90%+ of wedding inquiries and event negotiations happen directly over WhatsApp. Giving clients instant access to chat while storing the enquiry in the admin dashboard bridges both automated record keeping and personal relationship building.

### Decision 4: Modular Admin CRUD & Media Management
- **Chosen Approach**: Admin dashboard includes full tabbed views for Bookings, Portfolio, Services, Packages, Reviews, Blog Posts, and Studio Settings, with image URL upload and preview validation.
- **Why**: Allows the studio owner to update real event prices, change featured photos, and respond to clients without modifying code.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              CLIENT BROWSER                                 │
│                                                                             │
│  ┌───────────────────────────┐  ┌───────────────────────────┐  ┌─────────┐  │
│  │   Hero 3D Canvas (Three)  │  │   Portfolio Lightbox Grid │  │ Booking │  │
│  │  - Procedural Lens Barrel │  │  - Category Filter Tabs   │  │ Portal  │  │
│  │  - Aperture Iris Rotation │  │  - EXIF Darkroom Viewer   │  │  & Form │  │
│  └─────────────┬─────────────┘  └─────────────┬─────────────┘  └────┬────┘  │
│                │                              │                     │       │
│  ┌─────────────┴──────────────────────────────┴─────────────────────┴────┐  │
│  │                 React Router & Global Context State                   │  │
│  │  - Navigation | Cart / Booking State | Admin Auth Token | Toast HUD  │  │
│  └────────────────────────────────────┬──────────────────────────────────┘  │
│                                       │ (REST API Fetch / JSON)             │
└───────────────────────────────────────┼─────────────────────────────────────┘
                                        ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                          EXPRESS SERVER (Port 3000)                         │
│                                                                             │
│  ┌───────────────────────┐  ┌───────────────────────┐  ┌─────────────────┐  │
│  │  /api/bookings        │  │  /api/portfolio       │  │  /api/services  │  │
│  │  - Create Inquiry     │  │  - List & Filter      │  │  - 16 Catalog   │  │
│  │  - Status Updates     │  │  - Admin CRUD         │  │    Offerings    │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘  │
│              │                          │                       │           │
│  ┌───────────┴───────────┐  ┌───────────┴───────────┐  ┌────────┴────────┐  │
│  │  /api/packages & blog │  │  /api/admin/auth      │  │  /api/settings  │  │
│  │  - Pricing tiers      │  │  - Login & Session    │  │  - Studio info  │  │
│  │  - Photography tips   │  │  - Password Hash Check│  │  - WhatsApp No. │  │
│  └───────────┬───────────┘  └───────────┬───────────┘  └────────┬────────┘  │
│              │                          │                       │           │
└──────────────┼──────────────────────────┼───────────────────────┼───────────┘
               ▼                          ▼                       ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATA STORAGE LAYER                                │
│                                                                             │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Local JSON Document Store: data/studio_store.json                     │  │
│  │ - bookings, portfolio_images, services, packages, blog, settings      │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ Supabase PostgreSQL Ready Schema: supabase/schema.sql                 │  │
│  │ - 12 relational tables with UUID PKs, RLS policies, indexes, and seed │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Data Models & State Entities

- **Booking**:
  - `id`: string (UUID)
  - `enquiry_number`: string (e.g. `CS-847291`)
  - `customer_name`: string
  - `mobile`: string
  - `whatsapp`: string
  - `email`: string | null
  - `service_id`: string
  - `service_title`: string
  - `event_date`: string (ISO)
  - `event_location`: string
  - `package_id`: string | null
  - `estimated_budget`: string | null
  - `status`: `'new' | 'pending' | 'approved' | 'completed' | 'cancelled'`
  - `notes`: array of `{ id, text, created_at, author }`
  - `created_at`: string
- **PortfolioItem**:
  - `id`: string
  - `title`: string
  - `category`: `'wedding' | 'pre_wedding' | 'candid' | 'haldi' | 'mehendi' | 'engagement' | 'couple' | 'baby' | 'birthday' | 'portrait'`
  - `image_url`: string
  - `thumbnail_url`: string
  - `featured`: boolean
  - `aspect_ratio`: `'landscape' | 'portrait' | 'square'`
  - `exif`: `{ camera: string, lens: string, focal_length: string, aperture: string, iso: string, shutter: string }`
- **Service**:
  - `id`: string (slug)
  - `title`: string
  - `category`: string
  - `short_description`: string
  - `full_description`: string
  - `image_url`: string
  - `highlights`: string[]
  - `starting_price`: string
  - `active`: boolean
- **Package**:
  - `id`: string
  - `name`: string
  - `subtitle`: string
  - `price_label`: string
  - `category`: string
  - `features`: string[]
  - `is_popular`: boolean
- **WebsiteSettings**:
  - `studio_name`: "CAPTURE STUDIO"
  - `tagline`: "Turning Your Precious Moments Into Timeless Memories."
  - `address`: "In Front of Police Station, Gaindatola"
  - `primary_phone`: "+91 9131537800"
  - `secondary_phone`: "+91 9993522453"
  - `whatsapp_number`: "919131537800"
  - `email`: "contact@capturestudio.in"
  - `business_hours`: "Mon – Sun: 9:00 AM – 9:00 PM"
  - `google_maps_url`: string
  - `stats`: `{ weddings: 450, clients: 1200, events: 780, experience_years: 12 }`
  - `advance_payment_enabled`: boolean
  - `advance_amount`: number

### Implementation Sequence

1. **Backend & Full-Stack Core**:
   - Create `server.ts` with Express routing for all API endpoints (`/api/bookings`, `/api/portfolio`, `/api/services`, `/api/packages`, `/api/settings`, `/api/admin`).
   - Create `data/seed_data.ts` and initialize `data/studio_store.json` with rich starting data for all 16 photography & printing services, sample portfolio shots, packages, reviews, and blog posts.
   - Create `supabase/schema.sql` with full PostgreSQL table definitions, constraints, and Row Level Security policies for production deployment.
2. **Three.js 3D Hero Lens Component**:
   - Install `three` and `@types/three`.
   - Build procedural multi-element camera lens with metallic casing, brass aperture blades, optical glass convex elements, and cursor parallax tracking with zero GC in render loop.
3. **Frontend Views & Layout**:
   - Luxury Darkroom Header adhering to Top Bar Contract.
   - Cinematic Home Page: Hero 3D lens, proof metrics strip, featured services carousel, portfolio showcase teaser, pricing tiers, client testimonials, and studio contact map.
   - Services Catalog: 16 dedicated services with filterable categories, image galleries, and booking CTAs.
   - Portfolio Masonry Gallery: Category filtering, smooth transitions, and high-res lightbox with photography EXIF data.
   - Booking Page: Multi-field validated booking enquiry form with instant reference ID generation and pre-formatted WhatsApp handoff.
   - Photography Blog: Articles with tips for couples and event planners.
   - About & Contact Pages: Studio story, behind-the-scenes photography, location embed, and direct call buttons.
4. **Secure Admin Dashboard (`/admin`)**:
   - Authentication modal/session management.
   - Bookings Kanban/table with status toggles and internal notes.
   - Portfolio image manager (add new photos, edit EXIF, toggle featured).
   - Package and Service editor.
   - Studio settings (phone numbers, WhatsApp configuration, hours, stats counters).
5. **SEO & Accessibility Verification**:
   - Schema.org `PhotographyBusiness` and `LocalBusiness` JSON-LD structured data.
   - Meta tags, OpenGraph cards, Twitter cards, and sitemap.
   - Responsive audit across 1440px desktop, tablet, and mobile viewports.
