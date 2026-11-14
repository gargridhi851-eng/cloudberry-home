import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Truck, RefreshCw, Star, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const ProductDetailModal: React.FC = () => {
  const {
    selectedProduct,
    setSelectedProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
  } = useStore();

  const [selectedImageIdx, setSelectedImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState<string>('');

  if (!selectedProduct) return null;

  const isFavorited = isInWishlist(selectedProduct.id);
  const discountPercent = selectedProduct.comparePrice
    ? Math.round(((selectedProduct.comparePrice - selectedProduct.price) / selectedProduct.comparePrice) * 100)
    : 0;

  const currentColor = selectedColor || (selectedProduct.colors && selectedProduct.colors[0]?.name) || '';

  const handleAddToCart = () => {
    addToCart(selectedProduct, quantity, currentColor);
    setSelectedProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-4xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setSelectedProduct(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#4E3E37] bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer shadow"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12 max-h-[90vh] overflow-y-auto">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 bg-[#F5F0E8] p-6 flex flex-col justify-between border-b md:border-b-0 md:border-r border-[#EAE3D9]">
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-[4/5] w-full bg-[#EAE3D9] overflow-hidden rounded-sm">
                <img
                  src={selectedProduct.images[selectedImageIdx] || selectedProduct.images[0]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover object-center"
                  referrerPolicy="no-referrer"
                />
                {discountPercent > 0 && (
                  <span className="absolute top-3 left-3 bg-[#B88E3E] text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5">
                    {discountPercent}% Off
                  </span>
                )}
              </div>

              {/* Thumbnails if multiple images */}
              {selectedProduct.images.length > 1 && (
                <div className="flex gap-2">
                  {selectedProduct.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImageIdx(idx)}
                      className={`w-16 h-16 border-2 overflow-hidden transition-all cursor-pointer ${
                        selectedImageIdx === idx ? 'border-[#4E3E37]' : 'border-transparent opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Trust Notes */}
            <div className="mt-6 pt-4 border-t border-[#EAE3D9] grid grid-cols-3 gap-2 text-center text-[10px] uppercase tracking-wider text-[#7A6B63]">
              <div className="flex flex-col items-center gap-1">
                <Truck className="w-4 h-4 text-[#B88E3E]" />
                <span>Express Courier</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-[#B88E3E]" />
                <span>Fragile Insured</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="w-4 h-4 text-[#B88E3E]" />
                <span>7-Day Return</span>
              </div>
            </div>
          </div>

          {/* Right Column: Contiguous Purchase Module */}
          <div className="md:col-span-6 p-6 sm:p-8 space-y-5 flex flex-col justify-between">
            
            <div className="space-y-4">
              {/* Category & Rating */}
              <div className="flex items-center justify-between text-xs text-[#7A6B63] uppercase tracking-wider">
                <span>{selectedProduct.category} · {selectedProduct.collection}</span>
                <div className="flex items-center gap-1 text-[#B88E3E]">
                  <Star className="w-3.5 h-3.5 fill-current" />
                  <span className="font-mono text-xs text-[#4E3E37]">{selectedProduct.rating.toFixed(1)}</span>
                  <span className="text-[11px] text-[#7A6B63]">({selectedProduct.reviewCount})</span>
                </div>
              </div>

              {/* Title & Subtitle */}
              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#2E2420] leading-snug">
                  {selectedProduct.name}
                </h2>
                <p className="font-serif italic text-sm text-[#6D7F6E] mt-1">
                  {selectedProduct.subtitle}
                </p>
              </div>

              {/* Price Block */}
              <div className="flex items-baseline gap-3 py-2 border-y border-[#EAE3D9]">
                <span className="font-mono text-2xl font-semibold text-[#2E2420]">
                  ₹{selectedProduct.price.toLocaleString('en-IN')}
                </span>
                {selectedProduct.comparePrice && (
                  <span className="font-mono text-sm text-[#9B8C83] line-through">
                    ₹{selectedProduct.comparePrice.toLocaleString('en-IN')}
                  </span>
                )}
                <span className="text-[11px] text-[#6D7F6E] ml-auto font-medium">
                  Inclusive of all taxes
                </span>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                {selectedProduct.description}
              </p>

              {/* Color Options */}
              {selectedProduct.colors && selectedProduct.colors.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs uppercase tracking-wider text-[#4E3E37] font-medium flex items-center justify-between">
                    <span>Finish / Color:</span>
                    <span className="text-[#6D7F6E] font-serif italic capitalize">{currentColor}</span>
                  </div>
                  <div className="flex gap-2.5">
                    {selectedProduct.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all cursor-pointer ${
                          currentColor === c.name ? 'border-[#4E3E37] scale-110' : 'border-transparent'
                        }`}
                        title={c.name}
                      >
                        <span
                          className="w-5 h-5 rounded-full border border-black/15 flex items-center justify-center"
                          style={{ backgroundColor: c.hex }}
                        >
                          {currentColor === c.name && (
                            <Check className="w-3 h-3 text-[#2E2420] stroke-[3]" />
                          )}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Specifications: Dimensions, Materials */}
              <div className="bg-[#F5F0E8] p-3 text-xs space-y-1.5 border border-[#EAE3D9]">
                <div>
                  <strong className="text-[#4E3E37]">Dimensions:</strong>{' '}
                  <span className="text-[#6B5A51]">{selectedProduct.dimensions}</span>
                </div>
                <div>
                  <strong className="text-[#4E3E37]">Materials:</strong>{' '}
                  <span className="text-[#6B5A51]">{selectedProduct.materials}</span>
                </div>
                {selectedProduct.careInstructions && (
                  <div>
                    <strong className="text-[#4E3E37]">Care:</strong>{' '}
                    <span className="text-[#6B5A51]">{selectedProduct.careInstructions}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Purchase Action Box */}
            <div className="pt-4 space-y-3">
              
              {/* Stock status */}
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-1.5 text-[#6D7F6E] font-medium">
                  <span className="w-2 h-2 rounded-full bg-[#6D7F6E]" />
                  In Stock · Ready to dispatch ({selectedProduct.stockCount} units available)
                </span>
              </div>

              {/* Stepper + Buy Button + Wishlist */}
              <div className="flex items-center gap-3">
                {/* Quantity Stepper */}
                <div className="flex items-center border border-[#EAE3D9] bg-white text-xs">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="px-3 py-2.5 text-[#4E3E37] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-2.5 font-mono text-xs font-semibold tabular-nums">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(selectedProduct.stockCount, q + 1))}
                    className="px-3 py-2.5 text-[#4E3E37] hover:bg-[#F5F0E8] transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>

                {/* Add to Bag */}
                <button
                  onClick={handleAddToCart}
                  className="flex-grow py-3 bg-[#4E3E37] hover:bg-[#2E2420] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag — ₹{(selectedProduct.price * quantity).toLocaleString('en-IN')}</span>
                </button>

                {/* Wishlist toggle */}
                <button
                  onClick={() => toggleWishlist(selectedProduct.id)}
                  className={`p-3 border transition-colors cursor-pointer ${
                    isFavorited
                      ? 'border-[#B88E3E] bg-[#B88E3E] text-white'
                      : 'border-[#EAE3D9] bg-white text-[#4E3E37] hover:border-[#4E3E37]'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
                </button>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
