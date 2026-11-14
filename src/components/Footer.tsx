import React, { useState } from 'react';
import { ArrowRight, Instagram, Mail, ShieldCheck, Heart, Sparkles, Shield, Bot, LayoutDashboard } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const Footer: React.FC = () => {
  const {
    setActiveTab,
    setFilterCategory,
    setFilterCollection,
    setPolicyModal,
    setIsAIAssistantOpen,
    showToast,
  } = useStore();

  const [newsletterEmail, setNewsletterEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    showToast('Thank you for subscribing! Use code WELCOME500 for ₹500 off your first order.');
    setNewsletterEmail('');
  };

  const handleNav = (tab: any, cat = 'all', col = 'all') => {
    setActiveTab(tab);
    setFilterCategory(cat);
    setFilterCollection(col);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2E2420] text-[#FAF8F5] pt-16 sm:pt-20 pb-12 border-t border-[#4E3E37]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Top Newsletter & Brand Statement Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pb-12 border-b border-[#4E3E37]/80">
          <div className="lg:col-span-6 space-y-3">
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#D4AF67] font-medium block">
              The Thoughtful Living Gazette
            </span>
            <h3 className="font-serif text-3xl sm:text-4xl text-[#FAF8F5] font-light">
              Invite Gentle Beauty into Your Inbox
            </h3>
            <p className="text-xs sm:text-sm text-[#D6C8B8] leading-relaxed max-w-md">
              Receive seasonal interior lookbooks, early access to small-batch ceramic drops, and ₹500 off your initial curation.
            </p>
          </div>

          <div className="lg:col-span-6">
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email address"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full sm:w-80 px-4 py-3 bg-[#4E3E37]/50 border border-[#6B5A51] text-xs text-[#FAF8F5] placeholder-[#A8988F] focus:outline-none focus:border-[#D4AF67]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#D4AF67] text-[#2E2420] text-xs uppercase tracking-[0.16em] font-semibold hover:bg-white transition-colors cursor-pointer shrink-0"
              >
                <span>Subscribe</span>
              </button>
            </form>
          </div>
        </div>

        {/* Dedicated Admin Dashboard & AI Assistant Access Strip */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#382D28] border border-[#4E3E37]">
          {/* Admin Dashboard Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#2E2420] border border-[#4E3E37]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4E3E37] flex items-center justify-center text-[#D4AF67] shrink-0">
                <LayoutDashboard className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#FAF8F5] font-medium">Store Admin Dashboard</h4>
                <p className="text-[11px] text-[#A8988F]">Manage catalog products, pricing, stock & customer order fulfillment</p>
              </div>
            </div>
            <button
              onClick={() => handleNav('admin')}
              className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#D4AF67] text-[#2E2420] text-xs uppercase tracking-wider font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Open Admin
            </button>
          </div>

          {/* AI Stylist Card */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-[#2E2420] border border-[#4E3E37]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-none bg-[#4E3E37] flex items-center justify-center text-[#D4AF67] shrink-0">
                <Sparkles className="w-5 h-5 text-[#D4AF67]" />
              </div>
              <div>
                <h4 className="font-serif text-base text-[#FAF8F5] font-medium">Cloudberry AI Stylist</h4>
                <p className="text-[11px] text-[#A8988F]">Consult our AI interior design assistant for personalized room advice</p>
              </div>
            </div>
            <button
              onClick={() => setIsAIAssistantOpen(true)}
              className="px-4 py-2 bg-[#D4AF67] hover:bg-[#FAF8F5] text-[#2E2420] text-xs uppercase tracking-wider font-semibold transition-colors shrink-0 cursor-pointer"
            >
              Consult AI
            </button>
          </div>
        </div>

        {/* 4 Column Directory */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 text-xs">
          
          {/* Col 1: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <span className="font-serif text-2xl tracking-[0.16em] uppercase text-[#FAF8F5] block font-medium">
              Cloudberry Home
            </span>
            <p className="text-[#D6C8B8] leading-relaxed pr-6">
              A serene home decor brand honoring the ritual of living well. Every object is thoughtfully curated from honest stone, washed European linen, unglazed clay, and hand-forged brass.
            </p>
            <div className="flex items-center gap-4 text-[#D6C8B8] pt-2">
              <a href="#" className="hover:text-white transition-colors" aria-label="Instagram">
                <Instagram className="w-5 h-5 stroke-[1.5]" />
              </a>
              <a href="mailto:concierge@cloudberryhome.com" className="hover:text-white transition-colors" aria-label="Email">
                <Mail className="w-5 h-5 stroke-[1.5]" />
              </a>
            </div>
          </div>

          {/* Col 2: Shopping Links */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[#D4AF67] font-semibold text-[11px]">
              Explore Shop
            </h4>
            <ul className="space-y-2 text-[#D6C8B8]">
              <li>
                <button onClick={() => handleNav('shop', 'vases')} className="hover:text-white transition-colors">
                  Ceramic Vases
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'lamps')} className="hover:text-white transition-colors">
                  Lighting & Lamps
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'table-decor')} className="hover:text-white transition-colors">
                  Table Decor & Bowls
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'cushions')} className="hover:text-white transition-colors">
                  Washed Linen Cushions
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'candles')} className="hover:text-white transition-colors">
                  Soy Candles & Scents
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('shop', 'wall-art')} className="hover:text-white transition-colors">
                  Plaster Relief Wall Art
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Interior Collections */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[#D4AF67] font-semibold text-[11px]">
              Curated Worlds
            </h4>
            <ul className="space-y-2 text-[#D6C8B8]">
              <li>
                <button onClick={() => handleNav('collections', 'all', 'the-neutral-edit')} className="hover:text-white transition-colors">
                  The Neutral Edit
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections', 'all', 'the-little-luxuries')} className="hover:text-white transition-colors">
                  The Little Luxuries
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections', 'all', 'nature-at-home')} className="hover:text-white transition-colors">
                  Nature at Home
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('collections', 'all', 'slow-living')} className="hover:text-white transition-colors">
                  Slow Living Bedroom
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('rooms')} className="hover:text-white transition-colors">
                  Style Your Space
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('story')} className="hover:text-white transition-colors">
                  Our Story & Artisans
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Customer Support & Management Portals */}
          <div className="space-y-3">
            <h4 className="uppercase tracking-[0.2em] text-[#D4AF67] font-semibold text-[11px]">
              Care & Management
            </h4>
            <ul className="space-y-2 text-[#D6C8B8]">
              <li>
                <button onClick={() => handleNav('admin')} className="text-[#D4AF67] font-semibold hover:underline flex items-center gap-1.5">
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>Admin Dashboard</span>
                </button>
              </li>
              <li>
                <button onClick={() => setIsAIAssistantOpen(true)} className="text-[#D4AF67] font-semibold hover:underline flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Interior Stylist</span>
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('shipping')} className="hover:text-white transition-colors">
                  Shipping & Pan-India Delivery
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('returns')} className="hover:text-white transition-colors">
                  7-Day Returns & Exchanges
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('privacy')} className="hover:text-white transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('terms')} className="hover:text-white transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => setPolicyModal('faqs')} className="hover:text-white transition-colors">
                  Fragile Care & FAQs
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Verified Indian Payment Trust */}
        <div className="pt-8 border-t border-[#4E3E37]/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#A8988F]">
          <div>
            &copy; {new Date().getFullYear()} Cloudberry Home Pvt. Ltd. All rights reserved. Crafted for mindful living spaces.
          </div>

          <div className="flex items-center gap-3 text-[11px] uppercase tracking-wider">
            <span>Razorpay 256-Bit SSL</span>
            <span aria-hidden="true">·</span>
            <span>UPI & Cards</span>
            <span aria-hidden="true">·</span>
            <span>Cash on Delivery</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
