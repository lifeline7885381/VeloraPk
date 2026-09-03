import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, Sparkles, MapPin, ArrowUpDown, X } from 'lucide-react';
import { Product, CategoryFilter, Currency } from '../types';
import { ProductCard } from './ProductCard';
import { CITIES } from '../data/products';

interface MarketplaceGridProps {
  products: Product[];
  currency: Currency;
  selectedCategory: CategoryFilter;
  onSelectCategory: (cat: CategoryFilter) => void;
  searchQuery: string;
  onClearSearch: () => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const MarketplaceGrid: React.FC<MarketplaceGridProps> = ({
  products,
  currency,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onClearSearch,
  onQuickView,
  onAddToCart
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'featured' | 'price-desc' | 'price-asc' | 'rating'>('featured');
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  const categories: CategoryFilter[] = ['All', 'Couture', 'Jewelry', 'Footwear', 'Oud', 'Horology', 'Accessories'];

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((item) => {
        // Category
        if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
        // City
        if (selectedCity !== 'All' && item.originCity !== selectedCity) return false;
        // Search query
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase();
          const matchName = item.name.toLowerCase().includes(query);
          const matchSub = item.subtitle.toLowerCase().includes(query);
          const matchDesc = item.description.toLowerCase().includes(query);
          const matchHouse = item.artisanHouse.toLowerCase().includes(query);
          const matchCity = item.originCity.toLowerCase().includes(query);
          const matchCategory = item.category.toLowerCase().includes(query);
          if (!matchName && !matchSub && !matchDesc && !matchHouse && !matchCity && !matchCategory) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-desc') return b.pricePKR - a.pricePKR;
        if (sortBy === 'price-asc') return a.pricePKR - b.pricePKR;
        if (sortBy === 'rating') return b.rating - a.rating;
        return 0; // featured default order
      });
  }, [products, selectedCategory, selectedCity, searchQuery, sortBy]);

  return (
    <section id="marketplace-vault-section" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-[#D4AF37]/20">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-8 h-[1px] bg-[#D4AF37]" />
            <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              The Royal Collection
            </span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-serif-lux font-bold text-white tracking-wide">
            Pakistan’s Master Craftsmen
          </h2>
          <p className="text-xs sm:text-sm text-[#F5D76E]/70 mt-1 max-w-xl leading-relaxed">
            Every piece is verified for royal provenance, 24K gold assay certification, and heirloom generational needlecraft.
          </p>
        </div>

        {/* Counter and Filter status */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#F5D76E]/80 bg-[#0B0B0B] border border-[#D4AF37]/30 px-3 py-1.5 rounded-full font-medium">
            <span className="text-[#FFD700] font-bold">{filteredProducts.length}</span> Curations Available
          </span>
          <button
            id="mobile-filters-toggle-btn"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#F5D76E] bg-[#0B0B0B] border border-[#D4AF37]/40 rounded-full"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Active Search Query Notice */}
      {searchQuery && (
        <div className="mt-4 flex items-center justify-between p-3 bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-lg text-xs">
          <div className="flex items-center gap-2">
            <span className="text-[#F5D76E]/60">Filtered by:</span>
            <span className="font-semibold text-[#FFD700]">"{searchQuery}"</span>
          </div>
          <button
            onClick={onClearSearch}
            className="flex items-center gap-1 text-[#F5D76E]/80 hover:text-[#FFD700]"
          >
            <X className="w-3.5 h-3.5" />
            <span>Reset Search</span>
          </button>
        </div>
      )}

      {/* Desktop Filter Controls Bar */}
      <div className="mt-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const active = selectedCategory === cat;
            return (
              <button
                key={cat}
                id={`cat-filter-btn-${cat.toLowerCase()}`}
                onClick={() => onSelectCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  active
                    ? 'bg-[#D4AF37] text-[#050505] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                    : 'bg-[#0B0B0B] text-[#F5D76E]/80 border border-[#D4AF37]/25 hover:border-[#FFD700]/60 hover:text-[#FFD700]'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* City Filter & Sort Selection */}
        <div className="flex items-center gap-3">
          {/* Origin City */}
          <div className="flex items-center gap-1.5 bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#F5D76E]">
            <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#F5D76E]/50">Guild City:</span>
            <select
              id="city-filter-select"
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="bg-transparent text-[#FFD700] font-medium focus:outline-none cursor-pointer"
            >
              {CITIES.map((city) => (
                <option key={city} value={city} className="bg-[#0B0B0B] text-white">
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div className="flex items-center gap-1.5 bg-[#0B0B0B] border border-[#D4AF37]/30 rounded-lg px-2.5 py-1.5 text-xs text-[#F5D76E]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span className="text-[#F5D76E]/50">Sort:</span>
            <select
              id="sort-by-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-[#FFD700] font-medium focus:outline-none cursor-pointer"
            >
              <option value="featured" className="bg-[#0B0B0B] text-white">
                Featured Curations
              </option>
              <option value="price-desc" className="bg-[#0B0B0B] text-white">
                Highest Valuation
              </option>
              <option value="price-asc" className="bg-[#0B0B0B] text-white">
                Accessible Luxury
              </option>
              <option value="rating" className="bg-[#0B0B0B] text-white">
                Artisan Rating
              </option>
            </select>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              currency={currency}
              onQuickView={onQuickView}
              onAddToCart={onAddToCart}
            />
          ))}
        </div>
      ) : (
        <div className="mt-16 text-center py-16 px-4 bg-[#0B0B0B] border border-[#D4AF37]/20 rounded-2xl max-w-lg mx-auto">
          <Sparkles className="w-10 h-10 text-[#D4AF37] mx-auto mb-4 animate-pulse" />
          <h3 className="text-xl font-serif-lux font-bold text-white mb-2">
            No Curations Found
          </h3>
          <p className="text-xs text-[#F5D76E]/70 mb-6">
            We could not find items matching your current filters. Please adjust your criteria or reset the search.
          </p>
          <button
            id="reset-all-filters-btn"
            onClick={() => {
              onSelectCategory('All');
              setSelectedCity('All');
              onClearSearch();
            }}
            className="px-6 py-2.5 bg-[#D4AF37] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#FFD700] transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </section>
  );
};
