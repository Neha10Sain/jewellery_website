import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, CheckCircle2 } from 'lucide-react';
import { CartItem } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemoveItem: (id: string) => void;
  onClearCart: () => void;
}

export const CartDrawer: React.FC<Props> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [isOrdered, setIsOrdered] = useState(false);

  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const gst = Math.round(subtotal * 0.03);
  const total = Math.max(0, subtotal + gst - discount);

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (coupon.trim().toUpperCase() === 'LADAKH916' || coupon.trim().toUpperCase() === 'ROYAL5000') {
      setDiscount(5000);
      setAppliedCoupon(coupon.trim().toUpperCase());
    } else {
      alert('Invalid coupon. Try "LADAKH916" for ₹5,000 royal welcome benefit!');
    }
  };

  const handleCheckout = () => {
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
              <h3 className="font-cinzel text-base font-bold text-[#F5E5B8]">
                Your Shopping Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)})
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
                              <h4 className="font-cormorant text-base font-bold text-stone-900 truncate">
                                {item.product.name}
                              </h4>
                              <button
                                type="button"
                                onClick={() => onRemoveItem(item.id)}
                                className="text-stone-400 hover:text-red-600 p-0.5"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5">
                              {item.selectedMetal.replace('gold', '').toUpperCase()} Gold • {item.selectedGemstone} • {item.ringSize}
                            </div>
                          </div>

                          <div className="flex items-center justify-between mt-2 pt-1 border-t border-stone-100">
                            <div className="font-cinzel text-sm font-bold text-[#4A1017]">
                              ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
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
                      placeholder='Try promo "LADAKH916"'
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
                      <span>Insured Armored Courier (Ladakh & Pan-India):</span>
                      <span className="text-[#10B981] font-semibold">FREE</span>
                    </div>
                    <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between font-bold text-sm text-[#4A1017]">
                      <span>Grand Total:</span>
                      <span className="font-cinzel text-base">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-[10px] text-stone-500 bg-[#FAF1E4] p-2.5 rounded-xl border border-[#D4AF37]/30">
                    <ShieldCheck className="w-4 h-4 text-[#B38F2C] shrink-0" />
                    <span>Includes BIS Hallmark Certificate & Lifetime 100% Buyback Guarantee.</span>
                  </div>
                </>
              ) : (
                <div className="py-16 text-center space-y-3">
                  <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                    <ShoppingBag className="w-8 h-8" />
                  </div>
                  <h4 className="font-cormorant text-xl font-bold text-stone-800">
                    Your bag is empty
                  </h4>
                  <p className="text-xs text-stone-500">
                    Discover handpicked 916 gold chokers or custom 3D rings to fill your royal trousseau.
                  </p>
                </div>
              )
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-cormorant text-2xl font-bold text-[#2B090F]">
                  Order Placed Successfully!
                </h4>
                <p className="text-xs text-stone-600 max-w-xs mx-auto">
                  Thank you for placing your bespoke order with New Friends Jewellers. Order Ref: <strong>NFJ-ORD-2026-{Math.floor(Math.random()*80000+10000)}</strong>.
                </p>
                <div className="text-[11px] text-stone-500 bg-white p-3 rounded-xl border border-stone-200 max-w-xs mx-auto text-left">
                  Our Master Himalayan Goldsmiths have received your bespoke specifications. You may also collect this at our Choglamsar or Leh flagship boutique.
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onClearCart();
                    setIsOrdered(false);
                    onClose();
                  }}
                  className="px-6 py-2.5 bg-[#4A1017] text-white text-xs font-bold rounded-xl shadow"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </div>

          {/* Footer Action */}
          {!isOrdered && cartItems.length > 0 && (
            <div className="p-4 bg-white border-t border-stone-200">
              <button
                type="button"
                onClick={handleCheckout}
                className="w-full py-3.5 bg-[#4A1017] hover:bg-[#6B1724] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>PROCEED TO SECURE CHECKOUT</span>
                <ArrowRight className="w-4 h-4 text-[#F3DE8A]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
