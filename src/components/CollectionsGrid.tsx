import React, { useState } from 'react';
import { Sparkles, Heart, Eye, ShoppingBag, ShieldCheck, Clock, Calculator } from 'lucide-react';
import { JewelleryItem } from '../types';

interface Props {
  products: JewelleryItem[];
  onOpen3DModal: (item: JewelleryItem) => void;
  onAddToCart: (item: JewelleryItem) => void;
  onToggleWishlist: (item: JewelleryItem) => void;
  wishlistIds: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
  onOpenRental?: (item: JewelleryItem) => void;
  onOpenEMI?: (price: number) => void;
}

export const CollectionsGrid: React.FC<Props> = ({
  products,
  onOpen3DModal,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  activeCategory,
  onCategoryChange,
  onOpenRental,
  onOpenEMI,
}) => {
  const [purityFilter, setPurityFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Jewellery' },
    { id: 'necklaces', label: 'Bridal Chokers' },
    { id: 'bangles', label: 'Diamond Bangles' },
    { id: 'earrings', label: 'Royal Earrings' },
    { id: 'rings', label: 'Solitaire Rings' },
    { id: 'rentals', label: '✨ Rental Jewellery' },
    { id: 'coins', label: 'Gold Bullion Coins' },
  ];

  const filteredProducts = products.filter((item) => {
    let matchesCat = true;
    if (activeCategory === 'rentals') {
      matchesCat = !!item.isAvailableForRent;
    } else if (activeCategory !== 'all') {
      matchesCat = item.category === activeCategory;
    }

    const matchesPurity =
      purityFilter === 'all' ||
      (purityFilter === '24k' && (item.purity.includes('24K') || item.metal === 'gold24k')) ||
      (purityFilter === '22k' && (item.purity.includes('22K') || item.metal === 'gold22k')) ||
      (purityFilter === '18k' && (item.purity.includes('18K') || item.metal === 'rosegold' || item.metal === 'platinum'));
    return matchesCat && matchesPurity;
  });

  return (
    <section id="collections-section" className="py-10 sm:py-14 bg-[#FAF7F2] border-b border-[#E8DFC8] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 w-full">
        {/* Section Header: Minimal & Understandable */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider text-[#B38F2C] uppercase mb-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDCRAFTED BRIDAL COLLECTIONS</span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-4xl font-bold text-[#2B090F] tracking-tight">
              Featured Jewellery & Rentals
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1">
              Select any piece to inspect in 360° 3D, customize metal, buy on 0% EMI, or rent for weddings.
            </p>
          </div>

          {/* Metal Purity Filter */}
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-1 max-w-full no-scrollbar">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap">
              Filter:
            </span>
            {[
              { id: 'all', label: 'All' },
              { id: '22k', label: '22K Gold' },
              { id: '24k', label: '24K Gold' },
              { id: '18k', label: '18K / Platinum' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPurityFilter(p.id)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap shrink-0 ${
                  purityFilter === p.id
                    ? 'bg-[#4A1017] text-white font-semibold shadow-xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-6 no-scrollbar border-b border-stone-200 max-w-full">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shrink-0 ${
                activeCategory === cat.id
                  ? 'bg-[#4A1017] text-white shadow-xs font-bold'
                  : 'bg-white text-stone-700 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid: High visual emphasis on jewellery */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredProducts.map((item) => {
            const isWishlisted = wishlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-stone-200 hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Image Showcase */}
                <div
                  className="relative aspect-[4/3.8] overflow-hidden bg-stone-100 cursor-pointer"
                  onClick={() => onOpen3DModal(item)}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Badges */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start">
                    {item.isAvailableForRent && (
                      <span className="bg-[#8C6D23] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                        <Clock className="w-2.5 h-2.5 text-[#F3DE8A]" />
                        <span>Rent ₹{item.rentalPricePerDay?.toLocaleString('en-IN')}/day</span>
                      </span>
                    )}
                    {item.has3DModel && (
                      <span className="bg-[#4A1017]/95 backdrop-blur-sm text-[#F5E5B8] text-[9px] font-bold px-2 py-0.5 rounded-md border border-[#D4AF37]/30 shadow-xs flex items-center gap-1">
                        <Eye className="w-2.5 h-2.5 text-[#F3DE8A]" />
                        <span>3D View</span>
                      </span>
                    )}
                    {item.hallmarkCertified && (
                      <span className="bg-white/95 text-[#6B1724] text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-stone-200 shadow-xs flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-[#B38F2C]" />
                        <span>BIS 916</span>
                      </span>
                    )}
                  </div>

                  {/* Wishlist Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleWishlist(item);
                    }}
                    className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      isWishlisted
                        ? 'bg-[#6B1724] text-white'
                        : 'bg-white/80 text-stone-600 hover:text-[#6B1724] hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* Instant 3D View Button Bottom Bar */}
                  {item.has3DModel && (
                    <div className="absolute inset-x-2 bottom-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpen3DModal(item);
                        }}
                        className="w-full py-2 bg-black/80 hover:bg-black text-white text-xs font-semibold rounded-xl backdrop-blur-sm shadow-md flex items-center justify-center gap-1.5 transition-all"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F3DE8A]" />
                        <span>Open 3D Studio</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Minimalist Info Card */}
                <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <div className="text-[11px] font-medium text-stone-500">
                      {item.purity} • {item.weightGrams}g
                    </div>

                    <h3
                      onClick={() => onOpen3DModal(item)}
                      className="font-playfair text-base font-bold text-[#1F1615] group-hover:text-[#6B1724] transition-colors line-clamp-1 cursor-pointer mt-0.5"
                    >
                      {item.name}
                    </h3>
                  </div>

                  {/* Pricing and Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <div className="font-playfair text-base font-bold text-[#4A1017]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                      <button
                        type="button"
                        onClick={() => onOpenEMI?.(item.price)}
                        className="text-[10px] text-stone-500 hover:text-[#4A1017] flex items-center gap-1 underline font-medium"
                      >
                        <Calculator className="w-2.5 h-2.5" />
                        <span>EMI from ₹{Math.round(item.price / 6).toLocaleString('en-IN')}/mo</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {item.isAvailableForRent && (
                        <button
                          type="button"
                          onClick={() => onOpenRental?.(item)}
                          className="px-2 py-1.5 bg-[#FAF1E4] hover:bg-[#F3E5CC] text-[#8C6D23] text-[11px] font-bold rounded-xl border border-[#D4AF37]/40 transition-all"
                          title="Rent this item"
                        >
                          Rent
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => onAddToCart(item)}
                        className="p-2 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl transition-all shadow-xs active:scale-95"
                        title="Add to Shopping Bag"
                      >
                        <ShoppingBag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
