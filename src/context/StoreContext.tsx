import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Category, Collection, RoomLook, CartItem, Order, User, Coupon, Address } from '../types/index.ts';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COLLECTIONS, 
  INITIAL_ROOM_LOOKS, 
  INITIAL_USER, 
  INITIAL_ORDERS 
} from '../data/initialData.ts';

interface StoreContextType {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  roomLooks: RoomLook[];
  orders: Order[];
  cart: CartItem[];
  wishlist: string[];
  user: User | null;
  activeTab: 'home' | 'shop' | 'rooms' | 'collections' | 'story' | 'account' | 'admin';
  setActiveTab: (tab: 'home' | 'shop' | 'rooms' | 'collections' | 'story' | 'account' | 'admin') => void;
  filterCategory: string;
  setFilterCategory: (slug: string) => void;
  filterCollection: string;
  setFilterCollection: (slug: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  
  // Modals & Drawers
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isAuthOpen: boolean;
  setIsAuthOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isAIAssistantOpen: boolean;
  setIsAIAssistantOpen: (open: boolean) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedRoomLook: RoomLook | null;
  setSelectedRoomLook: (look: RoomLook | null) => void;
  lastConfirmedOrder: Order | null;
  setLastConfirmedOrder: (order: Order | null) => void;
  policyModal: string | null;
  setPolicyModal: (policy: string | null) => void;

  // Cart operations
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  cartSubtotal: number;
  cartItemCount: number;
  
  // Coupon
  appliedCoupon: Coupon | null;
  discountAmount: number;
  applyCouponCode: (code: string) => Promise<{ success: boolean; message: string }>;
  removeCoupon: () => void;

  // Wishlist
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  // Auth & Addresses
  login: (email: string) => Promise<void>;
  register: (name: string, email: string, phone: string) => Promise<void>;
  logout: () => void;
  saveAddress: (address: Partial<Address>) => void;

  // Orders
  placeOrder: (orderData: Partial<Order>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => Promise<void>;

  // Admin Product Management
  addProduct: (productData: Partial<Product>) => Promise<Product>;
  updateProduct: (id: string, productData: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: string) => Promise<void>;

  // Notification Toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [categories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [collections] = useState<Collection[]>(INITIAL_COLLECTIONS);
  const [roomLooks] = useState<RoomLook[]>(INITIAL_ROOM_LOOKS);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  
  // Persistent client states
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('cb_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('cb_wishlist');
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-4'];
    } catch {
      return ['prod-1', 'prod-4'];
    }
  });

  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('cb_user');
      return saved ? JSON.parse(saved) : INITIAL_USER;
    } catch {
      return INITIAL_USER;
    }
  });

  const [activeTab, setActiveTab] = useState<'home' | 'shop' | 'rooms' | 'collections' | 'story' | 'account' | 'admin'>('home');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterCollection, setFilterCollection] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modals
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedRoomLook, setSelectedRoomLook] = useState<RoomLook | null>(null);
  const [lastConfirmedOrder, setLastConfirmedOrder] = useState<Order | null>(null);
  const [policyModal, setPolicyModal] = useState<string | null>(null);

  // Coupon state
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3500);
  };

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('cb_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('cb_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem('cb_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('cb_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [user]);

  // Fetch live products and orders from server if reachable
  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.products) {
          setProducts(data.products);
        }
      })
      .catch(() => {
        // Fallback to initial products if offline or server loading
      });

    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && data.orders) {
          setOrders(data.orders);
        }
      })
      .catch(() => {});
  }, []);

  // Cart calculations
  const cartSubtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  // Recalculate coupon discount if subtotal changes
  useEffect(() => {
    if (appliedCoupon) {
      if (cartSubtotal < appliedCoupon.minOrder) {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        showToast(`Coupon removed: Cart below ₹${appliedCoupon.minOrder.toLocaleString('en-IN')}`);
      } else {
        const discount =
          appliedCoupon.discountType === 'percent'
            ? Math.round((cartSubtotal * appliedCoupon.value) / 100)
            : appliedCoupon.value;
        setDiscountAmount(discount);
      }
    } else {
      setDiscountAmount(0);
    }
  }, [cartSubtotal, appliedCoupon]);

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCart((prev) => {
      const selectedColor = color || (product.colors && product.colors[0] ? product.colors[0].name : undefined);
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === selectedColor
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [...prev, { product, quantity, selectedColor }];
      }
    });

    showToast(`Added "${product.name}" to bag`);
    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    showToast('Item removed from shopping bag');
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter((id) => id !== productId);
      } else {
        showToast('Saved to wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const applyCouponCode = async (code: string) => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, subtotal: cartSubtotal }),
      });
      const data = await res.json();
      if (data.success) {
        setAppliedCoupon(data.coupon);
        setDiscountAmount(data.discountAmount);
        showToast(data.message);
        return { success: true, message: data.message };
      } else {
        showToast(data.message || 'Invalid coupon code');
        return { success: false, message: data.message || 'Invalid coupon' };
      }
    } catch {
      // Local fallback validation
      const codeUpper = code.toUpperCase().trim();
      if (codeUpper === 'CLOUDBERRY10') {
        const disc = Math.round((cartSubtotal * 10) / 100);
        setAppliedCoupon({
          code: 'CLOUDBERRY10',
          discountType: 'percent',
          value: 10,
          minOrder: 1000,
          description: '10% off on all orders',
        });
        setDiscountAmount(disc);
        showToast('Coupon CLOUDBERRY10 applied: 10% off');
        return { success: true, message: '10% off applied' };
      }
      return { success: false, message: 'Invalid coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    showToast('Coupon removed');
  };

  const login = async (email: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast(`Welcome back, ${data.user.name}`);
        setIsAuthOpen(false);
      }
    } catch {
      const demoUser: User = {
        id: `usr-${Date.now()}`,
        name: email.split('@')[0],
        email,
        role: email.includes('admin') ? 'admin' : 'customer',
        createdAt: new Date().toISOString(),
        addresses: INITIAL_USER.addresses,
      };
      setUser(demoUser);
      showToast(`Logged in as ${demoUser.name}`);
      setIsAuthOpen(false);
    }
  };

  const register = async (name: string, email: string, phone: string) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setUser(data.user);
        showToast(`Welcome to Cloudberry Home, ${data.user.name}`);
        setIsAuthOpen(false);
      }
    } catch {
      const newUser: User = {
        id: `usr-${Date.now()}`,
        name,
        email,
        phone,
        role: 'customer',
        createdAt: new Date().toISOString(),
        addresses: [],
      };
      setUser(newUser);
      showToast(`Welcome to Cloudberry Home, ${name}`);
      setIsAuthOpen(false);
    }
  };

  const logout = () => {
    setUser(null);
    showToast('Logged out successfully');
  };

  const saveAddress = (addr: Partial<Address>) => {
    if (!user) return;
    const newAddr: Address = {
      id: addr.id || `addr-${Date.now()}`,
      fullName: addr.fullName || user.name,
      phone: addr.phone || user.phone || '+91 98765 43210',
      street: addr.street || '',
      apartment: addr.apartment || '',
      city: addr.city || '',
      state: addr.state || '',
      pinCode: addr.pinCode || '',
      isDefault: addr.isDefault || user.addresses.length === 0,
    };

    const updatedAddresses = addr.id
      ? user.addresses.map((a) => (a.id === addr.id ? newAddr : addr.isDefault ? { ...a, isDefault: false } : a))
      : [
          ...(addr.isDefault ? user.addresses.map((a) => ({ ...a, isDefault: false })) : user.addresses),
          newAddr,
        ];

    const updatedUser = { ...user, addresses: updatedAddresses };
    setUser(updatedUser);
    showToast('Address saved successfully');

    fetch('/api/auth/addresses', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: user.email, address: newAddr }),
    }).catch(() => {});
  };

  const placeOrder = async (orderData: Partial<Order>): Promise<Order> => {
    const payload = {
      items: cart,
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartSubtotal > 1999 ? 0 : 150,
      tax: Math.round(cartSubtotal * 0.05), // 5% GST
      total: (cartSubtotal > 1999 ? cartSubtotal : cartSubtotal + 150) - discountAmount + Math.round(cartSubtotal * 0.05),
      customer: {
        name: user?.name || orderData.customer?.name || 'Valued Guest',
        email: user?.email || orderData.customer?.email || 'guest@cloudberryhome.com',
        phone: user?.phone || orderData.customer?.phone || '+91 98765 43210',
      },
      shippingAddress: orderData.shippingAddress || (user?.addresses[0] ?? {
        id: 'addr-guest',
        fullName: 'Valued Customer',
        phone: '+91 98765 43210',
        street: 'Connaught Place',
        city: 'New Delhi',
        state: 'Delhi',
        pinCode: '110001',
      }),
      paymentMethod: orderData.paymentMethod || 'razorpay',
      paymentStatus: orderData.paymentStatus || (orderData.paymentMethod === 'razorpay' ? 'paid' : 'pending'),
      razorpayPaymentId: orderData.razorpayPaymentId || `pay_rzp_${Date.now()}`,
      notes: orderData.notes,
    };

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success && data.order) {
        setOrders((prev) => [data.order, ...prev]);
        setLastConfirmedOrder(data.order);
        clearCart();
        return data.order;
      }
    } catch {
      // Fallback
    }

    const fallbackOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber: `CB-${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal: cartSubtotal,
      discount: discountAmount,
      couponCode: appliedCoupon?.code,
      shippingFee: cartSubtotal > 1999 ? 0 : 150,
      tax: Math.round(cartSubtotal * 0.05),
      total: payload.total,
      customer: payload.customer,
      shippingAddress: payload.shippingAddress,
      paymentMethod: payload.paymentMethod as any,
      paymentStatus: payload.paymentStatus as any,
      razorpayPaymentId: payload.razorpayPaymentId,
      orderStatus: 'placed',
      trackingNumber: `EXP-${Math.floor(100000000 + Math.random() * 900000000)}`,
      trackingSteps: [
        { title: 'Order Confirmed', date: 'Just now', completed: true, current: true },
        { title: 'Artisan Inspection & Packing', date: 'Upcoming', completed: false, current: false },
        { title: 'Handed to Courier Partner', date: 'Upcoming', completed: false, current: false },
        { title: 'Out for Delivery', date: 'Upcoming', completed: false, current: false },
        { title: 'Delivered', date: 'Upcoming', completed: false, current: false },
      ],
      notes: payload.notes,
    };

    setOrders((prev) => [fallbackOrder, ...prev]);
    setLastConfirmedOrder(fallbackOrder);
    clearCart();
    return fallbackOrder;
  };

  const updateOrderStatus = async (orderId: string, status: Order['orderStatus'], trackingNumber?: string) => {
    try {
      await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, trackingNumber }),
      });
    } catch {}

    setOrders((prev) =>
      prev.map((o) => {
        if (o.id === orderId) {
          const statuses = ['placed', 'processing', 'shipped', 'delivered'];
          const currentIndex = statuses.indexOf(status);
          const steps = o.trackingSteps.map((s, idx) => ({
            ...s,
            completed: idx <= currentIndex,
            current: idx === currentIndex,
          }));
          return {
            ...o,
            orderStatus: status,
            trackingNumber: trackingNumber || o.trackingNumber,
            trackingSteps: steps,
          };
        }
        return o;
      })
    );
    showToast(`Order status updated to "${status.toUpperCase()}"`);
  };

  const addProduct = async (productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => [data.product, ...prev]);
        showToast('New product added to catalog');
        return data.product;
      }
    } catch {}

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: productData.name || 'New Artisan Piece',
      slug: (productData.name || 'new-piece').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      subtitle: productData.subtitle || '',
      description: productData.description || '',
      price: Number(productData.price) || 2999,
      comparePrice: productData.comparePrice ? Number(productData.comparePrice) : undefined,
      category: productData.category || 'Living Room Decor',
      categorySlug: (productData.category || 'living-room-decor').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      collection: productData.collection || 'The Neutral Edit',
      collectionSlug: 'the-neutral-edit',
      tags: ['Artisan'],
      inStock: true,
      stockCount: 15,
      dimensions: productData.dimensions || 'Standard',
      materials: productData.materials || 'Ceramic / Oak',
      colors: [{ name: 'Ivory Cream', hex: '#F5F0E8' }],
      images: productData.images && productData.images.length > 0 ? productData.images : [INITIAL_PRODUCTS[0].images[0]],
      rating: 5.0,
      reviewCount: 0,
      isFeatured: !!productData.isFeatured,
      isNew: true,
    };
    setProducts((prev) => [newProd, ...prev]);
    showToast('New product added');
    return newProd;
  };

  const updateProduct = async (id: string, productData: Partial<Product>): Promise<Product> => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });
      const data = await res.json();
      if (data.success && data.product) {
        setProducts((prev) => prev.map((p) => (p.id === id ? data.product : p)));
        showToast('Product updated successfully');
        return data.product;
      }
    } catch {}

    let updatedProd = products.find((p) => p.id === id)!;
    updatedProd = { ...updatedProd, ...productData };
    setProducts((prev) => prev.map((p) => (p.id === id ? updatedProd : p)));
    showToast('Product updated');
    return updatedProd;
  };

  const deleteProduct = async (id: string) => {
    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
    } catch {}
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product removed from catalog');
  };

  return (
    <StoreContext.Provider
      value={{
        products,
        categories,
        collections,
        roomLooks,
        orders,
        cart,
        wishlist,
        user,
        activeTab,
        setActiveTab,
        filterCategory,
        setFilterCategory,
        filterCollection,
        setFilterCollection,
        searchQuery,
        setSearchQuery,
        isCartOpen,
        setIsCartOpen,
        isAuthOpen,
        setIsAuthOpen,
        isSearchOpen,
        setIsSearchOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isAIAssistantOpen,
        setIsAIAssistantOpen,
        selectedProduct,
        setSelectedProduct,
        selectedRoomLook,
        setSelectedRoomLook,
        lastConfirmedOrder,
        setLastConfirmedOrder,
        policyModal,
        setPolicyModal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartSubtotal,
        cartItemCount,
        appliedCoupon,
        discountAmount,
        applyCouponCode,
        removeCoupon,
        toggleWishlist,
        isInWishlist,
        login,
        register,
        logout,
        saveAddress,
        placeOrder,
        updateOrderStatus,
        addProduct,
        updateProduct,
        deleteProduct,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
