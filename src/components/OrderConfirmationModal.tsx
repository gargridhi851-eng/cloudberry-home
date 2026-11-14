import React from 'react';
import { X, CheckCircle2, PackageCheck, Truck, MapPin, ArrowRight, Sparkles } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const OrderConfirmationModal: React.FC = () => {
  const {
    lastConfirmedOrder,
    setLastConfirmedOrder,
    setActiveTab,
  } = useStore();

  if (!lastConfirmedOrder) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-2xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setLastConfirmedOrder(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#4E3E37] bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer shadow"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* Header Banner */}
          <div className="text-center space-y-2 border-b border-[#EAE3D9] pb-6">
            <div className="w-14 h-14 bg-[#EDF2ED] rounded-full flex items-center justify-center mx-auto text-[#6D7F6E]">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="text-xs uppercase tracking-[0.2em] text-[#6D7F6E] font-medium block">
              Order Confirmed & Received
            </span>
            <h2 className="font-serif text-3xl text-[#2E2420]">
              Thank You, {lastConfirmedOrder.customer.name.split(' ')[0]}
            </h2>
            <p className="text-xs sm:text-sm text-[#7A6B63]">
              Your order <strong className="font-mono text-[#2E2420]">{lastConfirmedOrder.orderNumber}</strong> has been secured and sent to our artisan dispatch center.
            </p>
          </div>

          {/* Tracking Step Timeline */}
          <div className="bg-[#F5F0E8] p-4 sm:p-5 border border-[#EAE3D9] space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider font-semibold text-[#4E3E37]">Shipment Progress</span>
              <span className="font-mono text-[11px] text-[#7A6B63]">Tracking ID: {lastConfirmedOrder.trackingNumber}</span>
            </div>

            <div className="space-y-3 pt-2">
              {lastConfirmedOrder.trackingSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                        step.completed
                          ? 'bg-[#6D7F6E] text-white'
                          : step.current
                          ? 'bg-[#B88E3E] text-white'
                          : 'bg-[#EAE3D9] text-[#7A6B63]'
                      }`}
                    >
                      {step.completed ? '✓' : idx + 1}
                    </div>
                    {idx < lastConfirmedOrder.trackingSteps.length - 1 && (
                      <div
                        className={`w-0.5 h-6 ${
                          step.completed ? 'bg-[#6D7F6E]' : 'bg-[#EAE3D9]'
                        }`}
                      />
                    )}
                  </div>
                  <div className="flex-grow flex items-center justify-between text-xs">
                    <span className={step.completed || step.current ? 'font-medium text-[#2E2420]' : 'text-[#9B8C83]'}>
                      {step.title}
                    </span>
                    <span className="text-[11px] font-mono text-[#7A6B63]">{step.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Details & Delivery summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 bg-white border border-[#EAE3D9] space-y-1">
              <span className="uppercase tracking-wider text-[#7A6B63] block font-medium">Delivery Destination</span>
              <p className="font-semibold text-[#2E2420]">{lastConfirmedOrder.shippingAddress.fullName}</p>
              <p className="text-[#6B5A51]">{lastConfirmedOrder.shippingAddress.street}, {lastConfirmedOrder.shippingAddress.apartment}</p>
              <p className="text-[#6B5A51]">{lastConfirmedOrder.shippingAddress.city}, {lastConfirmedOrder.shippingAddress.state} - {lastConfirmedOrder.shippingAddress.pinCode}</p>
            </div>

            <div className="p-3 bg-white border border-[#EAE3D9] space-y-1">
              <span className="uppercase tracking-wider text-[#7A6B63] block font-medium">Payment & Amount</span>
              <p className="font-semibold text-[#2E2420]">
                {lastConfirmedOrder.paymentMethod === 'razorpay' ? 'Razorpay Online (Paid)' : 'Cash on Delivery (Pending)'}
              </p>
              <p className="font-mono text-base font-bold text-[#2E2420] pt-1">
                Total Paid: ₹{lastConfirmedOrder.total.toLocaleString('en-IN')}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="space-y-2">
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4E3E37]">Purchased Items</span>
            <div className="space-y-2">
              {lastConfirmedOrder.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs py-1.5 border-b border-[#EAE3D9]">
                  <div className="flex items-center gap-2">
                    <img src={it.product.images[0]} alt="" className="w-8 h-10 object-cover bg-white" />
                    <span>{it.product.name} (Qty: {it.quantity})</span>
                  </div>
                  <span className="font-mono">₹{(it.product.price * it.quantity).toLocaleString('en-IN')}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => {
                setLastConfirmedOrder(null);
                setActiveTab('account');
              }}
              className="flex-1 py-3 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium hover:bg-[#2E2420] transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>View in Order History</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setLastConfirmedOrder(null);
                setActiveTab('shop');
              }}
              className="px-6 py-3 border border-[#4E3E37] text-[#4E3E37] text-xs uppercase tracking-wider font-medium hover:bg-[#F5F0E8] transition-colors cursor-pointer"
            >
              Continue Browsing
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
