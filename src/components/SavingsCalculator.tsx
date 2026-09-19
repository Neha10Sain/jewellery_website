import React, { useState } from 'react';
import { PiggyBank, Sparkles, ShieldCheck, CheckCircle2, X, Gift, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const SavingsCalculator: React.FC<Props> = ({ isOpen, onClose }) => {
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(5000);
  const [enrolled, setEnrolled] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');

  if (!isOpen) return null;

  const totalTenureMonths = 11;
  const userPaid = monthlyDeposit * totalTenureMonths;
  const jewellerBonusMonth = monthlyDeposit * 1.0; // 1 month 100% bonus by brand!
  const totalMaturityValue = userPaid + jewellerBonusMonth;

  // Approximate gold grams accumulated at 22K rate ₹12,376/gm
  const approxGramsAccumulated = +(totalMaturityValue / 12376).toFixed(2);

  const handleEnroll = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setEnrolled(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-2xl w-full border border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-[#4A1017] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF1E4]/10 border border-[#F3DE8A]/40 flex items-center justify-center text-[#F3DE8A]">
              <PiggyBank className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#F3DE8A]">
                NEW FRIENDS JEWELLERS BESPOKE SCHEME
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-[#F5E5B8]">
                Swarn Bandhan Gold Savings Scheme
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-stone-300 hover:text-white p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {!enrolled ? (
            <>
              <div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Plan your bridal trousseau or gold portfolio with zero market volatility. Pay for 11 months, and New Friends Jewellers contributes the <strong>12th month instalment (100% Free)</strong> plus <strong>0% Making Charges</strong> on redemption across all 4 Ladakh boutiques.
                </p>
              </div>

              {/* Monthly Deposit Slider */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 space-y-3">
                <div className="flex justify-between items-center text-xs font-semibold">
                  <span className="text-stone-700">Monthly Contribution:</span>
                  <span className="font-cinzel text-xl font-bold text-[#4A1017]">
                    ₹{monthlyDeposit.toLocaleString('en-IN')} / mo
                  </span>
                </div>

                <input
                  type="range"
                  min={2000}
                  max={50000}
                  step={1000}
                  value={monthlyDeposit}
                  onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                  className="w-full accent-[#4A1017] h-2 bg-stone-200 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-stone-500">
                  <span>₹2,000 / mo</span>
                  <span>₹15,000 / mo</span>
                  <span>₹30,000 / mo</span>
                  <span>₹50,000 / mo</span>
                </div>
              </div>

              {/* Maturity Benefit Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-white rounded-xl p-3 border border-stone-200 text-center">
                  <div className="text-[10px] text-stone-500 font-bold uppercase">
                    You Pay (11 Mos)
                  </div>
                  <div className="font-cinzel text-base font-bold text-stone-900 mt-1">
                    ₹{userPaid.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="bg-[#FAF1E4] rounded-xl p-3 border border-[#D4AF37]/50 text-center">
                  <div className="text-[10px] text-[#8C6D23] font-bold uppercase flex items-center justify-center gap-1">
                    <Gift className="w-3 h-3 text-[#B38F2C]" />
                    <span>NFJ Bonus (Month 12)</span>
                  </div>
                  <div className="font-cinzel text-base font-bold text-[#8C6D23] mt-1">
                    +₹{jewellerBonusMonth.toLocaleString('en-IN')} Free
                  </div>
                </div>

                <div className="bg-[#4A1017] text-[#FAF7F2] rounded-xl p-3 border border-[#D4AF37]/40 text-center">
                  <div className="text-[10px] text-[#F3DE8A] font-bold uppercase">
                    Total Maturity Value
                  </div>
                  <div className="font-cinzel text-base font-bold text-[#F5E5B8] mt-1">
                    ₹{totalMaturityValue.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Accumulated Gold Equivalent */}
              <div className="p-3.5 bg-gradient-to-r from-[#FAF1E4] to-[#FDF8EE] rounded-2xl border border-[#D4AF37]/40 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#B38F2C]" />
                  <div>
                    <div className="text-xs font-bold text-[#4A1017]">
                      Estimated Accumulated 22K Gold
                    </div>
                    <div className="text-[11px] text-stone-600">
                      Zero making charges deduction when redeemed
                    </div>
                  </div>
                </div>
                <div className="font-cinzel text-xl font-bold text-[#8C6D23]">
                  ~ {approxGramsAccumulated} Grams
                </div>
              </div>

              {/* Enrollment Form */}
              <form onSubmit={handleEnroll} className="space-y-3 pt-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Full Name
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g. Sonam Angchuk"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-stone-700 block mb-1">
                      Mobile Number (+91)
                    </label>
                    <input
                      required
                      type="tel"
                      placeholder="e.g. 9876543210"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-[#4A1017] hover:bg-[#6B1724] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <span>Enroll in Swarn Bandhan (₹{monthlyDeposit.toLocaleString('en-IN')}/mo)</span>
                  <ArrowRight className="w-4 h-4 text-[#F3DE8A]" />
                </button>
              </form>
            </>
          ) : (
            /* Enrollment Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <h3 className="font-cormorant text-3xl font-bold text-[#2B090F]">
                Congratulations, {customerName || 'Patron'}!
              </h3>

              <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
                Your Swarn Bandhan Gold Passbook has been provisioned for ₹{monthlyDeposit.toLocaleString('en-IN')} / month. A verification SMS with digital passbook link has been dispatched to {customerPhone || 'your mobile'}.
              </p>

              <div className="bg-white rounded-2xl p-4 border border-[#D4AF37]/40 max-w-sm mx-auto text-xs text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Scheme ID:</span>
                  <span className="font-mono font-bold text-[#4A1017]">NFJ-SB-2026-916</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Boutique Allocation:</span>
                  <span className="font-semibold text-stone-800">Leh & Choglamsar Central</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Bonus Commitment:</span>
                  <span className="font-bold text-[#10B981]">1 Month 100% Free at Maturity</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEnrolled(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#4A1017] text-white text-xs font-bold rounded-xl shadow-md"
              >
                Back to Jewellery Showcase
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
