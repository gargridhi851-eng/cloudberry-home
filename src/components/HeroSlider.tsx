import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { HERO_IMAGES } from '../data/initialData.ts';
import { useStore } from '../context/StoreContext.tsx';

export const HeroSlider: React.FC = () => {
  const { setActiveTab, setFilterCollection, setFilterCategory } = useStore();

  return (
    <section
      className="relative bg-[#FAF8F5] border-b border-[#EAE3D9] overflow-hidden"
      aria-label="Homepage Editorial Showcase"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch min-h-[520px] lg:min-h-[580px]">
          
          {/* Left Column: Editorial Headline, Subtitle, Copy & CTAs */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6 lg:pr-4 z-10">
            
            {/* Editorial Kicker */}
            <div className="flex items-center gap-2 text-xs tracking-[0.2em] uppercase text-[#6B5A51] font-medium">
              <span>Cloudberry Home</span>
              <span aria-hidden="true">/</span>
              <span>Curated Living Editorial</span>
            </div>

            {/* Headline */}
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-[#2E2420] leading-[1.12] text-balance">
              Make Room for Beautiful Living
            </h1>

            {/* Subtitle */}
            <p className="font-serif italic text-xl sm:text-2xl text-[#6D7F6E] tracking-wide">
              Every Detail Tells a Story.
            </p>

            {/* Narrative description */}
            <p className="text-sm sm:text-base text-[#6B5A51] leading-relaxed max-w-lg">
              Sculptural furnishings, tactile washed linens, and warm ambient lighting thoughtfully composed for everyday serenity.
            </p>

            {/* Two Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setActiveTab('collections');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-7 py-3.5 bg-[#4E3E37] text-[#FAF8F5] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2E2420] transition-colors rounded-none group cursor-pointer shadow-sm"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2.5 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('shop');
                  setFilterCategory('all');
                  setFilterCollection('all');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-7 py-3.5 border border-[#4E3E37] text-[#4E3E37] text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#4E3E37] hover:text-[#FAF8F5] transition-colors rounded-none cursor-pointer"
              >
                <span>Shop New Arrivals</span>
              </button>
            </div>

            {/* Editorial Features Strip */}
            <div className="pt-6 border-t border-[#EAE3D9] flex items-center gap-6 text-xs text-[#7A6B63]">
              <div>
                <span className="font-medium text-[#2E2420] block">Pure Stoneware</span>
                <span>Hand-finished glazes</span>
              </div>
              <div className="w-[1px] h-8 bg-[#EAE3D9]" />
              <div>
                <span className="font-medium text-[#2E2420] block">Solid Oak & Brass</span>
                <span>Heirloom materials</span>
              </div>
              <div className="w-[1px] h-8 bg-[#EAE3D9]" />
              <div>
                <span className="font-medium text-[#2E2420] block">Pan-India Courier</span>
                <span>White-glove fragile care</span>
              </div>
            </div>
          </div>

          {/* Right Column: Large Cinematic High-Quality Interior Image */}
          <div className="lg:col-span-7 relative flex items-center">
            <div className="relative w-full h-[400px] sm:h-[480px] lg:h-full rounded-sm overflow-hidden bg-[#EFE8DE] shadow-[0_12px_40px_-15px_rgba(78,62,55,0.12)] border border-[#EAE3D9]">
              
              <img
                src={HERO_IMAGES.livingRoom}
                alt="Editorial luxury living room with cream bouclé sofa, fluted ceramic vases, oak coffee table, and warm sunlight"
                className="w-full h-full object-cover object-center transition-transform duration-700 ease-out hover:scale-[1.02]"
                referrerPolicy="no-referrer"
              />

              {/* Gentle warm ambient gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#2E2420]/30 via-transparent to-transparent pointer-events-none" />

              {/* Editorial Badge in corner */}
              <div className="absolute bottom-6 left-6 flex items-center gap-2 bg-[#FAF8F5]/90 backdrop-blur-md px-3.5 py-1.5 border border-[#EAE3D9] shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                <span className="text-[11px] uppercase tracking-wider text-[#4E3E37] font-medium">
                  The Autumn Living Editorial · Handcrafted Neutral Living
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
