import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import {
  initialSettings,
  initialServices,
  initialPortfolio,
  initialPackages,
  initialTestimonials,
  initialBlogPosts,
  initialBookings,
  initialEnquiries,
} from './server/seedData.ts';
import {
  WebsiteSettings,
  ServiceItem,
  PortfolioItem,
  PricingPackage,
  Testimonial,
  BlogPost,
  BookingEnquiry,
  ContactEnquiry,
  PaymentRecord,
} from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'studio_store.json');

interface StudioStore {
  settings: WebsiteSettings;
  services: ServiceItem[];
  portfolio: PortfolioItem[];
  packages: PricingPackage[];
  testimonials: Testimonial[];
  blogPosts: BlogPost[];
  bookings: BookingEnquiry[];
  enquiries: ContactEnquiry[];
  payments: PaymentRecord[];
}

// Ensure data directory and file exist with initial data
function getStore(): StudioStore {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DATA_FILE)) {
    const defaultData: StudioStore = {
      settings: initialSettings,
      services: initialServices,
      portfolio: initialPortfolio,
      packages: initialPackages,
      testimonials: initialTestimonials,
      blogPosts: initialBlogPosts,
      bookings: initialBookings,
      enquiries: initialEnquiries,
      payments: [],
    };
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultData, null, 2), 'utf-8');
    return defaultData;
  }

  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading studio data store, using fallback', err);
    return {
      settings: initialSettings,
      services: initialServices,
      portfolio: initialPortfolio,
      packages: initialPackages,
      testimonials: initialTestimonials,
      blogPosts: initialBlogPosts,
      bookings: initialBookings,
      enquiries: initialEnquiries,
      payments: [],
    };
  }
}

function saveStore(data: StudioStore): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save studio store:', err);
  }
}

// Generate unique enquiry ID
function generateEnquiryId(): string {
  const num = Math.floor(100000 + Math.random() * 900000);
  return `CS-${num}`;
}

// Simple admin token authentication
const ADMIN_TOKEN = 'capture_studio_admin_session_token_2026';
function isAdminAuthenticated(req: Request): boolean {
  const authHeader = req.headers.authorization;
  if (!authHeader) return false;
  const token = authHeader.replace(/^Bearer\s+/i, '');
  return token === ADMIN_TOKEN;
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================================================
  // API ROUTES
  // ============================================================================

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', studio: 'CAPTURE STUDIO', timestamp: new Date().toISOString() });
  });

  // 1. Settings
  app.get('/api/settings', (_req: Request, res: Response) => {
    const store = getStore();
    res.json(store.settings);
  });

  app.put('/api/settings', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.settings = { ...store.settings, ...req.body };
    saveStore(store);
    res.json({ success: true, settings: store.settings });
  });

  // 2. Services
  app.get('/api/services', (_req: Request, res: Response) => {
    const store = getStore();
    res.json(store.services);
  });

  app.post('/api/services', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const newService: ServiceItem = {
      id: `srv-${Date.now()}`,
      slug: req.body.slug || `service-${Date.now()}`,
      title: req.body.title || 'New Photography Service',
      category: req.body.category || 'wedding',
      shortDescription: req.body.shortDescription || '',
      fullDescription: req.body.fullDescription || '',
      heroImage: req.body.heroImage || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      startingPrice: req.body.startingPrice || '₹10,000',
      features: req.body.features || [],
      deliverables: req.body.deliverables || [],
      active: req.body.active !== undefined ? req.body.active : true,
      order: store.services.length + 1,
    };
    store.services.push(newService);
    saveStore(store);
    res.status(201).json(newService);
  });

  app.put('/api/services/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const index = store.services.findIndex((s) => s.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Service not found' });
      return;
    }
    store.services[index] = { ...store.services[index], ...req.body };
    saveStore(store);
    res.json(store.services[index]);
  });

  app.delete('/api/services/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.services = store.services.filter((s) => s.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 3. Portfolio
  app.get('/api/portfolio', (req: Request, res: Response) => {
    const store = getStore();
    const category = req.query.category as string;
    if (category && category !== 'all') {
      const filtered = store.portfolio.filter((p) => p.category === category);
      res.json(filtered);
      return;
    }
    res.json(store.portfolio);
  });

  app.post('/api/portfolio', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const newItem: PortfolioItem = {
      id: `p-${Date.now()}`,
      title: req.body.title || 'Untitled Capture',
      category: req.body.category || 'wedding',
      imageUrl: req.body.imageUrl,
      aspectRatio: req.body.aspectRatio || 'landscape',
      featured: Boolean(req.body.featured),
      eventDate: req.body.eventDate || new Date().toISOString().split('T')[0],
      clientNames: req.body.clientNames || '',
      exif: req.body.exif || {
        camera: 'Sony Alpha 7 IV',
        lens: 'FE 85mm F1.4 GM',
        focalLength: '85mm',
        aperture: 'f/1.8',
        shutterSpeed: '1/400s',
        iso: '200',
        location: 'Gaindatola',
      },
      order: store.portfolio.length + 1,
    };
    store.portfolio.unshift(newItem);
    saveStore(store);
    res.status(201).json(newItem);
  });

  app.put('/api/portfolio/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const index = store.portfolio.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Portfolio item not found' });
      return;
    }
    store.portfolio[index] = { ...store.portfolio[index], ...req.body };
    saveStore(store);
    res.json(store.portfolio[index]);
  });

  app.delete('/api/portfolio/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.portfolio = store.portfolio.filter((p) => p.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 4. Packages
  app.get('/api/packages', (_req: Request, res: Response) => {
    const store = getStore();
    res.json(store.packages);
  });

  app.put('/api/packages/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const index = store.packages.findIndex((p) => p.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Package not found' });
      return;
    }
    store.packages[index] = { ...store.packages[index], ...req.body };
    saveStore(store);
    res.json(store.packages[index]);
  });

  // 5. Bookings
  app.get('/api/bookings', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    res.json(store.bookings);
  });

  app.post('/api/bookings', (req: Request, res: Response) => {
    const store = getStore();
    const {
      customerName,
      mobile,
      whatsapp,
      email,
      serviceId,
      serviceTitle,
      eventDate,
      eventLocation,
      eventType,
      packageId,
      packageName,
      estimatedBudget,
      additionalRequirements,
      referenceImageUrls,
    } = req.body;

    if (!customerName || !mobile || !serviceTitle || !eventDate || !eventLocation) {
      res.status(400).json({ error: 'Missing required booking information' });
      return;
    }

    const enquiryNumber = generateEnquiryId();
    const newBooking: BookingEnquiry = {
      id: `bkg-${Date.now()}`,
      enquiryNumber,
      customerName,
      mobile,
      whatsapp: whatsapp || mobile,
      email: email || '',
      serviceId: serviceId || 'custom',
      serviceTitle,
      eventDate,
      eventLocation,
      eventType: eventType || 'Special Event',
      packageId,
      packageName,
      estimatedBudget,
      additionalRequirements,
      referenceImageUrls: referenceImageUrls || [],
      status: 'new',
      internalNotes: [
        {
          id: `note-${Date.now()}`,
          text: 'Booking enquiry submitted through Capture Studio website.',
          createdAt: new Date().toISOString(),
          author: 'System',
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      whatsappSent: false,
    };

    store.bookings.unshift(newBooking);
    saveStore(store);

    // Build tailored WhatsApp message string
    const studioPhone = store.settings.whatsappNumber || '919131537800';
    const waText = `Hello Capture Studio!%0A%0AI want to enquire about photography services.%0A*Enquiry ID:* ${enquiryNumber}%0A*Name:* ${encodeURIComponent(customerName)}%0A*Service:* ${encodeURIComponent(serviceTitle)}%0A*Event Date:* ${eventDate}%0A*Location:* ${encodeURIComponent(eventLocation)}%0A${packageName ? `*Package:* ${encodeURIComponent(packageName)}%0A` : ''}${estimatedBudget ? `*Budget:* ${encodeURIComponent(estimatedBudget)}%0A` : ''}%0APlease share your availability and package details!`;
    const whatsappUrl = `https://wa.me/${studioPhone}?text=${waText}`;

    res.status(201).json({
      success: true,
      booking: newBooking,
      enquiryNumber,
      whatsappUrl,
      message: 'Booking enquiry received successfully. Our studio team will review your dates!',
    });
  });

  app.patch('/api/bookings/:id/status', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { status } = req.body;
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    booking.status = status;
    booking.updatedAt = new Date().toISOString();
    saveStore(store);
    res.json({ success: true, booking });
  });

  app.post('/api/bookings/:id/notes', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const { text, author } = req.body;
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === req.params.id);
    if (!booking) {
      res.status(404).json({ error: 'Booking not found' });
      return;
    }
    if (!booking.internalNotes) booking.internalNotes = [];
    booking.internalNotes.push({
      id: `n-${Date.now()}`,
      text,
      createdAt: new Date().toISOString(),
      author: author || 'Admin',
    });
    booking.updatedAt = new Date().toISOString();
    saveStore(store);
    res.json({ success: true, notes: booking.internalNotes });
  });

  app.delete('/api/bookings/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.bookings = store.bookings.filter((b) => b.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 6. Contact Enquiries
  app.get('/api/enquiries', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    res.json(store.enquiries);
  });

  app.post('/api/enquiries', (req: Request, res: Response) => {
    const store = getStore();
    const { name, phone, email, serviceInterest, message } = req.body;
    if (!name || !phone) {
      res.status(400).json({ error: 'Name and phone are required' });
      return;
    }
    const newEnquiry: ContactEnquiry = {
      id: `enq-${Date.now()}`,
      name,
      phone,
      email: email || '',
      serviceInterest: serviceInterest || 'General Enquiry',
      message: message || '',
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    store.enquiries.unshift(newEnquiry);
    saveStore(store);
    res.status(201).json({ success: true, enquiry: newEnquiry });
  });

  app.patch('/api/enquiries/:id/status', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const item = store.enquiries.find((e) => e.id === req.params.id);
    if (!item) {
      res.status(404).json({ error: 'Enquiry not found' });
      return;
    }
    item.status = req.body.status;
    saveStore(store);
    res.json({ success: true, enquiry: item });
  });

  // 7. Testimonials
  app.get('/api/testimonials', (_req: Request, res: Response) => {
    const store = getStore();
    res.json(store.testimonials);
  });

  app.post('/api/testimonials', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const newTestimonial: Testimonial = {
      id: `t-${Date.now()}`,
      clientName: req.body.clientName || 'Anonymous Client',
      eventType: req.body.eventType || 'Wedding Celebration',
      eventDate: req.body.eventDate || 'Recent Event',
      rating: Number(req.body.rating) || 5,
      comment: req.body.comment || '',
      location: req.body.location || 'Gaindatola',
      active: req.body.active !== undefined ? req.body.active : true,
    };
    store.testimonials.unshift(newTestimonial);
    saveStore(store);
    res.status(201).json(newTestimonial);
  });

  app.delete('/api/testimonials/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.testimonials = store.testimonials.filter((t) => t.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 8. Blog Posts
  app.get('/api/blog', (_req: Request, res: Response) => {
    const store = getStore();
    res.json(store.blogPosts);
  });

  app.get('/api/blog/:slug', (req: Request, res: Response) => {
    const store = getStore();
    const post = store.blogPosts.find((b) => b.slug === req.params.slug);
    if (!post) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    res.json(post);
  });

  app.post('/api/blog', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const newPost: BlogPost = {
      id: `b-${Date.now()}`,
      slug: req.body.slug || `post-${Date.now()}`,
      title: req.body.title || 'New Photography Article',
      category: req.body.category || 'Wedding Photography Tips',
      readTime: req.body.readTime || '4 min read',
      excerpt: req.body.excerpt || '',
      content: req.body.content || '',
      imageUrl: req.body.imageUrl || 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
      publishedAt: new Date().toISOString().split('T')[0],
      author: req.body.author || 'Capture Studio Team',
      published: req.body.published !== undefined ? req.body.published : true,
    };
    store.blogPosts.unshift(newPost);
    saveStore(store);
    res.status(201).json(newPost);
  });

  app.put('/api/blog/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    const index = store.blogPosts.findIndex((b) => b.id === req.params.id);
    if (index === -1) {
      res.status(404).json({ error: 'Article not found' });
      return;
    }
    store.blogPosts[index] = { ...store.blogPosts[index], ...req.body };
    saveStore(store);
    res.json(store.blogPosts[index]);
  });

  app.delete('/api/blog/:id', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    store.blogPosts = store.blogPosts.filter((b) => b.id !== req.params.id);
    saveStore(store);
    res.json({ success: true });
  });

  // 9. Admin Authentication
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    // Accept standard default credentials or secure credentials
    if ((username === 'admin' && password === 'capture2026!') || (username === 'capture' && password === 'studio2026')) {
      res.json({
        success: true,
        token: ADMIN_TOKEN,
        user: {
          username: 'admin',
          name: 'Studio Manager',
          role: 'super_admin',
        },
      });
      return;
    }
    res.status(401).json({ error: 'Invalid admin credentials. Use admin / capture2026!' });
  });

  app.get('/api/admin/verify', (req: Request, res: Response) => {
    if (isAdminAuthenticated(req)) {
      res.json({ valid: true, role: 'super_admin' });
    } else {
      res.status(401).json({ valid: false });
    }
  });

  // 10. Razorpay Payment Integration (Test Mode)
  app.post('/api/payments/create-order', (req: Request, res: Response) => {
    const { bookingId, amount, customerName } = req.body;
    const store = getStore();
    const booking = store.bookings.find((b) => b.id === bookingId);
    const advanceAmount = amount || store.settings.advanceAmount || 2000;
    const orderId = `order_test_${Date.now()}`;

    const paymentRecord: PaymentRecord = {
      id: `pay-${Date.now()}`,
      bookingId: bookingId || 'direct',
      enquiryNumber: booking ? booking.enquiryNumber : `CS-${Date.now().toString().slice(-6)}`,
      customerName: customerName || (booking ? booking.customerName : 'Client'),
      amount: advanceAmount,
      currency: 'INR',
      status: 'pending',
      razorpayOrderId: orderId,
      createdAt: new Date().toISOString(),
    };

    store.payments.push(paymentRecord);
    saveStore(store);

    res.json({
      orderId,
      amount: advanceAmount * 100, // paise
      currency: 'INR',
      keyId: store.settings.razorpayKeyId || 'rzp_test_CaptureStudioKey',
      customerName: paymentRecord.customerName,
    });
  });

  app.post('/api/payments/verify', (req: Request, res: Response) => {
    const { razorpayOrderId, razorpayPaymentId } = req.body;
    const store = getStore();
    const payment = store.payments.find((p) => p.razorpayOrderId === razorpayOrderId);

    if (payment) {
      payment.status = 'captured';
      payment.razorpayPaymentId = razorpayPaymentId || `pay_test_${Date.now()}`;
      if (payment.bookingId) {
        const booking = store.bookings.find((b) => b.id === payment.bookingId);
        if (booking) {
          booking.status = 'approved';
          if (!booking.internalNotes) booking.internalNotes = [];
          booking.internalNotes.push({
            id: `n-${Date.now()}`,
            text: `Advance booking deposit of ₹${payment.amount} verified (ID: ${payment.razorpayPaymentId}).`,
            createdAt: new Date().toISOString(),
            author: 'Razorpay Gateway',
          });
        }
      }
      saveStore(store);
      res.json({ success: true, paymentId: payment.razorpayPaymentId, status: 'captured' });
      return;
    }

    res.status(404).json({ error: 'Order not found for verification' });
  });

  app.get('/api/payments', (req: Request, res: Response) => {
    if (!isAdminAuthenticated(req)) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
    const store = getStore();
    res.json(store.payments);
  });

  // 11. Supabase SQL Schema Export Endpoint
  app.get('/api/export/supabase-sql', (_req: Request, res: Response) => {
    const schemaPath = path.join(__dirname, 'supabase', 'schema.sql');
    if (fs.existsSync(schemaPath)) {
      const sqlContent = fs.readFileSync(schemaPath, 'utf-8');
      res.type('text/plain').send(sqlContent);
    } else {
      res.status(404).send('-- Supabase schema file not found');
    }
  });

  // ============================================================================
  // VITE DEV SERVER / PRODUCTION STATIC HANDLER
  // ============================================================================
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: process.env.DISABLE_HMR !== 'true' },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[CAPTURE STUDIO] Full-Stack server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting server:', err);
  process.exit(1);
});
