import React, { useState, useEffect } from 'react';
import { ShoppingBag, Search, Crown, Menu, X, ShieldCheck, Sparkles } from 'lucide-react';
import { ThreeDMonogram } from './ThreeDMonogram';
import { Currency, CategoryFilter } from '../types';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  currency: Currency;
  onCurrencyChange: (curr: Currency) => void;
  onSelectCategory: (cat: CategoryFilter) => void;
  selectedCategory: CategoryFilter;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenConcierge: () => void;
  onNavigateAdmin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  currency,
  onCurrencyChange,
  onSelectCategory,
  selectedCategory,
  searchQuery,
  onSearchChange,
  onOpenConcierge,
  onNavigateAdmin
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSearchInput, setShowSearchInput] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navCategories: { label: string; cat: CategoryFilter }[] = [
    { label: 'All Curations', cat: 'All' },
    { label: 'Haute Couture', cat: 'Couture' },
    { label: 'Royal Jewelry', cat: 'Jewelry' },
    { label: 'Artisan Footwear', cat: 'Footwear' },
    { label: 'Regal Oud', cat: 'Oud' },
    { label: 'Horology', cat: 'Horology' }
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-[#050505]/95 backdrop-blur-xl border-b border-[#D4AF37]/20 shadow-[0_10px_30px_rgba(0,0,0,0.8)] py-3'
          : 'bg-gradient-to-b from-[#050505] via-[#050505]/80 to-transparent py-5'
      }`}
    >
      {/* Top micro-bar for VIP Concierge & Pakistani National Craft Guarantee */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2 flex items-center justify-between text-[11px] text-[#F5D76E]/70 border-b border-[#D4AF37]/10 hidden md:flex">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-[#FFD700]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
            Official VELORA 24K Hallmark & Guild Certified
          </span>
          <span className="text-[#D4AF37]/30">|</span>
          <span className="hover:text-[#F5D76E] transition-colors">
            Armored VIP Delivery: Lahore • Karachi • Islamabad
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            id="nav-concierge-top-btn"
            onClick={onOpenConcierge}
            className="flex items-center gap-1.5 hover:text-[#FFD700] transition-colors cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-[#D4AF37]" />
            VIP Concierge Private Salon
          </button>
          <span className="text-[#D4AF37]/30">|</span>
          {/* Currency Toggle */}
          <div className="flex items-center gap-1 bg-[#0B0B0B] border border-[#D4AF37]/30 rounded px-1.5 py-0.5">
            {(['PKR', 'USD', 'AED'] as Currency[]).map((curr) => (
              <button
                key={curr}
                id={`curr-btn-${curr}`}
                onClick={() => onCurrencyChange(curr)}
                className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition-all ${
                  currency === curr
                    ? 'bg-[#D4AF37] text-[#050505]'
                    : 'text-[#F5D76E]/70 hover:text-[#FFD700]'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-2">
        <div className="flex items-center justify-between">
          {/* Brand Logo with 3D Monogram + VELORA PK Typography */}
          <a
            href="#"
            className="flex items-center gap-3 group focus:outline-none"
            aria-label="VELORA PK Homepage"
          >
            <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center relative">
              <ThreeDMonogram size="nav" interactive={false} />
            </div>

            <div className="flex flex-col">
              <div className="flex items-baseline gap-1.5">
                <span className="font-serif-lux font-bold tracking-[0.25em] text-xl text-white group-hover:text-[#FFD700] transition-colors">
                  VELORA
                </span>
                <span className="text-xs font-serif-lux font-semibold tracking-[0.3em] text-[#D4AF37] border border-[#D4AF37]/40 px-1 py-0.2 rounded-sm bg-[#D4AF37]/10">
                  PK
                </span>
              </div>
              <span className="text-[8.5px] uppercase tracking-[0.32em] text-[#F5D76E]/60 font-light">
                Luxury Marketplace
              </span>
            </div>
          </a>

          {/* Desktop Categories */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {navCategories.map(({ label, cat }) => {
              const active = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  id={`nav-cat-${cat}`}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-300 rounded-md cursor-pointer ${
                    active
                      ? 'text-[#050505] bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] font-semibold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                      : 'text-[#F5D76E]/80 hover:text-[#FFD700] hover:bg-[#D4AF37]/10'
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            {/* Search Input / Trigger */}
            <div className="relative">
              {showSearchInput ? (
                <div className="relative flex items-center">
                  <input
                    id="search-input-navbar"
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder="Search couture, emeralds, oud..."
                    className="w-48 sm:w-64 pl-8 pr-7 py-1.5 text-xs bg-[#0B0B0B] border border-[#D4AF37]/50 rounded-full text-white placeholder-[#F5D76E]/40 focus:outline-none focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700]"
                    autoFocus
                  />
                  <Search className="w-3.5 h-3.5 text-[#D4AF37] absolute left-2.5 pointer-events-none" />
                  <button
                    id="clear-search-btn"
                    onClick={() => {
                      if (searchQuery) onSearchChange('');
                      else setShowSearchInput(false);
                    }}
                    className="absolute right-2.5 text-[#F5D76E]/60 hover:text-[#FFD700]"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  id="toggle-search-btn"
                  onClick={() => setShowSearchInput(true)}
                  className="p-2 text-[#F5D76E]/80 hover:text-[#FFD700] hover:bg-[#D4AF37]/10 rounded-full transition-colors cursor-pointer"
                  title="Search curated treasures"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* VIP Concierge Button */}
            <button
              id="vip-concierge-action-btn"
              onClick={onOpenConcierge}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FFD700] bg-[#0B0B0B] border border-[#D4AF37]/40 hover:border-[#FFD700] rounded-full hover:bg-[#D4AF37]/15 transition-all shadow-[0_0_12px_rgba(212,175,55,0.15)] cursor-pointer"
            >
              <Sparkles className="w-3 h-3 text-[#FFD700]" />
              <span>VIP Salon</span>
            </button>

            {/* Cart Button */}
            <button
              id="cart-drawer-trigger-btn"
              onClick={onOpenCart}
              className="relative p-2.5 bg-[#0B0B0B] border border-[#D4AF37]/40 hover:border-[#FFD700] rounded-full hover:bg-[#D4AF37]/15 transition-all text-[#FFD700] shadow-[0_0_12px_rgba(212,175,55,0.2)] cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              {cartCount > 0 && (
                <span
                  id="cart-counter-badge"
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-[#FFD700] to-[#D4AF37] text-[#050505] text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-md animate-pulse"
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Trigger */}
            <button
              id="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#F5D76E] lg:hidden hover:text-[#FFD700] transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Slide-down Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-4 pt-4 border-t border-[#D4AF37]/20 bg-[#0B0B0B]/95 backdrop-blur-2xl rounded-xl p-4 shadow-2xl space-y-4">
            <div className="grid grid-cols-2 gap-2">
              {navCategories.map(({ label, cat }) => (
                <button
                  key={cat}
                  id={`mobile-nav-cat-${cat}`}
                  onClick={() => {
                    onSelectCategory(cat);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-3 py-2 text-xs rounded-lg uppercase tracking-wider transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#D4AF37] text-[#050505] font-semibold'
                      : 'text-[#F5D76E]/80 hover:bg-[#D4AF37]/10'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between text-xs">
              <span className="text-[#F5D76E]/70">Currency</span>
              <div className="flex gap-1">
                {(['PKR', 'USD', 'AED'] as Currency[]).map((curr) => (
                  <button
                    key={curr}
                    onClick={() => onCurrencyChange(curr)}
                    className={`px-2 py-1 rounded text-xs ${
                      currency === curr
                        ? 'bg-[#D4AF37] text-[#050505] font-bold'
                        : 'bg-[#151515] text-[#F5D76E]/80'
                    }`}
                  >
                    {curr}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onOpenConcierge();
                setMobileMenuOpen(false);
              }}
              className="w-full py-2.5 text-center text-xs font-semibold text-[#050505] bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] rounded-lg shadow-lg flex items-center justify-center gap-2 cursor-pointer"
            >
              <Crown className="w-4 h-4" />
              Book Private Salon Showing
            </button>

            {onNavigateAdmin && (
              <button
                onClick={() => {
                  onNavigateAdmin();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 text-center text-[11px] text-[#D4AF37] hover:text-[#FFD700] border border-[#D4AF37]/30 rounded-lg flex items-center justify-center gap-1.5 uppercase font-serif-lux tracking-wider"
              >
                <span>Vault Admin Portal</span>
              </button>
            )}
          </div>
        )}
      </div>
    </header>
  );
};
