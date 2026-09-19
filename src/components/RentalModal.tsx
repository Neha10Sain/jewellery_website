import React, { useState } from 'react';
import {
  X,
  Clock,
  ShieldCheck,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ShoppingBag,
} from 'lucide-react';
import { JewelleryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  product: JewelleryItem | null;
  allProducts: JewelleryItem[];
  onBookRental: (rentalDetails: {
    product: JewelleryItem;
    days: number;
    startDate: string;
    totalRental: number;
    deposit: number;
  }) => void;
}

export const RentalModal: React.FC<Props> = ({
  isOpen,
  onClose,
  product,
  allProducts,
  onBookRental,
}) => {
  const rentalEligibleProducts = allProducts.filter((p) => p.isAvailableForRent);
  const [selectedProductId, setSelectedProductId] = useState<string>(
    product?.id || rentalEligibleProducts[0]?.id || ''
  );
  const [rentalDays, setRentalDays] = useState<number>(3);
  const [eventDate, setEventDate] = useState<string>('2026-10-15');
  const [deliveryMode, setDeliveryMode] = useState<'store' | 'doorstep'>('store');
  const [isBookedSuccess, setIsBookedSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentItem =
    allProducts.find((p) => p.id === selectedProductId) ||
    product ||
    rentalEligibleProducts[0];

  const dailyRate = currentItem?.rentalPricePerDay || 3500;
  const totalRentalCost = dailyRate * rentalDays;
  const securityDeposit = currentItem?.rentalDeposit || Math.round(currentItem.price * 0.1);
  const grandTotal = totalRentalCost + securityDeposit;

  const handleConfirmBooking = () => {
    setIsBookedSuccess(true);
    setTimeout(() => {
      onBookRental({
        product: currentItem,
        days: rentalDays,
        startDate: eventDate,
        totalRental: totalRentalCost,
        deposit: securityDeposit,
      });
      setIsBookedSuccess(false);
      onClose();
    }, 1600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#8C6D23] text-white flex items-center justify-center font-bold shadow-xs">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#2B090F] leading-tight">
                Shahi Bridal Jewellery Rental Service
              </h2>
              <p className="text-[11px] text-stone-500">
                Wear genuine 22K BIS 916 & diamond heirlooms for your wedding at a fraction of retail price
              </p>
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

        {/* Modal Content */}
        <div className="p-4 sm:p-6 space-y-5">
          {/* Item Selector */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <label className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
              Select Bridal Ornament to Rent:
            </label>
            <select
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
            >
              {rentalEligibleProducts.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — Rent ₹{p.rentalPricePerDay?.toLocaleString('en-IN')}/day (Retail: ₹
                  {p.price.toLocaleString('en-IN')})
                </option>
              ))}
            </select>

            {currentItem && (
              <div className="flex items-center gap-3 p-3 bg-[#FAF7F2] rounded-xl border border-stone-200">
                <img
                  src={currentItem.image}
                  alt={currentItem.name}
                  className="w-16 h-16 object-cover rounded-xl border border-stone-300 shadow-xs"
                />
                <div className="space-y-0.5">
                  <span className="bg-[#FAF1E4] text-[#8C6D23] text-[9px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30 uppercase">
                    Available for Wedding Rental
                  </span>
                  <div className="font-playfair font-bold text-stone-900 text-sm">
                    {currentItem.name}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {currentItem.purity} • Retail: ₹{currentItem.price.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-[10px] text-stone-500 font-medium">Rental Rate</div>
                  <div className="font-playfair text-lg font-bold text-[#8C6D23]">
                    ₹{dailyRate.toLocaleString('en-IN')}
                    <span className="text-[10px] text-stone-400">/day</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Rental Duration & Event Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Duration */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <span className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                Rental Duration:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { days: 2, label: '2 Days', desc: 'Pre-wedding' },
                  { days: 3, label: '3 Days', desc: 'Main Wedding' },
                  { days: 5, label: '5 Days', desc: 'Bridal Week' },
                ].map((d) => (
                  <button
                    key={d.days}
                    type="button"
                    onClick={() => setRentalDays(d.days)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      rentalDays === d.days
                        ? 'bg-[#4A1017] text-white border-[#4A1017] font-bold shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs">{d.label}</div>
                    <div
                      className={`text-[9px] ${
                        rentalDays === d.days ? 'text-[#F3DE8A]' : 'text-stone-400'
                      }`}
                    >
                      {d.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Event Date */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <label className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                Wedding / Function Date:
              </label>
              <div className="flex items-center gap-2 bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs">
                <Calendar className="w-4 h-4 text-[#8C6D23]" />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="bg-transparent w-full focus:outline-none text-stone-900 font-semibold"
                />
              </div>
              <div className="text-[10px] text-stone-500">
                Jewellery arrives 24 hours prior for complimentary trial fitting.
              </div>
            </div>
          </div>

          {/* Delivery or Showroom Pickup */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2">
            <span className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
              Collection & Return Method:
            </span>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setDeliveryMode('store')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  deliveryMode === 'store'
                    ? 'bg-[#FAF1E4] border-[#D4AF37] text-stone-900 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <MapPin className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">Showroom Trial & Pickup</div>
                  <div className="text-[10px] text-stone-500">Leh or Choglamsar Boutique (Free)</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setDeliveryMode('doorstep')}
                className={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  deliveryMode === 'doorstep'
                    ? 'bg-[#FAF1E4] border-[#D4AF37] text-stone-900 font-semibold shadow-xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600'
                }`}
              >
                <Sparkles className="w-4 h-4 text-[#8C6D23] shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold">VIP Doorstep Delivery</div>
                  <div className="text-[10px] text-stone-500">Delivered by security courier</div>
                </div>
              </button>
            </div>
          </div>

          {/* Cost Breakdown */}
          <div className="bg-white p-4 rounded-2xl border-2 border-[#D4AF37]/50 shadow-xs space-y-3">
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Rental Charges ({rentalDays} Days @ ₹{dailyRate.toLocaleString('en-IN')}/day):</span>
              <span className="font-bold text-stone-900">₹{totalRentalCost.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <div className="flex items-center gap-1">
                <span>Refundable Security Deposit:</span>
                <span className="text-[10px] text-[#10B981] font-semibold">(100% Refunded on Return)</span>
              </div>
              <span className="font-bold text-stone-900">₹{securityDeposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex items-center justify-between text-xs text-stone-600">
              <span>Ultrasonic Polishing & Hygiene Sanitization:</span>
              <span className="font-bold text-[#10B981]">FREE</span>
            </div>

            <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase font-bold text-stone-400">Total Payable Now</div>
                <div className="font-playfair text-2xl font-bold text-[#4A1017]">
                  ₹{grandTotal.toLocaleString('en-IN')}
                </div>
              </div>

              {isBookedSuccess ? (
                <div className="flex items-center gap-2 bg-[#10B981] text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Rental Reserved!</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleConfirmBooking}
                  className="bg-[#4A1017] hover:bg-[#681822] text-white px-6 py-3 rounded-xl text-xs font-bold tracking-wider uppercase shadow-md transition-all active:scale-95 flex items-center gap-2"
                >
                  <Clock className="w-4 h-4 text-[#F3DE8A]" />
                  <span>Confirm Rental Booking</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
