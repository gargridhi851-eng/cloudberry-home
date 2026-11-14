import React, { useState } from 'react';
import { X, ShieldCheck, Lock, CreditCard, Banknote, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import confetti from 'canvas-confetti';

export const CheckoutModal: React.FC = () => {
  const {
    cart,
    cartSubtotal,
    discountAmount,
    appliedCoupon,
    isCheckoutOpen,
    setIsCheckoutOpen,
    user,
    placeOrder,
  } = useStore();

  const defaultAddr = user?.addresses[0];

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: defaultAddr?.street || '',
    apartment: defaultAddr?.apartment || '',
    city: defaultAddr?.city || '',
    state: defaultAddr?.state || '',
    pinCode: defaultAddr?.pinCode || '',
    notes: '',
  });

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpaySimStep, setRazorpaySimStep] = useState<null | 'authenticating' | 'verified'>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartSubtotal > 1999;
  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : 150;
  const tax = Math.round(cartSubtotal * 0.05);
  const finalTotal = Math.max(0, cartSubtotal - discountAmount + shippingFee + tax);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMessage(null);
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, '').slice(0, 6);
    setFormData((prev) => {
      const updated = { ...prev, pinCode: val };
      // Auto-detect common Indian cities based on PIN prefix if empty
      if (val.startsWith('11') && !prev.city) {
        updated.city = 'New Delhi';
        updated.state = 'Delhi';
      } else if (val.startsWith('40') && !prev.city) {
        updated.city = 'Mumbai';
        updated.state = 'Maharashtra';
      } else if (val.startsWith('56') && !prev.city) {
        updated.city = 'Bengaluru';
        updated.state = 'Karnataka';
      } else if (val.startsWith('12') && !prev.city) {
        updated.city = 'Gurugram';
        updated.state = 'Haryana';
      }
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!formData.name || !formData.email || !formData.phone || !formData.street || !formData.city || !formData.state || !formData.pinCode) {
      setErrorMessage('Please complete all required contact and shipping details.');
      return;
    }

    if (formData.pinCode.length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      // Simulate authentic Razorpay Indian payment modal & server-side verification
      setRazorpaySimStep('authenticating');
      
      try {
        // 1. Create order on server
        const createRes = await fetch('/api/razorpay/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: finalTotal, receipt: `rcpt_${Date.now()}` }),
        });
        const orderData = await createRes.json();

        // 2. Simulate gateway authorization delay
        await new Promise((resolve) => setTimeout(resolve, 1200));

        // 3. Verify payment on server
        const verifyRes = await fetch('/api/razorpay/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpayPaymentId: `pay_test_${Math.floor(100000000 + Math.random() * 900000000)}`,
            razorpayOrderId: orderData.orderId,
            razorpaySignature: 'sig_valid_test_sha256',
          }),
        });
        const verifyData = await verifyRes.json();

        setRazorpaySimStep('verified');
        await new Promise((resolve) => setTimeout(resolve, 600));

        // 4. Place official order in database
        const createdOrder = await placeOrder({
          paymentMethod: 'razorpay',
          paymentStatus: 'paid',
          razorpayPaymentId: verifyData.paymentId,
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            id: `addr-${Date.now()}`,
            fullName: formData.name,
            phone: formData.phone,
            street: formData.street,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
          },
          notes: formData.notes,
        });

        // Trigger celebratory confetti
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4E3E37', '#B88E3E', '#FAF8F5', '#6D7F6E'],
        });

        setIsProcessing(false);
        setRazorpaySimStep(null);
        setIsCheckoutOpen(false);
      } catch (err) {
        setIsProcessing(false);
        setRazorpaySimStep(null);
        setErrorMessage('Payment processing failed. Please try again.');
      }
    } else {
      // Cash on Delivery
      try {
        await new Promise((resolve) => setTimeout(resolve, 800));
        await placeOrder({
          paymentMethod: 'cod',
          paymentStatus: 'pending',
          customer: {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
          },
          shippingAddress: {
            id: `addr-${Date.now()}`,
            fullName: formData.name,
            phone: formData.phone,
            street: formData.street,
            apartment: formData.apartment,
            city: formData.city,
            state: formData.state,
            pinCode: formData.pinCode,
          },
          notes: formData.notes,
        });

        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#4E3E37', '#B88E3E', '#FAF8F5'],
        });

        setIsProcessing(false);
        setIsCheckoutOpen(false);
      } catch (err) {
        setIsProcessing(false);
        setErrorMessage('Failed to place Cash on Delivery order.');
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-4xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-6">
        
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#FAF8F5] border-b border-[#EAE3D9] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-4 h-4 text-[#6D7F6E]" />
            <h2 className="font-serif text-xl sm:text-2xl text-[#2E2420]">
              Secure Checkout
            </h2>
          </div>
          <button
            onClick={() => setIsCheckoutOpen(false)}
            className="p-1 text-[#7A6B63] hover:text-[#2E2420]"
            aria-label="Close checkout"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Razorpay Simulation Dialog Overlay if authenticating */}
        {razorpaySimStep && (
          <div className="absolute inset-0 z-30 bg-[#FAF8F5]/95 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#EAE3D9] flex items-center justify-center animate-pulse">
              <CreditCard className="w-8 h-8 text-[#4E3E37]" />
            </div>
            <div className="space-y-1">
              <span className="text-xs uppercase tracking-widest text-[#B88E3E] font-semibold">
                Razorpay Test Sandbox
              </span>
              <h3 className="font-serif text-2xl text-[#2E2420]">
                {razorpaySimStep === 'authenticating' ? 'Verifying Indian Payment Gateway...' : 'Payment Authorized & Verified'}
              </h3>
              <p className="text-xs text-[#7A6B63] max-w-xs mx-auto">
                {razorpaySimStep === 'authenticating'
                  ? 'Simulating UPI / Card authorization with Razorpay server-side verification...'
                  : 'HMAC signature confirmed. Finalizing your Cloudberry Home order.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh] overflow-y-auto">
          
          {/* Left Column: Form Details & Payment Selection */}
          <div className="md:col-span-7 p-6 sm:p-8 space-y-6 border-b md:border-b-0 md:border-r border-[#EAE3D9]">
            
            {errorMessage && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs">
                {errorMessage}
              </div>
            )}

            {/* 1. Customer Contact */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37] border-b border-[#EAE3D9] pb-2">
                1. Customer Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="e.g. Ridhi Garg"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="gargridhi851@gmail.com"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Mobile Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37] border-b border-[#EAE3D9] pb-2">
                2. Delivery Address in India
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Street / House / Building *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    value={formData.street}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="402, Magnolia Elegance, Golf Course Road"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Apartment / Sector / Landmark (Optional)</label>
                  <input
                    type="text"
                    name="apartment"
                    value={formData.apartment}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="Tower B, Sector 54"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">6-Digit PIN Code *</label>
                  <input
                    type="text"
                    name="pinCode"
                    required
                    maxLength={6}
                    value={formData.pinCode}
                    onChange={handlePincodeChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs font-mono text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="122002"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="Gurugram"
                  />
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">State *</label>
                  <input
                    type="text"
                    name="state"
                    required
                    value={formData.state}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="Haryana"
                  />
                </div>
              </div>
            </div>

            {/* 3. Payment Method Selection */}
            <div className="space-y-3">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37] border-b border-[#EAE3D9] pb-2">
                3. Payment Method
              </h3>
              <div className="space-y-2">
                
                {/* Razorpay Option */}
                <label
                  className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-[#4E3E37] bg-white shadow-sm'
                      : 'border-[#EAE3D9] bg-[#F5F0E8] hover:border-[#D6C8B8]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-[#4E3E37]"
                  />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#2E2420] uppercase tracking-wider">
                        Online Payment via Razorpay
                      </span>
                      <span className="text-[10px] bg-[#EDF2ED] text-[#6D7F6E] px-2 py-0.5 font-medium">
                        Instant Confirmation
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6B63]">
                      UPI (Google Pay, PhonePe, Paytm), RuPay, Visa, Mastercard, NetBanking & CRED.
                    </p>
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start gap-3 p-3.5 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#4E3E37] bg-white shadow-sm'
                      : 'border-[#EAE3D9] bg-[#F5F0E8] hover:border-[#D6C8B8]'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-[#4E3E37]"
                  />
                  <div className="flex-grow space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#2E2420] uppercase tracking-wider">
                        Cash on Delivery (COD)
                      </span>
                      <span className="text-[10px] bg-[#EAE3D9] text-[#4E3E37] px-2 py-0.5 font-medium">
                        Pay on Delivery
                      </span>
                    </div>
                    <p className="text-[11px] text-[#7A6B63]">
                      Pay by cash or UPI directly to delivery associate upon doorstep delivery.
                    </p>
                  </div>
                </label>

              </div>
            </div>

          </div>

          {/* Right Column: Order Summary & Placement */}
          <div className="md:col-span-5 bg-[#F5F0E8] p-6 sm:p-8 flex flex-col justify-between space-y-6">
            
            <div className="space-y-4">
              <h3 className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37] border-b border-[#EAE3D9] pb-2">
                Order Summary ({cart.length} items)
              </h3>

              {/* Items preview */}
              <div className="space-y-3 max-h-48 overflow-y-auto pr-1">
                {cart.map((item) => (
                  <div key={item.product.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-12 h-14 object-cover bg-white shrink-0 border border-[#EAE3D9]"
                    />
                    <div className="flex-grow min-w-0">
                      <h4 className="font-serif text-xs text-[#2E2420] truncate font-medium">
                        {item.product.name}
                      </h4>
                      <div className="text-[11px] text-[#7A6B63]">Qty: {item.quantity}</div>
                    </div>
                    <span className="font-mono text-xs font-semibold text-[#2E2420] shrink-0">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-1.5 text-xs text-[#6B5A51] pt-3 border-t border-[#EAE3D9]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono text-[#2E2420]">₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#6D7F6E]">
                    <span>Discount ({appliedCoupon?.code})</span>
                    <span className="font-mono">-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Estimated GST (5%)</span>
                  <span className="font-mono text-[#2E2420]">₹{tax.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span className="font-mono">
                    {shippingFee === 0 ? <span className="text-[#6D7F6E] uppercase">Free</span> : `₹${shippingFee}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-semibold text-[#2E2420] pt-2 border-t border-[#EAE3D9]">
                  <span>Total Amount</span>
                  <span className="font-mono text-lg">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Place Order CTA */}
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-4 bg-[#4E3E37] hover:bg-[#2E2420] text-white text-xs uppercase tracking-[0.18em] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer shadow disabled:opacity-50"
              >
                {isProcessing ? (
                  <span>Securing Order...</span>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4 text-[#D4AF67]" />
                    <span>Confirm & Place Order — ₹{finalTotal.toLocaleString('en-IN')}</span>
                  </>
                )}
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] uppercase tracking-wider text-[#7A6B63]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#6D7F6E]" />
                <span>256-Bit SSL Encrypted Checkout</span>
              </div>
            </div>

          </div>

        </form>

      </div>
    </div>
  );
};
