import React, { useState } from 'react';
import { X, ShieldCheck, Sparkles, ShoppingBag, Heart, Check, Ruler } from 'lucide-react';
import { JewelleryItem, MetalType, GemstoneType } from '../types';
import { ThreeJewelleryViewer, METAL_CONFIG, GEM_CONFIG } from './ThreeJewelleryViewer';

interface Props {
  item: JewelleryItem | null;
  onClose: () => void;
  onAddToCartCustomized: (item: JewelleryItem, metal: MetalType, gemstone: GemstoneType, ringSize: string) => void;
  onToggleWishlist: (item: JewelleryItem) => void;
  isWishlisted: boolean;
}

export const Product3DModal: React.FC<Props> = ({
  item,
  onClose,
  onAddToCartCustomized,
  onToggleWishlist,
  isWishlisted,
}) => {
  if (!item) return null;

  const [selectedMetal, setSelectedMetal] = useState<MetalType>(item.metal || 'gold22k');
  const [selectedGemstone, setSelectedGemstone] = useState<GemstoneType>(item.gemstone || 'diamond');
  const [caratSize, setCaratSize] = useState<number>(item.carat || 1.5);
  const [selectedRingSize, setSelectedRingSize] = useState<string>('14 (Indian / 54mm)');
  const [addedAnimation, setAddedAnimation] = useState<boolean>(false);

  // Dynamic price calculation based on customized metal & gem
  const basePrice = item.price;
  const metalMultiplier =
    selectedMetal === 'gold24k' ? 1.15 : selectedMetal === 'gold22k' ? 1.0 : selectedMetal === 'rosegold' ? 0.95 : 1.25;
  const gemMultiplier =
    selectedGemstone === 'diamond' ? 1.0 : selectedGemstone === 'sapphire' ? 0.9 : selectedGemstone === 'emerald' ? 0.85 : 0.95;
  const caratMultiplier = (caratSize / (item.carat || 1.5));
  const finalPrice = Math.round(basePrice * metalMultiplier * ((gemMultiplier * caratMultiplier * 0.4) + 0.6));

  const handleAdd = () => {
    setAddedAnimation(true);
    onAddToCartCustomized(item, selectedMetal, selectedGemstone, selectedRingSize);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-y-auto border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col relative">
        {/* Header bar */}
        <div className="p-4 sm:p-5 border-b border-[#D4AF37]/30 flex items-center justify-between bg-white/60">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="font-cinzel text-xs font-bold text-[#4A1017] tracking-wider uppercase">
              3D Interactive Bespoke Atelier • Leh Ladakh
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

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left: 3D Canvas Studio */}
          <div className="lg:col-span-7 bg-gradient-to-b from-stone-50 via-white to-stone-100 rounded-2xl border border-stone-200 shadow-inner relative overflow-hidden min-h-[420px] sm:min-h-[500px]">
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

          {/* Right: Customization Controls & Pricing */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                <span className="font-bold tracking-wider uppercase text-[#8C6D23]">
                  {item.collection}
                </span>
                <span className="bg-[#FAF1E4] text-[#6B1724] px-2 py-0.5 rounded-full font-bold text-[10px] border border-[#D4AF37]/30">
                  BIS 916 HALLMARKED
                </span>
              </div>

              <h2 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#2B090F] leading-snug">
                {item.name}
              </h2>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {item.description}
              </p>

              {/* Price Highlight */}
              <div className="mt-4 p-3.5 bg-white rounded-2xl border border-stone-200 flex items-baseline justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wider block">
                    Total Estimated Value
                  </span>
                  <div className="font-cinzel text-2xl font-bold text-[#4A1017]">
                    ₹{finalPrice.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="text-right text-[11px] text-stone-500">
                  <div>Net Weight: {item.weightGrams}g</div>
                  <div className="text-[#10B981] font-semibold">Free Karatmeter Testing</div>
                </div>
              </div>

              {/* Metal Alloy Selector */}
              <div className="mt-4">
                <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                  Select Precious Metal & Purity:
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
                            ? 'bg-[#4A1017] text-white border-[#4A1017] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold">{cfg.name}</div>
                        <div className="text-[10px] opacity-80">{cfg.label}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Gemstone Selector */}
              <div className="mt-4">
                <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                  Select Center Gemstone:
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
                            ? 'bg-[#B38F2C] text-white border-[#B38F2C] shadow-sm'
                            : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        <div className="font-bold">{gem.name}</div>
                        <div className="text-[10px] opacity-80">{gem.cut}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Ring Size Selector */}
              <div className="mt-4">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                    Ring Size:
                  </label>
                  <span className="text-[10px] text-[#B38F2C] font-semibold flex items-center gap-1 cursor-pointer">
                    <Ruler className="w-3 h-3" /> Size Guide
                  </span>
                </div>
                <select
                  value={selectedRingSize}
                  onChange={(e) => setSelectedRingSize(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#6B1724]"
                >
                  <option value="12 (Indian / 52mm)">Size 12 (Indian / 52mm)</option>
                  <option value="14 (Indian / 54mm)">Size 14 (Standard Bridal / 54mm)</option>
                  <option value="16 (Indian / 56mm)">Size 16 (Indian / 56mm)</option>
                  <option value="18 (Indian / 58mm)">Size 18 (Indian / 58mm)</option>
                  <option value="20 (Indian / 60mm)">Size 20 (Indian / 60mm)</option>
                </select>
              </div>
            </div>

            {/* Modal Actions */}
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
                className="flex-1 py-3 px-4 bg-gradient-to-r from-[#4A1017] to-[#6B1724] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                {addedAnimation ? (
                  <>
                    <Check className="w-4 h-4 text-[#34D399]" />
                    <span>Added to Bag!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 text-[#F3DE8A]" />
                    <span>Add Configured 3D Piece to Bag</span>
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
