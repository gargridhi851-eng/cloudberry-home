import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowRight, Sparkles, ChevronRight, Eye } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const CategoryGrid: React.FC = () => {
  const { categories, setActiveTab, setFilterCategory, setFilterCollection } = useStore();

  // Track active photo index per category card in the grid
  const [activePhotoIdxs, setActivePhotoIdxs] = useState<Record<string, number>>({});

  const handleCategorySelect = (slug: string) => {
    setActiveTab('shop');
    setFilterCategory(slug);
    setFilterCollection('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setPhotoForCategory = (catId: string, idx: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setActivePhotoIdxs((prev) => ({ ...prev, [catId]: idx }));
  };

  return (
    <section className="py-16 sm:py-24 bg-[#FAF8F5] border-b border-[#EAE3D9] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-[#EAE3D9] pb-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium">
              <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
              <span>Curated Departments</span>
              <span aria-hidden="true">·</span>
              <span>15 Living Spaces</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight">
              Explore Departments & Living Collections
            </h2>
            <p className="text-sm text-[#7A6B63] max-w-xl">
              Each department is photographed in authentic living contexts. Hover cards or click the indicator dots to view multiple photos, artisan textures, and ambient styling.
            </p>
          </div>

          <button
            onClick={() => {
              setActiveTab('shop');
              setFilterCategory('all');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="group inline-flex items-center text-xs uppercase tracking-[0.16em] font-medium text-[#4E3E37] hover:text-[#2E2420] transition-colors py-2"
          >
            <span>View All {categories.length} Departments</span>
            <ArrowRight className="w-3.5 h-3.5 ml-2 transition-transform group-hover:translate-x-1.5" />
          </button>
        </div>

        {/* Grid of All 15 Departments with Multi-Photo Preview Controls & Subtle Animations */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6">
          {categories.map((cat, cardIdx) => {
            const photoList = cat.images && cat.images.length > 0 ? cat.images : [cat.image];
            const currentIdx = activePhotoIdxs[cat.id] || 0;
            const currentPhoto = photoList[currentIdx] || photoList[0];

            return (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: (cardIdx % 5) * 0.05 }}
                onClick={() => handleCategorySelect(cat.slug)}
                className="group cursor-pointer flex flex-col bg-[#FAF8F5] border border-[#EAE3D9] overflow-hidden transition-all duration-500 hover:-translate-y-1.5 hover:shadow-xl hover:border-[#D6C8B8]"
              >
                {/* Image Container with Multi-Photo cycling */}
                <div className="relative aspect-[4/3] sm:aspect-square overflow-hidden bg-[#EAE3D9]">
                  
                  {/* Animated Image with Crossfade */}
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={currentPhoto}
                      src={currentPhoto}
                      alt={`${cat.name} photo ${currentIdx + 1}`}
                      initial={{ opacity: 0.85, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0.85 }}
                      transition={{ duration: 0.25 }}
                      className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
                      referrerPolicy="no-referrer"
                      loading="lazy"
                    />
                  </AnimatePresence>

                  {/* Gradient overlay on hover */}
                  <div className="absolute inset-0 bg-[#2E2420]/15 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  {/* Top highlight badge */}
                  {cat.highlight && (
                    <div className="absolute top-2 left-2 z-10 pointer-events-none">
                      <span className="bg-[#FAF8F5]/90 backdrop-blur-sm text-[#4E3E37] text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 border border-[#EAE3D9]">
                        {cat.highlight}
                      </span>
                    </div>
                  )}

                  {/* Multi-Photo Dots Selector on Card */}
                  {photoList.length > 1 && (
                    <div
                      className="absolute bottom-2.5 inset-x-0 flex items-center justify-center gap-1.5 z-20"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {photoList.map((_, dotIdx) => (
                        <button
                          key={dotIdx}
                          onClick={(e) => setPhotoForCategory(cat.id, dotIdx, e)}
                          className={`h-1.5 transition-all duration-300 rounded-full cursor-pointer ${
                            currentIdx === dotIdx
                              ? 'w-4 bg-white shadow'
                              : 'w-1.5 bg-white/60 hover:bg-white hover:w-2.5'
                          }`}
                          aria-label={`View photo ${dotIdx + 1} for ${cat.name}`}
                        />
                      ))}
                    </div>
                  )}

                  {/* Photo count indicator top-right */}
                  <span className="absolute top-2 right-2 bg-black/40 backdrop-blur-sm text-white text-[9px] font-mono px-1.5 py-0.5 pointer-events-none tabular-nums">
                    {currentIdx + 1}/{photoList.length}
                  </span>
                </div>

                {/* Title and metadata */}
                <div className="p-3.5 sm:p-4 flex flex-col justify-between flex-grow bg-[#FAF8F5] transition-colors group-hover:bg-[#F5F0E8]">
                  <div>
                    <h3 className="font-serif text-base sm:text-lg text-[#2E2420] group-hover:text-[#4E3E37] transition-colors leading-snug font-medium">
                      {cat.name}
                    </h3>
                    <p className="text-[11px] sm:text-xs text-[#7A6B63] mt-1 tracking-wider uppercase font-medium flex items-center justify-between">
                      <span>{cat.itemCount} items</span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-[#4E3E37]" />
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
