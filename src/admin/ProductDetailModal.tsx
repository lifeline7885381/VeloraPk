import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, MapPin, Check, ShoppingBag, MessageSquare, Award, Clock } from 'lucide-react';
import { Product, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface ProductDetailModalProps {
  product: Product | null;
  currency: Currency;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize?: string, customEngraving?: string) => void;
  onOpenConcierge: () => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  currency,
  isOpen,
  onClose,
  onAddToCart,
  onOpenConcierge
}) => {
  const [selectedSize, setSelectedSize] = useState<string>('Standard Royal Fit');
  const [customEngraving, setCustomEngraving] = useState<string>('');
  const [addedNotification, setAddedNotification] = useState<boolean>(false);

  if (!isOpen || !product) return null;

  const sizes = product.category === 'Footwear' 
    ? ['40 EU / 7 UK', '41 EU / 8 UK', '42 EU / 9 UK', '43 EU / 10 UK', '44 EU / 11 UK', 'Bespoke Custom Footprint']
    : product.category === 'Couture'
    ? ['38 (Small)', '40 (Medium)', '42 (Large)', '44 (Extra Large)', 'Bespoke Master Tailoring']
    : ['One Size (Heirloom Edition)'];

  const handleAdd = () => {
    onAddToCart(product, selectedSize, customEngraving);
    setAddedNotification(true);
    setTimeout(() => {
      setAddedNotification(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-black/85 backdrop-blur-xl animate-fadeIn">
      {/* Click outside to close */}
      <div className="fixed inset-0" onClick={onClose} />

      <div
        id="product-detail-modal"
        className="relative z-10 w-full max-w-4xl bg-[#0B0B0B] border border-[#D4AF37]/40 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9)] overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-[#D4AF37]/15 flex items-center justify-between bg-[#050505]/70">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span className="text-xs font-serif-lux uppercase tracking-[0.2em] text-[#FFD700]">
              VELORA Authenticity Verified • {product.purityCert}
            </span>
          </div>
          <button
            id="close-detail-modal-btn"
            onClick={onClose}
            className="p-1 text-[#F5D76E]/60 hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 sm:p-8 max-h-[82vh] overflow-y-auto">
          {/* Left: Image & Hallmark Guarantee */}
          <div className="space-y-4">
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#D4AF37]/30 bg-[#050505]">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-3 left-3 bg-[#050505]/90 border border-[#D4AF37]/40 rounded-full px-3 py-1 text-[10px] font-semibold text-[#FFD700] flex items-center gap-1.5 backdrop-blur-md">
                <Sparkles className="w-3 h-3 text-[#FFD700]" />
                {product.badge}
              </div>
            </div>

            {/* Guild Authenticity Box */}
            <div className="p-4 bg-[#050505] border border-[#D4AF37]/20 rounded-xl space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5D76E]/60">Artisan Guild:</span>
                <span className="text-white font-medium">{product.artisanHouse}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5D76E]/60">Origin City:</span>
                <span className="text-[#FFD700] font-medium flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#D4AF37]" />
                  {product.originCity}, Pakistan
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#F5D76E]/60">Assay Serial:</span>
                <span className="text-[#F5D76E] font-mono text-[11px]">{product.purityCert}</span>
              </div>
            </div>
          </div>

          {/* Right: Details & Order Configuration */}
          <div className="flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <span className="text-xs uppercase tracking-[0.25em] text-[#D4AF37] font-semibold">
                  {product.category}
                </span>
                {product.urduName && (
                  <span className="text-sm font-semibold text-[#F5D76E]/80 font-serif">
                    {product.urduName}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif-lux font-bold text-white leading-tight">
                {product.name}
              </h2>

              <p className="text-sm text-[#F5D76E]/70 mt-2 leading-relaxed">
                {product.description}
              </p>

              {/* Price Display */}
              <div className="mt-5 p-3.5 bg-[#050505] border border-[#D4AF37]/30 rounded-xl flex items-center justify-between">
                <div>
                  <span className="block text-[10px] uppercase tracking-widest text-[#F5D76E]/50">
                    Acquisition Valuation
                  </span>
                  <span className="text-2xl font-serif-lux font-extrabold text-gold-gradient tracking-tight">
                    {formatPrice(product.pricePKR, product.priceUSD, product.priceAED, currency)}
                  </span>
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center gap-1 text-[11px] text-[#FFD700] bg-[#D4AF37]/10 px-2 py-0.5 rounded border border-[#D4AF37]/30">
                    <Clock className="w-3 h-3" /> Armored Courier Ready
                  </span>
                </div>
              </div>

              {/* Specifications Matrix */}
              <div className="mt-5 space-y-2">
                <h4 className="text-xs font-serif-lux uppercase tracking-wider text-[#FFD700]">
                  Mastercraft Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.entries(product.specs).map(([key, value]) => (
                    <div key={key} className="p-2 bg-[#050505]/60 border border-[#D4AF37]/15 rounded">
                      <span className="text-[#F5D76E]/50 block text-[10px] uppercase">{key}</span>
                      <span className="text-white font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Sizing / Custom Fitting */}
              {sizes.length > 1 && (
                <div className="mt-5">
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-2">
                    Select Sizing / Tailoring
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSelectedSize(s)}
                        className={`px-2.5 py-1.5 text-xs rounded border transition-all text-center ${
                          selectedSize === s
                            ? 'bg-[#D4AF37] text-[#050505] font-bold border-[#FFD700]'
                            : 'bg-[#050505] text-[#F5D76E]/80 border-[#D4AF37]/30 hover:border-[#FFD700]'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Custom Monogram Engraving (Optional luxury touch) */}
              <div className="mt-4">
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                  Complimentary 24K Gold Inscription / Initials (Optional)
                </label>
                <input
                  type="text"
                  maxLength={20}
                  value={customEngraving}
                  onChange={(e) => setCustomEngraving(e.target.value)}
                  placeholder="e.g. 'M.K. • 2026' or Urdu Calligraphy"
                  className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/30 rounded-lg text-xs text-white placeholder-[#F5D76E]/30 focus:outline-none focus:border-[#FFD700]"
                />
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-[#D4AF37]/15 space-y-3">
              <button
                id="modal-add-to-vault-btn"
                onClick={handleAdd}
                disabled={addedNotification}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.35)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                {addedNotification ? (
                  <>
                    <Check className="w-4 h-4 text-[#050505]" />
                    <span>Added to Royal Vault Bag</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#050505]" />
                    <span>Acquire & Place In Royal Vault</span>
                  </>
                )}
              </button>

              <button
                id="modal-concierge-inquiry-btn"
                onClick={() => {
                  onClose();
                  onOpenConcierge();
                }}
                className="w-full py-2.5 bg-[#050505] hover:bg-[#D4AF37]/15 text-[#F5D76E] hover:text-[#FFD700] text-xs font-serif-lux font-medium tracking-wider uppercase rounded-xl border border-[#D4AF37]/30 hover:border-[#FFD700] transition-colors flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Inquire with Personal Shopper / VIP Salon</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
