import React, { useState } from 'react';
import {
  X,
  Plus,
  Trash2,
  Tag,
  Bell,
  CheckCircle2,
  DollarSign,
  Package,
  Layers,
  Sparkles,
  ShieldCheck,
  Send,
  Edit2,
  Store,
} from 'lucide-react';
import { JewelleryItem, PromotionalOffer, MetalType, GemstoneType } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: JewelleryItem[];
  offers: PromotionalOffer[];
  onUpdateProductPrice: (id: string, newPrice: number) => void;
  onDeleteProduct: (id: string) => void;
  onAddProduct: (product: JewelleryItem) => void;
  onAddOffer: (offer: PromotionalOffer) => void;
  onSendOfferNotification: (offer: PromotionalOffer) => void;
}

export const AdminPanelModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  offers,
  onUpdateProductPrice,
  onDeleteProduct,
  onAddProduct,
  onAddOffer,
  onSendOfferNotification,
}) => {
  const [activeTab, setActiveTab] = useState<'inventory' | 'offers' | 'new-item'>('inventory');

  // New item form state
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState<'necklaces' | 'bangles' | 'earrings' | 'rings' | 'coins'>('necklaces');
  const [newPrice, setNewPrice] = useState(250000);
  const [newWeight, setNewWeight] = useState(24.5);
  const [newPurity, setNewPurity] = useState('22K BIS 916 Gold');
  const [newMetal, setNewMetal] = useState<MetalType>('gold22k');
  const [newGemstone, setNewGemstone] = useState<GemstoneType>('emerald');
  const [newImage, setNewImage] = useState('https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=1000&q=80');
  const [newDescription, setNewDescription] = useState('Handcrafted 22K pure bridal jewellery with certified gemstones.');
  const [newIsRental, setNewIsRental] = useState(true);
  const [newRentalRate, setNewRentalRate] = useState(2500);

  // New offer form state
  const [offerTitle, setOfferTitle] = useState('');
  const [offerCode, setOfferCode] = useState('');
  const [offerDiscount, setOfferDiscount] = useState(20);
  const [offerDescription, setOfferDescription] = useState('');

  // Editing prices inline state
  const [editingPriceId, setEditingPriceId] = useState<string | null>(null);
  const [tempPrice, setTempPrice] = useState<number>(0);

  // Notification status feedback
  const [broadcastMessage, setBroadcastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSavePrice = (id: string) => {
    if (tempPrice > 0) {
      onUpdateProductPrice(id, tempPrice);
    }
    setEditingPriceId(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newItem: JewelleryItem = {
      id: `custom-${Date.now()}`,
      name: newName,
      category: newCategory,
      ornamentType: newCategory === 'necklaces' ? 'necklace' : newCategory === 'bangles' ? 'bangle' : newCategory === 'earrings' ? 'earrings' : 'ring',
      collection: 'Artisan Bespoke Atelier',
      price: Number(newPrice),
      weightGrams: Number(newWeight),
      purity: newPurity,
      metal: newMetal,
      gemstone: newGemstone,
      image: newImage,
      tag: 'New Launch',
      rating: 5.0,
      reviewsCount: 1,
      description: newDescription,
      hallmarkCertified: true,
      has3DModel: true,
      isAvailableForRent: newIsRental,
      rentalPricePerDay: newIsRental ? Number(newRentalRate) : undefined,
      rentalDeposit: newIsRental ? Math.round(Number(newPrice) * 0.1) : undefined,
    };

    onAddProduct(newItem);
    setActiveTab('inventory');
    setBroadcastMessage(`Successfully added "${newName}" to public showroom catalogue!`);
    setTimeout(() => setBroadcastMessage(null), 3500);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerTitle.trim()) return;

    const newOffer: PromotionalOffer = {
      id: `offer-${Date.now()}`,
      title: offerTitle,
      code: offerCode.toUpperCase() || 'LADAKH20',
      discountPercent: Number(offerDiscount),
      description: offerDescription || `${offerDiscount}% off festive promotional discount.`,
      badge: 'PROMO AD',
      expiryDate: '2026-11-30',
      isActive: true,
    };

    onAddOffer(newOffer);
    setOfferTitle('');
    setOfferCode('');
    setOfferDescription('');
    setBroadcastMessage(`Created new promotional campaign "${newOffer.title}"!`);
    setTimeout(() => setBroadcastMessage(null), 3500);
  };

  const handleSendNotification = (offer: PromotionalOffer) => {
    onSendOfferNotification(offer);
    setBroadcastMessage(`📢 Push & SMS notification sent to 4,850 registered Ladakh VIP customers for offer: "${offer.title}"!`);
    setTimeout(() => setBroadcastMessage(null), 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-5xl w-full max-h-[92vh] overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A1017] text-[#F5E5B8] flex items-center justify-center font-bold font-playfair shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#2B090F] leading-tight">
                Store Manager & Admin Portal
              </h2>
              <div className="text-[11px] text-stone-500 flex items-center gap-2">
                <span>New Friends Jewellers • Ladakh Outlets</span>
                <span>•</span>
                <span className="text-[#10B981] font-semibold">Active Session</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600 flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-stone-100 px-4 sm:px-6 py-2.5 flex items-center gap-2 border-b border-stone-200 overflow-x-auto no-scrollbar">
          <button
            type="button"
            onClick={() => setActiveTab('inventory')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'inventory'
                ? 'bg-[#4A1017] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Jewellery Inventory & Pricing ({products.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('new-item')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'new-item'
                ? 'bg-[#4A1017] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Plus className="w-4 h-4" />
            <span>Upload New Jewellery</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('offers')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'offers'
                ? 'bg-[#4A1017] text-white shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Offers & Ads ({offers.length})</span>
          </button>
        </div>

        {/* Broadcast Toast Banner */}
        {broadcastMessage && (
          <div className="bg-[#10B981] text-white px-4 py-2.5 text-xs font-semibold flex items-center justify-between shadow-inner animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{broadcastMessage}</span>
            </div>
            <button
              type="button"
              onClick={() => setBroadcastMessage(null)}
              className="text-white/80 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* TAB 1: Inventory & Set Prices */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-playfair text-lg font-bold text-[#2B090F]">
                    Live Catalogue & Price Controls
                  </h3>
                  <p className="text-xs text-stone-500">
                    Click on any price to modify it instantly on the customer-facing website.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('new-item')}
                  className="bg-[#4A1017] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Jewellery</span>
                </button>
              </div>

              <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 border-b border-stone-200 font-semibold uppercase text-[10px]">
                    <tr>
                      <th className="p-3">Jewellery</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Purity & Wt</th>
                      <th className="p-3">Price (₹)</th>
                      <th className="p-3">Rental Option</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {products.map((item) => (
                      <tr key={item.id} className="hover:bg-stone-50/80 transition-colors">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-10 h-10 object-cover rounded-lg border border-stone-200 shrink-0"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{item.name}</div>
                            <div className="text-[10px] text-stone-500">{item.collection}</div>
                          </div>
                        </td>
                        <td className="p-3 capitalize text-stone-600 font-medium">
                          {item.category}
                        </td>
                        <td className="p-3 text-stone-600">
                          <div>{item.purity}</div>
                          <div className="text-[10px] text-stone-400">{item.weightGrams} Grams</div>
                        </td>
                        <td className="p-3">
                          {editingPriceId === item.id ? (
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={tempPrice}
                                onChange={(e) => setTempPrice(Number(e.target.value))}
                                className="w-24 px-2 py-1 bg-white border border-[#4A1017] rounded-lg text-xs font-bold"
                              />
                              <button
                                type="button"
                                onClick={() => handleSavePrice(item.id)}
                                className="bg-[#4A1017] text-white p-1 rounded-lg text-xs"
                                title="Save Price"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <div
                              onClick={() => {
                                setEditingPriceId(item.id);
                                setTempPrice(item.price);
                              }}
                              className="font-playfair font-bold text-stone-900 hover:text-[#4A1017] cursor-pointer flex items-center gap-1 group"
                              title="Click to edit price"
                            >
                              <span>₹{item.price.toLocaleString('en-IN')}</span>
                              <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 text-stone-400" />
                            </div>
                          )}
                        </td>
                        <td className="p-3">
                          {item.isAvailableForRent ? (
                            <span className="bg-[#FAF1E4] text-[#8C6D23] font-bold text-[10px] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                              ₹{item.rentalPricePerDay?.toLocaleString('en-IN')}/day
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">Purchase Only</span>
                          )}
                        </td>
                        <td className="p-3 text-right">
                          <button
                            type="button"
                            onClick={() => onDeleteProduct(item.id)}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
                            title="Delete Jewellery"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 2: Upload New Jewellery Form */}
          {activeTab === 'new-item' && (
            <div className="max-w-2xl mx-auto bg-white p-6 rounded-2xl border border-stone-200 shadow-xs">
              <h3 className="font-playfair text-xl font-bold text-[#2B090F] mb-1">
                Upload & Add Jewellery
              </h3>
              <p className="text-xs text-stone-500 mb-5">
                New products are immediately available in the website catalogue, 3D viewer, and rental options.
              </p>

              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                    Jewellery Name:
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kashmiri Nizam Kundan Choker"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                      Category:
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                    >
                      <option value="necklaces">Bridal Chokers & Necklaces</option>
                      <option value="bangles">Diamond Bangles & Kadas</option>
                      <option value="earrings">Royal Earrings & Jhumkas</option>
                      <option value="rings">Solitaire Rings</option>
                      <option value="coins">Gold Coins</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                      Retail Price (₹):
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                      Gross Weight (Grams):
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={newWeight}
                      onChange={(e) => setNewWeight(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                      Metal:
                    </label>
                    <select
                      value={newMetal}
                      onChange={(e) => setNewMetal(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                    >
                      <option value="gold22k">22K Gold (916 BIS)</option>
                      <option value="gold24k">24K Pure Gold</option>
                      <option value="rosegold">18K Rose Gold</option>
                      <option value="platinum">Platinum 950</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                      Gemstone:
                    </label>
                    <select
                      value={newGemstone}
                      onChange={(e) => setNewGemstone(e.target.value as any)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="sapphire">Blue Sapphire</option>
                      <option value="diamond">Solitaire Diamond</option>
                      <option value="ruby">Burmese Ruby</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                    Image URL (High-res photography):
                  </label>
                  <input
                    type="url"
                    required
                    value={newImage}
                    onChange={(e) => setNewImage(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                  />
                  {newImage && (
                    <div className="mt-2 flex items-center gap-3">
                      <img
                        src={newImage}
                        alt="Preview"
                        className="w-14 h-14 object-cover rounded-xl border border-stone-300"
                      />
                      <span className="text-[11px] text-stone-500">Image Preview Ready</span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#4A1017] uppercase mb-1">
                    Product Description:
                  </label>
                  <textarea
                    rows={2}
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-900 focus:bg-white"
                  />
                </div>

                {/* Rental Settings */}
                <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isRentalCheck"
                      checked={newIsRental}
                      onChange={(e) => setNewIsRental(e.target.checked)}
                      className="rounded text-[#4A1017]"
                    />
                    <label htmlFor="isRentalCheck" className="text-xs font-bold text-stone-800">
                      Enable Wedding Rental for this piece
                    </label>
                  </div>
                  {newIsRental && (
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-stone-600">Rental Price per Day: ₹</span>
                      <input
                        type="number"
                        value={newRentalRate}
                        onChange={(e) => setNewRentalRate(Number(e.target.value))}
                        className="w-28 bg-white border border-stone-300 rounded-lg px-2 py-1 text-xs font-semibold"
                      />
                    </div>
                  )}
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('inventory')}
                    className="px-4 py-2 border border-stone-300 text-stone-600 rounded-xl text-xs font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl text-xs font-bold shadow-md transition-all"
                  >
                    Save & Publish Jewellery
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 3: Offers & Promotional Broadcast */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              {/* Broadcast notification banner */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left: Create New Offer */}
                <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-[#B38F2C]" />
                    <h4 className="font-playfair font-bold text-base text-stone-900">
                      Create Promotional Offer / Ad
                    </h4>
                  </div>

                  <form onSubmit={handleCreateOffer} className="space-y-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                        Offer Headline:
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Diwali Shubh Muhurat Special"
                        required
                        value={offerTitle}
                        onChange={(e) => setOfferTitle(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                          Promo Code:
                        </label>
                        <input
                          type="text"
                          placeholder="FESTIVE20"
                          value={offerCode}
                          onChange={(e) => setOfferCode(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs uppercase font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                          Discount (%):
                        </label>
                        <input
                          type="number"
                          value={offerDiscount}
                          onChange={(e) => setOfferDiscount(Number(e.target.value))}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-bold"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-700 uppercase mb-1">
                        Terms / Description:
                      </label>
                      <textarea
                        rows={2}
                        placeholder="Applicable on making charges for all bridal necklace sets."
                        value={offerDescription}
                        onChange={(e) => setOfferDescription(e.target.value)}
                        className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-2.5 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
                    >
                      Publish Offer
                    </button>
                  </form>
                </div>

                {/* Right: Active Campaigns & Send Broadcast to Customers */}
                <div className="lg:col-span-7 space-y-4">
                  <div>
                    <h4 className="font-playfair font-bold text-base text-stone-900">
                      Active Customer Offers & Broadcasts
                    </h4>
                    <p className="text-xs text-stone-500">
                      Send instant SMS & WhatsApp notification alerts to registered patrons.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {offers.map((offer) => (
                      <div
                        key={offer.id}
                        className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between space-y-3"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-[#FAF1E4] text-[#8C6D23] px-2.5 py-0.5 rounded-full text-[10px] font-bold border border-[#D4AF37]/30 uppercase">
                                {offer.badge}
                              </span>
                              <span className="font-mono text-xs font-bold text-[#4A1017] bg-stone-100 px-2 py-0.5 rounded">
                                {offer.code}
                              </span>
                            </div>
                            <h5 className="font-playfair font-bold text-base text-stone-900 mt-1">
                              {offer.title}
                            </h5>
                            <p className="text-xs text-stone-600 mt-0.5">
                              {offer.description}
                            </p>
                          </div>

                          <div className="text-right">
                            <span className="text-lg font-bold text-[#10B981]">
                              {offer.discountPercent}% OFF
                            </span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                          <div className="text-[10px] text-stone-400">
                            Valid through: {offer.expiryDate}
                          </div>

                          <button
                            type="button"
                            onClick={() => handleSendNotification(offer)}
                            className="bg-stone-900 hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-xs"
                          >
                            <Send className="w-3 h-3 text-[#F3DE8A]" />
                            <span>Notify Customers</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
