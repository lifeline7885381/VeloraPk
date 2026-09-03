import React, { useState } from 'react';
import { X, Crown, Sparkles, Check, PhoneCall, Calendar, MapPin } from 'lucide-react';

interface VipConciergeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VipConciergeModal: React.FC<VipConciergeModalProps> = ({
  isOpen,
  onClose
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [salonCity, setSalonCity] = useState('Lahore - Gulberg Private Vault');
  const [clientName, setClientName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [inquiryType, setInquiryType] = useState('Bridal / Wedding Bespoke Wardrobe');
  const [preferredDate, setPreferredDate] = useState('2026-09-15');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} />

      <div
        id="vip-concierge-modal"
        className="relative z-10 w-full max-w-lg bg-[#0B0B0B] border border-[#D4AF37]/50 rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.95)] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-[#D4AF37]/20 bg-[#050505] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#D4AF37]/15 rounded-full border border-[#FFD700]/40">
              <Crown className="w-5 h-5 text-[#FFD700]" />
            </div>
            <div>
              <h3 className="font-serif-lux font-bold text-lg text-white">
                VELORA PK Private Salon
              </h3>
              <p className="text-[11px] text-[#F5D76E]/60 uppercase tracking-widest">
                By Invitation & VIP Appointment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-[#F5D76E]/60 hover:text-white rounded-full hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="py-8 text-center space-y-4">
              <div className="w-14 h-14 bg-[#D4AF37]/20 border border-[#FFD700] rounded-full flex items-center justify-center mx-auto text-[#FFD700]">
                <Check className="w-7 h-7" />
              </div>
              <h4 className="font-serif-lux font-bold text-xl text-white">
                Private Consultation Requested
              </h4>
              <p className="text-xs text-[#F5D76E]/70 max-w-sm mx-auto leading-relaxed">
                Your dedicated VELORA VIP Client Relations Officer will reach out via confidential phone or encrypted message to confirm your appointment.
              </p>
              <div className="p-3 bg-[#050505] border border-[#D4AF37]/30 rounded-xl text-xs text-[#FFD700] font-mono">
                Booking Reference #VIP-{Math.floor(1000 + Math.random() * 9000)}
              </div>
              <button
                onClick={() => {
                  setSubmitted(false);
                  onClose();
                }}
                className="mt-4 px-8 py-2.5 bg-[#D4AF37] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-wider rounded-full hover:bg-[#FFD700]"
              >
                Close Window
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-xs text-[#F5D76E]/70 leading-relaxed">
                Experience high jewelry, haute couture, and rare reserve ouds in a private viewing suite with our master jewelers and couturiers.
              </p>

              <div>
                <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                  Private Salon Location
                </label>
                <div className="relative">
                  <select
                    value={salonCity}
                    onChange={(e) => setSalonCity(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option value="Lahore - Gulberg Private Vault">Lahore — Gulberg III Private Salon</option>
                    <option value="Karachi - Clifton Oceanfront Suite">Karachi — Clifton Block 4 View Suite</option>
                    <option value="Islamabad - Diplomatic Enclave">Islamabad — F-6 Hillside Salon</option>
                    <option value="Virtual VIP Concierge (Zoom / FaceTime)">Overseas / Virtual Video Showcase</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="e.g. Begum Fatima Abbasi"
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                    Direct Contact / WhatsApp
                  </label>
                  <input
                    type="tel"
                    required
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="+92 300 0000000"
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                    Focus of Showing
                  </label>
                  <select
                    value={inquiryType}
                    onChange={(e) => setInquiryType(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  >
                    <option>Bridal / Wedding Bespoke Wardrobe</option>
                    <option>24K Kundan & Swat Emerald High Jewelry</option>
                    <option>Exclusive Reserve Oud & Perfumery</option>
                    <option>Horology & Damascus Timepieces</option>
                    <option>Bespoke Leathercraft Commission</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-serif-lux uppercase tracking-wider text-[#FFD700] mb-1">
                    Preferred Date
                  </label>
                  <input
                    type="date"
                    required
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full px-3 py-2 bg-[#050505] border border-[#D4AF37]/40 rounded-lg text-xs text-white focus:outline-none focus:border-[#FFD700]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-4 py-3 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] text-[#050505] font-serif-lux font-bold text-xs uppercase tracking-[0.2em] rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.4)] hover:shadow-[0_0_30px_rgba(255,215,0,0.6)] transition-all cursor-pointer"
              >
                Request Private Invitation
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
