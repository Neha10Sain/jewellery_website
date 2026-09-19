import React, { useState } from 'react';
import { ArrowRight, Calendar, Sparkles, ShoppingBag, RotateCw, ShieldCheck, Check, Calculator, Clock } from 'lucide-react';
import { ThreeJewelleryViewer } from './ThreeJewelleryViewer';
import { ThreeHeroBackground } from './ThreeHeroBackground';
import { MetalType, GemstoneType, JewelleryItem } from '../types';

interface Props {
  onExploreClick: () => void;
  onConciergeClick: () => void;
  onOpenDigitalGold: () => void;
  onAddToCartDirect: (metal: MetalType, gemstone: GemstoneType, carat: number) => void;
  onOpenRental?: (item: JewelleryItem) => void;
  onOpenCalculator?: (price: number) => void;
}

interface NecklaceColorway {
  id: string;
  name: string;
  colorName: string;
  metal: MetalType;
  metalName: string;
  gemstone: GemstoneType;
  gemstoneName: string;
  purity: string;
  weightGrams: number;
  price: number;
  rentalPricePerDay: number;
  hex: string;
  image: string;
  accentBg: string;
  description: string;
}

const NECKLACE_COLORWAYS: NecklaceColorway[] = [
  {
    id: 'color-emerald',
    name: 'Royal Kashmiri Emerald Bridal Choker',
    colorName: 'Royal Emerald Green',
    metal: 'gold22k',
    metalName: '22K Hallmarked Gold',
    gemstone: 'emerald',
    gemstoneName: 'Colombian Emerald Drops',
    purity: '22K BIS 916 Standard',
    weightGrams: 42.5,
    price: 485000,
    rentalPricePerDay: 3500,
    hex: '#0F766E',
    image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1200&q=80',
    accentBg: 'from-[#052E2B]/90 to-[#0F766E]/80',
    description: 'Masterfully articulated 22K yellow gold choker cascading with vibrant pear-cut emerald teardrops and uncut diamonds.',
  },
  {
    id: 'color-sapphire',
    name: 'Kashmir Blue Sapphire Diamond Choker',
    colorName: 'Kashmir Sapphire Blue',
    metal: 'platinum',
    metalName: 'Platinum 950 & 18K White Gold',
    gemstone: 'sapphire',
    gemstoneName: 'Natural Velvet Blue Sapphires',
    purity: 'Platinum 950 Certified',
    weightGrams: 46.8,
    price: 540000,
    rentalPricePerDay: 4200,
    hex: '#1E3A8A',
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80',
    accentBg: 'from-[#0F172A]/90 to-[#1E3A8A]/80',
    description: 'Rare velvet blue cushion sapphires framed in high-sheen Platinum 950 with micro-pavé solitaire diamond halos.',
  },
  {
    id: 'color-ruby',
    name: 'Imperial Pigeon Blood Ruby Collar',
    colorName: 'Imperial Ruby Red',
    metal: 'gold22k',
    metalName: '22K Yellow Gold',
    gemstone: 'ruby',
    gemstoneName: 'Burmese Ruby Cabochons',
    purity: '22K BIS 916 Standard',
    weightGrams: 44.0,
    price: 510000,
    rentalPricePerDay: 3800,
    hex: '#991B1B',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1200&q=80',
    accentBg: 'from-[#450A0A]/90 to-[#991B1B]/80',
    description: 'Heritage bridal collar with deep crimson rubies set in 22K gold bezel cups with South Sea pearl drops.',
  },
  {
    id: 'color-solitaire',
    name: 'Eternal Solitaire Diamond River Choker',
    colorName: 'Pure Solitaire Diamond',
    metal: 'gold24k',
    metalName: '18K White Gold & 24K Trim',
    gemstone: 'diamond',
    gemstoneName: 'VVS1 Brilliant Solitaires',
    purity: 'IGI Certified VVS1 Diamonds',
    weightGrams: 39.5,
    price: 590000,
    rentalPricePerDay: 4500,
    hex: '#E2E8F0',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1200&q=80',
    accentBg: 'from-[#1E293B]/90 to-[#475569]/80',
    description: 'Continuous rivière line of brilliant cut natural diamonds catching radiant light from every angle.',
  },
  {
    id: 'color-rosegold',
    name: 'Blush Rose Gold Morganite Choker',
    colorName: 'Rose Blush & Morganite',
    metal: 'rosegold',
    metalName: '18K Warm Rose Gold',
    gemstone: 'ruby',
    gemstoneName: 'Blush Pink Morganites',
    purity: '18K Rose Gold BIS Hallmarked',
    weightGrams: 41.2,
    price: 435000,
    rentalPricePerDay: 3200,
    hex: '#FB7185',
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=1200&q=80',
    accentBg: 'from-[#4C0519]/90 to-[#BE123C]/80',
    description: 'Contemporary pastel bridal choker crafted in warm rose gold with delicate morganite and diamond petals.',
  },
];

export const HeroSection: React.FC<Props> = ({
  onExploreClick,
  onConciergeClick,
  onAddToCartDirect,
  onOpenRental,
  onOpenCalculator,
}) => {
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('2d');
  const [isZoomed, setIsZoomed] = useState(false);

  const activeColor = NECKLACE_COLORWAYS[activeColorIndex];

  // Convert activeColor to a pseudo JewelleryItem for rental
  const currentJewelleryItem: JewelleryItem = {
    id: `hero-${activeColor.id}`,
    name: activeColor.name,
    category: 'necklaces',
    ornamentType: 'necklace',
    collection: 'Royal Bridal Haute Couture',
    price: activeColor.price,
    weightGrams: activeColor.weightGrams,
    purity: activeColor.purity,
    metal: activeColor.metal,
    gemstone: activeColor.gemstone,
    image: activeColor.image,
    rating: 5.0,
    reviewsCount: 142,
    description: activeColor.description,
    hallmarkCertified: true,
    has3DModel: true,
    isAvailableForRent: true,
    rentalPricePerDay: activeColor.rentalPricePerDay,
    rentalDeposit: Math.round(activeColor.price * 0.1),
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF7F2] via-[#F4EBE0] to-[#FAF7F2] border-b border-[#E8DFC8]">
      {/* 3D Floating Gold Dust Ambient Background */}
      <ThreeHeroBackground />

      <div className="relative max-w-7xl mx-auto px-4 py-8 lg:py-12 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Clean & Powerful Narrative */}
          <div className="lg:col-span-5 space-y-5">
            {/* Royal Tag Badge */}
            <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#B38F2C] animate-pulse" />
              <span className="text-[11px] font-bold tracking-wider text-[#4A1017] uppercase">
                New Friends Jewellers • Leh Ladakh
              </span>
            </div>

            {/* Headline with Playfair Display */}
            <div>
              <h1 className="font-playfair text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#2B090F] leading-[1.08]">
                Bespoke Bridal Chokers & Fine Gold
              </h1>
              <p className="mt-3 text-sm sm:text-base text-stone-600 leading-relaxed max-w-md">
                Handcrafted 22K BIS 916 certified gold and natural solitaires, available to purchase or rent across 4 flagship boutiques in Ladakh.
              </p>
            </div>

            {/* Color Palette Switcher for the 2D Necklace */}
            <div className="bg-white/80 backdrop-blur-sm p-3.5 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                  Select Necklace Colorway:
                </span>
                <span className="text-xs font-semibold text-[#8C6D23]">
                  {activeColor.colorName}
                </span>
              </div>

              <div className="flex items-center gap-2.5">
                {NECKLACE_COLORWAYS.map((c, idx) => {
                  const isSelected = activeColorIndex === idx;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setActiveColorIndex(idx)}
                      title={c.colorName}
                      className={`group relative flex items-center justify-center rounded-full transition-all ${
                        isSelected
                          ? 'ring-2 ring-offset-2 ring-[#4A1017] scale-110'
                          : 'opacity-70 hover:opacity-100 hover:scale-105'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/20 shadow-xs block"
                        style={{ backgroundColor: c.hex }}
                      />
                      {isSelected && (
                        <Check className="w-4 h-4 text-white absolute inset-0 m-auto drop-shadow-md" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="text-[11px] text-stone-500 pt-1 flex items-center justify-between border-t border-stone-100">
                <span>{activeColor.metalName}</span>
                <span>{activeColor.gemstoneName}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onExploreClick}
                className="bg-[#4A1017] hover:bg-[#681822] text-white px-5 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>Explore Collections</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={onConciergeClick}
                className="bg-white hover:bg-stone-50 text-[#4A1017] border border-[#D4AF37] px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all shadow-xs"
              >
                <Calendar className="w-4 h-4 text-[#B38F2C]" />
                <span>Visit 4 Ladakh Stores</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-200/80">
              <div className="p-2.5 bg-white/70 rounded-xl text-center border border-stone-200">
                <div className="font-bold text-[#4A1017] text-xs">100% BIS 916</div>
                <div className="text-[10px] text-stone-500">Hallmarked Pure</div>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl text-center border border-stone-200">
                <div className="font-bold text-[#4A1017] text-xs">Rental Service</div>
                <div className="text-[10px] text-stone-500">From ₹1,700 / day</div>
              </div>
              <div className="p-2.5 bg-white/70 rounded-xl text-center border border-stone-200">
                <div className="font-bold text-[#4A1017] text-xs">0% EMI Plans</div>
                <div className="text-[10px] text-stone-500">No-Cost Tenure</div>
              </div>
            </div>
          </div>

          {/* Right Column: 2D Stylish Necklace Showcase in Multiple Colors */}
          <div className="lg:col-span-7 relative">
            <div className="bg-white/90 backdrop-blur-md rounded-3xl border-2 border-[#D4AF37]/50 shadow-2xl p-3 sm:p-4 relative overflow-hidden">
              {/* Header inside Showcase with 2D / 3D Toggle */}
              <div className="flex items-center justify-between pb-3 px-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
                  <span className="text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                    {viewMode === '2d' ? '2D Haute Couture Showcase' : '3D Interactive Studio'}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setViewMode('2d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      viewMode === '2d'
                        ? 'bg-[#4A1017] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    2D Showcase
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('3d')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      viewMode === '3d'
                        ? 'bg-[#4A1017] text-white shadow-xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    <RotateCw className="w-3 h-3" />
                    <span>3D View</span>
                  </button>
                </div>
              </div>

              {/* Main Visual Display */}
              {viewMode === '2d' ? (
                <div className="relative w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden bg-stone-900 group shadow-inner">
                  {/* High Quality Necklace Image */}
                  <img
                    src={activeColor.image}
                    alt={activeColor.name}
                    className={`w-full h-full object-cover transition-all duration-700 ${
                      isZoomed ? 'scale-125 cursor-zoom-out' : 'scale-100 cursor-zoom-in'
                    }`}
                    onClick={() => setIsZoomed(!isZoomed)}
                  />

                  {/* Shimmer gradient vignette */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20 pointer-events-none" />

                  {/* Top floating badges */}
                  <div className="absolute top-3 left-3 flex items-center gap-2">
                    <span className="bg-[#4A1017]/90 backdrop-blur-md text-[#F5E5B8] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/40 shadow-xs uppercase">
                      {activeColor.colorName}
                    </span>
                    <span className="bg-white/90 backdrop-blur-md text-[#6B1724] text-[9px] font-bold px-2 py-0.5 rounded-full border border-stone-200 shadow-xs flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-[#B38F2C]" />
                      <span>{activeColor.purity}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white text-[10px] px-2.5 py-1 rounded-full border border-white/20">
                    Gross Weight: {activeColor.weightGrams}g
                  </div>

                  {/* Bottom description banner */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h3 className="font-playfair text-lg sm:text-xl font-bold">
                      {activeColor.name}
                    </h3>
                    <p className="text-xs text-stone-300 line-clamp-1 mt-0.5">
                      {activeColor.description}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="w-full h-[400px] sm:h-[440px] rounded-2xl overflow-hidden bg-[#181514]">
                  <ThreeJewelleryViewer
                    selectedMetal={activeColor.metal}
                    selectedGemstone={activeColor.gemstone}
                    caratSize={2.0}
                    initialOrnament="necklace"
                    showControlsBar={true}
                  />
                </div>
              )}

              {/* Live Price & Multi-Action Bar */}
              <div className="mt-3.5 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/80">
                <div>
                  <div className="text-[11px] text-stone-500">
                    Purchase Price <span className="text-[10px] font-normal text-stone-400">(Incl. GST)</span>
                  </div>
                  <div className="font-playfair text-2xl font-bold text-[#4A1017]">
                    ₹{activeColor.price.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Rental Button */}
                  <button
                    type="button"
                    onClick={() => onOpenRental?.(currentJewelleryItem)}
                    className="bg-[#FAF1E4] hover:bg-[#F3E5CC] text-[#8C6D23] border border-[#D4AF37]/50 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all"
                  >
                    <Clock className="w-3.5 h-3.5 text-[#B38F2C]" />
                    <span>Rent ₹{activeColor.rentalPricePerDay.toLocaleString('en-IN')}/day</span>
                  </button>

                  {/* EMI Button */}
                  <button
                    type="button"
                    onClick={() => onOpenCalculator?.(activeColor.price)}
                    className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all"
                  >
                    <Calculator className="w-3.5 h-3.5 text-[#4A1017]" />
                    <span>0% EMI</span>
                  </button>

                  {/* Add to Bag */}
                  <button
                    type="button"
                    onClick={() => onAddToCartDirect(activeColor.metal, activeColor.gemstone, 2.0)}
                    className="bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] hover:brightness-105 text-[#2B090F] px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-sm transition-all active:scale-95"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Buy Now</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
