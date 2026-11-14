import React, { useState } from 'react';
import { Search, Heart, ShoppingBag, User as UserIcon, Menu, X, ShieldCheck } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    setFilterCategory,
    setFilterCollection,
    cartItemCount,
    wishlist,
    setIsCartOpen,
    setIsAuthOpen,
    setIsSearchOpen,
    user,
  } = useStore();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: any, cat = 'all', col = 'all') => {
    setActiveTab(tab);
    setFilterCategory(cat);
    setFilterCollection(col);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Quiet Announcement Bar */}
      <div className="bg-[#4E3E37] text-[#FAF8F5] text-[11px] sm:text-xs py-2 px-4 text-center tracking-wider font-medium flex items-center justify-center gap-2 border-b border-[#3E302A]">
        <span>Complimentary Pan-India Express Delivery on orders over ₹1,999</span>
        <span className="hidden sm:inline" aria-hidden="true">·</span>
        <span className="hidden sm:inline">Use code <strong className="font-semibold text-[#D4AF67]">CLOUDBERRY10</strong> for 10% off</span>
      </div>

      {/* Main Top Navigation conforming strictly to 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE3D9] transition-all duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-8">
          
          {/* Zone 1: Single text element wordmark */}
          <button
            onClick={() => handleNavClick('home')}
            className="group flex flex-col items-start text-left shrink-0 focus-visible:outline-none"
          >
            <span className="font-serif text-2xl sm:text-3xl tracking-[0.16em] uppercase text-[#2E2420] group-hover:text-[#4E3E37] transition-colors font-medium">
              Cloudberry Home
            </span>
          </button>

          {/* Zone 2: 5 clean single-line text navigation links with subtle underline */}
          <nav className="hidden lg:flex items-center gap-8 text-[13px] tracking-[0.12em] uppercase font-medium text-[#4E3E37]">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#2E2420] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'home' ? 'border-[#4E3E37] text-[#2E2420]' : 'border-transparent'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-[#2E2420] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'shop' ? 'border-[#4E3E37] text-[#2E2420]' : 'border-transparent'
              }`}
            >
              Shop
            </button>
            <button
              onClick={() => handleNavClick('rooms')}
              className={`hover:text-[#2E2420] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'rooms' ? 'border-[#4E3E37] text-[#2E2420]' : 'border-transparent'
              }`}
            >
              Rooms
            </button>
            <button
              onClick={() => handleNavClick('collections')}
              className={`hover:text-[#2E2420] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'collections' ? 'border-[#4E3E37] text-[#2E2420]' : 'border-transparent'
              }`}
            >
              Collections
            </button>
            <button
              onClick={() => handleNavClick('story')}
              className={`hover:text-[#2E2420] transition-colors whitespace-nowrap shrink-0 py-1 border-b-2 ${
                activeTab === 'story' ? 'border-[#4E3E37] text-[#2E2420]' : 'border-transparent'
              }`}
            >
              Our Story
            </button>
          </nav>

          {/* Zone 3: Action Affordances */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            {/* Quick Admin Toggle for review/management */}
            <button
              onClick={() => handleNavClick('admin')}
              className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider rounded border transition-colors ${
                activeTab === 'admin'
                  ? 'bg-[#4E3E37] text-white border-[#4E3E37]'
                  : 'text-[#6B5A51] border-[#D9CFC4] hover:bg-[#EFE8DE] hover:text-[#2E2420]'
              }`}
              title="Admin Store Management"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#4E3E37] hover:text-[#2E2420] transition-colors focus-visible:outline-none"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5 stroke-[1.6]" />
            </button>

            {/* Account */}
            <button
              onClick={() => {
                if (user) {
                  setActiveTab('account');
                } else {
                  setIsAuthOpen(true);
                }
              }}
              className="p-2 text-[#4E3E37] hover:text-[#2E2420] transition-colors focus-visible:outline-none relative"
              aria-label="Customer Account"
            >
              <UserIcon className="w-5 h-5 stroke-[1.6]" />
              {user && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-[#6D7F6E]" />
              )}
            </button>

            {/* Wishlist */}
            <button
              onClick={() => {
                setActiveTab('account');
              }}
              className="p-2 text-[#4E3E37] hover:text-[#2E2420] transition-colors focus-visible:outline-none relative"
              aria-label="View Wishlist"
            >
              <Heart className="w-5 h-5 stroke-[1.6]" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#B88E3E] text-white text-[10px] font-medium rounded-full flex items-center justify-center tabular-nums">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#4E3E37] hover:text-[#2E2420] transition-colors focus-visible:outline-none relative"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.6]" />
              {cartItemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-[#4E3E37] text-white text-[10px] font-medium rounded-full flex items-center justify-center tabular-nums">
                  {cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#4E3E37] hover:text-[#2E2420] focus-visible:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Flyout Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#FAF8F5] border-b border-[#EAE3D9] px-6 py-6 space-y-4">
            <nav className="flex flex-col space-y-3 text-sm uppercase tracking-wider font-medium text-[#4E3E37]">
              <button
                onClick={() => handleNavClick('home')}
                className="text-left py-2 border-b border-[#EAE3D9]/60 hover:text-[#2E2420]"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className="text-left py-2 border-b border-[#EAE3D9]/60 hover:text-[#2E2420]"
              >
                Shop All Products
              </button>
              <button
                onClick={() => handleNavClick('rooms')}
                className="text-left py-2 border-b border-[#EAE3D9]/60 hover:text-[#2E2420]"
              >
                Style Your Space (Rooms)
              </button>
              <button
                onClick={() => handleNavClick('collections')}
                className="text-left py-2 border-b border-[#EAE3D9]/60 hover:text-[#2E2420]"
              >
                Special Collections
              </button>
              <button
                onClick={() => handleNavClick('story')}
                className="text-left py-2 border-b border-[#EAE3D9]/60 hover:text-[#2E2420]"
              >
                Our Story
              </button>
              <button
                onClick={() => handleNavClick('admin')}
                className="text-left py-2 text-[#B88E3E] font-semibold"
              >
                Store Admin Portal
              </button>
            </nav>
          </div>
        )}
      </header>
    </>
  );
};
