import React, { useState } from 'react';
import {
  MapPin,
  Search,
  PiggyBank,
  ShoppingBag,
  Heart,
  Menu,
  X,
  FileCode2,
  Calculator,
  UserCheck,
  Clock,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { JewelleryItem } from '../types';

interface Props {
  cartCount: number;
  wishlistCount: number;
  products: JewelleryItem[];
  onOpenCart: () => void;
  onOpenWishlist: () => void;
  onOpenSavingsScheme: () => void;
  onOpenDigitalGold: () => void;
  onSelectProduct: (item: JewelleryItem) => void;
  onScrollToShowrooms: () => void;
  onOpenDeployGuide: () => void;
  onSelectCategory: (category: string) => void;
  onOpenAdmin: () => void;
  onOpenEMI: () => void;
  onOpenRental: () => void;
}

export const Navbar: React.FC<Props> = ({
  cartCount,
  wishlistCount,
  products,
  onOpenCart,
  onOpenWishlist,
  onOpenSavingsScheme,
  onSelectProduct,
  onScrollToShowrooms,
  onOpenDeployGuide,
  onSelectCategory,
  onOpenAdmin,
  onOpenEMI,
  onOpenRental,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filteredSearchResults = searchQuery.trim()
    ? products.filter(
        (item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.collection.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DFC8] shadow-xs">
      {/* Animated Golden Accent Top Shimmer Line */}
      <div className="h-[2.5px] w-full animate-shimmer-gold" />

      {/* Brand & Main Controls */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <div
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex items-center gap-3 cursor-pointer group shrink-0"
        >
          <div className="relative w-11 h-11 rounded-full bg-gradient-to-br from-[#4A1017] to-[#1F080C] border-2 border-[#D4AF37] flex items-center justify-center p-1 shadow-sm group-hover:scale-105 transition-transform">
            <span className="font-playfair text-xs font-bold tracking-widest text-[#F5E5B8]">
              NFJ
            </span>
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#10B981] ring-2 ring-white animate-pulse" />
          </div>

          <div className="flex flex-col">
            <span className="font-playfair font-bold tracking-[0.12em] text-base md:text-lg text-[#3E0A12] uppercase leading-none">
              NEW FRIENDS JEWELLERS
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-[#8C6D23] uppercase mt-1 flex items-center gap-1">
              <span>LEH LADAKH</span>
              <span>•</span>
              <span className="text-stone-500 font-normal">ESTD 1998</span>
            </span>
          </div>
        </div>

        {/* Search Input */}
        <div className="hidden md:flex flex-1 max-w-sm relative">
          <div className="w-full flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-stone-200 focus-within:border-[#4A1017] shadow-xs transition-all">
            <Search className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <input
              type="text"
              placeholder="Search bridal chokers, kada, rings..."
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
                <X className="w-3 h-3" />
              </button>
            )}
          </div>

          {/* Live Search Dropdown */}
          {isSearchOpen && searchQuery.trim() && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-in fade-in">
              <div className="text-[10px] uppercase font-bold text-stone-400 px-2 py-1 flex justify-between">
                <span>Matching Items ({filteredSearchResults.length})</span>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(false)}
                  className="hover:text-stone-800"
                >
                  Close
                </button>
              </div>

              {filteredSearchResults.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-1">
                  {filteredSearchResults.map((p) => (
                    <div
                      key={p.id}
                      onClick={() => {
                        onSelectProduct(p);
                        setIsSearchOpen(false);
                        setSearchQuery('');
                      }}
                      className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-stone-50 cursor-pointer transition-colors"
                    >
                      <img
                        src={p.image}
                        alt={p.name}
                        className="w-9 h-9 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-semibold text-stone-900 truncate">
                          {p.name}
                        </div>
                        <div className="text-[11px] text-[#4A1017] font-medium">
                          ₹{p.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                      {p.isAvailableForRent && (
                        <span className="text-[9px] bg-[#8C6D23] text-white px-1.5 py-0.5 rounded font-bold">
                          Rent
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-xs text-stone-500 p-3 text-center">
                  No matching jewellery found.
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Items & Modals */}
        <div className="flex items-center gap-2">
          {/* EMI Calculator Quick Trigger */}
          <button
            type="button"
            onClick={onOpenEMI}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#4A1017] px-3 py-1.5 rounded-full hover:bg-white border border-stone-200 transition-colors shadow-2xs"
            title="Calculate 0% EMI"
          >
            <Calculator className="w-3.5 h-3.5 text-[#B38F2C]" />
            <span>0% EMI</span>
          </button>

          {/* Bridal Rental Service Trigger */}
          <button
            type="button"
            onClick={onOpenRental}
            className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-[#8C6D23] bg-[#FAF1E4] hover:bg-[#F4E8D3] px-3 py-1.5 rounded-full border border-[#D4AF37]/50 transition-colors shadow-2xs"
            title="Rent Bridal Jewellery"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Rental</span>
          </button>

          {/* Admin / Profile Portal Button */}
          <button
            type="button"
            onClick={onOpenAdmin}
            className="flex items-center gap-1.5 text-xs font-bold text-[#4A1017] bg-white hover:bg-stone-50 px-3 py-1.5 rounded-full border border-[#D4AF37] transition-all shadow-2xs group"
            title="Admin & Store Manager Portal"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#B38F2C] group-hover:scale-110 transition-transform" />
            <span className="hidden sm:inline">Admin Portal</span>
          </button>

          {/* Showrooms */}
          <button
            type="button"
            onClick={onScrollToShowrooms}
            className="hidden lg:flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-[#4A1017] px-3 py-1.5 rounded-full hover:bg-white transition-colors"
          >
            <MapPin className="w-3.5 h-3.5 text-[#B38F2C]" />
            <span>4 Stores</span>
          </button>

          {/* Vercel Deploy Guide */}
          <button
            type="button"
            onClick={onOpenDeployGuide}
            className="hidden xl:flex items-center gap-1 bg-black text-white hover:bg-stone-800 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors"
          >
            <FileCode2 className="w-3 h-3 text-[#34D399]" />
            <span>Deploy</span>
          </button>

          {/* Wishlist */}
          <button
            type="button"
            onClick={onOpenWishlist}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 flex items-center justify-center border border-stone-200 text-stone-700 hover:text-[#4A1017] transition-colors relative shadow-2xs"
            title="Wishlist"
          >
            <Heart className="w-4 h-4 text-[#8C1D2F]" />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Bag with animated bounce */}
          <button
            type="button"
            onClick={onOpenCart}
            className="w-9 h-9 rounded-full bg-white hover:bg-stone-50 flex items-center justify-center border border-stone-200 text-stone-700 hover:text-[#4A1017] transition-colors relative shadow-2xs active:scale-95"
            title="Shopping Bag"
          >
            <ShoppingBag className="w-4 h-4 text-[#3E0A12]" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#6B1724] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
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

      {/* Clean Category Navigation Row */}
      <nav className="border-t border-[#EAE2D5] px-4 py-2 overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto flex items-center gap-6 whitespace-nowrap text-xs font-semibold text-stone-700">
          <button
            onClick={() => onSelectCategory('all')}
            className="hover:text-[#4A1017] transition-colors"
          >
            All Jewellery
          </button>
          <button
            onClick={() => onSelectCategory('necklaces')}
            className="hover:text-[#4A1017] transition-colors"
          >
            Bridal Chokers
          </button>
          <button
            onClick={() => onSelectCategory('bangles')}
            className="hover:text-[#4A1017] transition-colors"
          >
            Diamond Bangles
          </button>
          <button
            onClick={() => onSelectCategory('earrings')}
            className="hover:text-[#4A1017] transition-colors"
          >
            Royal Earrings
          </button>
          <button
            onClick={() => onSelectCategory('rings')}
            className="hover:text-[#4A1017] transition-colors"
          >
            Solitaire Rings
          </button>
          <button
            onClick={() => onSelectCategory('rentals')}
            className="text-[#8C6D23] font-bold hover:text-[#4A1017] transition-colors flex items-center gap-1"
          >
            <Sparkles className="w-3 h-3 text-[#B38F2C]" />
            <span>Rental Jewellery</span>
          </button>
          <button
            onClick={onOpenEMI}
            className="hover:text-[#4A1017] transition-colors flex items-center gap-1"
          >
            <Calculator className="w-3 h-3 text-[#B38F2C]" />
            <span>0% EMI Calculator</span>
          </button>
          <button
            onClick={onScrollToShowrooms}
            className="hover:text-[#4A1017] transition-colors flex items-center gap-1"
          >
            <MapPin className="w-3 h-3 text-[#B38F2C]" />
            <span>4 Ladakh Showrooms</span>
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white p-4 space-y-3 shadow-lg animate-in slide-in-from-top duration-200">
          <div className="space-y-1 pb-2 border-b border-stone-100">
            <button
              onClick={() => {
                onSelectCategory('all');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-semibold text-stone-800"
            >
              All Jewellery
            </button>
            <button
              onClick={() => {
                onSelectCategory('necklaces');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-semibold text-stone-800"
            >
              Bridal Chokers & Necklaces
            </button>
            <button
              onClick={() => {
                onSelectCategory('bangles');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-semibold text-stone-800"
            >
              Diamond Bangles & Kadas
            </button>
            <button
              onClick={() => {
                onSelectCategory('rentals');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left py-1.5 text-xs font-bold text-[#8C6D23]"
            >
              ✨ Rental Jewellery for Weddings
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              onClick={() => {
                onOpenEMI();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 text-center"
            >
              0% EMI Calculator
            </button>
            <button
              onClick={() => {
                onOpenAdmin();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-[#4A1017] text-white rounded-xl text-xs font-bold text-center"
            >
              Admin Portal
            </button>
            <button
              onClick={() => {
                onScrollToShowrooms();
                setMobileMenuOpen(false);
              }}
              className="p-2 bg-stone-100 rounded-xl text-xs font-semibold text-stone-700 text-center col-span-2"
            >
              Visit 4 Ladakh Stores
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
