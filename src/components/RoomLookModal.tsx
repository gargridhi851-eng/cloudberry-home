import React from 'react';
import { X, ShoppingBag, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const RoomLookModal: React.FC = () => {
  const {
    selectedRoomLook,
    setSelectedRoomLook,
    products,
    addToCart,
    showToast,
  } = useStore();

  if (!selectedRoomLook) return null;

  const lookProducts = products.filter((p) => selectedRoomLook.productIds.includes(p.id));
  const totalLookPrice = lookProducts.reduce((sum, p) => sum + p.price, 0);

  const addAllToCart = () => {
    lookProducts.forEach((p) => {
      addToCart(p, 1);
    });
    showToast(`Added all ${lookProducts.length} items from "${selectedRoomLook.title}" to bag!`);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-4xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-8">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedRoomLook(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#4E3E37] bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer shadow"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Room Photo and Concept */}
          <div className="md:col-span-5 bg-[#F5F0E8] border-b md:border-b-0 md:border-r border-[#EAE3D9] p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#EAE3D9]">
                <img
                  src={selectedRoomLook.image}
                  alt={selectedRoomLook.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div>
                <span className="text-[11px] uppercase tracking-[0.2em] text-[#6D7F6E] font-medium block mb-1">
                  Style Your Space
                </span>
                <h3 className="font-serif text-2xl text-[#2E2420]">
                  {selectedRoomLook.title}
                </h3>
                <p className="font-serif italic text-sm text-[#7A6B63] mt-0.5">
                  {selectedRoomLook.subtitle}
                </p>
                <p className="text-xs sm:text-sm text-[#6B5A51] mt-3 leading-relaxed">
                  {selectedRoomLook.description}
                </p>
              </div>
            </div>

            {/* Look Total & Add All Action */}
            <div className="pt-6 mt-6 border-t border-[#EAE3D9]">
              <div className="flex items-center justify-between mb-3 text-xs">
                <span className="uppercase tracking-wider text-[#7A6B63]">Complete Look ({lookProducts.length} Pieces)</span>
                <span className="font-mono text-base font-semibold text-[#2E2420]">
                  ₹{totalLookPrice.toLocaleString('en-IN')}
                </span>
              </div>
              <button
                onClick={addAllToCart}
                className="w-full py-3 bg-[#4E3E37] text-white text-xs uppercase tracking-[0.16em] font-medium hover:bg-[#2E2420] transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add Complete Look to Bag</span>
              </button>
            </div>
          </div>

          {/* Right Column: List of items featured in this look */}
          <div className="md:col-span-7 p-6 space-y-4">
            <div className="border-b border-[#EAE3D9] pb-3">
              <h4 className="text-xs uppercase tracking-[0.16em] font-medium text-[#4E3E37]">
                Featured Products in this Interior ({lookProducts.length})
              </h4>
            </div>

            <div className="space-y-4">
              {lookProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="flex items-center gap-4 p-3 bg-white border border-[#EAE3D9] hover:border-[#D6C8B8] transition-colors"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.name}
                    className="w-16 h-20 object-cover bg-[#F5F0E8] shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  
                  <div className="flex-grow min-w-0">
                    <span className="text-[10px] uppercase tracking-wider text-[#7A6B63] block">
                      {prod.category}
                    </span>
                    <h5 className="font-serif text-sm sm:text-base text-[#2E2420] truncate font-medium">
                      {prod.name}
                    </h5>
                    <div className="flex items-baseline gap-2 mt-1">
                      <span className="font-mono text-sm font-semibold text-[#2E2420]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </span>
                      {prod.comparePrice && (
                        <span className="text-xs text-[#9B8C83] line-through font-mono">
                          ₹{prod.comparePrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => addToCart(prod, 1)}
                    className="shrink-0 px-3.5 py-2 bg-[#F5F0E8] hover:bg-[#4E3E37] text-[#4E3E37] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Add</span>
                  </button>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
