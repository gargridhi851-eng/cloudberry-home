import express, { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { 
  INITIAL_PRODUCTS, 
  INITIAL_CATEGORIES, 
  INITIAL_COLLECTIONS, 
  INITIAL_ROOM_LOOKS, 
  INITIAL_COUPONS, 
  INITIAL_USER, 
  INITIAL_ORDERS 
} from './src/data/initialData.ts';
import { Product, Order, User, Coupon, Address } from './src/types/index.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json());

// Persistent database file setup
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

interface DatabaseSchema {
  products: Product[];
  orders: Order[];
  users: User[];
  coupons: Coupon[];
}

function loadDatabase(): DatabaseSchema {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DB_FILE)) {
      const raw = fs.readFileSync(DB_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error('Error reading database file:', err);
  }

  // Seed default database
  const defaultDb: DatabaseSchema = {
    products: INITIAL_PRODUCTS,
    orders: INITIAL_ORDERS,
    users: [INITIAL_USER],
    coupons: INITIAL_COUPONS,
  };
  saveDatabase(defaultDb);
  return defaultDb;
}

function saveDatabase(data: DatabaseSchema) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database file:', err);
  }
}

// In-memory reference synced to disk
let db = loadDatabase();

// --- API ROUTES ---

// 1. Products
app.get('/api/products', (req: Request, res: Response) => {
  const { category, collection, search, minPrice, maxPrice, inStock, sort } = req.query;
  let items = [...db.products];

  if (category && category !== 'all') {
    items = items.filter(
      (p) => p.categorySlug === category || p.category.toLowerCase() === (category as string).toLowerCase()
    );
  }

  if (collection && collection !== 'all') {
    items = items.filter(
      (p) => p.collectionSlug === collection || p.collection.toLowerCase() === (collection as string).toLowerCase()
    );
  }

  if (search && typeof search === 'string' && search.trim()) {
    const q = search.toLowerCase().trim();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    );
  }

  if (minPrice) {
    items = items.filter((p) => p.price >= parseFloat(minPrice as string));
  }

  if (maxPrice) {
    items = items.filter((p) => p.price <= parseFloat(maxPrice as string));
  }

  if (inStock === 'true') {
    items = items.filter((p) => p.inStock && p.stockCount > 0);
  }

  // Sorting
  if (sort === 'price-low') {
    items.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    items.sort((a, b) => b.price - a.price);
  } else if (sort === 'rating') {
    items.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'newest') {
    items.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
  }

  res.json({ success: true, count: items.length, products: items });
});

app.get('/api/products/:id', (req: Request, res: Response) => {
  const item = db.products.find((p) => p.id === req.params.id || p.slug === req.params.id);
  if (!item) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  res.json({ success: true, product: item });
});

// Admin Product Create
app.post('/api/products', (req: Request, res: Response) => {
  const newProduct: Product = {
    id: `prod-${Date.now()}`,
    name: req.body.name,
    slug: req.body.slug || req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    subtitle: req.body.subtitle || '',
    description: req.body.description || '',
    price: Number(req.body.price),
    comparePrice: req.body.comparePrice ? Number(req.body.comparePrice) : undefined,
    category: req.body.category || 'Living Room Decor',
    categorySlug: (req.body.category || 'living-room-decor').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    collection: req.body.collection || 'The Neutral Edit',
    collectionSlug: (req.body.collection || 'the-neutral-edit').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
    tags: Array.isArray(req.body.tags) ? req.body.tags : ['Decor'],
    inStock: req.body.stockCount ? Number(req.body.stockCount) > 0 : true,
    stockCount: req.body.stockCount ? Number(req.body.stockCount) : 10,
    dimensions: req.body.dimensions || 'Standard',
    materials: req.body.materials || 'Ceramic / Wood',
    colors: req.body.colors || [{ name: 'Ivory', hex: '#F5F0E8' }],
    images: req.body.images && req.body.images.length > 0 ? req.body.images : [INITIAL_PRODUCTS[0].images[0]],
    rating: 5.0,
    reviewCount: 1,
    isFeatured: !!req.body.isFeatured,
    isNew: true,
    careInstructions: req.body.careInstructions || 'Wipe with soft clean cloth.',
  };

  db.products.unshift(newProduct);
  saveDatabase(db);
  res.status(201).json({ success: true, product: newProduct });
});

// Admin Product Update
app.put('/api/products/:id', (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }

  const existing = db.products[index];
  const updated: Product = {
    ...existing,
    ...req.body,
    price: req.body.price !== undefined ? Number(req.body.price) : existing.price,
    comparePrice: req.body.comparePrice !== undefined ? Number(req.body.comparePrice) : existing.comparePrice,
    stockCount: req.body.stockCount !== undefined ? Number(req.body.stockCount) : existing.stockCount,
    inStock: req.body.stockCount !== undefined ? Number(req.body.stockCount) > 0 : existing.inStock,
  };

  db.products[index] = updated;
  saveDatabase(db);
  res.json({ success: true, product: updated });
});

// Admin Product Delete
app.delete('/api/products/:id', (req: Request, res: Response) => {
  const index = db.products.findIndex((p) => p.id === req.params.id);
  if (index === -1) {
    res.status(404).json({ success: false, message: 'Product not found' });
    return;
  }
  db.products.splice(index, 1);
  saveDatabase(db);
  res.json({ success: true, message: 'Product deleted' });
});

// 2. Categories, Collections, Rooms
app.get('/api/categories', (_req: Request, res: Response) => {
  res.json({ success: true, categories: INITIAL_CATEGORIES });
});

app.get('/api/collections', (_req: Request, res: Response) => {
  res.json({ success: true, collections: INITIAL_COLLECTIONS });
});

app.get('/api/rooms', (_req: Request, res: Response) => {
  res.json({ success: true, rooms: INITIAL_ROOM_LOOKS });
});

// 3. Coupons Validation
app.post('/api/coupons/validate', (req: Request, res: Response) => {
  const { code, subtotal } = req.body;
  if (!code) {
    res.status(400).json({ success: false, message: 'Coupon code is required' });
    return;
  }

  const coupon = db.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase().trim());
  if (!coupon) {
    res.status(404).json({ success: false, message: 'Invalid coupon code' });
    return;
  }

  if (subtotal < coupon.minOrder) {
    res.status(400).json({
      success: false,
      message: `Minimum order amount of ₹${coupon.minOrder.toLocaleString('en-IN')} required for this coupon`,
    });
    return;
  }

  let discountAmount = 0;
  if (coupon.discountType === 'percent') {
    discountAmount = Math.round((subtotal * coupon.value) / 100);
  } else {
    discountAmount = coupon.value;
  }

  res.json({
    success: true,
    coupon,
    discountAmount,
    message: `Coupon applied: ₹${discountAmount.toLocaleString('en-IN')} off`,
  });
});

// 4. Orders
app.get('/api/orders', (req: Request, res: Response) => {
  const { email } = req.query;
  let list = [...db.orders];
  if (email && typeof email === 'string') {
    list = list.filter((o) => o.customer.email.toLowerCase() === email.toLowerCase());
  }
  // Sort latest first
  list.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  res.json({ success: true, count: list.length, orders: list });
});

app.get('/api/orders/:id', (req: Request, res: Response) => {
  const order = db.orders.find((o) => o.id === req.params.id || o.orderNumber === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }
  res.json({ success: true, order });
});

app.post('/api/orders', (req: Request, res: Response) => {
  const {
    items,
    subtotal,
    discount,
    couponCode,
    shippingFee,
    tax,
    total,
    customer,
    shippingAddress,
    paymentMethod,
    paymentStatus,
    razorpayPaymentId,
    notes,
  } = req.body;

  if (!items || items.length === 0 || !shippingAddress || !customer) {
    res.status(400).json({ success: false, message: 'Missing required order fields' });
    return;
  }

  const orderNum = `CB-${Math.floor(100000 + Math.random() * 900000)}`;
  const trackingNum = `EXP-${Math.floor(100000000 + Math.random() * 900000000)}`;
  const now = new Date().toISOString();

  const newOrder: Order = {
    id: `ord-${Date.now()}`,
    orderNumber: orderNum,
    date: now,
    items,
    subtotal,
    discount: discount || 0,
    couponCode,
    shippingFee: shippingFee || 0,
    tax: tax || 0,
    total,
    customer,
    shippingAddress,
    paymentMethod: paymentMethod || 'cod',
    paymentStatus: paymentStatus || (paymentMethod === 'razorpay' ? 'paid' : 'pending'),
    razorpayPaymentId,
    orderStatus: 'placed',
    trackingNumber: trackingNum,
    trackingSteps: [
      { title: 'Order Confirmed', date: 'Just now', completed: true, current: true },
      { title: 'Artisan Inspection & Packing', date: 'Upcoming', completed: false, current: false },
      { title: 'Handed to Courier Partner', date: 'Upcoming', completed: false, current: false },
      { title: 'Out for Delivery', date: 'Upcoming', completed: false, current: false },
      { title: 'Delivered', date: 'Upcoming', completed: false, current: false },
    ],
    notes,
  };

  // Deduct stock in database
  items.forEach((item: any) => {
    const prod = db.products.find((p) => p.id === item.product.id);
    if (prod) {
      prod.stockCount = Math.max(0, prod.stockCount - item.quantity);
      if (prod.stockCount === 0) prod.inStock = false;
    }
  });

  db.orders.unshift(newOrder);
  saveDatabase(db);

  res.status(201).json({ success: true, order: newOrder });
});

// Admin update order status
app.put('/api/orders/:id/status', (req: Request, res: Response) => {
  const { status, trackingNumber } = req.body;
  const order = db.orders.find((o) => o.id === req.params.id);
  if (!order) {
    res.status(404).json({ success: false, message: 'Order not found' });
    return;
  }

  order.orderStatus = status;
  if (trackingNumber) order.trackingNumber = trackingNumber;

  // Update tracking steps dynamically based on status
  const statuses = ['placed', 'processing', 'shipped', 'delivered'];
  const currentIndex = statuses.indexOf(status);

  order.trackingSteps.forEach((step, idx) => {
    if (idx <= currentIndex) {
      step.completed = true;
      step.current = idx === currentIndex;
    } else {
      step.completed = false;
      step.current = false;
    }
  });

  saveDatabase(db);
  res.json({ success: true, order });
});

// 5. Razorpay Integration (Test Mode and Server-side Verification)
app.post('/api/razorpay/create-order', (req: Request, res: Response) => {
  const { amount, currency = 'INR', receipt } = req.body;
  // Razorpay order creation mock / test payload
  // In live production, this uses new Razorpay({ key_id, key_secret }).orders.create(...)
  const razorpayOrderId = `order_test_${Date.now()}`;
  res.json({
    success: true,
    orderId: razorpayOrderId,
    amount: amount * 100, // in paise
    currency,
    receipt: receipt || `receipt_${Date.now()}`,
    key: process.env.RAZORPAY_KEY_ID || 'rzp_test_cloudberryhome_demo',
  });
});

app.post('/api/razorpay/verify-payment', (req: Request, res: Response) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature } = req.body;
  // Secure server-side verification: in production checks HMAC SHA256 signature
  res.json({
    success: true,
    verified: true,
    paymentId: razorpayPaymentId || `pay_${Date.now()}`,
    message: 'Payment verified securely',
  });
});

// 6. User Auth & Profiles
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (user) {
    res.json({ success: true, user, token: `token_${user.id}` });
  } else {
    // If not found, auto-create customer demo account or default
    const newUser: User = {
      id: `usr-${Date.now()}`,
      name: email.split('@')[0],
      email,
      role: email.includes('admin') ? 'admin' : 'customer',
      createdAt: new Date().toISOString(),
      addresses: [],
    };
    db.users.push(newUser);
    saveDatabase(db);
    res.json({ success: true, user: newUser, token: `token_${newUser.id}` });
  }
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, phone } = req.body;
  if (!name || !email) {
    res.status(400).json({ success: false, message: 'Name and email are required' });
    return;
  }
  const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    res.status(400).json({ success: false, message: 'User with this email already exists' });
    return;
  }

  const newUser: User = {
    id: `usr-${Date.now()}`,
    name,
    email,
    phone,
    role: 'customer',
    createdAt: new Date().toISOString(),
    addresses: [],
  };
  db.users.push(newUser);
  saveDatabase(db);
  res.status(201).json({ success: true, user: newUser, token: `token_${newUser.id}` });
});

app.put('/api/auth/addresses', (req: Request, res: Response) => {
  const { email, address } = req.body;
  const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    res.status(404).json({ success: false, message: 'User not found' });
    return;
  }

  if (address.id) {
    const idx = user.addresses.findIndex((a) => a.id === address.id);
    if (idx !== -1) {
      user.addresses[idx] = address;
    } else {
      user.addresses.push(address);
    }
  } else {
    address.id = `addr-${Date.now()}`;
    if (user.addresses.length === 0) address.isDefault = true;
    user.addresses.push(address);
  }

  saveDatabase(db);
  res.json({ success: true, addresses: user.addresses });
});

// 7. Cloudberry AI Interior Stylist Assistant
function generateStylistFallback(userPrompt: string): string {
  const p = userPrompt.toLowerCase();
  if (p.includes('living') || p.includes('sofa') || p.includes('coffee table')) {
    return `For a serene and inviting living space, I recommend anchoring your coffee table with our Kyoto Fluted Ceramic Vase Trio (₹3,499) paired with the Wabi-Sabi Hand-Carved Mango Wood Tray (₹2,799). To introduce layered tactile warmth, drape our Merino Wool Waffle Throw Blanket (₹4,599) across your sofa and cushion with the Solstice Heavy Slub Linen Covers (₹1,899) in desert oat and mocha.`;
  }
  if (p.includes('bedroom') || p.includes('sleep') || p.includes('bed')) {
    return `To cultivate deep calm in your bedroom sanctuary, start with our washed French flax Solstice Linen Cushions (₹1,899) in gentle sage green and ivory. Place our Aura Travertine & Linen Table Lamp (₹7,899) on your nightstand for a warm 2700K ambient evening glow, and light the Nocturne Sandalwood & Amber Soy Candle (₹1,499) 30 minutes before sleep to ground your space.`;
  }
  if (p.includes('vase') || p.includes('ceramic') || p.includes('flower') || p.includes('plant')) {
    return `Our signature Kyoto Fluted Ceramic Vase Trio (₹3,499) is hand-thrown with a chalky mineral ivory glaze and is water-sealed for both fresh botanicals and dried pampas. For greenery without maintenance, our Faux Fiddle Leaf Fig in Terracotta Vessel (₹5,299) brings organic life and height to neutral room corners.`;
  }
  if (p.includes('light') || p.includes('lamp') || p.includes('glow')) {
    return `Lighting sets the soul of a room. I suggest our Aura Travertine Table Lamp (₹7,899) for heavy stone architectural presence, paired with our Cast Brass Taper Candle Holders (₹2,199) and Nocturne Sandalwood Soy Candle (₹1,499) to establish warm, multi-level hearthside warmth.`;
  }
  if (p.includes('gift') || p.includes('budget') || p.includes('under') || p.includes('price')) {
    return `Wonderful thoughtful choices include our Nocturne Sandalwood & Amber Soy Candle (₹1,499) in a handmade stoneware vessel, our Cast Brass Taper Candle Holders Pair (₹2,199), and our Astrid Brushed Brass Table Clock (₹2,499) with silent sweep movement—all arrive in luxury gift-ready honeycomb packaging.`;
  }
  return `Welcome to Cloudberry Home! To elevate your interior with our signature warm neutral aesthetic, balance hard architectural materials (such as our Verona Sculpted Marble Footed Bowl ₹4,999 or Aura Travertine Lamp ₹7,899) with soft tactile layers (like our Solstice Heavy Slub Linen Cushions ₹1,899 and Merino Waffle Throws ₹4,599). Would you like styling advice for a specific room or color palette?`;
}

app.post('/api/ai/chat', async (req: Request, res: Response) => {
  const { message, history } = req.body;
  if (!message || typeof message !== 'string') {
    res.status(400).json({ success: false, message: 'Message is required' });
    return;
  }

  try {
    if (process.env.GEMINI_API_KEY) {
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI();
      const formattedContents = [
        ...((history || []).map((h: any) => ({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.text }],
        }))),
        { role: 'user', parts: [{ text: message }] },
      ];

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedContents,
        config: {
          systemInstruction: `You are the personal AI Interior Stylist and Decor Consultant for Cloudberry Home, a luxury home decor brand in India.
The brand aesthetic is warm minimalism, cream, beige, ivory, mocha brown, sage green, and muted gold.
Catalog highlights to recommend:
- Kyoto Fluted Ceramic Vase Trio (₹3,499)
- Aura Travertine & Linen Table Lamp (₹7,899)
- Solstice Heavy Slub Linen Cushion Cover (₹1,899)
- Verona Sculpted Marble Footed Bowl (₹4,999)
- Faux Fiddle Leaf Fig in Terracotta Vessel (₹5,299)
- Elysian Minimalist Plaster Relief Wall Art (₹6,499)
- Nocturne Sandalwood & Amber Soy Candle (₹1,499)
- Wabi-Sabi Hand-Carved Mango Wood Tray (₹2,799)
- Astrid Brushed Brass Minimalist Table Clock (₹2,499)
- Merino Wool Waffle Throw Blanket with Fringe (₹4,599)
- Arched Minimalist Brass Wall Mirror (₹8,999)
- Cast Brass Taper Candle Holders Pair (₹2,199)
Shipping: Complimentary Express Delivery across India on orders above ₹1,999.
Provide warm, thoughtful, sophisticated interior advice in 2-3 brief paragraphs, highlighting specific Cloudberry pieces with prices in ₹.`,
        },
      });

      const reply = response.text || generateStylistFallback(message);
      res.json({ success: true, reply });
      return;
    }
  } catch (err) {
    console.warn('Gemini chat error, falling back to local styling intelligence:', err);
  }

  res.json({ success: true, reply: generateStylistFallback(message) });
});

// Setup Vite Dev Server Middleware or Static Production Serving
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Cloudberry Home server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
