export interface Product {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  price: number; // in INR (₹)
  comparePrice?: number; // original higher price for discount calculation
  category: string; // e.g. "Vases", "Lighting", "Lamps", "Cushions", etc.
  categorySlug: string;
  collection: string; // e.g. "The Neutral Edit", "The Little Luxuries", etc.
  collectionSlug: string;
  tags: string[];
  inStock: boolean;
  stockCount: number;
  dimensions: string;
  materials: string;
  colors: { name: string; hex: string }[];
  images: string[];
  rating: number;
  reviewCount: number;
  isFeatured?: boolean;
  isNew?: boolean;
  careInstructions?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  images: string[];
  itemCount: number;
  highlight?: string;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  image: string;
  tag: string;
}

export interface RoomLook {
  id: string;
  title: string;
  subtitle: string;
  roomType: 'living-room' | 'bedroom' | 'reading-corner' | 'dining-table' | 'entryway';
  image: string;
  description: string;
  productIds: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export interface Address {
  id: string;
  fullName: string;
  phone: string;
  street: string;
  apartment?: string;
  city: string;
  state: string;
  pinCode: string;
  isDefault?: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'customer' | 'admin';
  addresses: Address[];
  createdAt: string;
}

export interface TrackingStep {
  title: string;
  date: string;
  completed: boolean;
  current: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  couponCode?: string;
  shippingFee: number;
  tax: number;
  total: number;
  customer: {
    name: string;
    email: string;
    phone: string;
  };
  shippingAddress: Address;
  paymentMethod: 'razorpay' | 'cod';
  paymentStatus: 'paid' | 'pending';
  razorpayPaymentId?: string;
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  trackingNumber: string;
  trackingSteps: TrackingStep[];
  notes?: string;
}

export interface Coupon {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  minOrder: number;
  description: string;
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}
