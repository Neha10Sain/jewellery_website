import React, { useState } from 'react';
import { BullionTicker } from './components/BullionTicker';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { CollectionsGrid } from './components/CollectionsGrid';
import { FlagshipShowrooms } from './components/FlagshipShowrooms';
import { HeritageLegacySection } from './components/HeritageLegacySection';
import { Footer } from './components/Footer';

// Modals and Drawers
import { Product3DModal } from './components/Product3DModal';
import { AppointmentModal } from './components/AppointmentModal';
import { SavingsCalculator } from './components/SavingsCalculator';
import { DigitalGoldModal } from './components/DigitalGoldModal';
import { CartDrawer } from './components/CartDrawer';
import { WishlistDrawer } from './components/WishlistDrawer';
import { VercelDeployGuideModal } from './components/VercelDeployGuideModal';

import { JEWELLERY_PRODUCTS, SHOWROOMS_DATA } from './data/jewelleryData';
import { JewelleryItem, Showroom, CartItem, MetalType, GemstoneType } from './types';
import { Sparkles, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // State for Cart & Wishlist
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: JEWELLERY_PRODUCTS[0], // Royal Himalayan Solitaire
      quantity: 1,
      selectedMetal: 'gold22k',
      selectedGemstone: 'diamond',
      ringSize: '14 (Indian / 54mm)',
    },
  ]);

  // Initial wishlist matching the screenshots (showing '2' on badge)
  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'nfj-choker-01',
    'nfj-ring-01',
  ]);

  // Navigation & Category state
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Modals state
  const [product3DModalItem, setProduct3DModalItem] = useState<JewelleryItem | null>(null);
  const [appointmentShowroom, setAppointmentShowroom] = useState<Showroom | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSavingsOpen, setIsSavingsOpen] = useState<boolean>(false);
  const [isDigitalGoldOpen, setIsDigitalGoldOpen] = useState<boolean>(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState<boolean>(false);

  // Toast alert
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Cart operations
  const handleAddToCart = (product: JewelleryItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        return prev.map((i) =>
          i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: `cart-${Date.now()}-${Math.random()}`,
          product,
          quantity: 1,
          selectedMetal: product.metal || 'gold22k',
          selectedGemstone: product.gemstone || 'diamond',
          ringSize: '14 (Indian / 54mm)',
        },
      ];
    });
    showToast(`Added ${product.name} to your Shopping Bag!`);
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
    });
  };

  const handleAddToCartCustomized = (
    product: JewelleryItem,
    metal: MetalType,
    gemstone: GemstoneType,
    ringSize: string
  ) => {
    setCartItems((prev) => [
      ...prev,
      {
        id: `cart-custom-${Date.now()}`,
        product,
        quantity: 1,
        selectedMetal: metal,
        selectedGemstone: gemstone,
        ringSize,
      } as CartItem,
    ]);
    showToast(`Added Customized 3D ${product.name} (${metal.replace('gold', '').toUpperCase()} Gold) to Bag!`);
  };

  const handleHeroAddToCartDirect = (metal: MetalType, gemstone: GemstoneType, carat: number) => {
    const heroProduct = JEWELLERY_PRODUCTS[0];
    handleAddToCartCustomized(heroProduct, metal, gemstone, '14 (Indian / 54mm)');
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  // Wishlist operations
  const handleToggleWishlist = (product: JewelleryItem) => {
    setWishlistIds((prev) => {
      if (prev.includes(product.id)) {
        showToast(`Removed from Wishlist`);
        return prev.filter((id) => id !== product.id);
      } else {
        showToast(`Saved ${product.name} to Wishlist!`);
        return [...prev, product.id];
      }
    });
  };

  const wishlistProducts = JEWELLERY_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  // Smooth scroll
  const scrollToShowrooms = () => {
    const el = document.getElementById('showrooms-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToCollections = () => {
    const el = document.getElementById('collections-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#1F1615] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#4A1017]">
      {/* 1. Live Bullion Ticker Banner (Screenshot 1, 3, 4) */}
      <BullionTicker onOpenDigitalGold={() => setIsDigitalGoldOpen(true)} />

      {/* 2. Brand Header & Navigation (Screenshot 1, 3) */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSavingsScheme={() => setIsSavingsOpen(true)}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onSelectProduct={(product) => setProduct3DModalItem(product)}
        onScrollToShowrooms={scrollToShowrooms}
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCollections();
        }}
      />

      {/* 3. Hero Section with Real-Time 3D WebGL Ring Studio (Screenshot 3, 5) */}
      <HeroSection
        onExploreClick={scrollToCollections}
        onConciergeClick={scrollToShowrooms}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onAddToCartDirect={handleHeroAddToCartDirect}
      />

      {/* 4. Curated Jewellery Showcase with 3D Preview (Screenshot 1, 4) */}
      <CollectionsGrid
        onOpen3DModal={(item) => setProduct3DModalItem(item)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* 5. 4 Flagship Showrooms in Ladakh: Choglamsar, Leh, Kargil, Zanskar (Screenshot 1, 2) */}
      <FlagshipShowrooms
        onBookAppointment={(showroom) => setAppointmentShowroom(showroom)}
      />

      {/* 6. Himalayan Goldsmith Heritage & BIS 916 Legacy */}
      <HeritageLegacySection />

      {/* 7. Footer */}
      <Footer
        onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
        onOpenSavingsScheme={() => setIsSavingsOpen(true)}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onScrollToShowrooms={scrollToShowrooms}
      />

      {/* Floating Action Badge for Vercel Client Demo */}
      <aside aria-label="Demo quick links" className="fixed bottom-5 right-5 z-40 flex flex-col gap-2">
        <button
          type="button"
          onClick={() => setIsDeployGuideOpen(true)}
          className="flex items-center gap-2 bg-[#000000] text-white px-4 py-2.5 rounded-full shadow-2xl border border-stone-700 hover:border-[#34D399] hover:scale-105 transition-all text-xs font-bold"
        >
          <span className="w-2 h-2 rounded-full bg-[#34D399] animate-ping" />
          <span>Deploy on Vercel Free</span>
        </button>
      </aside>

      {/* Dynamic Toast Feedback */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1F080C] text-[#F5E5B8] px-5 py-2.5 rounded-full shadow-2xl border border-[#D4AF37]/50 text-xs font-semibold flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2">
          <Check className="w-4 h-4 text-[#34D399]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Modals & Drawers */}
      <Product3DModal
        item={product3DModalItem}
        onClose={() => setProduct3DModalItem(null)}
        onAddToCartCustomized={handleAddToCartCustomized}
        onToggleWishlist={handleToggleWishlist}
        isWishlisted={product3DModalItem ? wishlistIds.includes(product3DModalItem.id) : false}
      />

      <AppointmentModal
        showroom={appointmentShowroom}
        isOpen={!!appointmentShowroom}
        onClose={() => setAppointmentShowroom(null)}
      />

      <SavingsCalculator
        isOpen={isSavingsOpen}
        onClose={() => setIsSavingsOpen(false)}
      />

      <DigitalGoldModal
        isOpen={isDigitalGoldOpen}
        onClose={() => setIsDigitalGoldOpen(false)}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlistItems={wishlistProducts}
        onRemoveFromWishlist={handleToggleWishlist}
        onMoveToCart={(item) => handleAddToCart(item)}
        onOpen3D={(item) => setProduct3DModalItem(item)}
      />

      <VercelDeployGuideModal
        isOpen={isDeployGuideOpen}
        onClose={() => setIsDeployGuideOpen(false)}
      />
    </div>
  );
}
