import React, { useState } from 'react';
import { useStore } from '../context/StoreContext.tsx';
import { Sparkles, ArrowRight } from 'lucide-react';

export const RoomInspiration: React.FC = () => {
  const { roomLooks, setSelectedRoomLook, setActiveTab } = useStore();
  const [selectedRoomType, setSelectedRoomType] = useState<string>('all');

  const filterTabs = [
    { label: 'All Spaces', value: 'all' },
    { label: 'Living Rooms', value: 'living-room' },
    { label: 'Bedrooms', value: 'bedroom' },
    { label: 'Reading Corners', value: 'reading-corner' },
    { label: 'Dining Tables', value: 'dining-table' },
    { label: 'Entryways', value: 'entryway' },
  ];

  const filteredLooks = roomLooks.filter((r) => {
    if (selectedRoomType === 'all') return true;
    return r.roomType === selectedRoomType;
  });

  return (
    <section className="py-20 sm:py-28 bg-[#FAF8F5] border-b border-[#EAE3D9]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div className="max-w-xl">
            <div className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium mb-2.5">
              Interior Editorial
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#2E2420] tracking-tight mb-3">
              Style Your Space
            </h2>
            <p className="text-sm sm:text-base text-[#6B5A51] leading-relaxed">
              Explore meticulously styled environments where lighting, sculpture, and organic textiles converge. Click &quot;Shop This Look&quot; on any setting to curate the pieces in your home.
            </p>
          </div>

          {/* Interactive room tabs */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F5F0E8] max-w-full overflow-x-auto self-start md:self-end">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => setSelectedRoomType(tab.value)}
                className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium transition-all whitespace-nowrap cursor-pointer ${
                  selectedRoomType === tab.value
                    ? 'bg-[#4E3E37] text-white shadow-sm'
                    : 'text-[#6B5A51] hover:text-[#2E2420] hover:bg-white/60'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredLooks.map((look) => (
            <div
              key={look.id}
              className="group flex flex-col bg-[#F5F0E8] border border-[#EAE3D9] overflow-hidden transition-all duration-300 hover:shadow-xl"
            >
              {/* Room Image Stage */}
              <div className="relative aspect-[4/3] bg-[#EAE3D9] overflow-hidden">
                <img
                  src={look.image}
                  alt={look.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
                  referrerPolicy="no-referrer"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* Floating "Shop This Look" Button right on image */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-white text-xs font-serif italic tracking-wide drop-shadow-sm">
                    {look.productIds.length} styled pieces
                  </span>
                  <button
                    onClick={() => setSelectedRoomLook(look)}
                    className="px-4 py-2 bg-[#FAF8F5] text-[#2E2420] hover:bg-[#4E3E37] hover:text-[#FAF8F5] text-xs uppercase tracking-[0.14em] font-semibold transition-all shadow-md flex items-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#B88E3E]" />
                    <span>Shop This Look</span>
                  </button>
                </div>
              </div>

              {/* Room Text Details */}
              <div className="p-5 flex flex-col flex-grow justify-between space-y-3 bg-[#FAF8F5]">
                <div>
                  <h3 className="font-serif text-xl text-[#2E2420] leading-snug">
                    {look.title}
                  </h3>
                  <p className="font-serif italic text-xs text-[#7A6B63] mt-0.5">
                    {look.subtitle}
                  </p>
                  <p className="text-xs text-[#6B5A51] mt-2 line-clamp-2 leading-relaxed">
                    {look.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] flex items-center justify-between">
                  <button
                    onClick={() => setSelectedRoomLook(look)}
                    className="text-xs uppercase tracking-wider font-medium text-[#4E3E37] hover:text-[#2E2420] inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform cursor-pointer"
                  >
                    <span>View Staged Pieces</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
