import React, { useState } from 'react';
import {
  MapPin,
  Search,
  PiggyBank,
  User,
  ShoppingBag,
  Heart,
  Sparkles,
  Menu,
  X,
  Compass,
  FileCode2,
} from 'lucide-react';
import { JEWELLERY_PRODUCTS } from '../data/jewelleryData';
import { JewelleryItem } from '../types';

interface Props {
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSavingsScheme: () => void;
  onOpenDigitalGold: () => void;
  onSelectProduct: (item: JewelleryItem) => void;
  onScrollToShowrooms: () => void;
  onOpenDeployGuide: () => void;
  onSelectCategory: (category: string) => void;
}

export const Navbar: React.FC<Props> = ({
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
  onOpenSavingsScheme,
  onOpenDigitalGold,
  onSelectProduct,
  onScrollToShowrooms,
  onOpenDeployGuide,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSearchResults = searchQuery.trim()
    ? JEWELLERY_PRODUCTS.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#D4AF37]/30 shadow-xs">
      {/* Primary Brand & Actions Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3 md:gap-6">
        {/* Brand Logo & Royal Crest */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          {/* Royal Seal Emblem */}
          <div className="w-12 h-12 md:w-13 md:h-13 rounded-full bg-gradient-to-br from-[#4A1017] to-[#1F080C] border-2 border-[#D4AF37] flex items-center justify-center p-1.5 shadow-md group-hover:scale-105 transition-transform">
            <div className="w-full h-full rounded-full border border-[#F3DE8A]/50 flex items-center justify-center text-center">
              <span className="font-cinzel text-xs font-black tracking-widest text-[#F5E5B8]">
                NFJ
              </span>
            </div>
          </div>

          <div className="flex flex-col">
            <span className="font-cinzel font-black tracking-[0.18em] text-sm md:text-lg text-[#3E0A12] group-hover:text-[#6B1724] transition-colors uppercase leading-none">
              NEW FRIENDS JEWELLERS
            </span>
            <span className="text-[10px] md:text-[11px] font-medium tracking-[0.24em] text-[#8C6D23] uppercase mt-1">
              HERITAGE OF LEH, LADAKH
            </span>
          </div>
        </div>

        {/* Search Bar with live dropdown */}
        <div className="hidden md:flex flex-1 max-w-md relative">
          <div className="w-full flex items-center gap-2 bg-white px-3.5 py-2 rounded-full border border-[#D4AF37]/40 shadow-xs hover:border-[#6B1724] focus-within:border-[#6B1724] focus-within:ring-2 focus-within:ring-[#6B1724]/10 transition-all">
            <Search className="w-4 h-4 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search jewellery, gold, diamonds, collections..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsSearchOpen(true);
              }}
              onFocus={() => setIsSearchOpen(true)}
              className="w-full bg-transparent text-xs text-stone-800 focus:outline-none placeholder:text-stone-400"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-stone-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search Dropdown Results */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-[#D4AF37]/30 p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="text-[11px] uppercase tracking-wider text-stone-500 font-bold px-2 py-1 flex justify-between">
                <span>Matching Jewels ({filteredSearchResults.length})</span>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="text-stone-400 hover:text-stone-700"
                >
                  Close
                </button>
              </div>

              {filteredSearchResults.length > 0 ? (
                <div className="max-h-72 overflow-y-auto space-y-1.5 mt-1">
                  {filteredSearchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF1E4] cursor-pointer transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-10 h-10 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-stone-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-[#6B1724] font-medium">
                          ₹{p.price.toLocaleString('en-IN')} • {p.purity}
                        </div>
                      </div>
                      {p.has3DModel && (
                        <span className="text-[9px] bg-[#6B1724] text-white px-2 py-0.5 rounded-full font-bold">
                          3D
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-500 p-4 text-center">
                  No jewellery matching &ldquo;{searchQuery}&rdquo;. Try &ldquo;ring&rdquo;, &ldquo;gold&rdquo; or &ldquo;bridal&rdquo;.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* 4 Store Locations Badge */}
          <button
            type="button"
            onClick={onScrollToShowrooms}
            className="hidden lg:flex items-center gap-1.5 bg-white/90 hover:bg-white text-[#4A1017] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/50 text-xs font-semibold shadow-xs hover:border-[#6B1724] transition-all"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B38F2C]" />
            <span>4 Store Locations</span>
          </button>

          {/* Jewellery Savings Scheme */}
          <button
            type="button"
            onClick={onOpenSavingsScheme}
            className="hidden sm:flex items-center gap-1.5 bg-[#FDF8EE] hover:bg-[#FAF1E4] text-[#8C6D23] px-3.5 py-1.5 rounded-full border border-[#D4AF37]/60 text-xs font-semibold shadow-xs hover:border-[#8C6D23] transition-all"
          >
            <PiggyBank className="w-3.5 h-3.5 text-[#B38F2C]" />
            <span>Jewellery Savings Scheme</span>
          </button>

          {/* User Account */}
          <button
            type="button"
            onClick={() => alert('Welcome to New Friends Jewellers Loyalty Lounge. Sign in to view your BIS 916 certificates & Swarn Bandhan passbook.')}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 flex items-center justify-center border border-[#D4AF37]/40 text-stone-700 hover:text-[#4A1017] transition-colors"
            title="Customer Account"
          >
            <User className="w-4 h-4" />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 flex items-center justify-center border border-[#D4AF37]/40 text-stone-700 hover:text-[#4A1017] transition-colors relative"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 text-[#8C1D2F]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Cart / Bag */}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 flex items-center justify-center border border-[#D4AF37]/40 text-stone-700 hover:text-[#4A1017] transition-colors relative"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#3E0A12]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-9 h-9 rounded-full bg-white flex items-center justify-center border border-stone-300 text-stone-700"
          >
            {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Categories Row */}
      <nav className="bg-[#FAF7F2] border-t border-[#EAE2D5] px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6 whitespace-nowrap text-xs font-medium text-stone-700">
          <div className="flex items-center gap-6">
            <button
              onClick={() => onSelectCategory('all')}
              className="hover:text-[#6B1724] transition-colors flex items-center gap-1"
            >
              <span>Ready To Ship</span>
              <span className="text-[9px] bg-[#6B1724] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                FAST
              </span>
            </button>

            <button
              onClick={onOpenSavingsScheme}
              className="hover:text-[#6B1724] transition-colors flex items-center gap-1"
            >
              <span>Gold Schemes</span>
              <span className="text-[9px] bg-[#8C6D23] text-white px-1.5 py-0.2 rounded font-bold uppercase">
                SAVE
              </span>
            </button>

            <button onClick={() => onSelectCategory('rings')} className="hover:text-[#6B1724] transition-colors">
              Rings (3D)
            </button>

            <button onClick={() => onSelectCategory('earrings')} className="hover:text-[#6B1724] transition-colors">
              Earrings
            </button>

            <button onClick={() => onSelectCategory('necklaces')} className="hover:text-[#6B1724] transition-colors">
              Chains & Chokers
            </button>

            <button onClick={() => onSelectCategory('pendants')} className="hover:text-[#6B1724] transition-colors">
              Pendants
            </button>

            <button onClick={() => onSelectCategory('coins')} className="hover:text-[#6B1724] transition-colors">
              Coins & Bullion
            </button>

            <button
              onClick={onScrollToShowrooms}
              className="hover:text-[#6B1724] text-[#6B1724] font-semibold transition-colors flex items-center gap-1"
            >
              <span>Our 4 Stores</span>
              <span className="text-[9px] bg-[#3E0A12] text-[#F5E5B8] px-1.5 py-0.2 rounded font-bold uppercase">
                NEW
              </span>
            </button>

            <button
              onClick={() => alert('Corporate gifting, customized gold medals and institutional bullion minted with high relief.')}
              className="hover:text-[#6B1724] transition-colors"
            >
              Corporate
            </button>
          </div>

          {/* Right Category Badges */}
          <div className="flex items-center gap-3">
            {/* Vercel Deploy Guide Pill */}
            <button
              type="button"
              onClick={onOpenDeployGuide}
              className="flex items-center gap-1.5 bg-[#000000] text-white hover:bg-stone-800 px-3 py-1 rounded-full text-[11px] font-semibold shadow-xs transition-colors"
              title="Vercel Free Hosting Files & 1-Click Guide"
            >
              <FileCode2 className="w-3 h-3 text-[#34D399]" />
              <span>Vercel Deploy Files</span>
            </button>

            {/* Digital Gold Pill */}
            <button
              type="button"
              onClick={onOpenDigitalGold}
              className="flex items-center gap-1 bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] text-white px-3 py-1 rounded-full text-[11px] font-bold shadow-xs hover:brightness-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-3 h-3" />
              <span>DIGITAL GOLD</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-stone-200 p-4 space-y-3">
          <div className="w-full flex items-center gap-2 bg-stone-100 px-3 py-2 rounded-xl">
            <Search className="w-4 h-4 text-stone-500" />
            <input
              type="text"
              placeholder="Search jewellery..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-xs text-stone-800 focus:outline-none w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-medium">
            <button
              onClick={() => {
                onSelectCategory('rings');
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-stone-50 text-left hover:bg-[#FAF1E4]"
            >
              💍 3D Rings Studio
            </button>
            <button
              onClick={() => {
                onScrollToShowrooms();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-stone-50 text-left hover:bg-[#FAF1E4]"
            >
              🏛️ 4 Flagship Stores
            </button>
            <button
              onClick={() => {
                onOpenSavingsScheme();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-stone-50 text-left hover:bg-[#FAF1E4]"
            >
              💰 Gold Savings Scheme
            </button>
            <button
              onClick={() => {
                onOpenDigitalGold();
                setMobileMenuOpen(false);
              }}
              className="p-2.5 rounded-lg bg-stone-50 text-left hover:bg-[#FAF1E4]"
            >
              ✨ Digital Gold (24K)
            </button>
          </div>

          <button
            onClick={() => {
              onOpenDeployGuide();
              setMobileMenuOpen(false);
            }}
            className="w-full py-2 bg-black text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
          >
            <FileCode2 className="w-3.5 h-3.5 text-[#34D399]" />
            <span>Vercel Free Hosting Guide & Files</span>
          </button>
        </div>
      )}
    </header>
  );
};
