import React from 'react';
import { X, ShieldCheck, Truck, RefreshCw, FileText, HelpCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';

export const PolicyModals: React.FC = () => {
  const { policyModal, setPolicyModal } = useStore();

  if (!policyModal) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-2xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setPolicyModal(null)}
          className="absolute top-4 right-4 z-20 p-2 text-[#4E3E37] bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer shadow"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {policyModal === 'shipping' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
                <Truck className="w-6 h-6 text-[#6D7F6E]" />
                <h3 className="font-serif text-2xl text-[#2E2420]">Pan-India Shipping Policy</h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                <p>
                  At Cloudberry Home, we offer <strong>Complimentary Express Delivery</strong> on all orders valued above <strong>₹1,999</strong> across all pin codes in India. For orders below ₹1,999, a flat delivery fee of ₹150 applies.
                </p>
                <h4 className="font-serif text-base text-[#2E2420] font-semibold pt-2">Transit Durations</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li><strong>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Kolkata, Hyderabad):</strong> 2 to 4 business days.</li>
                  <li><strong>Tier 2 & 3 Cities:</strong> 4 to 6 business days.</li>
                  <li><strong>Remote / Island Regions:</strong> 6 to 9 business days.</li>
                </ul>
                <h4 className="font-serif text-base text-[#2E2420] font-semibold pt-2">Breakage-Free Fragile Packaging</h4>
                <p>
                  All ceramic vases, honed marble bowls, and glass table lamps are cushioned in custom biodegradable multi-wall honeycomb paper cells and corner armor. If any item arrives damaged in transit, we guarantee immediate replacement without hassle.
                </p>
              </div>
            </div>
          )}

          {policyModal === 'returns' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
                <RefreshCw className="w-6 h-6 text-[#6D7F6E]" />
                <h3 className="font-serif text-2xl text-[#2E2420]">7-Day Returns & Exchanges</h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                <p>
                  We want you to love living with your Cloudberry pieces. If an item does not suit your space, you may initiate a return or exchange within <strong>7 days</strong> of delivery.
                </p>
                <h4 className="font-serif text-base text-[#2E2420] font-semibold pt-2">Condition Guidelines</h4>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>Items must be unused, unwashed, and in original packaging with protective materials intact.</li>
                  <li>Our courier partner will arrange doorstep reverse pickup at no additional cost.</li>
                  <li>Refunds are credited to the original payment source within 3-5 business days of inspection, or via instant store credit.</li>
                </ul>
              </div>
            </div>
          )}

          {policyModal === 'privacy' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
                <ShieldCheck className="w-6 h-6 text-[#6D7F6E]" />
                <h3 className="font-serif text-2xl text-[#2E2420]">Privacy Policy & Data Security</h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                <p>
                  Your trust is paramount. Cloudberry Home treats customer information with strict institutional privacy:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>We never sell, rent, or trade your contact or order details to third-party ad networks.</li>
                  <li>All payment transactions are encrypted using 256-bit SSL via PCI-DSS compliant Razorpay servers. We never store credit/debit card credentials.</li>
                  <li>Phone numbers and delivery addresses are utilized solely for delivery dispatch and order status notifications.</li>
                </ul>
              </div>
            </div>
          )}

          {policyModal === 'terms' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
                <FileText className="w-6 h-6 text-[#6D7F6E]" />
                <h3 className="font-serif text-2xl text-[#2E2420]">Terms & Conditions</h3>
              </div>
              <div className="space-y-3 text-xs sm:text-sm text-[#6B5A51] leading-relaxed">
                <p>
                  Welcome to Cloudberry Home. By accessing our platform or purchasing our goods, you agree to these transparent terms:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-xs">
                  <li>All prices are in Indian Rupees (INR) and inclusive of applicable GST.</li>
                  <li>Because our products feature natural materials (honed marble, kiln-fired stoneware, live-edge wood), minor organic grain, glaze variation, and texture nuances are celebrated hallmarks of handcraftsmanship rather than defects.</li>
                  <li>Orders are subject to availability; in the rare event of inventory discrepancy, full refunds will be issued immediately.</li>
                </ul>
              </div>
            </div>
          )}

          {policyModal === 'faqs' && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 border-b border-[#EAE3D9] pb-4">
                <HelpCircle className="w-6 h-6 text-[#6D7F6E]" />
                <h3 className="font-serif text-2xl text-[#2E2420]">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-4 text-xs sm:text-sm text-[#6B5A51]">
                <div>
                  <h4 className="font-semibold text-[#2E2420]">Are your ceramic vases water-tight?</h4>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    Yes. All Cloudberry stoneware vessels receive an interior non-porous vitreous glaze suitable for fresh floral arrangements.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2E2420]">What payment methods do you support?</h4>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    We support Razorpay (Google Pay, PhonePe, Paytm, UPI, Cards, NetBanking) and Cash on Delivery (COD) across India.
                  </p>
                </div>
                <div>
                  <h4 className="font-semibold text-[#2E2420]">How do I care for solid marble and travertine?</h4>
                  <p className="text-xs text-[#7A6B63] mt-1">
                    Clean with a damp cloth and gentle pH-neutral soap. Avoid citrus cleaners or acidic liquids on raw stone surfaces.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
