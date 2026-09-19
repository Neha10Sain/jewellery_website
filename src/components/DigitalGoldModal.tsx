import React, { useState, useEffect } from 'react';
import { Coins, ShieldCheck, Sparkles, X, CheckCircle2, Lock, ArrowRight, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const DigitalGoldModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const [purchaseType, setPurchaseType] = useState<'amount' | 'grams'>('amount');
  const [amount, setAmount] = useState<number>(5000);
  const [grams, setGrams] = useState<number>(0.37);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(299);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Live 24K 999 gold rate
  const rate24k = 13501.5; // per gram

  useEffect(() => {
    if (!isOpen) return;
    const timer = setInterval(() => {
      setSecondsRemaining((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen]);

  const handleAmountChange = (val: number) => {
    setAmount(val);
    setGrams(+(val / rate24k).toFixed(4));
  };

  const handleGramsChange = (val: number) => {
    setGrams(val);
    setAmount(Math.round(val * rate24k));
  };

  const handleBuy = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.5 },
    });
    setIsCompleted(true);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-lg w-full border border-[#D4AF37]/60 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#3E0A12] via-[#4A1017] to-[#1F080C] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#FAF1E4]/10 border border-[#F3DE8A]/40 flex items-center justify-center text-[#F3DE8A]">
              <Coins className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold tracking-widest text-[#F3DE8A]">
                24K 999.9 PURE GOLD VAULT
              </div>
              <h3 className="font-cormorant text-2xl font-bold text-[#F5E5B8]">
                Save in Gold @ 0% Loss
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {!isCompleted ? (
            <>
              {/* Rate Locking Bar */}
              <div className="bg-white rounded-2xl p-3.5 border border-[#D4AF37]/40 shadow-xs flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase text-stone-500 font-bold">
                    Live 24K (999) Locked Rate
                  </div>
                  <div className="font-cinzel text-lg font-bold text-[#4A1017]">
                    ₹{rate24k.toLocaleString('en-IN')} / gm
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-[#FAF1E4] px-3 py-1.5 rounded-full text-xs font-bold text-[#8C6D23] border border-[#D4AF37]/30">
                  <Lock className="w-3.5 h-3.5" />
                  <span>
                    Valid: {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </span>
                </div>
              </div>

              {/* Amount vs Grams toggle */}
              <div className="flex rounded-xl bg-stone-200/80 p-1">
                <button
                  type="button"
                  onClick={() => setPurchaseType('amount')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    purchaseType === 'amount'
                      ? 'bg-white text-[#4A1017] shadow-sm'
                      : 'text-stone-600'
                  }`}
                >
                  Buy in Rupees (₹)
                </button>
                <button
                  type="button"
                  onClick={() => setPurchaseType('grams')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                    purchaseType === 'grams'
                      ? 'bg-white text-[#4A1017] shadow-sm'
                      : 'text-stone-600'
                  }`}
                >
                  Buy in Grams (g)
                </button>
              </div>

              {/* Dynamic Inputs */}
              {purchaseType === 'amount' ? (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Enter Investment Amount (Starting from ₹500):
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500 font-bold">
                      ₹
                    </span>
                    <input
                      type="number"
                      min={500}
                      step={100}
                      value={amount}
                      onChange={(e) => handleAmountChange(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl pl-8 pr-4 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                    />
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[1000, 5000, 10000, 25000].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleAmountChange(val)}
                        className="flex-1 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:border-[#4A1017]"
                      >
                        +₹{val.toLocaleString('en-IN')}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-stone-600 flex justify-between">
                    <span>You will receive:</span>
                    <span className="font-bold text-[#4A1017]">{grams} Grams of 24K Gold</span>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-xs font-semibold text-stone-700 block mb-1">
                    Enter Weight in Grams:
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      min={0.1}
                      step={0.1}
                      value={grams}
                      onChange={(e) => handleGramsChange(Number(e.target.value))}
                      className="w-full bg-white border border-stone-300 rounded-xl px-4 py-2.5 text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                    />
                    <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-500 text-xs font-bold">
                      Grams
                    </span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    {[0.5, 1.0, 2.0, 5.0].map((val) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => handleGramsChange(val)}
                        className="flex-1 py-1 bg-white border border-stone-200 rounded-lg text-xs font-medium text-stone-700 hover:border-[#4A1017]"
                      >
                        {val}g
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-stone-600 flex justify-between">
                    <span>Total Cost (incl. GST):</span>
                    <span className="font-bold text-[#4A1017]">₹{amount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}

              {/* Security & Redemption Promise */}
              <div className="space-y-2 bg-[#FAF1E4] p-3 rounded-2xl border border-[#D4AF37]/30 text-xs text-stone-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#B38F2C] shrink-0" />
                  <span>100% physically backed by 24K 999.9 gold stored in Brink&apos;s secured vaults.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B38F2C] shrink-0" />
                  <span>Convert to 22K physical jewellery at zero deduction across Leh, Choglamsar, Kargil & Zanskar.</span>
                </div>
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={handleBuy}
                className="w-full py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F3DE8A] to-[#D4AF37] text-[#3E1E05] font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg hover:brightness-105 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span>PROCEED TO BUY (₹{amount.toLocaleString('en-IN')})</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Success Screen */
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-cormorant text-3xl font-bold text-[#2B090F]">
                24K Gold Vault Credited!
              </h3>
              <p className="text-xs text-stone-600 max-w-sm mx-auto">
                Successfully acquired <strong>{grams}g</strong> of 24K Pure Gold (₹{amount.toLocaleString('en-IN')}). Your digital bullion certificate has been issued with ID: <strong>NFJ-24K-{Math.floor(Math.random()*90000+10000)}</strong>.
              </p>
              <button
                type="button"
                onClick={() => {
                  setIsCompleted(false);
                  onClose();
                }}
                className="px-6 py-2.5 bg-[#4A1017] text-white text-xs font-bold rounded-xl shadow"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
