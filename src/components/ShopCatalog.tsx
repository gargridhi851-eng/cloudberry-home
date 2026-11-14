import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ProductCard } from './ProductCard.tsx';
import { Filter, X, SlidersHorizontal, Search, RotateCcw } from 'lucide-react';

export const ShopCatalog: React.FC = () => {
  const {
    products,
    categories,
    collections,
    filterCategory,
    setFilterCategory,
    filterCollection,
    setFilterCollection,
    searchQuery,
    setSearchQuery,
  } = useStore();

  const [priceRange, setPriceRange] = useState<number>(12000);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'newest'>('featured');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Available filter colors
  const colorOptions = [
    { name: 'All Colors', value: 'all', hex: '#FAF8F5' },
    { name: 'Ivory & Cream', value: 'ivory', hex: '#F5F0E8' },
    { name: 'Mocha & Sand', value: 'mocha', hex: '#58463B' },
    { name: 'Sage Green', value: 'sage', hex: '#7A8875' },
    { name: 'Muted Gold', value: 'gold', hex: '#C5A059' },
    { name: 'Calacatta White', value: 'white', hex: '#EBEBEB' },
  ];

  const resetAllFilters = () => {
    setFilterCategory('all');
    setFilterCollection('all');
    setSearchQuery('');
    setPriceRange(12000);
    setSelectedColor('all');
    setInStockOnly(false);
    setSortBy('featured');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      // Category filter
      if (filterCategory !== 'all' && item.categorySlug !== filterCategory) {
        return false;
      }
      // Collection filter
      if (filterCollection !== 'all' && item.collectionSlug !== filterCollection) {
        return false;
      }
      // Price filter
      if (item.price > priceRange) {
        return false;
      }
      // In-stock filter
      if (inStockOnly && (!item.inStock || item.stockCount <= 0)) {
        return false;
      }
      // Color filter
      if (selectedColor !== 'all') {
        const hasColor = item.colors?.some((c) =>
          c.name.toLowerCase().includes(selectedColor)
        );
        if (!hasColor) return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matches =
          item.name.toLowerCase().includes(q) ||
          item.subtitle.toLowerCase().includes(q) ||
          item.category.toLowerCase().includes(q) ||
          item.description.toLowerCase().includes(q) ||
          item.tags.some((t) => t.toLowerCase().includes(q));
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
      return 0; // featured default
    });
  }, [products, filterCategory, filterCollection, priceRange, inStockOnly, selectedColor, searchQuery, sortBy]);

  const activeFilterCount =
    (filterCategory !== 'all' ? 1 : 0) +
    (filterCollection !== 'all' ? 1 : 0) +
    (selectedColor !== 'all' ? 1 : 0) +
    (priceRange < 12000 ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    (searchQuery ? 1 : 0);

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Catalog Banner & Title */}
        <div className="border-b border-[#EAE3D9] pb-8 mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium mb-2">
            The Living Collection
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight">
                {filterCategory !== 'all'
                  ? categories.find((c) => c.slug === filterCategory)?.name || 'Department'
                  : filterCollection !== 'all'
                  ? collections.find((c) => c.slug === filterCollection)?.name || 'Collection'
                  : 'All Decor & Essentials'}
              </h1>
              <p className="text-sm text-[#7A6B63] mt-1 font-light">
                {filterCategory !== 'all'
                  ? categories.find((c) => c.slug === filterCategory)?.description
                  : 'Artisanal ceramics, heirloom lighting, Belgian linens, and organic home accents.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              {/* Mobile Filter Button */}
              <button
                onClick={() => setMobileFilterOpen(true)}
                className="lg:hidden px-4 py-2 bg-[#F5F0E8] border border-[#EAE3D9] text-xs uppercase tracking-wider font-medium text-[#4E3E37] flex items-center gap-2 cursor-pointer"
              >
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
              </button>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#7A6B63] uppercase tracking-wider hidden sm:inline">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-[#FAF8F5] border border-[#EAE3D9] px-3 py-2 text-xs text-[#2E2420] uppercase tracking-wider focus:outline-none focus:border-[#4E3E37]"
                >
                  <option value="featured">Featured Curations</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Top Customer Rated</option>
                  <option value="newest">Newest Arrivals</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Desktop Left Sidebar Filters */}
          <aside className="hidden lg:block space-y-8 pr-4">
            
            {/* Search Input */}
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-wider text-[#4E3E37] font-semibold block">
                Search Items
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Vases, brass, linen..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] placeholder-[#9B8C83] focus:outline-none focus:border-[#4E3E37]"
                />
                <Search className="w-4 h-4 text-[#7A6B63] absolute left-3 top-2.5" />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2.5 text-[#7A6B63] hover:text-[#2E2420]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Clear Filters Button if any active */}
            {activeFilterCount > 0 && (
              <button
                onClick={resetAllFilters}
                className="w-full py-2 bg-[#F5F0E8] hover:bg-[#EAE3D9] text-[#4E3E37] text-xs uppercase tracking-wider font-medium flex items-center justify-center gap-2 border border-[#EAE3D9] transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters ({activeFilterCount})</span>
              </button>
            )}

            {/* Categories Filter */}
            <div className="space-y-3 border-t border-[#EAE3D9] pt-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#4E3E37] font-semibold">
                <span>Departments</span>
                {filterCategory !== 'all' && (
                  <button onClick={() => setFilterCategory('all')} className="text-[11px] text-[#B88E3E] lowercase hover:underline">
                    clear
                  </button>
                )}
              </div>
              <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1 text-xs">
                <button
                  onClick={() => setFilterCategory('all')}
                  className={`w-full text-left py-1 px-2 rounded-sm transition-colors flex items-center justify-between ${
                    filterCategory === 'all'
                      ? 'bg-[#4E3E37] text-white font-medium'
                      : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
                  }`}
                >
                  <span>All Categories</span>
                  <span className="text-[10px] tabular-nums">{products.length}</span>
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFilterCategory(cat.slug)}
                    className={`w-full text-left py-1 px-2 rounded-sm transition-colors flex items-center justify-between ${
                      filterCategory === cat.slug
                        ? 'bg-[#4E3E37] text-white font-medium'
                        : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
                    }`}
                  >
                    <span className="truncate">{cat.name}</span>
                    <span className="text-[10px] tabular-nums opacity-75">{cat.itemCount}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Collections Filter */}
            <div className="space-y-3 border-t border-[#EAE3D9] pt-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#4E3E37] font-semibold">
                <span>Collections</span>
                {filterCollection !== 'all' && (
                  <button onClick={() => setFilterCollection('all')} className="text-[11px] text-[#B88E3E] lowercase hover:underline">
                    clear
                  </button>
                )}
              </div>
              <div className="space-y-1 text-xs">
                <button
                  onClick={() => setFilterCollection('all')}
                  className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                    filterCollection === 'all'
                      ? 'bg-[#4E3E37] text-white font-medium'
                      : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
                  }`}
                >
                  All Curations
                </button>
                {collections.map((col) => (
                  <button
                    key={col.id}
                    onClick={() => setFilterCollection(col.slug)}
                    className={`w-full text-left py-1 px-2 rounded-sm transition-colors ${
                      filterCollection === col.slug
                        ? 'bg-[#4E3E37] text-white font-medium'
                        : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
                    }`}
                  >
                    {col.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter Slider */}
            <div className="space-y-3 border-t border-[#EAE3D9] pt-6">
              <div className="flex items-center justify-between text-xs uppercase tracking-wider text-[#4E3E37] font-semibold">
                <span>Max Price</span>
                <span className="font-mono text-sm text-[#2E2420]">₹{priceRange.toLocaleString('en-IN')}</span>
              </div>
              <input
                type="range"
                min="1000"
                max="12000"
                step="500"
                value={priceRange}
                onChange={(e) => setPriceRange(Number(e.target.value))}
                className="w-full accent-[#4E3E37] cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#7A6B63] font-mono">
                <span>₹1,000</span>
                <span>₹12,000</span>
              </div>
            </div>

            {/* Color Palette Swatches */}
            <div className="space-y-3 border-t border-[#EAE3D9] pt-6">
              <div className="text-xs uppercase tracking-wider text-[#4E3E37] font-semibold">
                Color Tones
              </div>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map((c) => (
                  <button
                    key={c.value}
                    onClick={() => setSelectedColor(c.value)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs border transition-all cursor-pointer ${
                      selectedColor === c.value
                        ? 'border-[#4E3E37] bg-white font-medium shadow-sm'
                        : 'border-[#EAE3D9] bg-[#F5F0E8] text-[#6B5A51] hover:border-[#B88E3E]'
                    }`}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0"
                      style={{ backgroundColor: c.hex }}
                    />
                    <span className="text-[11px]">{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* In-Stock Only Toggle */}
            <div className="border-t border-[#EAE3D9] pt-6 flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider text-[#4E3E37] font-medium">
                In Stock Only
              </span>
              <button
                onClick={() => setInStockOnly(!inStockOnly)}
                className={`w-10 h-5 flex items-center rounded-full p-1 transition-colors cursor-pointer ${
                  inStockOnly ? 'bg-[#4E3E37]' : 'bg-[#D6C8B8]'
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform ${
                    inStockOnly ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

          </aside>

          {/* Right Product Grid Column */}
          <main className="lg:col-span-3">
            
            {/* Meta status bar */}
            <div className="flex items-center justify-between text-xs text-[#7A6B63] mb-6 pb-2 border-b border-[#EAE3D9]">
              <div>
                Showing <strong className="font-semibold text-[#2E2420] tabular-nums">{filteredProducts.length}</strong> thoughtfully crafted products
              </div>
              {activeFilterCount > 0 && (
                <button
                  onClick={resetAllFilters}
                  className="text-[#B88E3E] hover:underline font-medium"
                >
                  Clear all filters
                </button>
              )}
            </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-[#F5F0E8] border border-[#EAE3D9] p-8">
                <div className="font-serif text-2xl text-[#2E2420] mb-2">No Matching Pieces Found</div>
                <p className="text-sm text-[#7A6B63] max-w-md mx-auto mb-6">
                  We could not find items matching your current filter criteria. Try clearing some filters or searching for another term.
                </p>
                <button
                  onClick={resetAllFilters}
                  className="px-6 py-2.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2E2420] transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            )}

          </main>

        </div>

      </div>

      {/* Mobile Drawer Filter Dialog */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden flex justify-end">
          <div className="w-full max-w-xs bg-[#FAF8F5] h-full p-6 overflow-y-auto space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-4">
                <h3 className="font-serif text-xl text-[#2E2420]">Filter Catalog</h3>
                <button onClick={() => setMobileFilterOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-[#4E3E37]" />
                </button>
              </div>

              {/* Department */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37]">Department</label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] p-2 text-xs text-[#2E2420]"
                >
                  <option value="all">All Departments</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Collection */}
              <div className="space-y-2">
                <label className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37]">Collection</label>
                <select
                  value={filterCollection}
                  onChange={(e) => setFilterCollection(e.target.value)}
                  className="w-full bg-white border border-[#EAE3D9] p-2 text-xs text-[#2E2420]"
                >
                  <option value="all">All Collections</option>
                  {collections.map((c) => (
                    <option key={c.id} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              {/* Price slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="uppercase font-semibold text-[#4E3E37]">Max Price</span>
                  <span className="font-mono font-medium">₹{priceRange.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="1000"
                  max="12000"
                  step="500"
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-[#4E3E37]"
                />
              </div>

              {/* In stock */}
              <div className="flex items-center justify-between pt-2">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37]">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 accent-[#4E3E37]"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#EAE3D9] space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium"
              >
                Apply Filters ({filteredProducts.length} Results)
              </button>
              <button
                onClick={resetAllFilters}
                className="w-full py-2 bg-[#F5F0E8] text-[#4E3E37] text-xs uppercase tracking-wider"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
