import React, { useState, useEffect } from 'react';
import {
  Lock,
  LogOut,
  Calendar,
  Image as ImageIcon,
  Layers,
  Settings,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Search,
  Plus,
  Trash2,
  CheckCircle,
  Clock,
  Database,
  Download,
  Copy,
  Check,
  Star,
  FileText,
  X,
  Phone,
  Send,
  ExternalLink,
} from 'lucide-react';
import {
  BookingEnquiry,
  PortfolioItem,
  ServiceItem,
  PricingPackage,
  ContactEnquiry,
  Testimonial,
  BlogPost,
  WebsiteSettings,
  PaymentRecord,
  BookingStatus,
} from '../types/index.ts';

interface AdminDashboardProps {
  onClose: () => void;
  onDataUpdated: () => void;
  initialSettings: WebsiteSettings;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onClose,
  onDataUpdated,
  initialSettings,
}) => {
  // Authentication State
  const [authToken, setAuthToken] = useState<string | null>(
    localStorage.getItem('capture_admin_token')
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('capture2026!');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Tab
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'bookings'
    | 'portfolio'
    | 'services'
    | 'packages'
    | 'enquiries'
    | 'testimonials'
    | 'blog'
    | 'payments'
    | 'settings'
    | 'supabase'
  >('overview');

  // Data States
  const [bookings, setBookings] = useState<BookingEnquiry[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [packages, setPackages] = useState<PricingPackage[]>([]);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings>(initialSettings);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [supabaseSql, setSupabaseSql] = useState<string>('');
  const [copiedSql, setCopiedSql] = useState(false);

  // Filters & Selected State
  const [bookingSearch, setBookingSearch] = useState('');
  const [bookingStatusFilter, setBookingStatusFilter] = useState<string>('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingEnquiry | null>(null);
  const [newNoteText, setNewNoteText] = useState('');

  // Modals for creating new items
  const [showAddPhotoModal, setShowAddPhotoModal] = useState(false);
  const [newPhoto, setNewPhoto] = useState({
    title: '',
    category: 'wedding',
    imageUrl: '',
    aspectRatio: 'landscape' as 'landscape' | 'portrait' | 'square',
    featured: false,
    camera: 'Sony Alpha 7 IV',
    lens: 'FE 85mm F1.4 GM',
    aperture: 'f/1.8',
    shutter: '1/400s',
    iso: '200',
    location: 'Gaindatola',
  });

  const [showAddBlogModal, setShowAddBlogModal] = useState(false);
  const [newBlogPost, setNewBlogPost] = useState({
    title: '',
    category: 'Wedding Photography Tips',
    readTime: '4 min read',
    excerpt: '',
    content: '',
    imageUrl: '',
  });

  const [showAddReviewModal, setShowAddReviewModal] = useState(false);
  const [newReview, setNewReview] = useState({
    clientName: '',
    eventType: 'Wedding Celebration',
    eventDate: 'February 2026',
    rating: 5,
    comment: '',
    location: 'Gaindatola',
  });

  // Load all data when authenticated
  useEffect(() => {
    if (authToken) {
      loadAllData();
    }
  }, [authToken]);

  const loadAllData = async () => {
    const headers = { Authorization: `Bearer ${authToken}` };
    try {
      const [
        bkgRes,
        portRes,
        srvRes,
        pkgRes,
        enqRes,
        testRes,
        blogRes,
        setRes,
        payRes,
        sqlRes,
      ] = await Promise.all([
        fetch('/api/bookings', { headers }),
        fetch('/api/portfolio'),
        fetch('/api/services'),
        fetch('/api/packages'),
        fetch('/api/enquiries', { headers }),
        fetch('/api/testimonials'),
        fetch('/api/blog'),
        fetch('/api/settings'),
        fetch('/api/payments', { headers }),
        fetch('/api/export/supabase-sql'),
      ]);

      if (bkgRes.ok) setBookings(await bkgRes.json());
      if (portRes.ok) setPortfolio(await portRes.json());
      if (srvRes.ok) setServices(await srvRes.json());
      if (pkgRes.ok) setPackages(await pkgRes.json());
      if (enqRes.ok) setEnquiries(await enqRes.json());
      if (testRes.ok) setTestimonials(await testRes.json());
      if (blogRes.ok) setBlogPosts(await blogRes.json());
      if (setRes.ok) setSettings(await setRes.json());
      if (payRes.ok) setPayments(await payRes.json());
      if (sqlRes.ok) setSupabaseSql(await sqlRes.text());
    } catch (err) {
      console.error('Failed to load admin data:', err);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid credentials');
      }
      setAuthToken(data.token);
      localStorage.setItem('capture_admin_token', data.token);
    } catch (err: any) {
      setLoginError(err.message || 'Login failed');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    setAuthToken(null);
    localStorage.removeItem('capture_admin_token');
  };

  // Booking actions
  const handleUpdateBookingStatus = async (id: string, status: BookingStatus) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status, updatedAt: new Date().toISOString() } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, status } : null));
        }
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleAddBookingNote = async (id: string) => {
    if (!newNoteText.trim()) return;
    try {
      const res = await fetch(`/api/bookings/${id}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ text: newNoteText, author: 'Studio Manager' }),
      });
      if (res.ok) {
        const data = await res.json();
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, internalNotes: data.notes } : b))
        );
        if (selectedBooking && selectedBooking.id === id) {
          setSelectedBooking((prev) => (prev ? { ...prev, internalNotes: data.notes } : null));
        }
        setNewNoteText('');
      }
    } catch (err) {
      console.error('Failed to add note:', err);
    }
  };

  const handleDeleteBooking = async (id: string) => {
    if (!confirm('Are you sure you want to delete this booking enquiry?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
        if (selectedBooking?.id === id) setSelectedBooking(null);
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Add Portfolio photo
  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhoto.imageUrl || !newPhoto.title) return;

    try {
      const res = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({
          title: newPhoto.title,
          category: newPhoto.category,
          imageUrl: newPhoto.imageUrl,
          aspectRatio: newPhoto.aspectRatio,
          featured: newPhoto.featured,
          exif: {
            camera: newPhoto.camera,
            lens: newPhoto.lens,
            focalLength: '85mm',
            aperture: newPhoto.aperture,
            shutterSpeed: newPhoto.shutter,
            iso: newPhoto.iso,
            location: newPhoto.location,
          },
        }),
      });

      if (res.ok) {
        const item = await res.json();
        setPortfolio((prev) => [item, ...prev]);
        setShowAddPhotoModal(false);
        setNewPhoto({
          title: '',
          category: 'wedding',
          imageUrl: '',
          aspectRatio: 'landscape',
          featured: false,
          camera: 'Sony Alpha 7 IV',
          lens: 'FE 85mm F1.4 GM',
          aperture: 'f/1.8',
          shutter: '1/400s',
          iso: '200',
          location: 'Gaindatola',
        });
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to add photo:', err);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Delete this photo from portfolio?')) return;
    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (res.ok) {
        setPortfolio((prev) => prev.filter((p) => p.id !== id));
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to delete photo:', err);
    }
  };

  // Settings update
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(settings),
      });
      if (res.ok) {
        alert('Studio website settings updated successfully!');
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to update settings:', err);
    }
  };

  // Add Blog Post
  const handleAddBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogPost.title || !newBlogPost.content) return;
    try {
      const slug = newBlogPost.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const res = await fetch('/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify({ ...newBlogPost, slug }),
      });
      if (res.ok) {
        const post = await res.json();
        setBlogPosts((prev) => [post, ...prev]);
        setShowAddBlogModal(false);
        setNewBlogPost({
          title: '',
          category: 'Wedding Photography Tips',
          readTime: '4 min read',
          excerpt: '',
          content: '',
          imageUrl: '',
        });
        onDataUpdated();
      }
    } catch (err) {
      console.error('Failed to create blog post:', err);
    }
  };

  // If not logged in, show secure login card
  if (!authToken) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-6">
        <div className="relative max-w-md w-full bg-[#0E1016] border border-white/10 rounded-2xl p-8 shadow-2xl space-y-6">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4AF37] to-[#8C6D14] flex items-center justify-center mx-auto shadow-lg shadow-[#D4AF37]/20">
              <Lock className="w-6 h-6 text-black" />
            </div>
            <h2 className="text-2xl font-bold font-display text-white">
              Studio Command Center
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Authorized Staff Login (Capture Studio Gaindatola)
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Admin Username
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 mb-1">
                Security Password
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-[#D4AF37]"
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#D4AF37]/20"
            >
              {isLoggingIn ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>

            <div className="p-3 rounded-lg bg-white/[0.03] border border-white/5 text-[11px] font-mono text-slate-400 text-center">
              Default Credentials: <span className="text-[#D4AF37]">admin</span> / <span className="text-[#D4AF37]">capture2026!</span>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customerName.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.mobile.includes(bookingSearch) ||
      b.enquiryNumber.toLowerCase().includes(bookingSearch.toLowerCase());
    const matchesStatus = bookingStatusFilter === 'all' || b.status === bookingStatusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#08090C] text-slate-100 overflow-hidden">
      {/* Top Admin Header */}
      <header className="h-16 px-6 bg-[#0E1016] border-b border-white/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#D4AF37] flex items-center justify-center font-bold text-black text-xs font-display">
            CS
          </div>
          <div>
            <span className="font-bold text-sm font-display text-white tracking-wider">
              CAPTURE STUDIO
            </span>
            <span className="text-[10px] font-mono text-[#D4AF37] block">
              GAIN-DATOLA EXECUTIVE CONTROL
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="hidden lg:flex items-center gap-1 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'bookings' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <span>Bookings</span>
            <span className="px-1.5 py-0.2 rounded-full bg-black/40 text-[10px] font-bold">
              {bookings.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('portfolio')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'portfolio' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Portfolio
          </button>
          <button
            onClick={() => setActiveTab('services')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'services' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Services (16)
          </button>
          <button
            onClick={() => setActiveTab('packages')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'packages' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Packages
          </button>
          <button
            onClick={() => setActiveTab('enquiries')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'enquiries' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Messages
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'testimonials' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Reviews
          </button>
          <button
            onClick={() => setActiveTab('blog')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'blog' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Journal
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'payments' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Payments
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'settings' ? 'bg-[#D4AF37] text-black font-semibold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Settings
          </button>
          <button
            onClick={() => setActiveTab('supabase')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 text-[#E5C05B] ${
              activeTab === 'supabase' ? 'bg-amber-400 text-black font-semibold' : 'hover:text-amber-300'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>Supabase SQL</span>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleLogout}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            title="Close Admin Portal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Mobile Tab Scroller */}
      <div className="lg:hidden flex items-center gap-2 px-4 py-2 bg-[#12141C] border-b border-white/5 overflow-x-auto scrollbar-none text-xs font-mono">
        {(['overview', 'bookings', 'portfolio', 'services', 'packages', 'enquiries', 'testimonials', 'blog', 'payments', 'settings', 'supabase'] as const).map(
          (tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1 rounded-md capitalize whitespace-nowrap ${
                activeTab === tab ? 'bg-[#D4AF37] text-black font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          )
        )}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-6 max-w-7xl mx-auto w-full">
        {/* ========================================================================= */}
        {/* TAB 1: OVERVIEW DASHBOARD */}
        {/* ========================================================================= */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-fadeIn">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-slate-400">
                  <span>TOTAL ENQUIRIES</span>
                  <Calendar className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <div className="text-3xl font-bold font-mono text-white tabular-nums">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Submitted via website booking engine
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-amber-400">
                  <span>NEW / PENDING</span>
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-amber-300 tabular-nums">
                  {bookings.filter((b) => b.status === 'new' || b.status === 'pending').length}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Awaiting review or schedule verification
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-emerald-400">
                  <span>APPROVED / CONFIRMED</span>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-emerald-300 tabular-nums">
                  {bookings.filter((b) => b.status === 'approved').length}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Reserved shoot dates on studio calendar
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono text-sky-400">
                  <span>COMPLETED WORKS</span>
                  <TrendingUp className="w-4 h-4 text-sky-400" />
                </div>
                <div className="text-3xl font-bold font-mono text-sky-300 tabular-nums">
                  {bookings.filter((b) => b.status === 'completed').length}
                </div>
                <div className="text-[11px] text-slate-500 font-sans">
                  Delivered albums & cinematic films
                </div>
              </div>
            </div>

            {/* Recent Enquiries Strip */}
            <div className="p-6 rounded-2xl bg-[#101218] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold font-display text-white">
                    Latest Event Shoot Inquiries
                  </h3>
                  <p className="text-xs text-slate-400 font-body">
                    Clients waiting for confirmation and WhatsApp follow-up.
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('bookings')}
                  className="px-3 py-1.5 text-xs font-mono text-[#D4AF37] hover:underline"
                >
                  View All Bookings →
                </button>
              </div>

              <div className="divide-y divide-white/5">
                {bookings.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3 flex items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-white">{b.customerName}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#D4AF37] border border-white/10">
                          {b.enquiryNumber}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">
                        {b.serviceTitle} · {b.eventDate} · {b.eventLocation}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded ${
                          b.status === 'approved'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : b.status === 'new'
                            ? 'bg-amber-500/20 text-amber-300'
                            : 'bg-slate-700 text-slate-300'
                        }`}
                      >
                        {b.status}
                      </span>
                      <button
                        onClick={() => {
                          setSelectedBooking(b);
                          setActiveTab('bookings');
                        }}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-xs font-mono"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: BOOKINGS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'bookings' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  placeholder="Search customer, phone, or ID..."
                  className="w-full bg-[#13151D] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#D4AF37]"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
                {(['all', 'new', 'pending', 'approved', 'completed', 'cancelled'] as const).map(
                  (st) => (
                    <button
                      key={st}
                      onClick={() => setBookingStatusFilter(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap ${
                        bookingStatusFilter === st
                          ? 'bg-[#D4AF37] text-black font-bold'
                          : 'bg-white/5 text-slate-400 hover:text-white'
                      }`}
                    >
                      {st}
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Split View: List + Details Drawer */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Bookings Table / List */}
              <div className="lg:col-span-7 bg-[#101218] border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-4 border-b border-white/10 text-xs font-mono text-slate-400 flex justify-between">
                  <span>Enquiries List ({filteredBookings.length})</span>
                </div>

                <div className="divide-y divide-white/5 max-h-[70vh] overflow-y-auto">
                  {filteredBookings.map((b) => {
                    const isSelected = selectedBooking?.id === b.id;
                    return (
                      <div
                        key={b.id}
                        onClick={() => setSelectedBooking(b)}
                        className={`p-4 transition-colors cursor-pointer hover:bg-white/[0.02] flex items-start justify-between gap-4 ${
                          isSelected ? 'bg-white/[0.05] border-l-2 border-[#D4AF37]' : ''
                        }`}
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-sm text-white font-display">
                              {b.customerName}
                            </span>
                            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black text-[#D4AF37] border border-white/10">
                              {b.enquiryNumber}
                            </span>
                          </div>
                          <div className="text-xs text-slate-300 font-body">
                            {b.serviceTitle}
                          </div>
                          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
                            <span>Date: {b.eventDate}</span>
                            <span>·</span>
                            <span>{b.eventLocation}</span>
                          </div>
                        </div>

                        <div className="text-right space-y-2">
                          <span
                            className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded inline-block ${
                              b.status === 'approved'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : b.status === 'new'
                                ? 'bg-amber-500/20 text-amber-300'
                                : b.status === 'completed'
                                ? 'bg-sky-500/20 text-sky-300'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {b.status}
                          </span>
                          <div className="text-[11px] font-mono text-slate-400">
                            {b.mobile}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {filteredBookings.length === 0 && (
                    <div className="p-8 text-center text-xs text-slate-500 font-mono">
                      No booking enquiries match your search criteria.
                    </div>
                  )}
                </div>
              </div>

              {/* Selected Booking Detail Inspector */}
              <div className="lg:col-span-5 bg-[#101218] border border-white/10 rounded-2xl p-6 space-y-6">
                {selectedBooking ? (
                  <>
                    <div className="flex items-center justify-between pb-4 border-b border-white/10">
                      <div>
                        <span className="text-[10px] font-mono text-[#D4AF37] uppercase block">
                          ENQUIRY DETAILS
                        </span>
                        <h3 className="text-xl font-bold font-display text-white">
                          {selectedBooking.customerName}
                        </h3>
                      </div>
                      <button
                        onClick={() => handleDeleteBooking(selectedBooking.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Delete Enquiry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Status Toggle Buttons */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-mono text-slate-400">Update Booking Status:</span>
                      <div className="flex flex-wrap gap-1.5">
                        {(['new', 'pending', 'approved', 'completed', 'cancelled'] as const).map(
                          (statusVal) => (
                            <button
                              key={statusVal}
                              onClick={() => handleUpdateBookingStatus(selectedBooking.id, statusVal)}
                              className={`px-2.5 py-1 rounded text-[11px] font-mono uppercase transition-all ${
                                selectedBooking.status === statusVal
                                  ? 'bg-[#D4AF37] text-black font-bold'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              {statusVal}
                            </button>
                          )
                        )}
                      </div>
                    </div>

                    {/* Details Sheet */}
                    <div className="p-4 rounded-xl bg-black/50 border border-white/5 space-y-2.5 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block">Enquiry Number:</span>
                        <span className="text-[#E5C05B] font-bold">{selectedBooking.enquiryNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <span className="text-slate-500 block">Mobile Phone:</span>
                          <a href={`tel:${selectedBooking.mobile}`} className="text-slate-200 hover:text-[#D4AF37]">
                            {selectedBooking.mobile}
                          </a>
                        </div>
                        <div>
                          <span className="text-slate-500 block">WhatsApp:</span>
                          <span className="text-slate-200">{selectedBooking.whatsapp}</span>
                        </div>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Service & Package:</span>
                        <span className="text-slate-200 font-semibold">{selectedBooking.serviceTitle}</span>
                        {selectedBooking.packageName && (
                          <span className="text-slate-400 block">Package: {selectedBooking.packageName}</span>
                        )}
                      </div>
                      <div className="flex justify-between">
                        <div>
                          <span className="text-slate-500 block">Event Date:</span>
                          <span className="text-slate-200">{selectedBooking.eventDate}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">Venue:</span>
                          <span className="text-slate-200">{selectedBooking.eventLocation}</span>
                        </div>
                      </div>
                      {selectedBooking.estimatedBudget && (
                        <div>
                          <span className="text-slate-500 block">Client Budget:</span>
                          <span className="text-slate-200">{selectedBooking.estimatedBudget}</span>
                        </div>
                      )}
                      {selectedBooking.additionalRequirements && (
                        <div>
                          <span className="text-slate-500 block">Notes from Client:</span>
                          <p className="text-slate-300 font-sans text-xs mt-0.5">
                            {selectedBooking.additionalRequirements}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Direct Contact Links */}
                    <div className="flex gap-2">
                      <a
                        href={`https://wa.me/${selectedBooking.whatsapp.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(selectedBooking.customerName)}!%20Regarding%20your%20Capture%20Studio%20enquiry%20${selectedBooking.enquiryNumber}...`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2"
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span>Chat on WhatsApp</span>
                      </a>
                      <a
                        href={`tel:${selectedBooking.mobile}`}
                        className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Phone className="w-4 h-4" />
                        <span>Call</span>
                      </a>
                    </div>

                    {/* Internal Notes History */}
                    <div className="space-y-3 pt-2 border-t border-white/10">
                      <h4 className="text-xs font-mono text-slate-300 uppercase">
                        Studio Internal Staff Notes
                      </h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {selectedBooking.internalNotes?.map((n) => (
                          <div key={n.id} className="p-2.5 rounded-lg bg-white/[0.03] text-xs">
                            <p className="text-slate-300 font-body">{n.text}</p>
                            <span className="text-[10px] font-mono text-slate-500 mt-1 block">
                              By {n.author} · {n.createdAt ? new Date(n.createdAt).toLocaleDateString() : ''}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newNoteText}
                          onChange={(e) => setNewNoteText(e.target.value)}
                          placeholder="Add internal note..."
                          className="flex-1 bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none"
                        />
                        <button
                          onClick={() => handleAddBookingNote(selectedBooking.id)}
                          className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-xl"
                        >
                          Add
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center text-xs text-slate-500 font-mono">
                    Select a booking enquiry from the left list to inspect details and add notes.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: PORTFOLIO MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'portfolio' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Portfolio Image Manager
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Upload new captures, set EXIF metadata, and categorize gallery works.
                </p>
              </div>
              <button
                onClick={() => setShowAddPhotoModal(true)}
                className="px-4 py-2.5 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-semibold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md shadow-[#D4AF37]/20"
              >
                <Plus className="w-4 h-4" />
                <span>Add Portfolio Photo</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {portfolio.map((photo) => (
                <div
                  key={photo.id}
                  className="bg-[#101218] border border-white/10 rounded-2xl overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative h-44 w-full bg-black">
                    <img
                      src={photo.imageUrl}
                      alt={photo.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-[10px] font-mono text-[#D4AF37]">
                      {photo.category}
                    </div>
                  </div>

                  <div className="p-4 space-y-3">
                    <div>
                      <h4 className="text-sm font-bold font-display text-white truncate">
                        {photo.title}
                      </h4>
                      <p className="text-[11px] font-mono text-slate-400">
                        {photo.exif.camera} · {photo.exif.aperture}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">
                        {photo.featured ? 'Featured' : 'Standard'}
                      </span>
                      <button
                        onClick={() => handleDeletePhoto(photo.id)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: SERVICES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'services' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Studio Services Catalog (16 Offerings)
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Update base starting prices, descriptions, and active status for photography, printing & design services.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-4"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase">
                        {srv.category}
                      </span>
                      <h4 className="text-base font-bold font-display text-white">
                        {srv.title}
                      </h4>
                    </div>
                    <span className="px-2 py-0.5 rounded bg-[#D4AF37]/20 text-[#D4AF37] font-mono font-bold text-xs">
                      {srv.startingPrice}
                    </span>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 font-body">
                    {srv.shortDescription}
                  </p>

                  <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className={srv.active ? 'text-emerald-400' : 'text-slate-500'}>
                      {srv.active ? '● Active' : '○ Inactive'}
                    </span>
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new starting price for ${srv.title}:`, srv.startingPrice);
                        if (newPrice) {
                          fetch(`/api/services/${srv.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${authToken}`,
                            },
                            body: JSON.stringify({ startingPrice: newPrice }),
                          }).then(() => {
                            setServices((prev) =>
                              prev.map((s) => (s.id === srv.id ? { ...s, startingPrice: newPrice } : s))
                            );
                            onDataUpdated();
                          });
                        }
                      }}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Edit Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: PACKAGES MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'packages' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Photography & Shoot Packages
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Update package prices and deliverables displayed on the public website.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.id}
                  className="p-6 rounded-2xl bg-[#101218] border border-white/10 space-y-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{pkg.category}</span>
                      <h4 className="text-lg font-bold font-display text-white">{pkg.name}</h4>
                    </div>
                    <span className="text-xl font-bold font-mono text-white">{pkg.price}</span>
                  </div>

                  <div className="space-y-1 text-xs text-slate-300">
                    {pkg.deliverables.slice(0, 3).map((d, i) => (
                      <div key={i} className="truncate">· {d}</div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">{pkg.duration}</span>
                    <button
                      onClick={() => {
                        const newPrice = prompt(`Enter new price for ${pkg.name}:`, pkg.price);
                        if (newPrice) {
                          fetch(`/api/packages/${pkg.id}`, {
                            method: 'PUT',
                            headers: {
                              'Content-Type': 'application/json',
                              Authorization: `Bearer ${authToken}`,
                            },
                            body: JSON.stringify({ price: newPrice }),
                          }).then(() => {
                            setPackages((prev) =>
                              prev.map((p) => (p.id === pkg.id ? { ...p, price: newPrice } : p))
                            );
                            onDataUpdated();
                          });
                        }
                      }}
                      className="text-[#D4AF37] hover:underline"
                    >
                      Update Price
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 6: CONTACT FORM ENQUIRIES */}
        {/* ========================================================================= */}
        {activeTab === 'enquiries' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Contact Form Messages
              </h3>
              <p className="text-xs text-slate-400 font-body">
                General queries sent through the contact form.
              </p>
            </div>

            <div className="divide-y divide-white/5 bg-[#101218] border border-white/10 rounded-2xl overflow-hidden">
              {enquiries.map((enq) => (
                <div key={enq.id} className="p-5 flex flex-col sm:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white text-sm">{enq.name}</span>
                      <span className="text-xs font-mono text-[#D4AF37]">({enq.phone})</span>
                    </div>
                    <div className="text-xs font-mono text-slate-400">
                      Interest: {enq.serviceInterest} · {enq.email || 'No email provided'}
                    </div>
                    <p className="text-xs text-slate-300 font-body pt-1">
                      "{enq.message}"
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`https://wa.me/${enq.phone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(enq.name)}!%20Capture%20Studio%20received%20your%20message...`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-mono flex items-center gap-1"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>
              ))}

              {enquiries.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No contact messages received yet.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 7: TESTIMONIALS */}
        {/* ========================================================================= */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Customer Testimonials & Reviews
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Manage client reviews displayed on the website.
                </p>
              </div>
              <button
                onClick={() => setShowAddReviewModal(true)}
                className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-xl"
              >
                + Add Review
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl bg-[#101218] border border-white/10 space-y-3">
                  <div className="flex justify-between">
                    <div>
                      <h4 className="font-bold text-white text-sm">{t.clientName}</h4>
                      <span className="text-[11px] font-mono text-slate-400">{t.eventType}</span>
                    </div>
                    <div className="flex text-[#D4AF37]">
                      {[...Array(t.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 italic font-body">
                    "{t.comment}"
                  </p>
                  <div className="text-[10px] font-mono text-slate-500">{t.location}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 8: BLOG MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'blog' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Photography Journal & Articles
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  SEO blog articles for couples, photographers, and event planners.
                </p>
              </div>
              <button
                onClick={() => setShowAddBlogModal(true)}
                className="px-4 py-2.5 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>New Article</span>
              </button>
            </div>

            <div className="space-y-4">
              {blogPosts.map((post) => (
                <div
                  key={post.id}
                  className="p-5 rounded-2xl bg-[#101218] border border-white/10 flex items-center justify-between gap-6"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-[#D4AF37] uppercase">{post.category}</span>
                    <h4 className="text-base font-bold font-display text-white">{post.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                  </div>
                  <div className="text-right font-mono text-xs text-slate-400 shrink-0">
                    <div>{post.publishedAt}</div>
                    <span className="text-emerald-400">● Published</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 9: PAYMENTS MANAGEMENT */}
        {/* ========================================================================= */}
        {activeTab === 'payments' && (
          <div className="space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Advance Payment Records (Razorpay Integration)
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Track client token advance deposits and transaction references.
              </p>
            </div>

            <div className="divide-y divide-white/5 bg-[#101218] border border-white/10 rounded-2xl overflow-hidden">
              <div className="p-4 border-b border-white/10 text-xs font-mono text-slate-400 grid grid-cols-5">
                <span>Enquiry ID</span>
                <span>Customer</span>
                <span>Amount</span>
                <span>Status</span>
                <span>Order ID</span>
              </div>
              {payments.map((p) => (
                <div key={p.id} className="p-4 grid grid-cols-5 text-xs font-mono text-slate-300">
                  <span className="text-[#D4AF37]">{p.enquiryNumber}</span>
                  <span className="text-white">{p.customerName}</span>
                  <span className="font-bold">₹{p.amount}</span>
                  <span className="text-emerald-400 uppercase">{p.status}</span>
                  <span className="text-slate-500 truncate">{p.razorpayOrderId}</span>
                </div>
              ))}

              {payments.length === 0 && (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  No payment deposits recorded yet. Advance payment feature is active in test mode.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 10: WEBSITE SETTINGS */}
        {/* ========================================================================= */}
        {activeTab === 'settings' && (
          <div className="max-w-3xl space-y-6 animate-fadeIn">
            <div>
              <h3 className="text-xl font-bold font-display text-white">
                Website Business & Contact Settings
              </h3>
              <p className="text-xs text-slate-400 font-body">
                Configure studio address, telephone lines, WhatsApp number, hours, and statistics.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-5 bg-[#101218] p-6 rounded-2xl border border-white/10">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Studio Business Name
                  </label>
                  <input
                    type="text"
                    value={settings.studioName}
                    onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={settings.tagline}
                    onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">
                  Physical Studio Address
                </label>
                <input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Primary Phone
                  </label>
                  <input
                    type="text"
                    value={settings.primaryPhone}
                    onChange={(e) => setSettings({ ...settings, primaryPhone: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    Secondary Phone
                  </label>
                  <input
                    type="text"
                    value={settings.secondaryPhone}
                    onChange={(e) => setSettings({ ...settings, secondaryPhone: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">
                    WhatsApp (Digits only)
                  </label>
                  <input
                    type="text"
                    value={settings.whatsappNumber}
                    onChange={(e) => setSettings({ ...settings, whatsappNumber: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white"
                  />
                </div>
              </div>

              {/* Statistics Counters */}
              <div className="pt-2 border-t border-white/10">
                <label className="block text-xs font-mono text-[#D4AF37] mb-3 uppercase">
                  Studio Counters (Displayed on Homepage)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Weddings</label>
                    <input
                      type="number"
                      value={settings.stats.weddingsCaptured}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          stats: { ...settings.stats, weddingsCaptured: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Happy Clients</label>
                    <input
                      type="number"
                      value={settings.stats.happyClients}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          stats: { ...settings.stats, happyClients: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Events</label>
                    <input
                      type="number"
                      value={settings.stats.eventsCovered}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          stats: { ...settings.stats, eventsCovered: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-mono text-slate-400 mb-1">Years Exp</label>
                    <input
                      type="number"
                      value={settings.stats.yearsExperience}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          stats: { ...settings.stats, yearsExperience: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Advance Payment Toggle */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                <div>
                  <span className="font-bold text-xs text-white block">Enable Advance Booking Deposit</span>
                  <span className="text-[11px] text-slate-400">Collect optional token deposit via Razorpay</span>
                </div>
                <input
                  type="checkbox"
                  checked={settings.advancePaymentEnabled}
                  onChange={(e) => setSettings({ ...settings, advancePaymentEnabled: e.target.checked })}
                  className="w-5 h-5 accent-[#D4AF37] rounded"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#D4AF37] hover:bg-[#E5C05B] text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
              >
                Save Studio Settings
              </button>
            </form>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 11: SUPABASE SQL EXPORT */}
        {/* ========================================================================= */}
        {activeTab === 'supabase' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-xl font-bold font-display text-white">
                  Supabase PostgreSQL Schema & Migrations
                </h3>
                <p className="text-xs text-slate-400 font-body">
                  Copy and paste this production SQL script directly into the Supabase SQL Editor.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(supabaseSql);
                    setCopiedSql(true);
                    setTimeout(() => setCopiedSql(false), 2000);
                  }}
                  className="px-4 py-2 bg-[#D4AF37] text-slate-950 font-semibold text-xs rounded-xl flex items-center gap-1.5"
                >
                  {copiedSql ? <Check className="w-4 h-4 text-emerald-900" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedSql ? 'SQL Copied!' : 'Copy SQL Script'}</span>
                </button>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-black border border-white/10 overflow-x-auto max-h-[60vh]">
              <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                {supabaseSql || '-- Loading Supabase Schema...'}
              </pre>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD PORTFOLIO PHOTO */}
      {showAddPhotoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
          <div className="relative max-w-lg w-full bg-[#0E1016] border border-white/10 rounded-2xl p-6 space-y-4">
            <button
              onClick={() => setShowAddPhotoModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-display text-white">
              Add Portfolio Photograph
            </h3>
            <form onSubmit={handleAddPhotoSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Photo Title *</label>
                <input
                  type="text"
                  required
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                  placeholder="e.g. Royal Twilight Varmala"
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Category</label>
                  <select
                    value={newPhoto.category}
                    onChange={(e) => setNewPhoto({ ...newPhoto, category: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="wedding">Wedding</option>
                    <option value="pre_wedding">Pre-Wedding</option>
                    <option value="candid">Candid</option>
                    <option value="haldi">Haldi</option>
                    <option value="mehendi">Mehendi</option>
                    <option value="engagement">Engagement</option>
                    <option value="couple">Couple</option>
                    <option value="baby">Baby Shoot</option>
                    <option value="birthday">Birthday</option>
                    <option value="portrait">Portraits</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-1">Aspect Ratio</label>
                  <select
                    value={newPhoto.aspectRatio}
                    onChange={(e) => setNewPhoto({ ...newPhoto, aspectRatio: e.target.value as any })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                  >
                    <option value="landscape">Landscape</option>
                    <option value="portrait">Portrait</option>
                    <option value="square">Square</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={newPhoto.imageUrl}
                  onChange={(e) => setNewPhoto({ ...newPhoto, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Aperture</label>
                  <input
                    type="text"
                    value={newPhoto.aperture}
                    onChange={(e) => setNewPhoto({ ...newPhoto, aperture: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">Shutter</label>
                  <input
                    type="text"
                    value={newPhoto.shutter}
                    onChange={(e) => setNewPhoto({ ...newPhoto, shutter: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1">ISO</label>
                  <input
                    type="text"
                    value={newPhoto.iso}
                    onChange={(e) => setNewPhoto({ ...newPhoto, iso: e.target.value })}
                    className="w-full bg-[#141620] border border-white/10 rounded-xl px-2 py-1.5 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newPhoto.featured}
                    onChange={(e) => setNewPhoto({ ...newPhoto, featured: e.target.checked })}
                    className="accent-[#D4AF37]"
                  />
                  <span>Mark as Featured</span>
                </label>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-xl"
                >
                  Save Photo
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD BLOG POST */}
      {showAddBlogModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-6">
          <div className="relative max-w-xl w-full bg-[#0E1016] border border-white/10 rounded-2xl p-6 space-y-4">
            <button
              onClick={() => setShowAddBlogModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-display text-white">Publish Article</h3>
            <form onSubmit={handleAddBlogSubmit} className="space-y-3">
              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Article Title *</label>
                <input
                  type="text"
                  required
                  value={newBlogPost.title}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, title: e.target.value })}
                  placeholder="e.g. 5 Poses for Golden Hour Couple Shoots"
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Cover Image URL</label>
                <input
                  type="url"
                  value={newBlogPost.imageUrl}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Short Excerpt</label>
                <input
                  type="text"
                  value={newBlogPost.excerpt}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, excerpt: e.target.value })}
                  placeholder="Brief summary for preview cards..."
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-300 mb-1">Full Content</label>
                <textarea
                  rows={6}
                  required
                  value={newBlogPost.content}
                  onChange={(e) => setNewBlogPost({ ...newBlogPost, content: e.target.value })}
                  placeholder="Write the article content..."
                  className="w-full bg-[#141620] border border-white/10 rounded-xl px-3 py-2 text-xs text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#D4AF37] text-slate-950 font-bold text-xs rounded-xl"
              >
                Publish Article
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
