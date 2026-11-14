import React, { useState } from 'react';
import { 
  Package, 
  ShoppingBag, 
  Users, 
  TrendingUp, 
  Plus, 
  Trash2, 
  Edit3, 
  Check, 
  AlertTriangle, 
  Settings, 
  ArrowLeft,
  X
} from 'lucide-react';
import { useStore } from '../context/StoreContext.tsx';
import { Product, Order } from '../types/index.ts';

export const AdminDashboard: React.FC = () => {
  const {
    products,
    orders,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    setActiveTab,
    showToast,
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'content'>('overview');

  // Product Add/Edit Modal
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({
    name: '',
    subtitle: '',
    description: '',
    price: 2999,
    comparePrice: 3499,
    category: 'Living Room Decor',
    stockCount: 15,
    dimensions: '30cm x 30cm',
    materials: 'Ceramic / Oak',
    images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
    isFeatured: true,
  });

  // Calculate Metrics
  const totalRevenue = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.total : 0), 0);
  const totalOrdersCount = orders.length;
  const lowStockProducts = products.filter((p) => p.stockCount <= 5);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) return;
    await addProduct(productForm);
    setIsAddProductOpen(false);
    setProductForm({
      name: '',
      subtitle: '',
      description: '',
      price: 2999,
      comparePrice: 3499,
      category: 'Living Room Decor',
      stockCount: 15,
      dimensions: '30cm x 30cm',
      materials: 'Ceramic / Oak',
      images: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=800&q=80'],
      isFeatured: true,
    });
  };

  const handleUpdateProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    await updateProduct(editingProduct.id, editingProduct);
    setEditingProduct(null);
  };

  return (
    <div className="bg-[#FAF8F5] min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EAE3D9] pb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setActiveTab('home')}
              className="p-2 border border-[#EAE3D9] hover:bg-[#F5F0E8] transition-colors"
              title="Return to store"
            >
              <ArrowLeft className="w-4 h-4 text-[#4E3E37]" />
            </button>
            <div>
              <div className="text-[11px] uppercase tracking-[0.2em] text-[#6D7F6E] font-medium">
                Cloudberry Home Management Console
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#2E2420]">
                Store Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#EDF2ED] text-[#6D7F6E] px-3 py-1 font-semibold uppercase tracking-wider">
              Live Environment
            </span>
            <button
              onClick={() => setActiveTab('home')}
              className="px-4 py-2 border border-[#4E3E37] text-[#4E3E37] hover:bg-[#4E3E37] hover:text-white text-xs uppercase tracking-wider font-medium transition-colors"
            >
              View Public Storefront
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="flex flex-wrap gap-2 border-b border-[#EAE3D9] pb-2">
          <button
            onClick={() => setActiveAdminTab('overview')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 ${
              activeAdminTab === 'overview'
                ? 'bg-[#4E3E37] text-white shadow-sm'
                : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Store Overview</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('products')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 ${
              activeAdminTab === 'products'
                ? 'bg-[#4E3E37] text-white shadow-sm'
                : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('orders')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 ${
              activeAdminTab === 'orders'
                ? 'bg-[#4E3E37] text-white shadow-sm'
                : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Customer Orders ({orders.length})</span>
          </button>
          <button
            onClick={() => setActiveAdminTab('content')}
            className={`px-4 py-2 text-xs uppercase tracking-wider font-medium transition-colors flex items-center gap-2 ${
              activeAdminTab === 'content'
                ? 'bg-[#4E3E37] text-white shadow-sm'
                : 'text-[#6B5A51] hover:bg-[#F5F0E8]'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>Banners & Content</span>
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeAdminTab === 'overview' && (
          <div className="space-y-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 bg-white border border-[#EAE3D9] space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-medium">Total Store Revenue</span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#2E2420]">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[11px] text-[#6D7F6E]">Calculated from paid customer orders</span>
              </div>

              <div className="p-6 bg-white border border-[#EAE3D9] space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-medium">Orders Placed</span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#2E2420]">
                  {totalOrdersCount}
                </div>
                <span className="text-[11px] text-[#7A6B63]">Across Razorpay & Cash on Delivery</span>
              </div>

              <div className="p-6 bg-white border border-[#EAE3D9] space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-medium">Active Catalog Pieces</span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#2E2420]">
                  {products.length}
                </div>
                <span className="text-[11px] text-[#7A6B63]">{categories.length} departments supported</span>
              </div>

              <div className="p-6 bg-white border border-[#EAE3D9] space-y-1">
                <span className="text-xs uppercase tracking-wider text-[#7A6B63] font-medium">Low Stock Alerts</span>
                <div className="font-mono text-2xl sm:text-3xl font-bold text-[#C53929]">
                  {lowStockProducts.length}
                </div>
                <span className="text-[11px] text-[#C53929]">Products with &le; 5 units remaining</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white border border-[#EAE3D9] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-[#EAE3D9] pb-3">
                <h3 className="font-serif text-xl text-[#2E2420]">Recent Customer Transactions</h3>
                <button
                  onClick={() => setActiveAdminTab('orders')}
                  className="text-xs text-[#B88E3E] uppercase tracking-wider hover:underline"
                >
                  View All Orders
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-[#EAE3D9] text-[#7A6B63] uppercase tracking-wider">
                      <th className="py-2.5">Order ID</th>
                      <th className="py-2.5">Customer</th>
                      <th className="py-2.5">Method</th>
                      <th className="py-2.5">Status</th>
                      <th className="py-2.5 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F0E8]">
                    {orders.slice(0, 5).map((o) => (
                      <tr key={o.id}>
                        <td className="py-3 font-mono font-semibold text-[#2E2420]">{o.orderNumber}</td>
                        <td className="py-3">{o.customer.name}</td>
                        <td className="py-3 uppercase text-[11px]">{o.paymentMethod}</td>
                        <td className="py-3">
                          <span className="px-2 py-0.5 uppercase tracking-wider text-[10px] font-semibold bg-[#EDF2ED] text-[#6D7F6E]">
                            {o.orderStatus}
                          </span>
                        </td>
                        <td className="py-3 text-right font-mono font-semibold text-[#2E2420]">
                          ₹{o.total.toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Products */}
        {activeAdminTab === 'products' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-2xl text-[#2E2420]">Product Catalog Inventory</h3>
                <p className="text-xs text-[#7A6B63]">Manage product listings, pricing, dimensions, and live stock levels.</p>
              </div>

              <button
                onClick={() => setIsAddProductOpen(true)}
                className="px-4 py-2.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium flex items-center gap-2 hover:bg-[#2E2420] transition-colors cursor-pointer shadow"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white border border-[#EAE3D9] overflow-x-auto shadow-sm">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#F5F0E8] border-b border-[#EAE3D9] text-[#7A6B63] uppercase tracking-wider">
                    <th className="p-3">Item</th>
                    <th className="p-3">Department</th>
                    <th className="p-3">Price (₹)</th>
                    <th className="p-3">Stock Units</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE3D9]">
                  {products.map((prod) => (
                    <tr key={prod.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="p-3 flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt=""
                          className="w-12 h-14 object-cover bg-[#F5F0E8] shrink-0 border border-[#EAE3D9]"
                        />
                        <div>
                          <div className="font-serif text-sm font-semibold text-[#2E2420] line-clamp-1">{prod.name}</div>
                          <span className="text-[10px] text-[#7A6B63] line-clamp-1">{prod.subtitle}</span>
                        </div>
                      </td>
                      <td className="p-3 text-[#6B5A51]">{prod.category}</td>
                      <td className="p-3 font-mono font-semibold text-[#2E2420]">
                        ₹{prod.price.toLocaleString('en-IN')}
                      </td>
                      <td className="p-3">
                        <span
                          className={`font-mono tabular-nums px-2 py-0.5 rounded text-[11px] font-semibold ${
                            prod.stockCount <= 5
                              ? 'bg-red-50 text-red-700'
                              : 'bg-[#EDF2ED] text-[#6D7F6E]'
                          }`}
                        >
                          {prod.stockCount} in stock
                        </span>
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingProduct(prod)}
                          className="p-1.5 text-[#4E3E37] hover:bg-[#F5F0E8] transition-colors"
                          title="Edit Product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteProduct(prod.id)}
                          className="p-1.5 text-[#C53929] hover:bg-red-50 transition-colors"
                          title="Delete Product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Orders */}
        {activeAdminTab === 'orders' && (
          <div className="space-y-6">
            <div>
              <h3 className="font-serif text-2xl text-[#2E2420]">Customer Orders Fulfillment</h3>
              <p className="text-xs text-[#7A6B63]">Track, update statuses, and monitor dispatch timelines across Pan-India delivery.</p>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="p-5 bg-white border border-[#EAE3D9] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#EAE3D9] pb-3 text-xs">
                    <div>
                      <span className="text-[#7A6B63]">Order ID: </span>
                      <strong className="font-mono text-sm text-[#2E2420]">{ord.orderNumber}</strong>
                      <span className="text-[#7A6B63] ml-3">Date: {new Date(ord.date).toLocaleString()}</span>
                    </div>

                    {/* Status Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-[#7A6B63] uppercase tracking-wider">Status:</span>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                        className="bg-[#FAF8F5] border border-[#EAE3D9] px-2.5 py-1 text-xs uppercase font-semibold text-[#2E2420] focus:outline-none"
                      >
                        <option value="placed">Placed</option>
                        <option value="processing">Processing (QC & Packing)</option>
                        <option value="shipped">Shipped (With Courier)</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </div>
                  </div>

                  {/* Customer and Shipping details */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <strong className="text-[#4E3E37] block uppercase tracking-wider mb-1">Customer</strong>
                      <p className="font-semibold text-[#2E2420]">{ord.customer.name}</p>
                      <p className="text-[#7A6B63]">{ord.customer.email}</p>
                      <p className="text-[#7A6B63] font-mono">{ord.customer.phone}</p>
                    </div>

                    <div>
                      <strong className="text-[#4E3E37] block uppercase tracking-wider mb-1">Shipping Address</strong>
                      <p className="text-[#6B5A51]">{ord.shippingAddress.street}, {ord.shippingAddress.apartment}</p>
                      <p className="text-[#6B5A51]">{ord.shippingAddress.city}, {ord.shippingAddress.state} - {ord.shippingAddress.pinCode}</p>
                    </div>

                    <div>
                      <strong className="text-[#4E3E37] block uppercase tracking-wider mb-1">Payment & Logistics</strong>
                      <p className="uppercase">{ord.paymentMethod} ({ord.paymentStatus})</p>
                      <p className="font-mono text-[#7A6B63]">AWB: {ord.trackingNumber}</p>
                      <p className="font-mono font-semibold text-base text-[#2E2420] mt-1">
                        Total: ₹{ord.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>

                  {/* Ordered items */}
                  <div className="pt-3 border-t border-[#F5F0E8] space-y-1 text-xs">
                    <span className="text-[11px] uppercase tracking-wider text-[#7A6B63]">Order Items:</span>
                    <div className="flex flex-wrap gap-4">
                      {ord.items.map((it, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-1.5 bg-[#FAF8F5] border border-[#EAE3D9]">
                          <img src={it.product.images[0]} alt="" className="w-8 h-10 object-cover" />
                          <span>{it.product.name} &times; {it.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Banners & Content */}
        {activeAdminTab === 'content' && (
          <div className="space-y-6 max-w-2xl bg-white border border-[#EAE3D9] p-6">
            <h3 className="font-serif text-2xl text-[#2E2420]">Store Announcement & Promotional Banners</h3>
            <p className="text-xs text-[#7A6B63]">Update hero promotional message and active coupon discount codes.</p>

            <div className="space-y-4 text-xs">
              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#4E3E37] block mb-1">
                  Top Header Announcement Strip
                </label>
                <input
                  type="text"
                  defaultValue="Complimentary Pan-India Express Delivery on orders over ₹1,999 · Thoughtfully Curated Artisanal Living"
                  className="w-full px-3 py-2 border border-[#EAE3D9] bg-[#FAF8F5]"
                />
              </div>

              <div>
                <label className="text-[11px] uppercase tracking-wider font-semibold text-[#4E3E37] block mb-1">
                  Active Welcome Coupon Code
                </label>
                <input
                  type="text"
                  defaultValue="CLOUDBERRY10 (10% Discount on all orders)"
                  className="w-full px-3 py-2 border border-[#EAE3D9] bg-[#FAF8F5]"
                />
              </div>

              <button
                onClick={() => showToast('Store banner settings updated successfully')}
                className="px-5 py-2.5 bg-[#4E3E37] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
              >
                Save Settings
              </button>
            </div>
          </div>
        )}

        {/* Modal: Add Product */}
        {isAddProductOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-[#FAF8F5] max-w-xl w-full border border-[#EAE3D9] shadow-2xl p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-[#EAE3D9] pb-3">
                <h3 className="font-serif text-2xl text-[#2E2420]">Add New Decor Product</h3>
                <button onClick={() => setIsAddProductOpen(false)} className="p-1">
                  <X className="w-5 h-5 text-[#4E3E37]" />
                </button>
              </div>

              <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                    placeholder="e.g. Kyoto Fluted Stoneware Jug"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Subtitle</label>
                  <input
                    type="text"
                    value={productForm.subtitle}
                    onChange={(e) => setProductForm({ ...productForm, subtitle: e.target.value })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                    placeholder="e.g. Handcrafted matte reactive glaze"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#4E3E37]">Price (₹) *</label>
                    <input
                      type="number"
                      required
                      value={productForm.price}
                      onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EAE3D9] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4E3E37]">Initial Stock Count *</label>
                    <input
                      type="number"
                      required
                      value={productForm.stockCount}
                      onChange={(e) => setProductForm({ ...productForm, stockCount: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EAE3D9] bg-white font-mono"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Department</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Image URL</label>
                  <input
                    type="text"
                    value={productForm.images?.[0] || ''}
                    onChange={(e) => setProductForm({ ...productForm, images: [e.target.value] })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Description</label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                  />
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsAddProductOpen(false)}
                    className="px-4 py-2 border border-[#EAE3D9] text-[#7A6B63]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#4E3E37] text-white uppercase tracking-wider font-medium"
                  >
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Product */}
        {editingProduct && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="relative bg-[#FAF8F5] max-w-xl w-full border border-[#EAE3D9] shadow-2xl p-6 sm:p-8 space-y-4">
              <div className="flex justify-between items-center border-b border-[#EAE3D9] pb-3">
                <h3 className="font-serif text-2xl text-[#2E2420]">Edit Product: {editingProduct.name}</h3>
                <button onClick={() => setEditingProduct(null)} className="p-1">
                  <X className="w-5 h-5 text-[#4E3E37]" />
                </button>
              </div>

              <form onSubmit={handleUpdateProductSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] font-semibold text-[#4E3E37]">Product Name</label>
                  <input
                    type="text"
                    value={editingProduct.name}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    className="w-full p-2 border border-[#EAE3D9] bg-white"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-[#4E3E37]">Price (₹)</label>
                    <input
                      type="number"
                      value={editingProduct.price}
                      onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EAE3D9] bg-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-[#4E3E37]">Stock Count</label>
                    <input
                      type="number"
                      value={editingProduct.stockCount}
                      onChange={(e) => setEditingProduct({ ...editingProduct, stockCount: Number(e.target.value) })}
                      className="w-full p-2 border border-[#EAE3D9] bg-white font-mono"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-[#EAE3D9] flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(null)}
                    className="px-4 py-2 border border-[#EAE3D9] text-[#7A6B63]"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#4E3E37] text-white uppercase tracking-wider font-medium"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
