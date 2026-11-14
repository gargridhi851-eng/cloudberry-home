import React, { useState } from 'react';
import { X, User as UserIcon, Package, MapPin, Heart, LogOut, Plus, Check, Trash2, ArrowRight } from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Address } from '../types/index.ts';

export const AccountModal: React.FC = () => {
  const {
    user,
    orders,
    wishlist,
    products,
    isAuthOpen,
    setIsAuthOpen,
    login,
    register,
    logout,
    saveAddress,
    addToCart,
    toggleWishlist,
    setSelectedProduct,
    setActiveTab,
  } = useStore();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [emailInput, setEmailInput] = useState('gargridhi851@gmail.com');
  const [nameInput, setNameInput] = useState('Ridhi Garg');
  const [phoneInput, setPhoneInput] = useState('+91 98765 43210');
  const [activeAccountTab, setActiveAccountTab] = useState<'orders' | 'addresses' | 'wishlist'>('orders');

  // New address state
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    fullName: user?.name || '',
    phone: user?.phone || '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    pinCode: '',
    isDefault: false,
  });

  if (!isAuthOpen && !user) return null;

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (authMode === 'login') {
      await login(emailInput);
    } else {
      await register(nameInput, emailInput, phoneInput);
    }
  };

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.street || !newAddr.city || !newAddr.pinCode) return;
    saveAddress(newAddr);
    setIsAddingAddress(false);
    setNewAddr({
      fullName: user?.name || '',
      phone: user?.phone || '',
      street: '',
      apartment: '',
      city: '',
      state: '',
      pinCode: '',
      isDefault: false,
    });
  };

  const wishlistProducts = products.filter((p) => wishlist.includes(p.id));
  const userOrders = orders.filter((o) => !user || o.customer.email.toLowerCase() === user.email.toLowerCase());

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="relative bg-[#FAF8F5] max-w-3xl w-full border border-[#EAE3D9] shadow-2xl overflow-hidden my-6">
        
        {/* Close Button */}
        <button
          onClick={() => setIsAuthOpen(false)}
          className="absolute top-4 right-4 z-20 p-2 text-[#4E3E37] bg-white/90 hover:bg-white rounded-full transition-colors cursor-pointer shadow"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* If Not Logged In: Login / Register Form */}
        {!user ? (
          <div className="p-8 sm:p-10 max-w-md mx-auto text-center space-y-6">
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] text-[#6D7F6E] font-medium block">
                Cloudberry Home
              </span>
              <h2 className="font-serif text-3xl text-[#2E2420]">
                {authMode === 'login' ? 'Welcome Back' : 'Create an Account'}
              </h2>
              <p className="text-xs text-[#7A6B63]">
                {authMode === 'login'
                  ? 'Access your orders, saved delivery addresses, and curated wishlist.'
                  : 'Join our thoughtful living circle for complimentary delivery perks.'}
              </p>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-4 text-left">
              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Full Name</label>
                  <input
                    type="text"
                    required
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="e.g. Ridhi Garg"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Email Address</label>
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                  placeholder="gargridhi851@gmail.com"
                />
              </div>

              {authMode === 'register' && (
                <div className="space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-[#EAE3D9] text-xs text-[#2E2420] focus:outline-none focus:border-[#4E3E37]"
                    placeholder="+91 98765 43210"
                  />
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#4E3E37] hover:bg-[#2E2420] text-white text-xs uppercase tracking-[0.16em] font-medium transition-colors cursor-pointer shadow mt-2"
              >
                {authMode === 'login' ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="pt-4 border-t border-[#EAE3D9] text-xs text-[#7A6B63]">
              {authMode === 'login' ? (
                <span>
                  Don&apos;t have an account yet?{' '}
                  <button
                    onClick={() => setAuthMode('register')}
                    className="text-[#4E3E37] font-semibold underline cursor-pointer"
                  >
                    Register here
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{' '}
                  <button
                    onClick={() => setAuthMode('login')}
                    className="text-[#4E3E37] font-semibold underline cursor-pointer"
                  >
                    Sign in
                  </button>
                </span>
              )}
            </div>
          </div>
        ) : (
          /* Logged In Customer Dashboard */
          <div className="p-6 sm:p-8 space-y-6 max-h-[85vh] overflow-y-auto">
            
            {/* Header Profile Info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[#EAE3D9] text-[#4E3E37] rounded-full flex items-center justify-center font-serif text-xl font-bold">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-serif text-2xl text-[#2E2420]">{user.name}</h2>
                  <p className="text-xs text-[#7A6B63]">{user.email} · {user.phone || '+91 98765 43210'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {user.role === 'admin' && (
                  <button
                    onClick={() => {
                      setIsAuthOpen(false);
                      setActiveTab('admin');
                    }}
                    className="px-3 py-1.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium"
                  >
                    Admin Portal
                  </button>
                )}
                <button
                  onClick={logout}
                  className="px-3 py-1.5 border border-[#EAE3D9] text-[#7A6B63] hover:text-[#C53929] text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Logout</span>
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex gap-2 border-b border-[#EAE3D9]">
              <button
                onClick={() => setActiveAccountTab('orders')}
                className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeAccountTab === 'orders'
                    ? 'border-[#4E3E37] text-[#2E2420]'
                    : 'border-transparent text-[#7A6B63] hover:text-[#2E2420]'
                }`}
              >
                <Package className="w-4 h-4" />
                <span>Orders ({userOrders.length})</span>
              </button>
              <button
                onClick={() => setActiveAccountTab('addresses')}
                className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeAccountTab === 'addresses'
                    ? 'border-[#4E3E37] text-[#2E2420]'
                    : 'border-transparent text-[#7A6B63] hover:text-[#2E2420]'
                }`}
              >
                <MapPin className="w-4 h-4" />
                <span>Saved Addresses ({user.addresses.length})</span>
              </button>
              <button
                onClick={() => setActiveAccountTab('wishlist')}
                className={`pb-2.5 px-3 text-xs uppercase tracking-wider font-medium border-b-2 transition-colors flex items-center gap-2 cursor-pointer ${
                  activeAccountTab === 'wishlist'
                    ? 'border-[#4E3E37] text-[#2E2420]'
                    : 'border-transparent text-[#7A6B63] hover:text-[#2E2420]'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Wishlist ({wishlistProducts.length})</span>
              </button>
            </div>

            {/* Content: Orders Tab */}
            {activeAccountTab === 'orders' && (
              <div className="space-y-4">
                {userOrders.length === 0 ? (
                  <p className="text-xs text-[#7A6B63] py-8 text-center">No orders placed yet.</p>
                ) : (
                  userOrders.map((ord) => (
                    <div key={ord.id} className="p-4 bg-white border border-[#EAE3D9] space-y-3">
                      <div className="flex flex-wrap items-center justify-between text-xs gap-2 border-b border-[#EAE3D9] pb-2">
                        <div>
                          <span className="text-[#7A6B63]">Order: </span>
                          <strong className="font-mono text-[#2E2420]">{ord.orderNumber}</strong>
                        </div>
                        <div>
                          <span className="text-[#7A6B63]">Placed: </span>
                          <span>{new Date(ord.date).toLocaleDateString()}</span>
                        </div>
                        <span className="px-2 py-0.5 uppercase tracking-wider text-[10px] font-semibold bg-[#EDF2ED] text-[#6D7F6E]">
                          {ord.orderStatus.toUpperCase()}
                        </span>
                      </div>

                      {/* Purchased items */}
                      <div className="space-y-2">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <img src={it.product.images[0]} alt="" className="w-8 h-10 object-cover bg-[#F5F0E8]" />
                              <div>
                                <h5 className="font-medium text-[#2E2420]">{it.product.name}</h5>
                                <span className="text-[10px] text-[#7A6B63]">Qty: {it.quantity}</span>
                              </div>
                            </div>
                            <span className="font-mono text-[#2E2420]">
                              ₹{(it.product.price * it.quantity).toLocaleString('en-IN')}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-[#EAE3D9] flex items-center justify-between text-xs">
                        <span className="font-mono text-[#7A6B63]">
                          Tracking: {ord.trackingNumber}
                        </span>
                        <div className="font-semibold text-sm text-[#2E2420] font-mono">
                          Total: ₹{ord.total.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* Content: Addresses Tab */}
            {activeAccountTab === 'addresses' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-xs uppercase tracking-wider text-[#7A6B63]">Manage Delivery Destinations</span>
                  <button
                    onClick={() => setIsAddingAddress(!isAddingAddress)}
                    className="px-3 py-1.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{isAddingAddress ? 'Cancel' : 'Add New Address'}</span>
                  </button>
                </div>

                {/* Add Address Form */}
                {isAddingAddress && (
                  <form onSubmit={handleSaveNewAddress} className="p-4 bg-white border border-[#EAE3D9] space-y-3 text-xs">
                    <h4 className="font-semibold text-[#2E2420] uppercase tracking-wider">New Indian Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] text-[#7A6B63]">Street / Line 1 *</label>
                        <input
                          type="text"
                          required
                          value={newAddr.street}
                          onChange={(e) => setNewAddr({ ...newAddr, street: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#EAE3D9] bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A6B63]">Apartment / Sector</label>
                        <input
                          type="text"
                          value={newAddr.apartment}
                          onChange={(e) => setNewAddr({ ...newAddr, apartment: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#EAE3D9] bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A6B63]">PIN Code *</label>
                        <input
                          type="text"
                          required
                          maxLength={6}
                          value={newAddr.pinCode}
                          onChange={(e) => setNewAddr({ ...newAddr, pinCode: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#EAE3D9] bg-[#FAF8F5] font-mono"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A6B63]">City *</label>
                        <input
                          type="text"
                          required
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#EAE3D9] bg-[#FAF8F5]"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-[#7A6B63]">State *</label>
                        <input
                          type="text"
                          required
                          value={newAddr.state}
                          onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                          className="w-full px-2 py-1.5 border border-[#EAE3D9] bg-[#FAF8F5]"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="mt-2 px-4 py-2 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                    >
                      Save Address
                    </button>
                  </form>
                )}

                {/* Existing addresses */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {user.addresses.map((a) => (
                    <div key={a.id} className="p-4 bg-white border border-[#EAE3D9] space-y-2 text-xs relative">
                      {a.isDefault && (
                        <span className="inline-block bg-[#EDF2ED] text-[#6D7F6E] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider">
                          Default Address
                        </span>
                      )}
                      <h5 className="font-semibold text-[#2E2420]">{a.fullName}</h5>
                      <p className="text-[#6B5A51]">{a.street}, {a.apartment}</p>
                      <p className="text-[#6B5A51]">{a.city}, {a.state} - {a.pinCode}</p>
                      <p className="text-[#7A6B63] font-mono">{a.phone}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Content: Wishlist Tab */}
            {activeAccountTab === 'wishlist' && (
              <div className="space-y-4">
                {wishlistProducts.length === 0 ? (
                  <p className="text-xs text-[#7A6B63] py-8 text-center">Your wishlist is currently empty.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {wishlistProducts.map((prod) => (
                      <div key={prod.id} className="p-3 bg-white border border-[#EAE3D9] flex gap-3 items-center">
                        <img src={prod.images[0]} alt="" className="w-14 h-18 object-cover bg-[#F5F0E8]" />
                        <div className="flex-grow min-w-0">
                          <h5 className="font-serif text-sm text-[#2E2420] truncate font-medium">{prod.name}</h5>
                          <div className="font-mono text-xs font-semibold text-[#2E2420]">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </div>
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() => addToCart(prod, 1)}
                              className="px-2.5 py-1 bg-[#4E3E37] text-white text-[10px] uppercase tracking-wider"
                            >
                              Move to Bag
                            </button>
                            <button
                              onClick={() => toggleWishlist(prod.id)}
                              className="text-[10px] text-[#C53929] hover:underline"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
};
