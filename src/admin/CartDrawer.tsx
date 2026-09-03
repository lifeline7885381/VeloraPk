import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ShieldCheck, ArrowRight, Lock, CheckCircle2 } from 'lucide-react';
import { CartItem, Currency } from '../types';
import { formatPrice } from '../utils/formatters';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  currency: Currency;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  currency,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart
}) => {
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'shipping' | 'confirmed'>('cart');
  const [customerName, setCustomerName] = useState('');
  const [customerCity, setCustomerCity] = useState('Lahore');
  const [customerPhone, setCustomerPhone] = useState('+92 3');
  const [paymentMethod, setPaymentMethod] = useState<'raast' | 'cod' | 'wire'>('raast');
  const [orderTrackingCode, setOrderTrackingCode] = useState('');

  if (!isOpen) return null;

  const totalPKR = items.reduce((sum, item) => sum + item.product.pricePKR * item.quantity, 0);
  const totalUSD = items.reduce((sum, item) => sum + item.product.priceUSD * item.quantity, 0);
  const totalAED = items.reduce((sum, item) => sum + item.product.priceAED * item.quantity, 0);

  const handleProceedToCheckout = () => {
    setCheckoutStep('shipping');
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const code = `VELORA-PK-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderTrackingCode(code);
    setCheckoutStep('confirmed');
    onClearCart();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />

      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div
          id="cart-drawer"
          className="w-screen max-w-md bg-[#0B0B0B] border-l border-[#D4AF37]/30 shadow-2xl flex flex-col justify-between"
        >
          {/* Header */}
          <div className="px-6 py-5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#050505]">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#FFD700]" />
              <h3 className="font-serif-lux font-bold text-lg text-white tracking-wide">
                Royal Vault Bag
              </h3>
            </div>
            <button
              id="close-cart-btn"
              onClick={onClose}
              className="p-1.5 text-[#F5D76E]/60 hover:text-white rounded-full hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-6">
            {checkoutStep === 'cart' && (
              <>
                {items.length === 0 ? (
                  <div className="py-20 text-center space-y-4">
                    <ShoppingBag className="w-12 h-12 text-[#D4AF37]/40 mx-auto" />
                    <p className="font-serif-lux text-base text-white">Your Vault Bag is Empty</p>
                    <p className="text-xs text-[#F5D76E]/60 max-w-xs mx-auto">
                      Explore our curated Pakistani heirloom crafts and add treasures to your bag.
                    </p>
                    <button
                      onClick={onClose}
                      className="mt-4 px-6 py-2.5 bg-[#D4AF37] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#FFD700] transition-colors"
                    >
                      Browse Curations
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-3 bg-[#050505] border border-[#D4AF37]/20 rounded-xl relative"
                      >
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-20 h-24 object-cover rounded-lg border border-[#D4AF37]/30"
                        />
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-serif-lux font-semibold text-sm text-white line-clamp-1">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => onRemoveItem(item.product.id)}
                                className="text-[#F5D76E]/40 hover:text-red-400 p-1"
                                title="Remove Item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {item.selectedSize && (
                              <p className="text-[11px] text-[#F5D76E]/60 mt-0.5">
                                Size: <span className="text-[#FFD700]">{item.selectedSize}</span>
                              </p>
                            )}

                            {item.customEngraving && (
                              <p className="text-[10px] text-[#D4AF37] italic mt-0.5">
                                Engraved: "{item.customEngraving}"
                              </p>
                            )}
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 border border-[#D4AF37]/30 rounded px-2 py-0.5 bg-[#0B0B0B]">
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                                className="text-xs text-[#F5D76E] px-1 hover:text-[#FFD700]"
                              >
                                -
                              </button>
                              <span className="text-xs font-semibold text-white px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                                className="text-xs text-[#F5D76E] px-1 hover:text-[#FFD700]"
                              >
                                +
                              </button>
                            </div>

                            <span className="font-serif-lux font-bold text-sm text-[#FFD700]">
                              {formatPrice(
                                item.product.pricePKR * item.quantity,
                                item.product.priceUSD * item.quantity,
                                item.product.priceAED * item.quantity,
                                currency
                              )}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {checkoutStep === 'shipping' && (
              <form id="checkout-form" onSubmit={handlePlaceOrder} className="space-y-4">
                <div className="flex items-center gap-2 pb-2 border-b border-[#D4AF37]/20">
                  <span className="text-xs font-serif-lux uppercase tracking-wider text-[#FFD700]">
                    Armored VIP Delivery Protocol
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-[#F5D76E]/80 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Nawabzada Tariq Khan"
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-[#F5D76E]/80 mb-1">City</label>
                    <select
                      value={customerCity}
                      onChange={(e) => setCustomerCity(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                    >
                      <option value="Lahore">Lahore (Gulberg / DHA)</option>
                      <option value="Karachi">Karachi (Clifton / DHA)</option>
                      <option value="Islamabad">Islamabad (F-6 / E-7)</option>
                      <option value="Peshawar">Peshawar (Hayatabad)</option>
                      <option value="Faisalabad">Faisalabad</option>
                      <option value="Multan">Multan</option>
                      <option value="International">Overseas / International</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-[#F5D76E]/80 mb-1">VIP Contact</label>
                    <input
                      type="tel"
                      required
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-[#F5D76E]/80 mb-1">Delivery Address</label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Estate / Penthouse address for armored handover"
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>

                {/* Payment Selection */}
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-2">
                    Settlement Method
                  </label>
                  <div className="space-y-2 text-xs">
                    <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${paymentMethod === 'raast' ? 'bg-[#D4AF37]/15 border-[#FFD700]' : 'bg-[#050505] border-[#D4AF37]/25'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'raast'}
                          onChange={() => setPaymentMethod('raast')}
                        />
                        <span className="text-white font-medium">State Bank Raast / Instant QR</span>
                      </div>
                      <span className="text-[10px] text-[#FFD700] bg-[#FFD700]/10 px-2 py-0.5 rounded">Zero Fee</span>
                    </label>

                    <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${paymentMethod === 'wire' ? 'bg-[#D4AF37]/15 border-[#FFD700]' : 'bg-[#050505] border-[#D4AF37]/25'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'wire'}
                          onChange={() => setPaymentMethod('wire')}
                        />
                        <span className="text-white font-medium">HBL / Bank Alfalah Luxe Wire</span>
                      </div>
                      <span className="text-[10px] text-[#F5D76E]/60">Bank Transfer</span>
                    </label>

                    <label className={`flex items-center justify-between p-2.5 rounded-lg border cursor-pointer ${paymentMethod === 'cod' ? 'bg-[#D4AF37]/15 border-[#FFD700]' : 'bg-[#050505] border-[#D4AF37]/25'}`}>
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="payment"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                        />
                        <span className="text-white font-medium">Armored Handover (Cash on Delivery)</span>
                      </div>
                      <span className="text-[10px] text-[#F5D76E]/60">VIP Protocol</span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="w-1/3 py-2.5 bg-[#050505] border border-[#D4AF37]/30 text-[#F5D76E] rounded-xl text-xs"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="w-2/3 py-2.5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] text-[#050505] font-serif-lux font-bold rounded-xl text-xs uppercase tracking-wider shadow-lg"
                  >
                    Authorize Acquisition
                  </button>
                </div>
              </form>
            )}

            {checkoutStep === 'confirmed' && (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#D4AF37]/20 border border-[#FFD700] rounded-full flex items-center justify-center mx-auto text-[#FFD700] shadow-[0_0_30px_rgba(212,175,55,0.4)]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif-lux font-bold text-xl text-white">
                  Acquisition Authorized
                </h4>
                <p className="text-xs text-[#F5D76E]/80 max-w-xs mx-auto">
                  Your order has been sealed and submitted to the VELORA PK Guild Vault.
                </p>

                <div className="p-4 bg-[#050505] border border-[#D4AF37]/30 rounded-xl text-xs space-y-1">
                  <span className="text-[#F5D76E]/60 block text-[10px] uppercase">Royal Protocol Tracking</span>
                  <span className="font-mono text-base font-bold text-[#FFD700]">{orderTrackingCode}</span>
                  <p className="text-[10px] text-[#F5D76E]/50 mt-1">
                    White-glove armored courier will contact you within 2 hours.
                  </p>
                </div>

                <button
                  onClick={() => {
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="mt-6 px-8 py-2.5 bg-[#D4AF37] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#FFD700] transition-colors"
                >
                  Return to Marketplace
                </button>
              </div>
            )}
          </div>

          {/* Footer with Summary (Cart view only) */}
          {checkoutStep === 'cart' && items.length > 0 && (
            <div className="p-6 border-t border-[#D4AF37]/20 bg-[#050505] space-y-4">
              <div className="space-y-1.5 text-xs">
                <div className="flex justify-between text-[#F5D76E]/70">
                  <span>Vault Subtotal</span>
                  <span>{formatPrice(totalPKR, totalUSD, totalAED, currency)}</span>
                </div>
                <div className="flex justify-between text-[#F5D76E]/70">
                  <span>Armored VIP Courier Handover</span>
                  <span className="text-[#FFD700] font-semibold">Complimentary</span>
                </div>
                <div className="flex justify-between text-[#F5D76E]/70">
                  <span>24K Assay & Certificate Sealing</span>
                  <span className="text-[#FFD700] font-semibold">Included</span>
                </div>
                <div className="pt-2 border-t border-[#D4AF37]/15 flex justify-between items-baseline">
                  <span className="font-serif-lux uppercase text-sm font-semibold text-white">
                    Total Valuation
                  </span>
                  <span className="font-serif-lux font-extrabold text-xl text-gold-gradient">
                    {formatPrice(totalPKR, totalUSD, totalAED, currency)}
                  </span>
                </div>
              </div>

              <button
                id="cart-checkout-proceed-btn"
                onClick={handleProceedToCheckout}
                className="w-full py-3.5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_0_25px_rgba(212,175,55,0.3)] hover:shadow-[0_0_35px_rgba(255,215,0,0.5)] transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
              >
                <span>Proceed to Armored Handover</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[10px] text-[#F5D76E]/50">
                <Lock className="w-3 h-3 text-[#D4AF37]" />
                <span>256-Bit Encrypted Royal Sovereign Transaction</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
