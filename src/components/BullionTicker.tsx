import React, { useState } from 'react';
import { TrendingUp, Coins, Calculator, ShieldCheck, X, Sparkles, RefreshCw } from 'lucide-react';
import { INITIAL_BULLION_RATES } from '../data/jewelleryData';
import { BullionRate } from '../types';

interface Props {
  onOpenDigitalGold: () => void;
}

export const BullionTicker: React.FC<Props> = ({ onOpenDigitalGold }) => {
  const [rates, setRates] = useState<BullionRate[]>(INITIAL_BULLION_RATES);
  const [showCalculator, setShowCalculator] = useState(false);
  const [calcGrams, setCalcGrams] = useState(10);
  const [calcPurity, setCalcPurity] = useState<'24K' | '22K' | '18K' | 'Silver'>('22K');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const simulateMarketTick = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setRates((prev) =>
        prev.map((r) => {
          const delta = (Math.random() - 0.45) * 8;
          const newRate = +(r.ratePerGram + delta).toFixed(2);
          return {
            ...r,
            ratePerGram: newRate,
            changePercent: +(r.changePercent + (delta > 0 ? 0.05 : -0.04)).toFixed(2),
            isPositive: delta >= 0,
          };
        })
      );
      setIsRefreshing(false);
    }, 600);
  };

  const getRateForPurity = () => {
    if (calcPurity === '24K') return rates[0].ratePerGram;
    if (calcPurity === '22K') return rates[1].ratePerGram;
    if (calcPurity === '18K') return rates[2].ratePerGram;
    return rates[3].ratePerGram;
  };

  const currentSelectedRate = getRateForPurity();
  const estimatedValue = currentSelectedRate * calcGrams;
  const gst = estimatedValue * 0.03; // 3% GST standard in India for bullion/gold
  const totalPayable = estimatedValue + gst;

  return (
    <>
      {/* Top Banner Ticker */}
      <div className="w-full bg-[#1F080C] text-[#F5E5B8] text-xs py-2 px-3 border-b border-[#5E121E] shadow-sm relative z-30 overflow-hidden">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Left badge */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center gap-1.5 bg-[#4A1017] px-2.5 py-1 rounded-full border border-[#D4AF37]/30">
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
              <span className="font-bold tracking-wider text-[11px] text-[#F3DE8A] uppercase">
                LIVE BULLION RATES
              </span>
            </div>
            <button
              onClick={simulateMarketTick}
              title="Refresh Live MCX / Bullion Market Rates"
              className="text-stone-400 hover:text-[#D4AF37] transition-colors p-1"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#D4AF37]' : ''}`} />
            </button>
          </div>

          {/* Infinity Scroll Rates Marquee */}
          <div className="flex-1 overflow-hidden relative group min-w-0">
            {/* Subtle edge fade gradients */}
            <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[#1F080C] to-transparent z-10" />
            <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#1F080C] to-transparent z-10" />

            <div className="animate-ticker-infinite flex items-center py-0.5 whitespace-nowrap cursor-default">
              {/* Duplicated items for continuous seamless loop */}
              {[...rates, ...rates].map((rate, idx) => (
                <div key={idx} className="flex items-center gap-2 shrink-0 px-5 text-[12px] font-medium">
                  <span className="text-stone-300">{rate.name}:</span>
                  <span className="font-bold text-white tracking-wide">
                    ₹{rate.ratePerGram.toLocaleString('en-IN')}{rate.name.includes('Silver') ? '/gm' : '/gm'}
                  </span>
                  <span
                    className={`flex items-center text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      rate.isPositive ? 'text-[#34D399] bg-[#064E3B]/50' : 'text-[#F87171] bg-[#7F1D1D]/50'
                    }`}
                  >
                    <TrendingUp className="w-2.5 h-2.5 mr-0.5 inline" />
                    {rate.isPositive ? '+' : ''}
                    {rate.changePercent}%
                  </span>
                  <span className="text-[#D4AF37]/40 font-bold ml-3 select-none">✦</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Action CTA */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setShowCalculator(true)}
              className="hidden lg:flex items-center gap-1 text-[11px] text-stone-300 hover:text-[#F3DE8A] transition-colors px-2 py-0.5 rounded border border-white/10 hover:border-[#D4AF37]/40"
            >
              <Calculator className="w-3 h-3 text-[#D4AF37]" />
              <span>Bullion Calc</span>
            </button>

            <button
              type="button"
              onClick={onOpenDigitalGold}
              className="bg-gradient-to-r from-[#D4AF37] via-[#F3DE8A] to-[#D4AF37] text-[#3E1E05] font-bold text-[10px] sm:text-[11px] px-2.5 sm:px-3 py-1 rounded-full shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1 shrink-0"
            >
              <Coins className="w-3 h-3 text-[#3E1E05]" />
              <span>
                Save <span className="hidden sm:inline">in Gold @ 0% Loss</span><span className="sm:hidden">Gold</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Bullion Live Calculator Modal */}
      {showCalculator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#FAF7F2] text-[#1F1615] rounded-2xl max-w-md w-full border border-[#D4AF37]/40 shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="bg-[#4A1017] text-[#FAF7F2] p-4 flex items-center justify-between border-b border-[#D4AF37]/30">
              <div className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-[#F3DE8A]" />
                <h3 className="font-cinzel font-bold text-base tracking-wide text-[#F5E5B8]">
                  Live Bullion Value Calculator
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCalculator(false)}
                className="text-stone-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-4">
              <p className="text-xs text-stone-600 leading-relaxed">
                Calculate live gold valuation based on real-time Leh Ladakh bullion benchmarks with certified BIS 916 transparency.
              </p>

              {/* Purity selector */}
              <div>
                <label className="text-xs font-semibold text-[#4A1017] uppercase tracking-wider block mb-1.5">
                  Select Precious Metal
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {(['24K', '22K', '18K', 'Silver'] as const).map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setCalcPurity(p)}
                      className={`py-2 text-xs font-semibold rounded-xl border transition-all ${
                        calcPurity === p
                          ? 'bg-[#6B1724] text-white border-[#6B1724] shadow'
                          : 'bg-white text-stone-700 border-stone-300 hover:border-[#D4AF37]'
                      }`}
                    >
                      {p === 'Silver' ? '999 Silver' : `${p} Gold`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grams input slider */}
              <div>
                <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                  <span>Weight in Grams:</span>
                  <span className="text-[#6B1724] font-bold text-sm">{calcGrams} gm</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={100}
                  value={calcGrams}
                  onChange={(e) => setCalcGrams(Number(e.target.value))}
                  className="w-full accent-[#6B1724] h-2 bg-stone-200 rounded-lg cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                  <span>1 gm</span>
                  <span>25 gm</span>
                  <span>50 gm</span>
                  <span>100 gm</span>
                </div>
              </div>

              {/* Rate Breakdown Table */}
              <div className="bg-white rounded-xl p-3 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Current Base Rate ({calcPurity}):</span>
                  <span className="font-semibold text-stone-900">₹{currentSelectedRate.toLocaleString('en-IN')} / gm</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Net Metal Value ({calcGrams}g):</span>
                  <span className="font-semibold text-stone-900">₹{estimatedValue.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>GST (3%):</span>
                  <span className="font-semibold text-stone-900">₹{gst.toFixed(0)}</span>
                </div>
                <div className="border-t border-dashed border-stone-300 pt-2 flex justify-between text-sm font-bold text-[#6B1724]">
                  <span>Total Estimated Cost:</span>
                  <span className="text-base text-[#4A1017]">₹{Math.round(totalPayable).toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Trust Badge */}
              <div className="flex items-center gap-2 text-[11px] text-stone-600 bg-[#FAF1E4] p-2.5 rounded-lg border border-[#D4AF37]/30">
                <ShieldCheck className="w-4 h-4 text-[#B38F2C] shrink-0" />
                <span>Zero Karatmeter testing deductions guaranteed across all 4 Ladakh boutiques.</span>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => {
                    setShowCalculator(false);
                    onOpenDigitalGold();
                  }}
                  className="flex-1 py-2.5 bg-gradient-to-r from-[#D4AF37] to-[#B38F2C] text-white font-bold text-xs rounded-xl shadow hover:brightness-105 transition-all flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Lock & Buy at this Rate</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
