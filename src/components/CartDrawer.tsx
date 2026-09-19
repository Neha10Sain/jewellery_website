import React, { useState } from 'react';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Tag,
  CheckCircle2,
  CreditCard,
  Smartphone,
  Landmark,
  Clock,
  Lock,
  QrCode,
} from 'lucide-react';
import { CartItem } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
  onOpenEMI?: (price: number) => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onOpenEMI,
}) => {
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'payment'>('cart');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'upi' | 'credit' | 'debit' | 'emi'>('upi');

  // Dummy payment form inputs for realistic demo
  const [upiId, setUpiId] = useState('patron@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8821');
  const [cardExpiry, setCardExpiry] = useState('08/29');
  const [cardCvv, setCardCvv] = useState('782');
  const [cardHolder, setCardHolder] = useState('Tsering Angmo');

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => {
    if (item.isRental) {
      const daily = item.product.rentalPricePerDay || 3500;
      const days = item.rentalDays || 3;
      return acc + daily * days * item.quantity;
    }
    return acc + item.product.price * item.quantity;
  }, 0);

  const gst = Math.round(subtotal * 0.03);
  const total = Math.max(0, subtotal + gst - discount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCoupon = coupon.trim().toUpperCase();
    if (cleanCoupon === 'LADAKH916' || cleanCoupon === 'BRIDAL25' || cleanCoupon === 'GOLDFREE') {
      setDiscount(5000);
      setAppliedCoupon(cleanCoupon);
    } else {
      alert('Invalid code. Try "BRIDAL25" or "LADAKH916" for festive privilege savings!');
    }
  };

  const handleProcessPayment = () => {
    confetti({
      particleCount: 120,
      spread: 90,
      origin: { y: 0.5 },
    });
    setIsOrdered(true);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#FAF7F2] text-[#1F1615] shadow-2xl flex flex-col justify-between border-l border-[#D4AF37]/50">
          {/* Header */}
          <div className="p-4 bg-[#4A1017] text-white flex items-center justify-between border-b border-[#D4AF37]/30">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#F3DE8A]" />
              <h3 className="font-playfair text-base font-bold text-[#F5E5B8]">
                {checkoutStep === 'payment'
                  ? 'Secure Payment Checkout'
                  : `Shopping Bag (${cartItems.reduce((a, b) => a + b.quantity, 0)})`}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="text-stone-300 hover:text-white p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {!isOrdered ? (
              checkoutStep === 'cart' ? (
                cartItems.length > 0 ? (
                  <>
                    <div className="space-y-3">
                      {cartItems.map((item) => (
                        <div
                          key={item.id}
                          className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs flex gap-3"
                        >
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-18 h-18 object-cover rounded-xl border border-stone-200"
                          />
                          <div className="flex-1 min-w-0 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h4 className="font-playfair text-sm font-bold text-stone-900 truncate">
                                  {item.product.name}
                                </h4>
                                <button
                                  type="button"
                                  onClick={() => onRemoveItem(item.id)}
                                  className="text-stone-400 hover:text-red-600 p-0.5"
                                  title="Remove"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                              <div className="text-[11px] text-stone-500 mt-0.5">
                                {item.isRental ? (
                                  <span className="text-[#8C6D23] font-bold">
                                    Wedding Rental ({item.rentalDays || 3} Days)
                                  </span>
                                ) : (
                                  <span>
                                    {item.selectedMetal.replace('gold', '').toUpperCase()} Gold • {item.selectedGemstone}
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                              <div className="font-playfair text-sm font-bold text-[#4A1017]">
                                {item.isRental ? (
                                  <span>
                                    ₹{((item.product.rentalPricePerDay || 3500) * (item.rentalDays || 3) * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                ) : (
                                  <span>
                                    ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 border border-stone-300 rounded-lg px-2 py-0.5 text-xs">
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, -1)}
                                  className="text-stone-500 hover:text-stone-900 font-bold"
                                >
                                  -
                                </button>
                                <span className="font-semibold">{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() => onUpdateQuantity(item.id, 1)}
                                  className="text-stone-500 hover:text-stone-900 font-bold"
                                >
                                  +
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Promo Code Box */}
                    <form onSubmit={applyPromo} className="flex gap-2">
                      <input
                        type="text"
                        placeholder='Try "BRIDAL25" or "LADAKH916"'
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        className="flex-1 bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs uppercase text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold hover:bg-black"
                      >
                        Apply
                      </button>
                    </form>

                    {appliedCoupon && (
                      <div className="text-[11px] text-[#10B981] font-semibold flex items-center gap-1">
                        <Tag className="w-3 h-3" />
                        <span>Coupon {appliedCoupon} applied: ₹5,000 Royal Privilege Discount!</span>
                      </div>
                    )}

                    {/* Billing Breakdown */}
                    <div className="bg-white p-3.5 rounded-2xl border border-stone-200 text-xs space-y-2">
                      <div className="flex justify-between text-stone-600">
                        <span>Subtotal:</span>
                        <span>₹{subtotal.toLocaleString('en-IN')}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex justify-between text-[#10B981]">
                          <span>Royal Discount:</span>
                          <span>-₹{discount.toLocaleString('en-IN')}</span>
                        </div>
                      )}
                      <div className="flex justify-between text-stone-600">
                        <span>GST (3% Indian Bullion Standard):</span>
                        <span>₹{gst.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span>Insured Armored Courier (Pan-Ladakh & India):</span>
                        <span className="text-[#10B981] font-semibold">FREE</span>
                      </div>
                      <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between font-bold text-sm text-[#4A1017]">
                        <span>Grand Total:</span>
                        <span className="font-playfair text-base">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-[10px] text-stone-500 bg-[#FAF1E4] p-2.5 rounded-xl border border-[#D4AF37]/30">
                      <ShieldCheck className="w-4 h-4 text-[#B38F2C] shrink-0" />
                      <span>100% BIS 916 Hallmarked & Certified by New Friends Jewellers, Leh.</span>
                    </div>
                  </>
                ) : (
                  <div className="py-16 text-center space-y-3">
                    <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                      <ShoppingBag className="w-8 h-8" />
                    </div>
                    <h4 className="font-playfair text-xl font-bold text-stone-800">
                      Your bag is empty
                    </h4>
                    <p className="text-xs text-stone-500 max-w-xs mx-auto">
                      Explore our 2D bridal chokers, kada bangles, or rental collections to fill your trousseau.
                    </p>
                  </div>
                )
              ) : (
                /* CHECKOUT STEP: Payment Options (UPI, Credit Card, Debit Card, EMI) */
                <div className="space-y-4 animate-in fade-in">
                  <div className="bg-white p-3.5 rounded-2xl border border-stone-200">
                    <div className="flex items-center justify-between text-xs pb-2 border-b border-stone-100">
                      <span className="text-stone-500">Order Amount:</span>
                      <span className="font-playfair font-bold text-[#4A1017] text-base">
                        ₹{total.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 mt-1 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-[#10B981]" />
                      <span>256-Bit Bank Grade Encryption • Official New Friends Jewellers Gateway</span>
                    </div>
                  </div>

                  {/* Payment Method Selector Tabs */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                      Select Payment Option (Preview Mode):
                    </label>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('upi')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          selectedPaymentMethod === 'upi'
                            ? 'bg-[#4A1017] text-white border-[#4A1017] font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <Smartphone className="w-4 h-4 text-[#F3DE8A]" />
                        <div>
                          <div className="text-xs">UPI / QR</div>
                          <div className="text-[9px] opacity-75">GPay, PhonePe, Paytm</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('credit')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          selectedPaymentMethod === 'credit'
                            ? 'bg-[#4A1017] text-white border-[#4A1017] font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <CreditCard className="w-4 h-4 text-[#F3DE8A]" />
                        <div>
                          <div className="text-xs">Credit Card</div>
                          <div className="text-[9px] opacity-75">Visa, Master, RuPay</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setSelectedPaymentMethod('debit')}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          selectedPaymentMethod === 'debit'
                            ? 'bg-[#4A1017] text-white border-[#4A1017] font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <Landmark className="w-4 h-4 text-[#F3DE8A]" />
                        <div>
                          <div className="text-xs">Debit Card</div>
                          <div className="text-[9px] opacity-75">All Indian Banks</div>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPaymentMethod('emi');
                          onOpenEMI?.(total);
                        }}
                        className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all ${
                          selectedPaymentMethod === 'emi'
                            ? 'bg-[#4A1017] text-white border-[#4A1017] font-bold shadow-xs'
                            : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
                        }`}
                      >
                        <Clock className="w-4 h-4 text-[#F3DE8A]" />
                        <div>
                          <div className="text-xs">0% No-Cost EMI</div>
                          <div className="text-[9px] opacity-75">HDFC, ICICI, Bajaj</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Method Details */}
                  {selectedPaymentMethod === 'upi' && (
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between text-xs font-bold text-stone-800">
                        <span>Instant UPI Payment</span>
                        <QrCode className="w-4 h-4 text-[#4A1017]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                          Enter VPA / UPI ID:
                        </label>
                        <input
                          type="text"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-xs font-mono font-medium"
                        />
                      </div>
                      <div className="flex items-center gap-2 pt-1">
                        <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-600 font-bold">
                          GPay
                        </span>
                        <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-600 font-bold">
                          PhonePe
                        </span>
                        <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-600 font-bold">
                          Paytm
                        </span>
                        <span className="text-[10px] bg-stone-100 px-2 py-1 rounded text-stone-600 font-bold">
                          BHIM
                        </span>
                      </div>
                    </div>
                  )}

                  {(selectedPaymentMethod === 'credit' || selectedPaymentMethod === 'debit') && (
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-stone-800">
                          {selectedPaymentMethod === 'credit' ? 'Credit Card Details' : 'Debit Card Details'}
                        </span>
                        <span className="text-[10px] text-stone-400 uppercase font-mono">
                          256-Bit Protected
                        </span>
                      </div>

                      {/* Card Preview Chip */}
                      <div className="bg-gradient-to-tr from-[#2B090F] via-[#4A1017] to-[#7B1D28] text-[#FAF7F2] p-4 rounded-2xl shadow-md space-y-3">
                        <div className="flex justify-between items-center text-[10px] uppercase tracking-wider text-[#F3DE8A]">
                          <span>New Friends Jewellers • VIP Privilege Card</span>
                          <CreditCard className="w-4 h-4" />
                        </div>
                        <div className="font-mono text-base tracking-widest py-1">
                          {cardNumber}
                        </div>
                        <div className="flex justify-between text-[11px]">
                          <div>
                            <div className="text-[9px] text-stone-400 uppercase">Cardholder</div>
                            <div className="font-semibold">{cardHolder}</div>
                          </div>
                          <div>
                            <div className="text-[9px] text-stone-400 uppercase">Expires</div>
                            <div className="font-semibold font-mono">{cardExpiry}</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <label className="block text-[10px] text-stone-500 mb-1">Expiry Date</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] text-stone-500 mb-1">CVV / CVC</label>
                          <input
                            type="password"
                            maxLength={4}
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1.5 font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedPaymentMethod === 'emi' && (
                    <div className="bg-white p-4 rounded-2xl border border-stone-200 text-xs space-y-2">
                      <div className="font-bold text-stone-900">0% No-Cost EMI Available</div>
                      <p className="text-stone-600 text-[11px]">
                        Pay in 3 or 6 equal monthly installments with zero interest on your HDFC, ICICI, or SBI credit card.
                      </p>
                      <button
                        type="button"
                        onClick={() => onOpenEMI?.(total)}
                        className="text-[#4A1017] underline font-bold"
                      >
                        Customize EMI Tenure in Calculator →
                      </button>
                    </div>
                  )}
                </div>
              )
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-playfair text-2xl font-bold text-[#2B090F]">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Thank you for placing your bespoke order with New Friends Jewellers, Ladakh.
                  Ref: <strong>NFJ-2026-{Math.floor(Math.random() * 80000 + 10000)}</strong>.
                </p>
                <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 max-w-xs mx-auto text-left">
                  Payment confirmed via {selectedPaymentMethod.toUpperCase()} (Demo Preview). Our master goldsmiths in Leh have received your order.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    setIsOrdered(false);
                    setCheckoutStep('cart');
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#4A1017] text-white text-xs font-bold rounded-xl shadow"
                >
                  Continue Browsing
                </button>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {!isOrdered && cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200">
              {checkoutStep === 'cart' ? (
                <button
                  type="button"
                  onClick={() => setCheckoutStep('payment')}
                  className="w-full py-3.5 bg-[#4A1017] hover:bg-[#6B1724] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span>Select Payment Method (₹{total.toLocaleString('en-IN')})</span>
                  <ArrowRight className="w-4 h-4 text-[#F3DE8A]" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setCheckoutStep('cart')}
                    className="px-4 py-3 border border-stone-300 rounded-xl text-xs font-semibold text-stone-600"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={handleProcessPayment}
                    className="flex-1 py-3.5 bg-[#10B981] hover:bg-[#059669] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    <span>Authorize & Place Order</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
