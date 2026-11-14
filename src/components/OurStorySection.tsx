import React from 'react';
import { HERO_IMAGES } from '../data/initialData.ts';
import { ArrowRight, Sparkles, Shield, HeartHandshake, Feather } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const OurStorySection: React.FC = () => {
  const { setActiveTab } = useStore();

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Narrative Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Visual Composition */}
          <div className="lg:col-span-6 relative">
            <div className="relative aspect-[4/3] rounded-sm overflow-hidden bg-[#EAE3D9] shadow-lg">
              <img
                src={HERO_IMAGES.accessories}
                alt="Cloudberry Home artisanal ceramic craftsmanship and mindful living details"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Inset Accent Visual */}
            <div className="hidden sm:block absolute -bottom-10 -right-8 w-1/2 aspect-[4/3] rounded-sm overflow-hidden border-4 border-[#FAF8F5] shadow-xl bg-[#F5F0E8]">
              <img
                src={HERO_IMAGES.livingRoom}
                alt="Warm living room ambient details"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>

          {/* Right Column: Narrative Copy */}
          <div className="lg:col-span-6 space-y-6 lg:pl-6">
            
            <div className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium">
              About Cloudberry Home
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight leading-[1.15]">
              Beautiful Living, Thoughtfully Chosen
            </h2>

            <p className="text-base text-[#6B5A51] leading-relaxed">
              At Cloudberry Home, we believe home is not merely a place of shelter, but an intimate reflection of inner calm. In a world crowded with fleeting fast decor, we curate timeless, handcrafted objects that ground daily rituals in warmth and quiet elegance.
            </p>

            <p className="text-sm sm:text-base text-[#6B5A51] leading-relaxed">
              Every ceramic vessel, woven linen throw, and warm brass lamp in our catalog is thoughtfully selected for its tactile authenticity, sustainable materials, and enduring soul. We work directly with generational artisans, potters, and weavers across India and global craft heritage centers to bring honest craftsmanship into contemporary living spaces.
            </p>

            {/* Four Ethical Pillars */}
            <div className="grid grid-cols-2 gap-6 pt-4 border-t border-[#EAE3D9]">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#4E3E37]">
                  <Feather className="w-4 h-4 text-[#B88E3E]" />
                  <h4 className="font-serif text-base text-[#2E2420] font-semibold">Honest Materials</h4>
                </div>
                <p className="text-xs text-[#7A6B63] leading-normal">
                  Natural stone, unglazed stoneware, pure flax linen, and solid wood without artificial veneers.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#4E3E37]">
                  <HeartHandshake className="w-4 h-4 text-[#B88E3E]" />
                  <h4 className="font-serif text-base text-[#2E2420] font-semibold">Artisan Roots</h4>
                </div>
                <p className="text-xs text-[#7A6B63] leading-normal">
                  Fair trade partnerships supporting generational master carvers and textile guilds.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#4E3E37]">
                  <Sparkles className="w-4 h-4 text-[#B88E3E]" />
                  <h4 className="font-serif text-base text-[#2E2420] font-semibold">Quiet Luxury</h4>
                </div>
                <p className="text-xs text-[#7A6B63] leading-normal">
                  Understated silhouettes in cream, ivory, sage, and mocha that age gracefully.
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-[#4E3E37]">
                  <Shield className="w-4 h-4 text-[#B88E3E]" />
                  <h4 className="font-serif text-base text-[#2E2420] font-semibold">Conscious Care</h4>
                </div>
                <p className="text-xs text-[#7A6B63] leading-normal">
                  100% recyclable plastic-free honeycomb paper packaging and safe transit assurance.
                </p>
              </div>
            </div>

            <div className="pt-4">
              <button
                onClick={() => {
                  setActiveTab('shop');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center px-8 py-3.5 bg-[#4E3E37] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2E2420] transition-colors rounded-none cursor-pointer group"
              >
                <span>Shop the Thoughtful Collection</span>
                <ArrowRight className="w-3.5 h-3.5 ml-2.5 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
