import React, { useState, useEffect, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  LogOut,
  ExternalLink,
  Shield,
  Layers,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  X,
  Image as ImageIcon,
  DollarSign,
  Barcode,
  Archive,
  Info
} from 'lucide-react';
import { Product, StockStatus, CategoryFilter } from '../types';

interface AdminDashboardProps {
  token: string;
  adminUser: { email: string; name: string };
  onLogout: () => void;
  onNavigateHome: () => void;
}

const PRESET_LUXURY_IMAGES = [
  { label: 'Imperial Sherwani', url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=1000&q=80' },
  { label: '24K Emerald Choker', url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cordovan Chappal', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Cambodi Royal Oud', url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Flying Tourbillon Watch', url: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1000&q=80' },
  { label: 'Pashmina Shawl', url: 'https://images.unsplash.com/photo-1607345366928-199ea26cfe3e?auto=format&fit=crop&w=1000&q=80' }
];

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  token,
  adminUser,
  onLogout,
  onNavigateHome
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [activeProduct, setActiveProduct] = useState<Partial<Product>>({});
  const [saving, setSaving] = useState(false);

  // Delete State
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Toast
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch products from SQLite database
  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Failed to retrieve products from persistent database');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err: any) {
      setError(err.message || 'Database connection error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.sku && p.sku.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesStatus = selectedStatus === 'All' || p.stockStatus === selectedStatus;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [products, searchQuery, selectedCategory, selectedStatus]);

  // Inventory stats
  const stats = useMemo(() => {
    const totalCount = products.length;
    const inStockCount = products.filter((p) => p.stockStatus === 'In Stock' || !p.stockStatus).length;
    const lowStockCount = products.filter((p) => p.stockStatus === 'Low Stock').length;
    const outOfStockCount = products.filter((p) => p.stockStatus === 'Out of Stock').length;
    const totalValuePKR = products.reduce((sum, p) => sum + (Number(p.pricePKR) || 0), 0);
    return { totalCount, inStockCount, lowStockCount, outOfStockCount, totalValuePKR };
  }, [products]);

  // Open Add Modal
  const handleOpenAddModal = () => {
    setModalMode('add');
    setActiveProduct({
      name: '',
      subtitle: 'Handcrafted Sovereign Masterpiece',
      category: 'Couture',
      pricePKR: 150000,
      image: PRESET_LUXURY_IMAGES[0].url,
      sku: `VEL-COU-${Math.floor(100 + Math.random() * 900)}`,
      stockStatus: 'In Stock',
      description: '',
      originCity: 'Lahore',
      artisanHouse: 'Velora Royal Guild Atelier',
      purityCert: 'VELORA Certified Sovereign Hallmark',
      specs: {
        'Craftsmanship': 'Master Artisan Needlework',
        'Authentication': 'Official Velora Guild Seal'
      }
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (product: Product) => {
    setModalMode('edit');
    setActiveProduct({ ...product });
    setIsModalOpen(true);
  };

  // Save Product (Add or Edit)
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProduct.name || !activeProduct.pricePKR) {
      showToast('Product Name and Price in PKR are required', 'error');
      return;
    }

    setSaving(true);
    try {
      const url = modalMode === 'add' ? '/api/products' : `/api/products/${activeProduct.id}`;
      const method = modalMode === 'add' ? 'POST' : 'PUT';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(activeProduct)
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save product in database');

      showToast(
        modalMode === 'add'
          ? `Masterpiece "${activeProduct.name}" added to database.`
          : `Masterpiece "${activeProduct.name}" updated successfully.`
      );

      setIsModalOpen(false);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to save product', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Delete Product
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);

    try {
      const res = await fetch(`/api/products/${deleteTarget.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product from database');

      showToast(`Masterpiece "${deleteTarget.name}" deleted from database.`);
      setDeleteTarget(null);
      fetchProducts();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete product', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const getStatusBadge = (status?: StockStatus) => {
    switch (status) {
      case 'In Stock':
        return 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300';
      case 'Low Stock':
        return 'bg-amber-950/70 border-amber-500/50 text-amber-300';
      case 'Out of Stock':
        return 'bg-rose-950/70 border-rose-500/50 text-rose-300';
      case 'Pre-Order':
        return 'bg-sky-950/70 border-sky-500/50 text-sky-300';
      default:
        return 'bg-zinc-800 border-zinc-700 text-zinc-300';
    }
  };

  return (
    <div className="min-h-screen bg-[#060606] text-[#F5D76E] selection:bg-[#D4AF37]/30 selection:text-[#FFD700]">
      {/* Toast Feedback */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl border flex items-center gap-3 shadow-[0_10px_30px_rgba(0,0,0,0.8)] animate-fadeIn ${
            toast.type === 'error'
              ? 'bg-red-950 border-red-500 text-red-200'
              : 'bg-[#0B0B0B] border-[#FFD700] text-white'
          }`}
        >
          {toast.type === 'error' ? (
            <AlertTriangle className="w-4 h-4 text-red-400" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#FFD700]" />
          )}
          <span className="text-xs font-medium">{toast.message}</span>
        </div>
      )}

      {/* Top Navigation Bar */}
      <header className="border-b border-[#D4AF37]/20 bg-[#0B0B0B]/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/20 border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD700]">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-serif-lux font-bold tracking-[0.2em] text-lg text-white">
                  VELORA <span className="text-[#FFD700]">PK</span>
                </span>
                <span className="ml-2 text-[10px] uppercase tracking-widest font-mono text-[#D4AF37] px-2 py-0.5 rounded bg-[#D4AF37]/10 border border-[#D4AF37]/30">
                  Vault Admin
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:flex flex-col text-right">
              <span className="text-xs font-medium text-white">{adminUser.email}</span>
              <span className="text-[10px] text-[#D4AF37]/80 uppercase tracking-widest">
                Master Database Access
              </span>
            </div>

            <button
              onClick={onNavigateHome}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#D4AF37]/30 hover:border-[#FFD700] text-[#F5D76E] hover:text-[#FFD700] bg-[#111] text-xs font-serif-lux uppercase tracking-wider transition-all cursor-pointer"
              title="View Public Marketplace"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">View Live Store</span>
            </button>

            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/30 hover:border-red-500 text-red-300 hover:text-white bg-red-950/20 hover:bg-red-950/50 text-xs font-serif-lux uppercase tracking-wider transition-all cursor-pointer"
              title="Sign Out of Admin Portal"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Add Product Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-serif-lux uppercase tracking-[0.2em] text-[#D4AF37]">
              <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
              Persistent SQLite Sovereign Catalog
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif-lux font-bold text-white tracking-wide mt-1">
              Masterpiece Inventory & Curations
            </h1>
            <p className="text-xs text-[#F5D76E]/60 max-w-xl mt-1">
              Manage live products displayed on Velora PK. All additions, edits, and deletions persist directly into the cloud database.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchProducts}
              disabled={loading}
              className="p-2.5 rounded-xl border border-[#D4AF37]/30 hover:border-[#FFD700] text-[#FFD700] bg-[#0E0E0E] hover:bg-[#151515] transition-all cursor-pointer disabled:opacity-50"
              title="Refresh Catalog from Database"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#AA771C] text-black font-serif-lux font-bold text-xs uppercase tracking-[0.15em] hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.25)] cursor-pointer"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add Product</span>
            </button>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#D4AF37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#F5D76E]/60 uppercase tracking-widest font-serif-lux">
              <span>Total Catalog</span>
              <Layers className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-2xl font-bold font-serif-lux text-white mt-2">
              {stats.totalCount} <span className="text-xs text-[#D4AF37] font-sans">items</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0B0B] border border-emerald-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-emerald-400/80 uppercase tracking-widest font-serif-lux">
              <span>In Stock</span>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-serif-lux text-emerald-300 mt-2">
              {stats.inStockCount} <span className="text-xs text-emerald-400/70 font-sans">active</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0B0B] border border-amber-500/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-amber-400/80 uppercase tracking-widest font-serif-lux">
              <span>Low / Out of Stock</span>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-serif-lux text-amber-300 mt-2">
              {stats.lowStockCount + stats.outOfStockCount}{' '}
              <span className="text-xs text-amber-400/70 font-sans">attention</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#D4AF37]/20 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-[#F5D76E]/60 uppercase tracking-widest font-serif-lux">
              <span>Inventory Valuation</span>
              <DollarSign className="w-4 h-4 text-[#D4AF37]" />
            </div>
            <div className="text-lg sm:text-xl font-bold font-serif-lux text-[#FFD700] mt-2 truncate">
              ₨ {stats.totalValuePKR.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="p-4 rounded-xl bg-[#0B0B0B] border border-[#D4AF37]/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#D4AF37]/60 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, SKU, category, or description..."
              className="w-full bg-[#141414] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-lg pl-10 pr-4 py-2 text-xs text-white placeholder-[#F5D76E]/30 outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Category Select */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#141414] border border-[#D4AF37]/30 text-xs text-[#F5D76E] rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-[#FFD700]"
            >
              <option value="All">All Categories</option>
              <option value="Couture">Couture</option>
              <option value="Jewelry">Jewelry</option>
              <option value="Footwear">Footwear</option>
              <option value="Oud">Oud</option>
              <option value="Horology">Horology</option>
              <option value="Accessories">Accessories</option>
            </select>

            {/* Status Select */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-[#141414] border border-[#D4AF37]/30 text-xs text-[#F5D76E] rounded-lg px-3 py-2 outline-none cursor-pointer focus:border-[#FFD700]"
            >
              <option value="All">All Stock Statuses</option>
              <option value="In Stock">In Stock</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Out of Stock">Out of Stock</option>
              <option value="Pre-Order">Pre-Order</option>
            </select>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-[#0B0B0B] border border-[#D4AF37]/25 rounded-2xl overflow-hidden shadow-2xl">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-center">
              <div className="w-8 h-8 border-2 border-[#D4AF37] border-t-transparent rounded-full animate-spin mb-3" />
              <p className="text-xs text-[#F5D76E]/70 font-serif-lux tracking-widest uppercase">
                Synchronizing with Sovereign SQLite Vault...
              </p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-300">
              <AlertTriangle className="w-8 h-8 mx-auto text-red-400 mb-2" />
              <p className="text-sm font-semibold">{error}</p>
              <button
                onClick={fetchProducts}
                className="mt-4 px-4 py-2 rounded-lg bg-red-900/40 border border-red-500/40 text-xs text-white hover:bg-red-900/60 transition-all cursor-pointer"
              >
                Retry Database Query
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-16 text-center text-[#F5D76E]/60 space-y-3">
              <Archive className="w-10 h-10 mx-auto text-[#D4AF37]/40" />
              <p className="text-sm font-serif-lux text-white">No products found matching filters</p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                  setSelectedStatus('All');
                }}
                className="text-xs text-[#FFD700] hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#121212] border-b border-[#D4AF37]/20 text-[#D4AF37] font-serif-lux uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Masterpiece</th>
                    <th className="py-3.5 px-4">SKU</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">Price (PKR)</th>
                    <th className="py-3.5 px-4">Stock Status</th>
                    <th className="py-3.5 px-4">Origin / Atelier</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D4AF37]/10">
                  {filteredProducts.map((product) => (
                    <tr
                      key={product.id}
                      className="hover:bg-[#141414] transition-colors group"
                    >
                      {/* Product Name & Thumbnail */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-[#D4AF37]/30 flex-shrink-0 bg-black"
                            referrerPolicy="no-referrer"
                          />
                          <div className="max-w-xs">
                            <div className="font-serif-lux font-bold text-white text-sm group-hover:text-[#FFD700] transition-colors line-clamp-1">
                              {product.name}
                            </div>
                            <div className="text-[11px] text-[#F5D76E]/60 line-clamp-1">
                              {product.description}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3.5 px-4 font-mono text-[11px] text-[#D4AF37]">
                        {product.sku || `VP-${product.id}`}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-serif-lux tracking-wider bg-[#1B1B1B] border border-[#D4AF37]/30 text-[#F5D76E]">
                          {product.category}
                        </span>
                      </td>

                      {/* Price in PKR */}
                      <td className="py-3.5 px-4 font-serif-lux font-bold text-white text-sm whitespace-nowrap">
                        ₨ {Number(product.pricePKR).toLocaleString()}
                        <span className="block text-[10px] text-[#F5D76E]/50 font-sans font-normal">
                          ≈ ${product.priceUSD} / AED {product.priceAED}
                        </span>
                      </td>

                      {/* Stock Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase font-medium border ${getStatusBadge(
                            product.stockStatus
                          )}`}
                        >
                          {product.stockStatus || 'In Stock'}
                        </span>
                      </td>

                      {/* Origin City */}
                      <td className="py-3.5 px-4 text-[#F5D76E]/70 text-[11px]">
                        <div>{product.originCity || 'Lahore'}</div>
                        <div className="text-[10px] text-[#F5D76E]/40 truncate max-w-[140px]">
                          {product.artisanHouse || 'Velora Atelier'}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEditModal(product)}
                            className="p-1.5 rounded-lg border border-[#D4AF37]/30 hover:border-[#FFD700] text-[#F5D76E] hover:text-[#FFD700] hover:bg-[#D4AF37]/10 transition-all cursor-pointer"
                            title="Edit Product Details"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteTarget(product)}
                            className="p-1.5 rounded-lg border border-red-500/30 hover:border-red-500 text-red-400 hover:text-white hover:bg-red-950/40 transition-all cursor-pointer"
                            title="Delete Product from Database"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-[#0D0D0D] border border-[#D4AF37]/50 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9)] relative animate-fadeIn my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[#D4AF37]/20 mb-6">
              <div>
                <h3 className="font-serif-lux font-bold text-xl text-white">
                  {modalMode === 'add' ? 'Add Sovereign Masterpiece' : 'Edit Masterpiece Details'}
                </h3>
                <p className="text-xs text-[#F5D76E]/60 mt-0.5">
                  Synchronizes directly with Velora PK persistent SQLite database
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveProduct} className="space-y-5 text-xs">
              {/* Product Name */}
              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                  Product Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={activeProduct.name || ''}
                  onChange={(e) => setActiveProduct({ ...activeProduct, name: e.target.value })}
                  placeholder="e.g. Royal Swat Emerald & Polki Necklace"
                  className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 outline-none"
                />
              </div>

              {/* Subtitle */}
              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                  Subtitle / Tagline
                </label>
                <input
                  type="text"
                  value={activeProduct.subtitle || ''}
                  onChange={(e) => setActiveProduct({ ...activeProduct, subtitle: e.target.value })}
                  placeholder="e.g. Handcrafted with certified 24K gold foil and royal accents"
                  className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                />
              </div>

              {/* Category, SKU, and Stock Status Row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                    Category <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={activeProduct.category || 'Couture'}
                    onChange={(e) =>
                      setActiveProduct({
                        ...activeProduct,
                        category: e.target.value as Product['category']
                      })
                    }
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Couture">Couture</option>
                    <option value="Jewelry">Jewelry</option>
                    <option value="Footwear">Footwear</option>
                    <option value="Oud">Oud</option>
                    <option value="Horology">Horology</option>
                    <option value="Accessories">Accessories</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1 flex items-center justify-between">
                    <span>SKU <span className="text-red-400">*</span></span>
                    <button
                      type="button"
                      onClick={() => {
                        const cat = activeProduct.category || 'Couture';
                        const prefix = cat.substring(0, 3).toUpperCase();
                        setActiveProduct({
                          ...activeProduct,
                          sku: `VEL-${prefix}-${Math.floor(100 + Math.random() * 900)}`
                        });
                      }}
                      className="text-[10px] text-[#FFD700] hover:underline"
                    >
                      Regenerate
                    </button>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={activeProduct.sku || ''}
                      onChange={(e) => setActiveProduct({ ...activeProduct, sku: e.target.value })}
                      placeholder="VEL-COU-101"
                      className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3.5 py-2.5 font-mono text-xs text-[#FFD700] placeholder-zinc-500 outline-none"
                    />
                    <Barcode className="w-4 h-4 text-[#D4AF37]/40 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                    Stock Status <span className="text-red-400">*</span>
                  </label>
                  <select
                    value={activeProduct.stockStatus || 'In Stock'}
                    onChange={(e) =>
                      setActiveProduct({
                        ...activeProduct,
                        stockStatus: e.target.value as StockStatus
                      })
                    }
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="In Stock">In Stock</option>
                    <option value="Low Stock">Low Stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                    <option value="Pre-Order">Pre-Order</option>
                  </select>
                </div>
              </div>

              {/* Price in PKR */}
              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                  Price in PKR (₨) <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-sm font-serif-lux text-[#D4AF37]">
                    ₨
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    value={activeProduct.pricePKR || ''}
                    onChange={(e) =>
                      setActiveProduct({
                        ...activeProduct,
                        pricePKR: Number(e.target.value),
                        priceUSD: Math.round(Number(e.target.value) / 278),
                        priceAED: Math.round(Number(e.target.value) / 75)
                      })
                    }
                    placeholder="485000"
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl pl-8 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 outline-none font-serif-lux"
                  />
                </div>
                {activeProduct.pricePKR ? (
                  <p className="text-[11px] text-[#D4AF37]/70 mt-1">
                    Converted automatically: ≈ ${Math.round(Number(activeProduct.pricePKR) / 278)} USD • AED{' '}
                    {Math.round(Number(activeProduct.pricePKR) / 75)}
                  </p>
                ) : null}
              </div>

              {/* Product Image URL */}
              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                  Product Image URL <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="url"
                    required
                    value={activeProduct.image || ''}
                    onChange={(e) => setActiveProduct({ ...activeProduct, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                  <ImageIcon className="w-4 h-4 text-[#D4AF37]/40 absolute right-3 top-3 pointer-events-none" />
                </div>

                {/* Preset quick images */}
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  <span className="text-[10px] text-[#F5D76E]/50 uppercase tracking-widest mr-1">
                    Curated Presets:
                  </span>
                  {PRESET_LUXURY_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setActiveProduct({ ...activeProduct, image: preset.url })}
                      className="px-2 py-0.5 rounded bg-[#181818] hover:bg-[#252525] border border-[#D4AF37]/20 text-[10px] text-[#FFD700] transition-colors"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>

                {/* Preview Thumbnail */}
                {activeProduct.image && (
                  <div className="mt-3 flex items-center gap-3 p-2 bg-[#151515] rounded-xl border border-[#D4AF37]/20">
                    <img
                      src={activeProduct.image}
                      alt="Preview"
                      className="w-14 h-14 object-cover rounded-lg border border-[#D4AF37]/30 bg-black"
                      referrerPolicy="no-referrer"
                    />
                    <div className="text-[11px] text-[#F5D76E]/70 truncate">
                      Image Preview Loaded Successfully
                    </div>
                  </div>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                  Description <span className="text-red-400">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={activeProduct.description || ''}
                  onChange={(e) =>
                    setActiveProduct({ ...activeProduct, description: e.target.value })
                  }
                  placeholder="Detailed description of craftsmanship, materials, heritage background, and purity..."
                  className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl p-3 text-xs text-white placeholder-zinc-500 outline-none leading-relaxed"
                />
              </div>

              {/* Origin City & Artisan House */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                    Origin City
                  </label>
                  <select
                    value={activeProduct.originCity || 'Lahore'}
                    onChange={(e) =>
                      setActiveProduct({
                        ...activeProduct,
                        originCity: e.target.value as Product['originCity']
                      })
                    }
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3 py-2.5 text-xs text-white outline-none cursor-pointer"
                  >
                    <option value="Lahore">Lahore</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Multan">Multan</option>
                    <option value="Swat Valley">Swat Valley</option>
                    <option value="Islamabad">Islamabad</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#F5D76E] mb-1">
                    Artisan Atelier / House
                  </label>
                  <input
                    type="text"
                    value={activeProduct.artisanHouse || ''}
                    onChange={(e) =>
                      setActiveProduct({ ...activeProduct, artisanHouse: e.target.value })
                    }
                    placeholder="e.g. Swat Heritage Gems"
                    className="w-full bg-[#151515] border border-[#D4AF37]/30 focus:border-[#FFD700] rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-500 outline-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#D4AF37]/20 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-serif-lux uppercase tracking-wider transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#D4AF37] via-[#F5D76E] to-[#AA771C] text-black font-serif-lux font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all shadow-[0_0_20px_rgba(212,175,55,0.3)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
                >
                  {saving ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-black border-t-transparent rounded-full animate-spin" />
                      <span>Saving to Database...</span>
                    </>
                  ) : (
                    <span>{modalMode === 'add' ? 'Publish Masterpiece' : 'Save Changes'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#0E0E0E] border border-red-500/50 rounded-2xl w-full max-w-md p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9)] relative">
            <div className="flex items-center gap-3 text-red-400 mb-4">
              <div className="w-10 h-10 rounded-xl bg-red-950/60 border border-red-500/40 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-lux font-bold text-base text-white">
                  Confirm Catalog Deletion
                </h4>
                <span className="text-[11px] text-red-300">Irreversible database action</span>
              </div>
            </div>

            <p className="text-xs text-zinc-300 leading-relaxed mb-6">
              Are you sure you wish to delete{' '}
              <strong className="text-white">"{deleteTarget.name}"</strong> (SKU:{' '}
              <span className="font-mono text-[#FFD700]">{deleteTarget.sku || deleteTarget.id}</span>)?
              This will remove the item permanently from the SQLite database and public storefront.
            </p>

            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl border border-zinc-700 text-xs text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-serif-lux font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(239,68,68,0.4)] disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <span>Delete Masterpiece</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
