import React from 'react';
import {
  MapPin,
  Phone,
  Clock,
  Sparkles,
  ShieldCheck,
  Calculator,
  UserCheck,
  ExternalLink,
} from 'lucide-react';
import { SHOWROOMS_DATA } from '../data/jewelleryData';

interface Props {
  onOpenDeployGuide?: () => void;
  onOpenSavingsScheme: () => void;
  onOpenDigitalGold: () => void;
  onScrollToShowrooms: (view?: 'showroom' | 'map', showroomId?: string) => void;
  onOpenAdmin?: () => void;
  onOpenEMI?: () => void;
  onOpenRental?: () => void;
}

export const Footer: React.FC<Props> = ({
  onOpenSavingsScheme,
  onOpenDigitalGold,
  onScrollToShowrooms,
  onOpenAdmin,
  onOpenEMI,
  onOpenRental,
}) => {
  return (
    <footer className="relative bg-[#1A0609] text-[#FAF7F2] border-t-2 border-[#D4AF37]/50 pt-12 pb-8 overflow-hidden">
      {/* Animated Top Golden Shimmer Line */}
      <div className="absolute top-0 left-0 right-0 h-[2px] animate-shimmer-gold" />

      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-[#4A1017]/30 rounded-full blur-3xl pointer-events-none animate-pulse-glow" />

      <div className="relative max-w-7xl mx-auto px-4 z-10">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Crest Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-12 h-12 rounded-full bg-gradient-to-br from-[#4A1017] to-[#140507] border-2 border-[#D4AF37] flex items-center justify-center text-[#F5E5B8] font-playfair font-bold text-sm shadow-md animate-float-gentle">
                NFJ
                <Sparkles className="w-3 h-3 text-[#F3DE8A] absolute -top-1 -right-1" />
              </div>
              <div>
                <h3 className="font-playfair text-lg font-bold tracking-wider text-[#F5E5B8] uppercase">
                  NEW FRIENDS JEWELLERS
                </h3>
                <p className="text-[10px] tracking-[0.2em] text-[#D4AF37] uppercase">
                  HERITAGE OF LEH, LADAKH
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              The premier destination for certified BIS 916 hallmarked bridal jewellery, 24K pure gold bullion, natural solitaires, and wedding jewellery rentals across 4 flagship boutiques in Ladakh.
            </p>

            {/* Certifications row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-[10px] bg-[#4A1017]/90 border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[#F5E5B8] font-bold flex items-center gap-1 shadow-xs">
                <ShieldCheck className="w-3 h-3 text-[#F3DE8A]" />
                <span>BIS 916 CERTIFIED</span>
              </span>
              <span className="text-[10px] bg-[#4A1017]/90 border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[#F5E5B8] font-bold">
                0% NO-COST EMI
              </span>
              <span className="text-[10px] bg-[#4A1017]/90 border border-[#D4AF37]/50 px-2.5 py-1 rounded-full text-[#F5E5B8] font-bold">
                WEDDING RENTALS
              </span>
            </div>

            {/* Direct Helpline & Contact */}
            <div className="pt-2">
              <span className="text-[10px] text-[#F3DE8A] uppercase tracking-wider font-semibold block">
                Store Helpline & Concierge:
              </span>
              <a
                href="tel:+919928541909"
                className="inline-flex items-center gap-2 mt-1 text-xs font-semibold text-stone-300 hover:text-[#F3DE8A] transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
                <span>+91-9928541909 (Daily 9:30 AM – 8:30 PM)</span>
              </a>
            </div>
          </div>

          {/* Customer Services */}
          <div className="space-y-3 text-xs">
            <h4 className="font-playfair font-bold text-[#F5E5B8] text-sm uppercase tracking-wider">
              Exclusive Services
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button
                  type="button"
                  onClick={onOpenRental}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <Clock className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>Bridal Jewellery Rental</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenEMI}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5"
                >
                  <Calculator className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>0% EMI Calculator</span>
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenSavingsScheme}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  Swarn Bandhan Gold Scheme
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenDigitalGold}
                  className="hover:text-[#D4AF37] transition-colors"
                >
                  24K Digital Gold Bullion
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAdmin}
                  className="hover:text-[#D4AF37] transition-colors flex items-center gap-1.5 text-[#F3DE8A] font-bold"
                >
                  <UserCheck className="w-3.5 h-3.5" />
                  <span>Store Manager & Admin</span>
                </button>
              </li>
            </ul>
          </div>

          {/* 4 Boutiques Directory */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => onScrollToShowrooms('showroom')}
                className="font-playfair font-bold text-[#F5E5B8] text-sm uppercase tracking-wider hover:text-[#D4AF37] transition-colors text-left"
              >
                Our 4 Ladakh Showrooms
              </button>
              <button
                type="button"
                onClick={() => onScrollToShowrooms('map')}
                className="text-[11px] text-[#D4AF37] hover:underline font-semibold flex items-center gap-1"
              >
                <span>View on Map →</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-stone-300">
              {SHOWROOMS_DATA.map((s) => (
                <div
                  key={s.id}
                  onClick={() => onScrollToShowrooms('showroom', s.id)}
                  className="p-2.5 rounded-xl bg-black/40 border border-stone-800 hover:border-[#D4AF37]/50 cursor-pointer transition-all group"
                >
                  <div className="font-bold text-white text-xs flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#D4AF37]" />
                      <span>{s.city}</span>
                    </div>
                    {s.googleMapsUrl && (
                      <a
                        href={s.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-[10px] text-[#D4AF37] hover:underline flex items-center gap-0.5"
                        title="Open in Google Maps"
                      >
                        <span>Map</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                  </div>
                  <p className="text-[10px] text-stone-400 truncate mt-0.5">{s.address}</p>
                  <div className="flex items-center justify-between mt-1 text-[10px]">
                    <a
                      href="tel:+919928541909"
                      className="text-[#D4AF37] hover:text-[#F3DE8A] hover:underline font-bold flex items-center gap-1"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>{s.phone}</span>
                    </a>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onScrollToShowrooms('map', s.id);
                      }}
                      className="text-stone-400 hover:text-[#F3DE8A] underline"
                    >
                      Locate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar with Contact Helpline & BIS Notice */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-3">
          <p>© {new Date().getFullYear()} New Friends Jewellers, Ladakh. All Rights Reserved.</p>

          <div className="flex items-center gap-4">
            <a
              href="tel:+919928541909"
              className="text-[#F5E5B8] hover:text-[#D4AF37] flex items-center gap-1.5 font-bold"
            >
              <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>Helpline: +91-9928541909</span>
            </a>
            <span>•</span>
            <span className="text-stone-500">BIS Registration: HM/C-781920</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
