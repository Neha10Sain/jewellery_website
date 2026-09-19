import React, { useState } from 'react';
import { ArrowRight, Star, ShieldCheck, Sparkles, MessageCircle, RotateCw, Eye } from 'lucide-react';
import { ThreeJewelleryViewer } from './ThreeJewelleryViewer';
import { ThreeHeroBackground } from './ThreeHeroBackground';
import { MetalType, GemstoneType } from '../types';

interface Props {
  onExploreClick: () => void;
  onConciergeClick: () => void;
  onOpenDigitalGold: () => void;
  onAddToCartDirect: (metal: MetalType, gemstone: GemstoneType, carat: number) => void;
}

export const HeroSection: React.FC<Props> = ({
  onExploreClick,
  onConciergeClick,
  onOpenDigitalGold,
  onAddToCartDirect,
}) => {
  const [selectedMetal, setSelectedMetal] = useState<MetalType>('gold22k');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType>('diamond');
  const [caratSize, setCaratSize] = useState<number>(1.5);
  const [heroMode, setHeroMode] = useState<'3d' | 'royal_photo'>('3d');

  // Dynamic price calculation based on metal and carat
  const baseGoldWeight = 7.2; // grams
  const goldRate = selectedMetal === 'gold24k' ? 13501 : selectedMetal === 'gold22k' ? 12376 : selectedMetal === 'rosegold' ? 10126 : 8900;
  const metalCost = baseGoldWeight * goldRate;
  const gemCost =
    selectedGemstone === 'diamond'
      ? caratSize * 65000
      : selectedGemstone === 'sapphire'
      ? caratSize * 45000
      : selectedGemstone === 'emerald'
      ? caratSize * 38000
      : caratSize * 42000;
  const makingCharges = 12500;
  const totalEstimatedPrice = Math.round(metalCost + gemCost + makingCharges);

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EDE2] to-[#FAF7F2] border-b border-[#E8DFC8]">
      {/* 3D Dynamic Floating Stardust Background */}
      <ThreeHeroBackground />

      {/* Royal Subtle Mandala Background Pattern */}
      <div className="absolute inset-0 bg-mandala pointer-events-none opacity-40" />

      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-14 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left Column: Royal Copy & Hero Card */}
          <div className="lg:col-span-5 flex flex-col space-y-6">
            {/* Royal Tag Pill */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#B38F2C]" />
                <span className="text-[11px] font-bold tracking-widest text-[#6B1724] uppercase font-cinzel">
                  ROYAL HERITAGE OF LEH, LADAKH • BIS 916
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 bg-[#FAF1E4] px-2.5 py-1 rounded-full text-[10px] font-bold text-[#8C6D23] border border-[#D4AF37]/30">
                <span>BIS 916 PURE</span>
              </div>
            </div>

            {/* Headline */}
            <div>
              <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B090F] leading-[1.08]">
                Purest 916 Gold,{' '}
                <span className="italic font-normal text-[#8C6D23] block sm:inline">
                  Himalayan Royalty
                </span>
              </h1>
              <p className="mt-4 text-sm sm:text-base text-stone-700 leading-relaxed max-w-xl">
                Immerse in the grand splendour of certified BIS 916 hallmarked bridal gold and natural diamonds, meticulously handcrafted by master Himalayan goldsmiths across our Leh, Choglamsar, and Kargil ateliers.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExploreClick}
                className="flex items-center gap-2 bg-[#4A1017] hover:bg-[#6B1724] text-white px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all"
              >
                <span>EXPLORE COLLECTIONS</span>
                <ArrowRight className="w-4 h-4 text-[#F3DE8A]" />
              </button>

              <button
                type="button"
                onClick={onConciergeClick}
                className="flex items-center gap-2 bg-white hover:bg-[#FAF1E4] text-[#4A1017] px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider border border-[#4A1017]/40 shadow-xs hover:border-[#6B1724] transition-all"
              >
                <MessageCircle className="w-4 h-4 text-[#B38F2C]" />
                <span>SHOWROOM CONCIERGE</span>
              </button>
            </div>

            {/* Social Proof Banner matching Screenshot 3 */}
            <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-semibold text-stone-700 border-t border-stone-300/60">
              <div className="flex items-center gap-1">
                <div className="flex text-[#D4AF37]">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#D4AF37]" />
                  ))}
                </div>
                <span className="font-bold text-stone-900 ml-1">RATED 4.9/5</span>
                <span className="text-stone-500">BY 10,000+ PATRONS</span>
              </div>
              <span className="text-stone-400">•</span>
              <div className="flex items-center gap-1.5 text-[#6B1724]">
                <ShieldCheck className="w-4 h-4 text-[#B38F2C]" />
                <span className="font-bold">100% BIS 916 HALLMARKED</span>
              </div>
            </div>

            {/* 3D Customizer Live Summary Box */}
            <div className="bg-white/85 backdrop-blur-md rounded-2xl p-4 border border-[#D4AF37]/30 shadow-sm flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold text-stone-500 tracking-wider block">
                  Configured 3D Piece Value
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-cinzel text-xl font-bold text-[#4A1017]">
                    ₹{totalEstimatedPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[11px] text-stone-500">
                    ({caratSize}ct • {selectedMetal.replace('gold', '').toUpperCase()} Gold)
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onAddToCartDirect(selectedMetal, selectedGemstone, caratSize)}
                className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] text-white font-bold text-xs px-4 py-2 rounded-xl shadow hover:brightness-105 active:scale-95 transition-all"
              >
                Order Custom Ring
              </button>
            </div>
          </div>

          {/* Right Column: 3D Interactive Jewellery Studio & Switcher */}
          <div className="lg:col-span-7">
            <div className="relative rounded-3xl bg-gradient-to-b from-white/90 via-[#FFFDF9]/95 to-white/90 border-2 border-[#D4AF37]/40 shadow-2xl overflow-hidden backdrop-blur-xl">
              {/* Studio Header bar */}
              <div className="px-5 py-3.5 border-b border-[#D4AF37]/20 flex items-center justify-between bg-[#FAF7F2]/80">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                  <span className="font-cinzel text-xs font-bold text-[#4A1017] tracking-wider uppercase">
                    3D Interactive Virtual Atelier
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHeroMode('3d')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      heroMode === '3d'
                        ? 'bg-[#4A1017] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    3D Real-Time Model
                  </button>

                  <button
                    type="button"
                    onClick={() => setHeroMode('royal_photo')}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                      heroMode === 'royal_photo'
                        ? 'bg-[#4A1017] text-white shadow-xs'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    Bridal Silk Photo
                  </button>
                </div>
              </div>

              {/* Viewport Content */}
              {heroMode === '3d' ? (
                <div className="relative h-[480px] sm:h-[540px]">
                  <ThreeJewelleryViewer
                    selectedMetal={selectedMetal}
                    selectedGemstone={selectedGemstone}
                    caratSize={caratSize}
                    onMetalChange={setSelectedMetal}
                    onGemstoneChange={setSelectedGemstone}
                    onCaratChange={setCaratSize}
                    showControlsBar={true}
                  />
                </div>
              ) : (
                <div className="relative h-[480px] sm:h-[540px] overflow-hidden group">
                  <img
                    src="https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80"
                    alt="Royal Leh Gold Bridal Choker"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                    <span className="text-xs font-bold tracking-widest uppercase text-[#F3DE8A] font-cinzel">
                      Masterpiece of Ladakh
                    </span>
                    <h3 className="text-2xl font-bold font-cormorant">
                      The Sheesh Mahal Kundan Jadau Bridal Set
                    </h3>
                    <p className="text-xs text-stone-300 mt-1 max-w-md">
                      Over 180 hours of hand-beaten gold artistry, featuring unheated emeralds and BIS 916 purity stamp.
                    </p>
                    <button
                      type="button"
                      onClick={() => setHeroMode('3d')}
                      className="mt-3 w-fit px-4 py-1.5 bg-[#D4AF37] text-[#2B090F] font-bold text-xs rounded-xl hover:brightness-110"
                    >
                      Switch to 3D Inspection Mode →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
