import React, { useState } from 'react';
import { X, ShoppingBag, Heart, Check, Clock, Calculator } from 'lucide-react';
import { JewelleryItem, MetalType, GemstoneType, OrnamentType } from '../types';
import { ThreeJewelleryViewer, METAL_CONFIG, GEM_CONFIG } from './ThreeJewelleryViewer';

interface Props {
  item: JewelleryItem | null;
  onClose: () => void;
  onAddToCartCustomized: (item: JewelleryItem, metal: MetalType, gemstone: GemstoneType, ringSize: string) => void;
  onToggleWishlist: (item: JewelleryItem) => void;
  isWishlisted: boolean;
  onOpenRental?: (item: JewelleryItem) => void;
  onOpenEMI?: (price: number) => void;
}

export const Product3DModal: React.FC<Props> = ({
  item,
  onClose,
  onAddToCartCustomized,
  onToggleWishlist,
  isWishlisted,
  onOpenRental,
  onOpenEMI,
}) => {
  if (!item) return null;

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(item.metal || 'gold22k');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType>(item.gemstone || 'diamond');
  const [caratSize, setCaratSize] = useState<number>(item.carat || 1.5);
  const [selectedRingSize, setSelectedRingSize] = useState<string>('14 (Indian / 54mm)');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  const initialOrnament: OrnamentType =
    item.ornamentType ||
    (item.category === 'necklaces'
      ? 'necklace'
      : item.category === 'bangles'
      ? 'bangle'
      : item.category === 'earrings'
      ? 'earrings'
      : 'ring');

  // Dynamic price calculation
  const basePrice = item.price;
  const metalMultiplier =
    selectedMetal === 'gold24k' ? 1.15 : selectedMetal === 'gold22k' ? 1.0 : selectedMetal === 'rosegold' ? 0.95 : 1.2;
  const gemMultiplier =
    selectedGemstone === 'diamond' ? 1.0 : selectedGemstone === 'sapphire' ? 0.9 : selectedGemstone === 'emerald' ? 0.85 : 0.95;
  const finalPrice = Math.round(basePrice * metalMultiplier * gemMultiplier);

  const handleAdd = () => {
    setAddedAnimation(true);
    onAddToCartCustomized(item, selectedMetal, selectedGemstone, selectedRingSize);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border border-[#D4AF37]/50 shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="p-4 border-b border-stone-200 flex items-center justify-between bg-white/70">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <span className="text-xs font-bold text-[#4A1017] tracking-wider uppercase">
              3D Interactive Jewellery Studio
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* 3D Canvas Studio */}
          <div className="lg:col-span-7 bg-[#1C1817] rounded-2xl border border-stone-800 shadow-inner relative overflow-hidden min-h-[280px] sm:min-h-[420px] lg:min-h-[480px]">
            <ThreeJewelleryViewer
              selectedMetal={selectedMetal}
              selectedGemstone={selectedGemstone}
              caratSize={caratSize}
              initialOrnament={initialOrnament}
              onMetalChange={setSelectedMetal}
              onGemstoneChange={setSelectedGemstone}
              onCaratChange={setCaratSize}
              showControlsBar={true}
            />
          </div>

          {/* Simple, Understandable Customization Controls */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="text-xs text-stone-500 font-medium mb-1">
                {item.purity} • {item.weightGrams} Grams
              </div>

              <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2B090F] leading-tight">
                {item.name}
              </h2>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {item.description}
              </p>

              {/* Price Banner */}
              <div className="mt-4 p-3.5 bg-white rounded-2xl border border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Estimated Price
                  </span>
                  <div className="font-playfair text-2xl font-bold text-[#4A1017]">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-[11px] text-[#10B981] font-semibold">
                  BIS 916 Certified
                </div>
              </div>

              {/* Metal Selection */}
              <div className="mt-4">
                <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                  Gold & Metal:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(METAL_CONFIG) as MetalType[]).map((metalKey) => {
                    const cfg = METAL_CONFIG[metalKey];
                    const isSelected = selectedMetal === metalKey;
                    return (
                      <button
                        key={metalKey}
                        type="button"
                        onClick={() => setSelectedMetal(metalKey)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          isSelected
                            ? 'bg-[#4A1017] text-white border-[#4A1017] shadow-xs font-semibold'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div>{cfg.name}</div>
                        <div className="text-[10px] opacity-80">{cfg.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gemstone Selection */}
              <div className="mt-4">
                <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                  Center Gemstone:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(Object.keys(GEM_CONFIG) as GemstoneType[]).map((gemKey) => {
                    const gem = GEM_CONFIG[gemKey];
                    const isSelected = selectedGemstone === gemKey;
                    return (
                      <button
                        key={gemKey}
                        type="button"
                        onClick={() => setSelectedGemstone(gemKey)}
                        className={`p-2 rounded-xl text-left border text-xs transition-all ${
                          isSelected
                            ? 'bg-[#B38F2C] text-white border-[#B38F2C] shadow-xs font-semibold'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div>{gem.name}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ring Size Option (Only if Ring) */}
              {initialOrnament === 'ring' && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                    Ring Size:
                  </label>
                  <select
                    value={selectedRingSize}
                    onChange={(e) => setSelectedRingSize(e.target.value)}
                    aria-label="Select Ring Size"
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6B1724]"
                  >
                    <option value="12 (Indian / 52mm)">Size 12 (52mm)</option>
                    <option value="14 (Indian / 54mm)">Size 14 (Standard Bridal / 54mm)</option>
                    <option value="16 (Indian / 56mm)">Size 16 (56mm)</option>
                    <option value="18 (Indian / 58mm)">Size 18 (58mm)</option>
                  </select>
                </div>
              )}

              {/* Quick EMI & Rental triggers */}
              <div className="mt-4 flex gap-2">
                {item.isAvailableForRent && (
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onOpenRental?.(item);
                    }}
                    className="flex-1 py-2 px-3 bg-[#FAF1E4] hover:bg-[#F3E5CC] text-[#8C6D23] rounded-xl text-xs font-bold border border-[#D4AF37]/50 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Rent ₹{item.rentalPricePerDay?.toLocaleString('en-IN')}/day</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenEMI?.(finalPrice);
                  }}
                  className="flex-1 py-2 px-3 bg-white hover:bg-stone-50 text-stone-700 rounded-xl text-xs font-semibold border border-stone-300 flex items-center justify-center gap-1.5 transition-all"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#4A1017]" />
                  <span>0% EMI Plans</span>
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-stone-200 flex items-center gap-3">
              <button
                type="button"
                onClick={() => onToggleWishlist(item)}
                className={`p-3 rounded-xl border transition-all ${
                  isWishlisted
                    ? 'bg-[#6B1724] text-white border-[#6B1724]'
                    : 'bg-white text-stone-600 border-stone-300 hover:text-[#6B1724]'
                }`}
                title="Save to Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
              </button>

              <button
                type="button"
                onClick={handleAdd}
                className="flex-1 py-3 px-4 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2 active:scale-95"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#34D399]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#F3DE8A]" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
