import React from 'react';
import { motion, type Variants } from 'motion/react';
import { Sparkles, ShieldCheck, Gem, Compass, ChevronDown } from 'lucide-react';
import { ThreeDMonogram } from './ThreeDMonogram';
import { CategoryFilter } from '../types';

interface HeroProps {
  onExploreClick: () => void;
  onSelectCategory: (cat: CategoryFilter) => void;
  onOpenConcierge: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreClick,
  onSelectCategory,
  onOpenConcierge
}) => {
  // Staggered reveal for VELORA PK text
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.3
      }
    }
  };

  const letterVariants: Variants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.9 }
    }
  };

  const luxuryTags = [
    { label: '24K Swat Emeralds', cat: 'Jewelry' as CategoryFilter },
    { label: 'Lahore Zardozi Sherwanis', cat: 'Couture' as CategoryFilter },
    { label: 'Peshawar Cordovan Chappals', cat: 'Footwear' as CategoryFilter },
    { label: '40-Year Aged Cambodi Oud', cat: 'Oud' as CategoryFilter }
  ];

  return (
    <section className="relative min-h-[92vh] flex flex-col items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background Architectural Atmosphere: Obsidian & Rich Black with Subtle Radial Gold Mists */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Deep ambient radial glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-b from-[#D4AF37]/10 via-[#FFD700]/5 to-transparent rounded-full blur-[140px]" />
        
        {/* Subtle geometric star/diamond lines representing Pakistani Mughal architecture */}
        <div 
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#D4AF37 1px, transparent 1px), radial-gradient(#D4AF37 1px, #050505 1px)`,
            backgroundSize: '40px 40px',
            backgroundPosition: '0 0, 20px 20px'
          }}
        />

        {/* Top and Bottom soft vignettes */}
        <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[#050505] to-transparent" />
        <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[#050505] to-transparent" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center text-center">
        {/* Subtle Brand Hallmark Pill */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0B0B0B]/80 border border-[#D4AF37]/30 shadow-[0_4px_20px_rgba(212,175,55,0.1)] mb-6 backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />
          <span className="text-[11px] tracking-[0.25em] uppercase font-semibold text-[#F5D76E]">
            The Royal Pakistani Marketplace
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
          <span className="text-[10px] tracking-[0.2em] text-[#F5D76E]/70">
            2026 Curations
          </span>
        </motion.div>

        {/* Centerpiece: Original 3D Metallic Gold "VP" Monogram */}
        <div className="relative my-2 sm:my-4 flex flex-col items-center">
          <ThreeDMonogram
            size="hero"
            interactive={true}
            showShimmerTrigger={true}
            className="animate-float-subtle"
          />
        </div>

        {/* Elegant "VELORA PK" Typography with Staggered Reveal Animation */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 flex flex-col items-center"
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3">
            {/* VELORA Letters */}
            <div className="flex items-center tracking-[0.28em] sm:tracking-[0.35em] text-4xl sm:text-6xl md:text-7xl font-serif-lux font-extrabold select-none">
              {'VELORA'.split('').map((char, index) => (
                <motion.span
                  key={index}
                  variants={letterVariants}
                  className="text-gold-gradient inline-block hover:scale-105 transition-transform"
                >
                  {char}
                </motion.span>
              ))}
            </div>

            {/* PK Badge */}
            <motion.div
              variants={letterVariants}
              className="ml-2 sm:ml-4 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-md bg-[#0B0B0B] border border-[#D4AF37]/60 shadow-[0_0_20px_rgba(212,175,55,0.25)] flex items-center justify-center"
            >
              <span className="text-sm sm:text-xl md:text-2xl font-serif-lux font-bold tracking-[0.3em] text-[#FFD700]">
                PK
              </span>
            </motion.div>
          </div>

          {/* Underline Gold Foil Accent */}
          <motion.div
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8, ease: 'easeOut' }}
            className="w-48 sm:w-72 h-[1px] bg-gradient-to-r from-transparent via-[#FFD700] to-transparent mt-4 mb-3"
          />

          {/* Pakistani Luxury Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 1.0 }}
            className="max-w-2xl text-xs sm:text-sm md:text-base text-[#F5D76E]/80 font-light tracking-[0.2em] uppercase leading-relaxed"
          >
            Bespoke Haute Couture <span className="text-[#D4AF37]">•</span> Heirloom 24K Jewelry <span className="text-[#D4AF37]">•</span> Imperial Oud <span className="text-[#D4AF37]">•</span> Master Cobblers
          </motion.p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
        >
          <button
            id="hero-explore-vault-btn"
            onClick={onExploreClick}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#FFD700] via-[#D4AF37] to-[#F5D76E] text-[#050505] font-serif-lux font-bold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-full shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(255,215,0,0.6)] hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Gem className="w-4 h-4 text-[#050505]" />
            <span>Explore The Royal Vault</span>
          </button>

          <button
            id="hero-book-concierge-btn"
            onClick={onOpenConcierge}
            className="w-full sm:w-auto px-8 py-3.5 bg-[#0B0B0B]/90 hover:bg-[#D4AF37]/15 text-[#F5D76E] hover:text-[#FFD700] font-serif-lux font-semibold text-xs sm:text-sm tracking-[0.2em] uppercase rounded-full border border-[#D4AF37]/40 hover:border-[#FFD700] backdrop-blur-md transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-[0_4px_20px_rgba(0,0,0,0.6)]"
          >
            <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
            <span>VIP Salon Concierge</span>
          </button>
        </motion.div>

        {/* Quick Curation Filter Pills */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-2 max-w-2xl"
        >
          <span className="text-[11px] text-[#F5D76E]/50 uppercase tracking-widest mr-1">
            Featured Artisans:
          </span>
          {luxuryTags.map((tag) => (
            <button
              key={tag.label}
              id={`quick-tag-${tag.label.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => {
                onSelectCategory(tag.cat);
                onExploreClick();
              }}
              className="px-3 py-1 text-[11px] text-[#F5D76E]/80 hover:text-[#FFD700] bg-[#0B0B0B]/70 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/25 hover:border-[#FFD700]/60 rounded-full transition-all duration-200 cursor-pointer"
            >
              {tag.label}
            </button>
          ))}
        </motion.div>

        {/* Smooth Scroll Down Indicator */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
          onClick={onExploreClick}
          className="mt-12 text-[#D4AF37]/60 hover:text-[#FFD700] transition-colors flex flex-col items-center gap-1 group cursor-pointer"
          aria-label="Scroll to Vault"
        >
          <span className="text-[9px] uppercase tracking-[0.3em] font-light">Scroll Down</span>
          <ChevronDown className="w-4 h-4 animate-bounce group-hover:text-[#FFD700]" />
        </motion.button>
      </div>
    </section>
  );
};
