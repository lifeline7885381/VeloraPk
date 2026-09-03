import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { MarketplaceGrid } from './components/MarketplaceGrid';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { VipConciergeModal } from './components/VipConciergeModal';
import { AuthenticityGuarantee } from './components/AuthenticityGuarantee';
import { Footer } from './components/Footer';
import { AdminApp } from './admin/AdminApp';
import { LUXURY_PRODUCTS } from './data/products';
import { Product, CartItem, Currency, CategoryFilter } from './types';
import { Check } from 'lucide-react';

export default function App() {
  // Navigation & Route State
  const [currentPath, setCurrentPath] = useState<string>(() => {
    return typeof window !== 'undefined' ? window.location.pathname : '/';
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', path);
      setCurrentPath(path);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Products from persistent SQLite database
  const [products, setProducts] = useState<Product[]>(LUXURY_PRODUCTS);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Database fetch status ' + res.status);
        return res.json();
      })
      .then((data) => {
        if (data.products && Array.isArray(data.products) && data.products.length > 0) {
          setProducts(data.products);
        }
      })
      .catch((err) => {
        console.warn('Initial product load fallback to local catalog:', err);
      });
  }, [currentPath]);

  // If visiting /admin, exclusively render the sovereign Admin Portal
  if (currentPath === '/admin' || currentPath.startsWith('/admin')) {
    return <AdminApp onNavigateHome={() => navigateTo('/')} />;
  }

  const [currency, setCurrency] = useState<Currency>('PKR');
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isConciergeOpen, setIsConciergeOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart Handlers
  const handleAddToCart = (product: Product, selectedSize?: string, customEngraving?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [
          ...prev,
          {
            product,
            quantity: 1,
            selectedSize,
            customEngraving
          }
        ];
      }
    });

    // Show luxury feedback toast
    setToastMessage(`Acquisition added to Royal Vault Bag: ${product.name}`);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(productId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (productId: string) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const scrollToVault = () => {
    const el = document.getElementById('marketplace-vault-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5D76E] selection:bg-[#D4AF37]/30 selection:text-[#FFD700] relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#0B0B0B] border border-[#FFD700] rounded-xl px-4 py-3 shadow-[0_10px_30px_rgba(212,175,55,0.3)] flex items-center gap-3 animate-fadeIn">
          <div className="w-6 h-6 rounded-full bg-[#D4AF37]/20 flex items-center justify-center text-[#FFD700]">
            <Check className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-medium text-white">{toastMessage}</span>
        </div>
      )}

      {/* Navigation */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        currency={currency}
        onCurrencyChange={setCurrency}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => {
          setSelectedCategory(cat);
          scrollToVault();
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onNavigateAdmin={() => navigateTo('/admin')}
      />

      <main>
        {/* Hero Section with 3D Monogram & VELORA PK Brand Reveal */}
        <Hero
          onExploreClick={scrollToVault}
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            scrollToVault();
          }}
          onOpenConcierge={() => setIsConciergeOpen(true)}
        />

        {/* Marketplace Grid with Live Database Products */}
        <MarketplaceGrid
          products={products}
          currency={currency}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onQuickView={(p) => setQuickViewProduct(p)}
          onAddToCart={(p) => handleAddToCart(p)}
        />

        {/* Sovereign Standards & Authenticity Guarantee */}
        <AuthenticityGuarantee />
      </main>

      {/* Footer */}
      <Footer
        onOpenConcierge={() => setIsConciergeOpen(true)}
        onScrollToTop={scrollToTop}
        onNavigateAdmin={() => navigateTo('/admin')}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={quickViewProduct}
        currency={currency}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onOpenConcierge={() => setIsConciergeOpen(true)}
      />

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        currency={currency}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onClearCart={handleClearCart}
      />

      {/* VIP Concierge Modal */}
      <VipConciergeModal
        isOpen={isConciergeOpen}
        onClose={() => setIsConciergeOpen(false)}
      />
    </div>
  );
}
