import React from 'react';
import { ShieldCheck, Award, Lock, Truck, Sparkles, MapPin } from 'lucide-react';
import { ThreeDMonogram } from './ThreeDMonogram';

export const AuthenticityGuarantee: React.FC = () => {
  const pillars = [
    {
      icon: Award,
      title: '24K Gold Hallmark & Gem Assay',
      desc: 'Every piece of high jewelry is tested and stamped by certified Pakistani Gemological Laboratories with strict Karat verification.'
    },
    {
      icon: ShieldCheck,
      title: 'Generational Guild Provenance',
      desc: 'We collaborate exclusively with master artisans across Old Anarkali, Namak Mandi, and Kashigari guilds preserved over centuries.'
    },
    {
      icon: Truck,
      title: 'Armored White-Glove Delivery',
      desc: 'High-valuation acquisitions are dispatched via insured armored courier with biometric recipient handover across all major cities.'
    },
    {
      icon: Lock,
      title: 'Lifetime Royal Authentication',
      desc: 'Each creation arrives in a velvet-lined walnut casket with a tamper-proof wax seal and unique serial registered to your name.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#D4AF37]/20">
      {/* Visual Feature Block with 3D Monogram */}
      <div className="bg-gradient-to-b from-[#0B0B0B] to-[#050505] border border-[#D4AF37]/30 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#050505] border border-[#D4AF37]/40 text-[#FFD700] text-xs font-serif-lux uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5" />
              The VELORA PK Sovereign Standard
            </div>

            <h3 className="text-2xl sm:text-4xl font-serif-lux font-bold text-white leading-tight">
              A Legacy of Uncompromising Pakistani Craftsmanship
            </h3>

            <p className="text-xs sm:text-sm text-[#F5D76E]/70 leading-relaxed max-w-xl">
              VELORA PK was established to elevate Pakistan’s finest artisan treasures onto the global luxury stage. From hand-chiseled Swat emeralds to pure gold zardozi needlework, we guarantee unyielding authenticity and royal heritage.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-[#D4AF37]/15">
              <div>
                <span className="block text-2xl font-serif-lux font-extrabold text-[#FFD700]">100%</span>
                <span className="text-[10px] text-[#F5D76E]/60 uppercase tracking-wider">24K Certified</span>
              </div>
              <div>
                <span className="block text-2xl font-serif-lux font-extrabold text-[#FFD700]">300+</span>
                <span className="text-[10px] text-[#F5D76E]/60 uppercase tracking-wider">Hours Per Sherwani</span>
              </div>
              <div>
                <span className="block text-2xl font-serif-lux font-extrabold text-[#FFD700]">6 Cities</span>
                <span className="text-[10px] text-[#F5D76E]/60 uppercase tracking-wider">Heritage Guilds</span>
              </div>
              <div>
                <span className="block text-2xl font-serif-lux font-extrabold text-[#FFD700]">VIP</span>
                <span className="text-[10px] text-[#F5D76E]/60 uppercase tracking-wider">Armored Handover</span>
              </div>
            </div>
          </div>

          {/* Interactive Compact 3D Logo Showcase */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center p-6 bg-[#050505]/80 border border-[#D4AF37]/30 rounded-2xl relative">
            <span className="text-[10px] font-serif-lux uppercase tracking-[0.25em] text-[#D4AF37] mb-2">
              Official 3D Monogram Insignia
            </span>
            <ThreeDMonogram size="compact" interactive={true} />
            <span className="text-xs font-serif-lux font-bold tracking-[0.2em] text-white mt-1">
              VELORA PK
            </span>
            <span className="text-[9px] text-[#F5D76E]/50 tracking-widest uppercase mt-0.5">
              Interactive Gold Tilt Engine
            </span>
          </div>
        </div>
      </div>

      {/* 4 Pillars Grid */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {pillars.map((p, idx) => {
          const Icon = p.icon;
          return (
            <div
              key={idx}
              className="p-6 bg-[#0B0B0B] border border-[#D4AF37]/20 hover:border-[#FFD700]/50 rounded-2xl transition-all duration-300 hover:shadow-[0_8px_25px_rgba(212,175,55,0.12)] space-y-3"
            >
              <div className="w-10 h-10 rounded-full bg-[#050505] border border-[#D4AF37]/40 flex items-center justify-center text-[#FFD700]">
                <Icon className="w-5 h-5" />
              </div>
              <h4 className="font-serif-lux font-bold text-sm text-white">
                {p.title}
              </h4>
              <p className="text-xs text-[#F5D76E]/70 leading-relaxed">
                {p.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
};
