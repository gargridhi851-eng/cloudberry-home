import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { ArrowRight } from 'lucide-react';

export const FeaturedEdit: React.FC = () => {
  const { products, setActiveTab, setFilterCategory } = useStore();
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterTabs = [
    { label: 'All Curated Pieces', value: 'all' },
    { label: 'Vases & Vessels', value: 'vases' },
    { label: 'Ambient Lighting', value: 'lamps' },
    { label: 'Table Decor', value: 'table-decor' },
    { label: 'Linen Cushions', value: 'cushions' },
    { label: 'Botanicals', value: 'artificial-flowers' },
  ];

  const filteredProducts = products.filter((p) => {
    if (activeFilter === 'all') return true;
    return p.categorySlug === activeFilter;
  });

  return (
    <section className="py-20 bg-[#F5F0E8] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium mb-2.5">
            Signature Selection
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight mb-4">
            The Cloudberry Edit
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A51] leading-relaxed">
            Meticulously designed focal points and quiet accents. Each piece is chosen for its enduring materiality, sculptural poise, and organic soul.
          </p>

          {/* Interactive Filter Segment Tabs (Functional Buttons) */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 p-1 bg-[#EAE3D9]/60 rounded-none inline-flex max-w-full overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setActiveFilter(tab.value)}
                className={`px-3.5 py-2 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap cursor-pointer ${
                  activeFilter === tab.value
                    ? 'bg-[#4E3E37] text-white shadow-sm'
                    : 'text-[#6B5A51] hover:text-[#2E2420] hover:bg-[#FAF8F5]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {filteredProducts.slice(0, 8).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* View All Button */}
        <div className="mt-14 text-center">
          <button
            onClick={() => {
              setActiveTab('shop');
              setFilterCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="inline-flex items-center justify-center px-8 py-4 bg-transparent border border-[#4E3E37] text-[#4E3E37] text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#4E3E37] hover:text-[#FAF8F5] transition-colors rounded-none cursor-pointer group"
          >
            <span>Explore Entire Collection</span>
            <ArrowRight className="w-4 h-4 ml-3 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

      </div>
    </section>
  );
};
