import React, { useState } from 'react';
import { Sparkles, Heart, Eye, ShoppingBag, ShieldCheck, Star } from 'lucide-react';
import { JEWELLERY_PRODUCTS } from '../data/jewelleryData';
import { JewelleryItem, MetalType, GemstoneType } from '../types';

interface Props {
  onOpen3DModal: (item: JewelleryItem) => void;
  onAddToCart: (item: JewelleryItem) => void;
  onToggleWishlist: (item: JewelleryItem) => void;
  wishlistIds: string[];
  activeCategory: string;
  onCategoryChange: (cat: string) => void;
}

export const CollectionsGrid: React.FC<Props> = ({
  onOpen3DModal,
  onAddToCart,
  onToggleWishlist,
  wishlistIds,
  activeCategory,
  onCategoryChange,
}) => {
  const [purityFilter, setPurityFilter] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Jewels' },
    { id: 'rings', label: '3D Rings' },
    { id: 'necklaces', label: 'Bridal & Chokers' },
    { id: 'earrings', label: 'Jhumkas & Studs' },
    { id: 'pendants', label: 'Pendants' },
    { id: 'coins', label: 'Gold Bullion Coins' },
  ];

  const filteredProducts = JEWELLERY_PRODUCTS.filter((item) => {
    const matchesCat = activeCategory === 'all' || item.category === activeCategory;
    const matchesPurity =
      purityFilter === 'all' ||
      (purityFilter === '24k' && (item.purity.includes('24K') || item.metal === 'gold24k')) ||
      (purityFilter === '22k' && (item.purity.includes('22K') || item.metal === 'gold22k')) ||
      (purityFilter === '18k' && (item.purity.includes('18K') || item.metal === 'rosegold' || item.metal === 'platinum'));
    return matchesCat && matchesPurity;
  });

  return (
    <section id="collections-section" className="py-16 bg-[#FAF7F2] border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#B38F2C] uppercase font-cinzel mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>HANDCRAFTED HIMALAYAN COLLECTIONS</span>
            </div>
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B090F] tracking-tight">
              Curated Royal Jewellery
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-xl">
              From certified BIS 916 bridal chokers to custom 3D interactive solitaires, explore master craftsmanship shaped with ancient Himalayan heritage.
            </p>
          </div>

          {/* Metal Purity Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1">
            <span className="text-xs font-semibold text-stone-500 whitespace-nowrap mr-1">
              Purity:
            </span>
            {[
              { id: 'all', label: 'All Purity' },
              { id: '24k', label: '24K (999)' },
              { id: '22k', label: '22K (916 BIS)' },
              { id: '18k', label: '18K Diamond' },
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setPurityFilter(p.id)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all whitespace-nowrap ${
                  purityFilter === p.id
                    ? 'bg-[#6B1724] text-white shadow-xs font-semibold'
                    : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-400'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 no-scrollbar border-b border-stone-200">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? 'bg-[#4A1017] text-[#FAF7F2] shadow-md'
                  : 'bg-white/70 text-stone-700 hover:bg-white border border-stone-200/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((item) => {
            const isWishlisted = wishlistIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-stone-200/90 hover:border-[#D4AF37] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-square overflow-hidden bg-stone-100">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                  />

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                    {item.tag && (
                      <span className="bg-[#4A1017]/90 backdrop-blur-md text-[#F5E5B8] text-[10px] font-bold px-2.5 py-1 rounded-full border border-[#D4AF37]/30 shadow-xs uppercase">
                        {item.tag}
                      </span>
                    )}
                    {item.hallmarkCertified && (
                      <span className="bg-white/90 backdrop-blur-md text-[#6B1724] text-[9px] font-bold px-2 py-0.5 rounded-full border border-stone-200 shadow-xs flex items-center gap-1">
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
                    className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all ${
                      isWishlisted
                        ? 'bg-[#6B1724] text-white'
                        : 'bg-white/80 text-stone-600 hover:text-[#6B1724] hover:bg-white'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white' : ''}`} />
                  </button>

                  {/* 3D Quick Inspect Overlay on Hover */}
                  {item.has3DModel && (
                    <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                      <button
                        type="button"
                        onClick={() => onOpen3DModal(item)}
                        className="flex-1 py-2 bg-[#4A1017]/90 backdrop-blur-md hover:bg-[#4A1017] text-white text-xs font-bold rounded-xl shadow-lg flex items-center justify-center gap-1.5 transition-all active:scale-95"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#F3DE8A]" />
                        <span>Inspect in 3D</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Details Body */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                      <span className="uppercase tracking-wider font-semibold text-[#8C6D23]">
                        {item.collection}
                      </span>
                      <div className="flex items-center gap-1 text-stone-700 font-semibold">
                        <Star className="w-3 h-3 fill-[#D4AF37] text-[#D4AF37]" />
                        <span>{item.rating}</span>
                        <span className="text-[10px] text-stone-400">({item.reviewsCount})</span>
                      </div>
                    </div>

                    <h3 className="font-cormorant text-lg font-bold text-[#1F1615] group-hover:text-[#6B1724] transition-colors line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Price & Weight Row */}
                  <div className="pt-2 border-t border-stone-100 flex items-end justify-between">
                    <div>
                      <div className="text-[10px] text-stone-400 font-medium">
                        Gross Weight: {item.weightGrams}g • {item.purity}
                      </div>
                      <div className="font-cinzel text-base sm:text-lg font-bold text-[#4A1017]">
                        ₹{item.price.toLocaleString('en-IN')}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onAddToCart(item)}
                      className="p-2.5 bg-[#FAF1E4] hover:bg-[#4A1017] text-[#4A1017] hover:text-white rounded-xl transition-all shadow-xs active:scale-95"
                      title="Add to Shopping Bag"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </button>
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
