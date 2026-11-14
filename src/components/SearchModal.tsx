import React, { useState } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const SearchModal: React.FC = () => {
  const {
    products,
    isSearchOpen,
    setIsSearchOpen,
    setSelectedProduct,
    setActiveTab,
    setFilterCategory,
  } = useStore();

  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const popularSearches = [
    { label: 'Ceramic Vases', category: 'vases' },
    { label: 'Table Lamps', category: 'lamps' },
    { label: 'Linen Cushions', category: 'cushions' },
    { label: 'Marble Bowls', category: 'table-decor' },
    { label: 'Wall Art', category: 'wall-art' },
    { label: 'Soy Candles', category: 'candles' },
  ];

  const results = query.trim()
    ? products.filter(
        (p) =>
          p.name.toLowerCase().includes(query.toLowerCase()) ||
          p.subtitle.toLowerCase().includes(query.toLowerCase()) ||
          p.category.toLowerCase().includes(query.toLowerCase()) ||
          p.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleSelectPopular = (cat: string) => {
    setIsSearchOpen(false);
    setActiveTab('shop');
    setFilterCategory(cat);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-start justify-center p-4 sm:p-6 pt-16 sm:pt-24 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-2xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden p-6 sm:p-8 space-y-6">
        
        {/* Header Search Box */}
        <div className="flex items-center gap-3 border-b-2 border-[#4E3E37] pb-3">
          <Search className="w-6 h-6 text-[#4E3E37]" />
          <input
            type="text"
            autoFocus
            placeholder="Search home decor, lighting, vases, throws..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base sm:text-lg bg-transparent text-[#2E2420] placeholder-[#9B8C83] focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="p-1 text-[#7A6B63] hover:text-[#2E2420]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Popular Suggestions */}
        {!query && (
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-semibold block">
              Curated Searches
            </span>
            <div className="flex flex-wrap gap-2">
              {popularSearches.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectPopular(s.category)}
                  className="px-3 py-1.5 bg-[#F5F0E8] hover:bg-[#4E3E37] text-[#4E3E37] hover:text-white text-xs rounded-none border border-[#EAE3D9] transition-colors cursor-pointer"
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Matching Results */}
        {query && (
          <div className="space-y-3 max-h-80 overflow-y-auto">
            <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-semibold block">
              Matching Decor Pieces ({results.length})
            </span>
            {results.length === 0 ? (
              <p className="text-xs text-[#7A6B63] py-6 text-center">
                No items match &quot;{query}&quot;. Try exploring our categories or general terms.
              </p>
            ) : (
              <div className="space-y-2">
                {results.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => {
                      setIsSearchOpen(false);
                      setSelectedProduct(prod);
                    }}
                    className="flex items-center gap-3 p-2.5 bg-white border border-[#EAE3D9] hover:border-[#D6C8B8] cursor-pointer transition-colors"
                  >
                    <img
                      src={prod.images[0]}
                      alt=""
                      className="w-12 h-14 object-cover bg-[#F5F0E8] shrink-0"
                    />
                    <div className="flex-grow min-w-0">
                      <span className="text-[10px] uppercase text-[#7A6B63] tracking-wider block">
                        {prod.category}
                      </span>
                      <h4 className="font-serif text-sm text-[#2E2420] truncate font-medium">
                        {prod.name}
                      </h4>
                      <span className="font-mono text-xs font-semibold text-[#2E2420]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#7A6B63] shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};
