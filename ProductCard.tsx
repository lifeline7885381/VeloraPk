import React from 'react';
import { Sparkles, Eye, ShoppingBag, MapPin, ShieldCheck } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductCardProps {
  product: Product;
  currency: Currency;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  currency,
  onQuickView,
  onAddToCart
}) => {
  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-[#0B0B0B] border border-[#D4AF37]/20 hover:border-[#FFD700]/70 rounded-xl overflow-hidden transition-all duration-500 hover:shadow-[0_10px_35px_rgba(212,175,55,0.18)] hover:-translate-y-1.5 flex flex-col"
    >
      {/* Top Gold Foil Corner Accent */}
      <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden pointer-events-none z-20">
        <div className="absolute transform rotate-45 bg-gradient-to-r from-[#D4AF37] to-[#FFD700] text-[#050505] font-bold text-[8px] py-0.5 right-[-35px] top-[14px] w-[100px] text-center shadow-md">
          VIP
        </div>
      </div>

      {/* Image Container with Luxury Overlay */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#050505]">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 filter brightness-95 contrast-105"
        />

        {/* Ambient Dark Gradient on bottom of image for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-transparent to-black/20" />

        {/* Origin & Purity Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider bg-[#050505]/85 border border-[#D4AF37]/40 text-[#FFD700] backdrop-blur-md">
            <Sparkles className="w-2.5 h-2.5 text-[#FFD700]" />
            {product.badge}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-medium tracking-wide bg-[#0B0B0B]/90 border border-[#D4AF37]/25 text-[#F5D76E]/90 backdrop-blur-sm">
            <MapPin className="w-2.5 h-2.5 text-[#D4AF37]" />
            {product.originCity}
          </span>
        </div>

        {/* Quick View Button overlay on hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 backdrop-blur-[2px]">
          <button
            id={`quick-view-btn-${product.id}`}
            onClick={() => onQuickView(product)}
            className="px-4 py-2 bg-[#0B0B0B]/90 hover:bg-[#D4AF37] text-[#FFD700] hover:text-[#050505] text-xs font-serif-lux font-semibold tracking-wider uppercase rounded-full border border-[#D4AF37]/60 transition-all duration-200 flex items-center gap-1.5 shadow-xl active:scale-95 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Examine</span>
          </button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Urdu Name */}
          <div className="flex items-baseline justify-between gap-2 mb-1">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
              {product.category}
            </span>
            {product.urduName && (
              <span className="text-[12px] font-medium text-[#F5D76E]/60 tracking-normal font-serif">
                {product.urduName}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3
            onClick={() => onQuickView(product)}
            className="font-serif-lux font-semibold text-base sm:text-lg text-white group-hover:text-[#FFD700] transition-colors line-clamp-1 cursor-pointer"
          >
            {product.name}
          </h3>

          {/* Subtitle / Craft detail */}
          <p className="text-xs text-[#F5D76E]/60 mt-1 line-clamp-2 leading-relaxed">
            {product.subtitle}
          </p>

          {/* Artisan House */}
          <div className="mt-2.5 flex items-center gap-1.5 text-[10.5px] text-[#F5D76E]/50">
            <ShieldCheck className="w-3 h-3 text-[#D4AF37]" />
            <span className="truncate">{product.artisanHouse}</span>
          </div>
        </div>

        {/* Price & Action */}
        <div className="mt-4 pt-3 border-t border-[#D4AF37]/15 flex items-center justify-between">
          <div>
            <span className="block text-[9px] uppercase tracking-widest text-[#F5D76E]/40">
              Vault Price
            </span>
            <span className="text-base sm:text-lg font-serif-lux font-bold text-gold-gradient tracking-tight">
              {formatPrice(product.pricePKR, product.priceUSD, product.priceAED, currency)}
            </span>
          </div>

          <button
            id={`add-to-bag-btn-${product.id}`}
            onClick={() => onAddToCart(product)}
            className="p-2.5 bg-[#050505] hover:bg-[#D4AF37] text-[#FFD700] hover:text-[#050505] border border-[#D4AF37]/40 hover:border-[#FFD700] rounded-full transition-all duration-300 shadow-md active:scale-95 cursor-pointer group/btn"
            title="Add to Royal Vault Bag"
            aria-label={`Add ${product.name} to bag`}
          >
            <ShoppingBag className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};
