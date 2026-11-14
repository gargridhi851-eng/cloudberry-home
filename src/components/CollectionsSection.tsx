import React from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { ArrowRight } from 'lucide-react';

export const CollectionsSection: React.FC = () => {
  const { collections, setActiveTab, setFilterCollection, setFilterCategory } = useStore();

  const handleCollectionClick = (slug: string) => {
    setActiveTab('shop');
    setFilterCollection(slug);
    setFilterCategory('all');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section className="py-20 bg-[#F5F0E8] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium mb-2.5">
            Thematic Narratives
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight mb-4">
            Special Collections
          </h2>
          <p className="text-sm sm:text-base text-[#6B5A51] leading-relaxed">
            Thoughtfully grouped around architectural moods, material sensibilities, and gentle daily rhythms.
          </p>
        </div>

        {/* Collections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {collections.map((col, idx) => (
            <div
              key={col.id}
              onClick={() => handleCollectionClick(col.slug)}
              className={`group cursor-pointer flex flex-col bg-[#FAF8F5] border border-[#EAE3D9] overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[#D9CFC4] ${
                idx === 0 ? 'lg:col-span-2 lg:flex-row' : ''
              }`}
            >
              {/* Image Frame */}
              <div
                className={`relative overflow-hidden bg-[#EAE3D9] ${
                  idx === 0
                    ? 'lg:w-3/5 aspect-[16/10] lg:aspect-auto'
                    : 'aspect-[4/3]'
                }`}
              >
                <img
                  src={col.image}
                  alt={col.name}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-[#2E2420]/15 group-hover:bg-[#2E2420]/25 transition-colors duration-300" />
                <span className="absolute top-4 left-4 text-[10px] uppercase tracking-widest font-semibold bg-[#FAF8F5]/90 backdrop-blur-sm text-[#4E3E37] px-2.5 py-1 border border-[#EAE3D9]">
                  {col.tag}
                </span>
              </div>

              {/* Text Info */}
              <div
                className={`p-6 sm:p-8 flex flex-col justify-between ${
                  idx === 0 ? 'lg:w-2/5' : ''
                }`}
              >
                <div className="space-y-3">
                  <span className="text-[11px] uppercase tracking-widest text-[#6D7F6E] font-medium block">
                    {col.subtitle}
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#2E2420] group-hover:text-[#4E3E37] transition-colors leading-tight">
                    {col.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                    {col.description}
                  </p>
                </div>

                <div className="pt-6 mt-6 border-t border-[#EAE3D9] flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.16em] font-medium text-[#4E3E37] group-hover:text-[#2E2420] inline-flex items-center gap-2">
                    <span>Explore Collection</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
