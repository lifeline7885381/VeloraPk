import React from 'react';
import { ShieldCheck, MapPin, Phone, Mail, Instagram, ArrowUp, Shield } from 'lucide-react';
import { ThreeDMonogram } from './ThreeDMonogram';

interface FooterProps {
  onOpenConcierge: () => void;
  onScrollToTop: () => void;
  onNavigateAdmin?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConcierge, onScrollToTop, onNavigateAdmin }) => {
  return (
    <footer className="bg-[#050505] border-t border-[#D4AF37]/30 text-[#F5D76E]/70 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-[#D4AF37]/15">
          {/* Col 1: Brand & 3D Insignia */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex items-center justify-center">
                <ThreeDMonogram size="nav" interactive={false} />
              </div>
              <div>
                <span className="font-serif-lux font-bold tracking-[0.25em] text-xl text-white">
                  VELORA <span className="text-[#FFD700]">PK</span>
                </span>
                <span className="block text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]">
                  The Royal Pakistani Marketplace
                </span>
              </div>
            </div>

            <p className="text-xs text-[#F5D76E]/60 max-w-sm leading-relaxed">
              Curating sovereign craftsmanship from the ancient bazaars and master ateliers of Lahore, Peshawar, Swat Valley, Karachi, and Multan.
            </p>

            <div className="flex items-center gap-2 text-xs text-[#FFD700] pt-2">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
              <span>Registered Pakistani Luxury Hallmark</span>
            </div>
          </div>

          {/* Col 2: Ateliers & Salons */}
          <div className="space-y-3">
            <h4 className="font-serif-lux font-bold text-xs uppercase tracking-[0.2em] text-white">
              Private Salons
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5 text-[#F5D76E]/80">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Gulberg III, Lahore</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#F5D76E]/80">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Clifton Block 4, Karachi</span>
              </li>
              <li className="flex items-center gap-1.5 text-[#F5D76E]/80">
                <MapPin className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>Sector F-6, Islamabad</span>
              </li>
              <li className="pt-1">
                <button
                  onClick={onOpenConcierge}
                  className="text-[11px] text-[#FFD700] hover:underline"
                >
                  Book Private Showing →
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Curations */}
          <div className="space-y-3">
            <h4 className="font-serif-lux font-bold text-xs uppercase tracking-[0.2em] text-white">
              Royal Curations
            </h4>
            <ul className="space-y-2 text-xs text-[#F5D76E]/70">
              <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Imperial Jamawar & Zardozi</li>
              <li className="hover:text-[#FFD700] transition-colors cursor-pointer">24K Polki & Swat Emeralds</li>
              <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Cordovan Peshawari Chappals</li>
              <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Aged Cambodi Dehn Al Oud</li>
              <li className="hover:text-[#FFD700] transition-colors cursor-pointer">Damascus Flying Tourbillons</li>
            </ul>
          </div>

          {/* Col 4: VIP Services */}
          <div className="space-y-3">
            <h4 className="font-serif-lux font-bold text-xs uppercase tracking-[0.2em] text-white">
              Client Relations
            </h4>
            <ul className="space-y-2 text-xs text-[#F5D76E]/70">
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+92 (042) 111-VELORA-PK</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>concierge@velorapk.com</span>
              </li>
              <li>Armored Delivery Schedule</li>
              <li>24K Purity Verification Registry</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#F5D76E]/50">
          <div>
            © {new Date().getFullYear()} VELORA PK Private Limited. All rights reserved. Sovereign Pakistani Luxury.
          </div>

          <div className="flex items-center gap-4">
            {onNavigateAdmin && (
              <a
                href="/admin"
                onClick={(e) => {
                  e.preventDefault();
                  onNavigateAdmin();
                }}
                className="text-[11px] text-[#D4AF37]/70 hover:text-[#FFD700] transition-colors flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#0A0A0A] border border-[#D4AF37]/30 hover:border-[#FFD700]/60"
              >
                <Shield className="w-3 h-3 text-[#D4AF37]" />
                <span className="font-serif-lux uppercase tracking-widest text-[10px]">Vault Admin</span>
              </a>
            )}
            <span className="text-[11px] text-[#D4AF37]">
              Black & Gold Heritage Guild
            </span>
            <button
              onClick={onScrollToTop}
              className="p-2 rounded-full bg-[#0B0B0B] border border-[#D4AF37]/30 hover:border-[#FFD700] text-[#FFD700] hover:scale-105 transition-all"
              title="Return to Apex"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
