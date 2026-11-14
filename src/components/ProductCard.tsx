import React from 'react';
import { Heart, Eye, ShoppingBag, Star } from 'lucide-react';
import { Product } from '../types/index.ts';
import { useStore } from '../context/StoreContext.tsx';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    addToCart,
    toggleWishlist,
    isInWishlist,
    setSelectedProduct,
  } = useStore();

  const isFavorited = isInWishlist(product.id);
  const discountPercent = product.comparePrice
    ? Math.round(((product.comparePrice - product.price) / product.comparePrice) * 100)
    : 0;

  return (
    <div className="group flex flex-col bg-[#FAF8F5] border border-[#EAE3D9] overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-[#D6C8B8]">
      
      {/* Product Image Stage */}
      <div className="relative aspect-[4/5] bg-[#F5F0E8] overflow-hidden cursor-pointer" onClick={() => setSelectedProduct(product)}>
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          referrerPolicy="no-referrer"
          loading="lazy"
        />

        {/* Quiet subtle tag if new or discounted */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
          {product.isNew && (
            <span className="bg-[#FAF8F5]/90 backdrop-blur-sm text-[#4E3E37] text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 border border-[#EAE3D9]">
              New Arrival
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#B88E3E] text-white text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5">
              {discountPercent}% Off
            </span>
          )}
        </div>

        {/* Action icons top right */}
        <div className="absolute top-3 right-3 flex flex-col gap-1.5 z-10">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleWishlist(product.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-colors cursor-pointer shadow-sm ${
              isFavorited
                ? 'bg-[#B88E3E] text-white'
                : 'bg-[#FAF8F5]/90 text-[#4E3E37] hover:text-[#B88E3E] hover:bg-white'
            }`}
            aria-label={isFavorited ? 'Remove from wishlist' : 'Save to wishlist'}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProduct(product);
            }}
            className="p-2 rounded-full bg-[#FAF8F5]/90 text-[#4E3E37] hover:text-[#2E2420] hover:bg-white backdrop-blur-md transition-colors cursor-pointer shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            aria-label="Quick view product"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Add Overlay on bottom of image for desktop */}
        <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-[#2E2420]/60 via-[#2E2420]/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex items-center justify-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(product);
            }}
            className="w-full py-2.5 bg-[#FAF8F5] text-[#2E2420] text-xs uppercase tracking-wider font-medium hover:bg-[#4E3E37] hover:text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Add to Bag</span>
          </button>
        </div>
      </div>

      {/* Product Information Body */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow justify-between space-y-3">
        <div>
          {/* Unboxed clean metadata kicker */}
          <div className="flex items-center justify-between text-[11px] text-[#7A6B63] tracking-widest uppercase mb-1.5 font-medium">
            <span>{product.category}</span>
            <div className="flex items-center gap-1 text-[#B88E3E]">
              <Star className="w-3 h-3 fill-current" />
              <span className="font-mono tabular-nums text-xs text-[#4E3E37]">{product.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Product Name */}
          <h3
            onClick={() => setSelectedProduct(product)}
            className="font-serif text-base sm:text-lg text-[#2E2420] hover:text-[#6D7F6E] transition-colors leading-snug cursor-pointer line-clamp-1"
          >
            {product.name}
          </h3>

          <p className="text-xs text-[#7A6B63] line-clamp-1 mt-1 font-light">
            {product.subtitle}
          </p>
        </div>

        {/* Price & Mobile Add Button */}
        <div className="pt-2 border-t border-[#EAE3D9] flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-base sm:text-lg font-semibold text-[#2E2420] font-mono tabular-nums">
              ₹{product.price.toLocaleString('en-IN')}
            </span>
            {product.comparePrice && (
              <span className="text-xs text-[#9B8C83] line-through font-mono tabular-nums">
                ₹{product.comparePrice.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          {/* Mobile direct Add to Cart button */}
          <button
            onClick={() => addToCart(product)}
            className="sm:hidden p-2 text-[#4E3E37] bg-[#EFE8DE] hover:bg-[#4E3E37] hover:text-white transition-colors rounded-none cursor-pointer"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
