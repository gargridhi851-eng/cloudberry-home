import React, { useState } from 'react';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotal,
    cartItemCount,
    appliedCoupon,
    discountAmount,
    applyCouponCode,
    removeCoupon,
    setIsCheckoutOpen,
    setActiveTab,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const [isApplying, setIsApplying] = useState(false);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const freeShippingDifference = freeShippingThreshold - cartSubtotal;
  const isFreeShipping = freeShippingDifference <= 0;
  const progressPercent = Math.min(100, Math.round((cartSubtotal / freeShippingThreshold) * 100));

  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const tax = Math.round(cartSubtotal * 0.05); // 5% GST
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + tax);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setIsApplying(true);
    await applyCouponCode(couponInput.trim());
    setIsApplying(false);
    setCouponInput('');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/50 backdrop-blur-sm flex justify-end animate-fade-in">
      <div className="w-full max-w-md bg-[#FAF8F5] h-full shadow-2xl flex flex-col justify-between border-l border-[#EAE3D9]">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-[#EAE3D9] flex items-center justify-between bg-[#FAF8F5]">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#4E3E37]" />
            <h2 className="font-serif text-xl text-[#2E2420]">
              Shopping Bag ({cartItemCount})
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-1.5 text-[#7A6B63] hover:text-[#2E2420] transition-colors cursor-pointer"
            aria-label="Close cart"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress Notification */}
        <div className="bg-[#F5F0E8] px-5 py-3 border-b border-[#EAE3D9]">
          <div className="text-xs text-[#4E3E37] flex items-center justify-between mb-1.5">
            {isFreeShipping ? (
              <span className="font-medium text-[#6D7F6E] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                You unlocked Complimentary Express Delivery!
              </span>
            ) : (
              <span>
                Add <strong className="font-semibold font-mono">₹{freeShippingDifference.toLocaleString('en-IN')}</strong> more for Free Delivery
              </span>
            )}
            <span className="font-mono text-[10px] text-[#7A6B63]">{progressPercent}%</span>
          </div>
          <div className="w-full bg-[#EAE3D9] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#6D7F6E] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Cart Itemized List */}
        <div className="flex-grow overflow-y-auto p-5 space-y-4">
          {cart.length === 0 ? (
            <div className="py-16 text-center space-y-4">
              <ShoppingBag className="w-12 h-12 text-[#D6C8B8] mx-auto stroke-[1.2]" />
              <h3 className="font-serif text-xl text-[#2E2420]">Your bag is currently empty</h3>
              <p className="text-xs text-[#7A6B63] max-w-xs mx-auto">
                Discover handcrafted living room pieces, sculptural vases, and warm ambient lighting.
              </p>
              <button
                onClick={() => {
                  setIsCartOpen(false);
                  setActiveTab('shop');
                }}
                className="px-6 py-2.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2E2420] transition-colors cursor-pointer"
              >
                Explore Shop
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedColor || ''}`}
                className="flex gap-4 p-3.5 bg-white border border-[#EAE3D9] transition-all"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="w-20 h-24 object-cover bg-[#F5F0E8] shrink-0"
                  referrerPolicy="no-referrer"
                />

                {/* Details */}
                <div className="flex flex-col justify-between flex-grow min-w-0">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-[#7A6B63]">
                      {item.product.category}
                    </span>
                    <h4 className="font-serif text-base text-[#2E2420] truncate font-medium">
                      {item.product.name}
                    </h4>
                    {item.selectedColor && (
                      <span className="text-xs text-[#7A6B63] italic">
                        Color: {item.selectedColor}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#F5F0E8]">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#EAE3D9] bg-[#FAF8F5] text-xs">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="px-2.5 py-1 text-[#4E3E37] hover:bg-[#EAE3D9] cursor-pointer"
                      >
                        -
                      </button>
                      <span className="px-2 font-mono tabular-nums text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="px-2.5 py-1 text-[#4E3E37] hover:bg-[#EAE3D9] cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="font-mono text-sm font-semibold text-[#2E2420]">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-[#9B8C83] hover:text-[#C53929] transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Checkout & Summary Module */}
        {cart.length > 0 && (
          <div className="p-5 border-t border-[#EAE3D9] bg-[#FAF8F5] space-y-4">
            
            {/* Coupon Code Input */}
            <div>
              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 bg-[#EDF2ED] border border-[#CCD8CC] text-xs text-[#4E3E37]">
                  <div className="flex items-center gap-1.5 text-[#6D7F6E]">
                    <Check className="w-4 h-4" />
                    <span className="font-semibold">{appliedCoupon.code}</span> applied: -₹{discountAmount.toLocaleString('en-IN')}
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-xs text-[#C53929] hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-grow">
                    <input
                      type="text"
                      placeholder="Discount code (e.g. CLOUDBERRY10)"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs uppercase text-[#2E2420] placeholder-[#9B8C83] focus:outline-none focus:border-[#4E3E37]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#9B8C83] absolute right-3 top-2.5" />
                  </div>
                  <button
                    type="submit"
                    disabled={isApplying}
                    className="px-4 py-2 bg-[#EAE3D9] hover:bg-[#4E3E37] text-[#4E3E37] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </form>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-1.5 text-xs text-[#6B5A51]">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono text-[#2E2420]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#6D7F6E]">
                  <span>Promo Discount ({appliedCoupon?.code})</span>
                  <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated GST (5%)</span>
                <span className="font-mono text-[#2E2420]">₹{tax.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Pan-India Delivery</span>
                <span className="font-mono">
                  {shippingFee === 0 ? (
                    <span className="text-[#6D7F6E] uppercase font-semibold">Free</span>
                  ) : (
                    `₹${shippingFee}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#2E2420] pt-2 border-t border-[#EAE3D9]">
                <span>Estimated Total</span>
                <span className="font-mono text-base">₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Checkout Action Button */}
            <button
              onClick={handleProceedToCheckout}
              className="w-full py-3.5 bg-[#4E3E37] hover:bg-[#2E2420] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <p className="text-[10px] text-center text-[#7A6B63] uppercase tracking-wider">
              100% Secure Payments via Razorpay · Cash on Delivery Supported
            </p>
          </div>
        )}

      </div>
    </div>
  );
};
