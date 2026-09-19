import React from 'react';
import { ShieldCheck, Award, Gem, Sparkles, CheckCircle2, HeartHandshake } from 'lucide-react';

export const HeritageLegacySection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-gradient-to-b from-[#FAF7F2] to-[#F5ECE0] border-b border-[#E8DFC8] w-full max-w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 items-center">
          {/* Visual Showcase */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4AF37]/50 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=1000&q=80"
                alt="Master Goldsmith at New Friends Jewellers"
                className="w-full h-[300px] sm:h-[450px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Floating Quote Badge */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6 text-white">
                <span className="text-[10px] font-bold tracking-widest text-[#F3DE8A] uppercase font-cinzel">
                  THE NEW FRIENDS JEWELLERS PROMISE
                </span>
                <p className="font-cormorant text-xl sm:text-2xl font-bold mt-1 leading-snug">
                  &ldquo;Every grain of gold tested by Karatmeter, every diamond certified by world gemological laboratories.&rdquo;
                </p>
                <div className="text-[11px] sm:text-xs text-stone-300 mt-1.5 sm:mt-2">
                  Serving royal weddings & patron families across Ladakh for decades.
                </div>
              </div>
            </div>

            {/* Floating Hallmark Cert Badge */}
            <div className="absolute top-3 right-3 sm:-top-4 sm:-right-4 bg-white rounded-2xl p-2.5 sm:p-3.5 border border-[#D4AF37] shadow-xl flex items-center gap-2.5 sm:gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#FAF1E4] flex items-center justify-center text-[#B38F2C]">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <div>
                <div className="text-[11px] sm:text-xs font-bold text-[#4A1017]">BIS 916 GUARANTEE</div>
                <div className="text-[9px] sm:text-[10px] text-stone-500">Zero tolerance for impurity</div>
              </div>
            </div>
          </div>

          {/* Heritage Copy & Pillars */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#B38F2C] uppercase font-cinzel mb-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>CENTURY OF TRUST & ETHICAL GOLDSMITHING</span>
              </div>
              <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold text-[#2B090F] tracking-tight leading-tight">
                Himalayan Grandeur Meets Precision 3D Innovation
              </h2>
              <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
                Born at the foot of the snow-clad Himalayas, New Friends Jewellers has woven the soul of Leh Ladakh into timeless heirlooms. Whether crafting ancient repoussé bridal ornaments or engineering interactive real-time 3D diamond rings for the modern connoisseur, our legacy remains unwavering.
              </p>
            </div>

            {/* 4 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-[#4A1017] font-bold text-xs">
                  <Award className="w-4 h-4 text-[#B38F2C]" />
                  <span>100% BIS Hallmarked</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Every jewel carries the official Government of India BIS triangular stamp and unique 6-digit HUID code.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-[#4A1017] font-bold text-xs">
                  <Gem className="w-4 h-4 text-[#B38F2C]" />
                  <span>Natural Solitaires Only</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  IGI & GIA certified conflict-free diamonds with cut, clarity, and brilliance tested under high magnification.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-[#4A1017] font-bold text-xs">
                  <HeartHandshake className="w-4 h-4 text-[#B38F2C]" />
                  <span>Lifetime 100% Buyback</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Exchange or upgrade gold and solitaires at prevailing market rates with zero hidden deductions forever.
                </p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-stone-200/90 shadow-xs space-y-1">
                <div className="flex items-center gap-2 text-[#4A1017] font-bold text-xs">
                  <CheckCircle2 className="w-4 h-4 text-[#B38F2C]" />
                  <span>4 Boutique Support</span>
                </div>
                <p className="text-[11px] text-stone-500 leading-relaxed">
                  Complimentary ultrasonic cleaning, size adjustment, and inspection across all our 4 Ladakh flagships.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
