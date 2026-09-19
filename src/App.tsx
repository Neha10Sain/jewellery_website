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
import { AdminPanelModal } from './components/AdminPanelModal';
import { EMICalculatorModal } from './components/EMICalculatorModal';
import { RentalModal } from './components/RentalModal';
import { ConciergeChatbot } from './components/ConciergeChatbot';

import { JEWELLERY_PRODUCTS, INITIAL_PROMOTIONS, SHOWROOMS_DATA } from './data/jewelleryData';
import { JewelleryItem, Showroom, CartItem, MetalType, GemstoneType, PromotionalOffer } from './types';
import { Check, Bell, ShieldCheck, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  // Inventory state & promotions state (manageable via Admin Portal)
  const [products, setProducts] = useState<JewelleryItem[]>(JEWELLERY_PRODUCTS);
  const [offers, setOffers] = useState<PromotionalOffer[]>(INITIAL_PROMOTIONS);

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 'cart-init-1',
      product: JEWELLERY_PRODUCTS[0], // Royal Kashmiri Emerald Bridal Choker
      quantity: 1,
      selectedMetal: 'gold22k',
      selectedGemstone: 'emerald',
      ringSize: '14 (Indian / 54mm)',
    },
  ]);

  const [wishlistIds, setWishlistIds] = useState<string[]>([
    'nfj-choker-01',
    'necklace-3',
  ]);

  // Navigation & Category filter
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Modals state
  const [product3DModalItem, setProduct3DModalItem] = useState<JewelleryItem | null>(null);
  const [appointmentShowroom, setAppointmentShowroom] = useState<Showroom | null>(null);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [isSavingsOpen, setIsSavingsOpen] = useState<boolean>(false);
  const [isDigitalGoldOpen, setIsDigitalGoldOpen] = useState<boolean>(false);

  // New Modals: Admin, EMI, and Rental
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isEMIOpen, setIsEMIOpen] = useState<boolean>(false);
  const [emiSelectedPrice, setEmiSelectedPrice] = useState<number>(485000);
  const [rentalItemTarget, setRentalItemTarget] = useState<JewelleryItem | null>(null);

  // Notifications & Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [customerAlert, setCustomerAlert] = useState<{ title: string; message: string } | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Cart operations
  const handleAddToCart = (product: JewelleryItem) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id && !i.isRental);
      if (existing) {
        return prev.map((i) =>
          i.id === existing.id ? { ...i, quantity: i.quantity + 1 } : i
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
    showToast(`Added Customized 3D ${product.name} to Bag!`);
  };

  const handleHeroAddToCartDirect = (metal: MetalType, gemstone: GemstoneType) => {
    const heroProduct = products[0] || JEWELLERY_PRODUCTS[0];
    handleAddToCartCustomized(heroProduct, metal, gemstone, '14 (Indian / 54mm)');
    setIsCartOpen(true);
  };

  const handleConfirmRental = (
    item: JewelleryItem,
    days: number,
    deposit: number,
    startDate: string
  ) => {
    const rentalEntry: CartItem = {
      id: `cart-rental-${Date.now()}`,
      product: item,
      quantity: 1,
      selectedMetal: item.metal || 'gold22k',
      selectedGemstone: item.gemstone || 'diamond',
      isRental: true,
      rentalDays: days,
      rentalStartDate: startDate,
    };
    setCartItems((prev) => [...prev, rentalEntry]);
    setRentalItemTarget(null);
    setIsCartOpen(true);
    showToast(`Booked ${item.name} on rent for ${days} days!`);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
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

  const wishlistProducts = products.filter((p) => wishlistIds.includes(p.id));

  // Admin Panel operations
  const handleSaveProduct = (newOrUpdated: JewelleryItem) => {
    setProducts((prev) => {
      const idx = prev.findIndex((p) => p.id === newOrUpdated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newOrUpdated;
        return copy;
      }
      return [newOrUpdated, ...prev];
    });
    showToast(`Jewellery catalog updated successfully!`);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    showToast(`Jewellery item deleted from catalog`);
  };

  const handleSaveOffer = (newOrUpdated: PromotionalOffer) => {
    setOffers((prev) => {
      const idx = prev.findIndex((o) => o.id === newOrUpdated.id);
      if (idx >= 0) {
        const copy = [...prev];
        copy[idx] = newOrUpdated;
        return copy;
      }
      return [newOrUpdated, ...prev];
    });
    showToast(`Promotional offer updated!`);
  };

  const handleDeleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((o) => o.id !== offerId));
    showToast(`Promotional offer removed`);
  };

  const handleSendNotification = (title: string, message: string) => {
    setCustomerAlert({ title, message });
    showToast(`Broadcast sent to 4,200+ registered Ladakh customers!`);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.3 },
    });
  };

  // Quick modal openers
  const openEMIModal = (price?: number) => {
    if (price) setEmiSelectedPrice(price);
    setIsEMIOpen(true);
  };

  const openRentalModal = (item?: JewelleryItem) => {
    if (item) {
      setRentalItemTarget(item);
    } else {
      const defaultRental = products.find((p) => p.isAvailableForRent) || products[0];
      setRentalItemTarget(defaultRental);
    }
  };

  // Showrooms active view and target ID
  const [showroomActiveView, setShowroomActiveView] = useState<'showroom' | 'map'>('showroom');
  const [showroomActiveId, setShowroomActiveId] = useState<string>('choglamsar');

  // Smooth scrolls
  const scrollToShowrooms = (view: 'showroom' | 'map' = 'showroom', showroomId?: string) => {
    setShowroomActiveView(view);
    if (showroomId) {
      setShowroomActiveId(showroomId);
    }
    const el = document.getElementById('showrooms-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const scrollToCollections = () => {
    const el = document.getElementById('collections-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden relative bg-[#FAF7F2] text-[#1F1615] font-sans antialiased selection:bg-[#D4AF37]/30 selection:text-[#4A1017]">
      {/* Customer Broadcast Banner (Triggered when Admin sends offer notification) */}
      {customerAlert && (
        <div className="bg-[#4A1017] text-[#F5E5B8] px-4 py-2.5 border-b border-[#D4AF37]/40 flex items-center justify-between text-xs animate-in slide-in-from-top duration-300">
          <div className="max-w-7xl mx-auto flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
            <Bell className="w-4 h-4 text-[#F3DE8A]" />
            <span className="font-bold uppercase tracking-wider">{customerAlert.title}:</span>
            <span>{customerAlert.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setCustomerAlert(null)}
            className="text-stone-300 hover:text-white text-sm px-2"
          >
            ✕
          </button>
        </div>
      )}

      {/* 1. Live Bullion Ticker Banner */}
      <BullionTicker onOpenDigitalGold={() => setIsDigitalGoldOpen(true)} />

      {/* 2. Brand Header & Navigation with Animated Golden Shimmer */}
      <Navbar
        cartCount={cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        wishlistCount={wishlistIds.length}
        products={products}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenSavingsScheme={() => setIsSavingsOpen(true)}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onSelectProduct={(product) => setProduct3DModalItem(product)}
        onScrollToShowrooms={scrollToShowrooms}
        onSelectCategory={(cat) => {
          setActiveCategory(cat);
          scrollToCollections();
        }}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenEMI={() => openEMIModal()}
        onOpenRental={() => openRentalModal()}
      />

      {/* 3. Hero Section with 2D Stylish Multi-Colorway Necklace and Real-Time 3D Studio */}
      <HeroSection
        onExploreClick={scrollToCollections}
        onConciergeClick={scrollToShowrooms}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onAddToCartDirect={handleHeroAddToCartDirect}
        onOpenRental={(item) => openRentalModal(item)}
        onOpenCalculator={(price) => openEMIModal(price)}
      />

      {/* 4. Curated Jewellery Showcase with 3D Preview, 0% EMI & Rental Tags */}
      <CollectionsGrid
        products={products}
        onOpen3DModal={(item) => setProduct3DModalItem(item)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
        wishlistIds={wishlistIds}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onOpenRental={(item) => openRentalModal(item)}
        onOpenEMI={(price) => openEMIModal(price)}
      />

      {/* 5. 4 Flagship Showrooms in Ladakh: Real Luxury Boutiques Photos */}
      <FlagshipShowrooms
        onBookAppointment={(showroom) => setAppointmentShowroom(showroom)}
        activeView={showroomActiveView}
        onViewChange={setShowroomActiveView}
        activeShowroomId={showroomActiveId}
        onSelectShowroomId={setShowroomActiveId}
      />

      {/* 6. Himalayan Goldsmith Heritage & BIS 916 Legacy */}
      <HeritageLegacySection />

      {/* 7. Footer with Animated Golden Accent and Quick Triggers */}
      <Footer
        onOpenSavingsScheme={() => setIsSavingsOpen(true)}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
        onScrollToShowrooms={scrollToShowrooms}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenEMI={() => openEMIModal()}
        onOpenRental={() => openRentalModal()}
      />

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
        onOpenRental={(item) => openRentalModal(item)}
        onOpenEMI={(price) => openEMIModal(price)}
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

      {/* Admin Panel Modal */}
      <AdminPanelModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        offers={offers}
        onUpdateProductPrice={(id, newPrice) => {
          setProducts((prev) =>
            prev.map((p) => (p.id === id ? { ...p, price: newPrice } : p))
          );
          showToast(`Price updated to ₹${newPrice.toLocaleString('en-IN')}`);
        }}
        onDeleteProduct={(id) => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
          showToast(`Jewellery item deleted`);
        }}
        onAddProduct={(newProduct) => {
          setProducts((prev) => [newProduct, ...prev]);
          showToast(`Added ${newProduct.name} to catalog!`);
        }}
        onAddOffer={(newOffer) => {
          setOffers((prev) => [newOffer, ...prev]);
          showToast(`Added promotional offer ${newOffer.code}!`);
        }}
        onSendOfferNotification={(offer) => {
          setCustomerAlert({
            title: offer.title,
            message: `${offer.description} Use code: ${offer.code}`,
          });
          showToast(`Notification sent to Ladakh customers for offer ${offer.code}!`);
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.3 },
          });
        }}
      />

      {/* EMI Calculator Modal */}
      <EMICalculatorModal
        isOpen={isEMIOpen}
        onClose={() => setIsEMIOpen(false)}
        products={products}
        initialPrice={emiSelectedPrice}
        onBuyOnEMI={(product, emiPlan) => {
          handleAddToCart(product);
          setIsEMIOpen(false);
          setIsCartOpen(true);
          showToast(
            `Added ${product.name} with ${emiPlan.tenure}-Month 0% EMI (₹${emiPlan.monthlyEMI.toLocaleString('en-IN')}/mo)!`
          );
        }}
      />

      {/* Rental Jewellery Booking Modal */}
      <RentalModal
        isOpen={!!rentalItemTarget}
        onClose={() => setRentalItemTarget(null)}
        product={rentalItemTarget}
        allProducts={products}
        onBookRental={(details) => {
          handleConfirmRental(
            details.product,
            details.days,
            details.deposit,
            details.startDate
          );
        }}
      />

      {/* Royal Concierge Chatbot on Bottom Right */}
      <ConciergeChatbot
        onOpenAppointment={(showroom) => {
          setAppointmentShowroom(showroom || SHOWROOMS_DATA[0]);
        }}
        onOpenShowrooms={scrollToShowrooms}
        onOpenDigitalGold={() => setIsDigitalGoldOpen(true)}
      />
    </div>
  );
}
