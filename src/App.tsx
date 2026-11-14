import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext.tsx';
import { Header } from './components/Header.tsx';
import { HeroSlider } from './components/HeroSlider.tsx';
import { CategoryGrid } from './components/CategoryGrid.tsx';
import { FeaturedEdit } from './components/FeaturedEdit.tsx';
import { RoomInspiration } from './components/RoomInspiration.tsx';
import { CollectionsSection } from './components/CollectionsSection.tsx';
import { OurStorySection } from './components/OurStorySection.tsx';
import { ShopCatalog } from './components/ShopCatalog.tsx';
import { ProductDetailModal } from './components/ProductDetailModal.tsx';
import { RoomLookModal } from './components/RoomLookModal.tsx';
import { CartDrawer } from './components/CartDrawer.tsx';
import { CheckoutModal } from './components/CheckoutModal.tsx';
import { OrderConfirmationModal } from './components/OrderConfirmationModal.tsx';
import { AccountModal } from './components/AccountModal.tsx';
import { SearchModal } from './components/SearchModal.tsx';
import { PolicyModals } from './components/PolicyModals.tsx';
import { AdminDashboard } from './components/AdminDashboard.tsx';
import { AIAssistant } from './components/AIAssistant.tsx';
import { Footer } from './components/Footer.tsx';
import { Sparkles, CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toastMessage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#2C2724]">
      {/* Global Header */}
      <Header />

      {/* Main View Switcher */}
      <main className="flex-grow">
        {activeTab === 'home' && (
          <>
            <HeroSlider />
            <CategoryGrid />
            <FeaturedEdit />
            <RoomInspiration />
            <CollectionsSection />
            <OurStorySection />
          </>
        )}

        {activeTab === 'shop' && <ShopCatalog />}

        {activeTab === 'rooms' && (
          <div className="py-6">
            <RoomInspiration />
          </div>
        )}

        {activeTab === 'collections' && (
          <div className="py-6">
            <CollectionsSection />
          </div>
        )}

        {activeTab === 'story' && (
          <div className="py-6">
            <OurStorySection />
          </div>
        )}

        {activeTab === 'admin' && <AdminDashboard />}

        {activeTab === 'account' && (
          <div className="py-12 max-w-4xl mx-auto px-4">
            <AccountModal />
          </div>
        )}
      </main>

      {/* Global Footer */}
      <Footer />

      {/* Global Modals & Drawers */}
      <ProductDetailModal />
      <RoomLookModal />
      <CartDrawer />
      <CheckoutModal />
      <OrderConfirmationModal />
      <AccountModal />
      <SearchModal />
      <PolicyModals />
      <AIAssistant />

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 right-6 z-50 bg-[#2E2420] text-[#FAF8F5] px-4 py-3 rounded-none shadow-xl border border-[#4E3E37] flex items-center gap-2.5 text-xs animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#D4AF67] shrink-0" />
          <span className="tracking-wide">{toastMessage}</span>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
