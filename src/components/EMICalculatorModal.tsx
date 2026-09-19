import React, { useState } from 'react';
import { X, Calculator, ShieldCheck, Check, CreditCard, Sparkles, ShoppingBag } from 'lucide-react';
import { JewelleryItem } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  products: JewelleryItem[];
  initialPrice?: number;
  onBuyOnEMI?: (product: JewelleryItem, emiPlan: { tenure: number; monthlyEMI: number }) => void;
}

export const EMICalculatorModal: React.FC<Props> = ({
  isOpen,
  onClose,
  products,
  initialPrice,
  onBuyOnEMI,
}) => {
  const [selectedProductId, setSelectedProductId] = useState<string>(
    products[0]?.id || ''
  );
  const [customPrice, setCustomPrice] = useState<number>(initialPrice || products[0]?.price || 250000);
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(10);
  const [selectedTenure, setSelectedTenure] = useState<number>(6);
  const [selectedBank, setSelectedBank] = useState<string>('HDFC Bank');
  const [isApprovedDemo, setIsApprovedDemo] = useState<boolean>(false);

  if (!isOpen) return null;

  const currentProduct = products.find((p) => p.id === selectedProductId) || products[0];
  const principalPrice = currentProduct ? currentProduct.price : customPrice;

  const downPaymentAmount = Math.round((principalPrice * downPaymentPercent) / 100);
  const loanAmount = principalPrice - downPaymentAmount;

  // Interest rates: 0% for 3 & 6 months (No-Cost EMI), standard rates for longer
  const annualInterestRate =
    selectedTenure <= 6 ? 0 : selectedTenure === 9 ? 8.5 : selectedTenure === 12 ? 9.5 : selectedTenure === 18 ? 10.5 : 11.5;

  const monthlyInterestRate = annualInterestRate / 12 / 100;
  let monthlyEMI = 0;
  if (annualInterestRate === 0) {
    monthlyEMI = Math.round(loanAmount / selectedTenure);
  } else {
    monthlyEMI = Math.round(
      (loanAmount * monthlyInterestRate * Math.pow(1 + monthlyInterestRate, selectedTenure)) /
        (Math.pow(1 + monthlyInterestRate, selectedTenure) - 1)
    );
  }

  const totalPayableLoan = monthlyEMI * selectedTenure;
  const totalInterest = Math.max(0, totalPayableLoan - loanAmount);
  const grandTotal = downPaymentAmount + totalPayableLoan;

  const handleApplyEMI = () => {
    setIsApprovedDemo(true);
    setTimeout(() => {
      if (onBuyOnEMI && currentProduct) {
        onBuyOnEMI(currentProduct, { tenure: selectedTenure, monthlyEMI });
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto border-2 border-[#D4AF37]/50 shadow-2xl flex flex-col relative">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#4A1017] text-[#F5E5B8] flex items-center justify-center font-bold shadow-xs">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-playfair text-xl font-bold text-[#2B090F] leading-tight">
                Jewellery EMI & Affordability Calculator
              </h2>
              <p className="text-[11px] text-stone-500">
                0% No-Cost EMI on BIS 916 Gold & Diamond Jewellery • Instant Approval
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

        {/* Modal Body */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-4 sm:p-6">
          {/* Left Column: Select Jewellery & Configure Terms */}
          <div className="lg:col-span-7 space-y-4">
            {/* Jewellery Selector */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <label className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                Select Jewellery from Website:
              </label>
              <select
                value={selectedProductId}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2.5 text-xs font-semibold text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
              >
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — ₹{p.price.toLocaleString('en-IN')} ({p.purity})
                  </option>
                ))}
              </select>

              {currentProduct && (
                <div className="flex items-center gap-3 p-2 bg-[#FAF7F2] rounded-xl border border-stone-200">
                  <img
                    src={currentProduct.image}
                    alt={currentProduct.name}
                    className="w-12 h-12 object-cover rounded-lg border border-stone-300"
                  />
                  <div>
                    <div className="font-playfair font-bold text-stone-900 text-sm">
                      {currentProduct.name}
                    </div>
                    <div className="text-[11px] text-stone-500">
                      {currentProduct.purity} • {currentProduct.weightGrams}g
                    </div>
                  </div>
                  <div className="ml-auto text-right">
                    <div className="font-playfair text-base font-bold text-[#4A1017]">
                      ₹{currentProduct.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Down Payment Slider */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                  Down Payment ({downPaymentPercent}%):
                </span>
                <span className="font-playfair font-bold text-sm text-[#4A1017]">
                  ₹{downPaymentAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={50}
                step={5}
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value))}
                className="w-full accent-[#4A1017] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-400 font-semibold">
                <span>0% (Zero Down Payment)</span>
                <span>25%</span>
                <span>50% (Max Down Payment)</span>
              </div>
            </div>

            {/* Tenure Options */}
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-2.5">
              <span className="block text-xs font-bold text-[#4A1017] uppercase tracking-wider">
                Select EMI Tenure:
              </span>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { months: 3, label: '3 Months', tag: '0% No-Cost' },
                  { months: 6, label: '6 Months', tag: '0% No-Cost' },
                  { months: 9, label: '9 Months', tag: '8.5% p.a.' },
                  { months: 12, label: '12 Months', tag: '9.5% p.a.' },
                  { months: 18, label: '18 Months', tag: '10.5% p.a.' },
                  { months: 24, label: '24 Months', tag: '11.5% p.a.' },
                ].map((t) => (
                  <button
                    key={t.months}
                    type="button"
                    onClick={() => setSelectedTenure(t.months)}
                    className={`p-2.5 rounded-xl border text-center transition-all ${
                      selectedTenure === t.months
                        ? 'bg-[#4A1017] text-white border-[#4A1017] shadow-sm font-bold'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    <div className="text-xs">{t.label}</div>
                    <div
                      className={`text-[9px] font-semibold mt-0.5 ${
                        selectedTenure === t.months ? 'text-[#F3DE8A]' : 'text-[#8C6D23]'
                      }`}
                    >
                      {t.tag}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Partner Banks */}
            <div className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs">
              <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
                Supported Partner Banks for Instant EMI:
              </div>
              <div className="flex flex-wrap gap-2">
                {['HDFC Bank', 'ICICI Bank', 'SBI Card', 'Bajaj Finserv', 'IDFC FIRST Bank', 'Axis Bank'].map((b) => (
                  <button
                    key={b}
                    type="button"
                    onClick={() => setSelectedBank(b)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold border transition-all ${
                      selectedBank === b
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-stone-50 text-stone-600 border-stone-200 hover:border-stone-400'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Loan Summary & Action */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
            <div className="bg-white p-5 rounded-2xl border-2 border-[#D4AF37]/50 shadow-md space-y-4">
              <div className="text-center pb-3 border-b border-stone-200">
                <span className="text-[11px] uppercase font-bold text-stone-400 tracking-wider">
                  Monthly EMI Payment
                </span>
                <div className="font-playfair text-3xl font-bold text-[#4A1017] mt-1">
                  ₹{monthlyEMI.toLocaleString('en-IN')}
                  <span className="text-xs font-normal text-stone-500"> / month</span>
                </div>
                {selectedTenure <= 6 && (
                  <span className="inline-block mt-1 bg-[#FAF1E4] text-[#8C6D23] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
                    ✨ 0% NO-COST EMI APPLIED
                  </span>
                )}
              </div>

              {/* Financial Breakdown Table */}
              <div className="space-y-2.5 text-xs text-stone-700">
                <div className="flex justify-between">
                  <span className="text-stone-500">Retail Price:</span>
                  <span className="font-semibold">₹{principalPrice.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Down Payment ({downPaymentPercent}%):</span>
                  <span className="font-semibold text-[#4A1017]">
                    - ₹{downPaymentAmount.toLocaleString('en-IN')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Loan Principal:</span>
                  <span className="font-semibold">₹{loanAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Tenure:</span>
                  <span className="font-semibold">{selectedTenure} Months</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Interest Rate:</span>
                  <span className="font-semibold text-[#10B981]">
                    {annualInterestRate === 0 ? '0% (No Interest)' : `${annualInterestRate}% p.a.`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Total Interest:</span>
                  <span className="font-semibold">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Processing Fee:</span>
                  <span className="font-semibold text-[#10B981]">₹0 (Waived Off)</span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-900 text-sm">
                  <span>Total Payable:</span>
                  <span className="font-playfair text-[#4A1017]">
                    ₹{grandTotal.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Features */}
              <div className="pt-2 text-[11px] text-stone-500 space-y-1">
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <Check className="w-3.5 h-3.5" />
                  <span>Zero documentation for HDFC / ICICI card holders</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#10B981]">
                  <Check className="w-3.5 h-3.5" />
                  <span>BIS 916 Hallmark certificate delivered with order</span>
                </div>
              </div>
            </div>

            {/* Application Action Button */}
            <div className="pt-2">
              {isApprovedDemo ? (
                <div className="p-4 bg-[#10B981]/10 border border-[#10B981] rounded-2xl text-center space-y-1 animate-in zoom-in-95">
                  <div className="flex items-center justify-center gap-2 text-[#10B981] font-bold text-sm">
                    <Check className="w-4 h-4" />
                    <span>Instant EMI Approved for {selectedBank}!</span>
                  </div>
                  <p className="text-[11px] text-stone-600">
                    Your monthly payment is configured to ₹{monthlyEMI.toLocaleString('en-IN')}/mo.
                  </p>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={handleApplyEMI}
                  className="w-full py-3.5 bg-[#4A1017] hover:bg-[#681822] text-white rounded-2xl text-xs font-bold uppercase tracking-wider shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                >
                  <CreditCard className="w-4 h-4 text-[#F3DE8A]" />
                  <span>Apply & Buy on EMI (₹{monthlyEMI.toLocaleString('en-IN')}/mo)</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
