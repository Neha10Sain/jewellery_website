import React from 'react';
import { MapPin, Phone, Mail, Clock, ShieldCheck, Heart, FileCode2, ExternalLink } from 'lucide-react';
import { SHOWROOMS_DATA } from '../data/jewelleryData';

interface Props {
  onOpenDeployGuide: () => void;
  onOpenSavingsScheme: () => void;
  onOpenDigitalGold: () => void;
  onScrollToShowrooms: () => void;
}

export const Footer: React.FC<Props> = ({
  onOpenDeployGuide,
  onOpenSavingsScheme,
  onOpenDigitalGold,
  onScrollToShowrooms,
}) => {
  return (
    <footer className="bg-[#1F080C] text-[#FAF7F2] border-t-2 border-[#D4AF37]/50 pt-14 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-stone-800">
          {/* Brand & Crest Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#4A1017] to-[#1F080C] border-2 border-[#D4AF37] flex items-center justify-center text-[#F5E5B8] font-cinzel font-black text-sm shadow-md">
                NFJ
              </div>
              <div>
                <h3 className="font-cinzel text-lg font-black tracking-widest text-[#F5E5B8] uppercase">
                  NEW FRIENDS JEWELLERS
                </h3>
                <p className="text-[10px] tracking-[0.24em] text-[#D4AF37] uppercase">
                  HERITAGE OF LEH, LADAKH
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed max-w-sm">
              The premier destination for certified BIS 916 hallmarked bridal jewellery, 24K pure gold bullion, natural solitaires, and bespoke 3D CAD creations across 4 flagship boutiques in the Union Territory of Ladakh.
            </p>

            {/* Certifications row */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-[10px] bg-[#4A1017] border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[#F5E5B8] font-bold">
                BIS 916 CERTIFIED
              </span>
              <span className="text-[10px] bg-[#4A1017] border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[#F5E5B8] font-bold">
                IGI & GIA SOLITAIRES
              </span>
              <span className="text-[10px] bg-[#4A1017] border border-[#D4AF37]/40 px-2.5 py-1 rounded text-[#F5E5B8] font-bold">
                100% ETHICAL SOURCING
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 text-xs">
            <h4 className="font-cinzel font-bold text-[#F5E5B8] text-sm uppercase tracking-wider">
              Bespoke Services
            </h4>
            <ul className="space-y-2 text-stone-300">
              <li>
                <button onClick={onOpenSavingsScheme} className="hover:text-[#D4AF37] transition-colors">
                  Swarn Bandhan Gold Scheme
                </button>
              </li>
              <li>
                <button onClick={onOpenDigitalGold} className="hover:text-[#D4AF37] transition-colors">
                  Save in 24K Digital Gold
                </button>
              </li>
              <li>
                <button onClick={onScrollToShowrooms} className="hover:text-[#D4AF37] transition-colors">
                  Private Bridal Suite Booking
                </button>
              </li>
              <li>
                <span className="text-stone-400">Instant Karatmeter Assay</span>
              </li>
              <li>
                <span className="text-stone-400">Lifetime Gold Exchange & Buyback</span>
              </li>
            </ul>
          </div>

          {/* 4 Boutiques Directory */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <div className="flex items-center justify-between">
              <h4 className="font-cinzel font-bold text-[#F5E5B8] text-sm uppercase tracking-wider">
                Our 4 Ladakh Showrooms
              </h4>
              <button
                type="button"
                onClick={onScrollToShowrooms}
                className="text-[11px] text-[#D4AF37] hover:underline"
              >
                View on Map →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              {SHOWROOMS_DATA.map((s) => (
                <div
                  key={s.id}
                  className="bg-[#2D0D13] p-2.5 rounded-xl border border-[#5E121E] text-[11px] space-y-1"
                >
                  <div className="font-bold text-[#F5E5B8] flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-[#D4AF37] shrink-0" />
                    <span className="truncate">{s.city} Flagship</span>
                  </div>
                  <div className="text-stone-400 truncate">{s.address}</div>
                  <div className="text-stone-400 font-mono text-[10px]">{s.phone}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Client Demo & Vercel Free Hosting Callout */}
        <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-stone-800 text-xs text-stone-300">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] animate-ping" />
            <span className="font-semibold text-white">
              Ready for Evening Client Showcase Demo
            </span>
            <span className="text-stone-400 hidden md:inline">
              • High-performance Three.js 3D WebGL • Real-time Bullion Engine
            </span>
          </div>

          <button
            type="button"
            onClick={onOpenDeployGuide}
            className="flex items-center gap-2 bg-black hover:bg-stone-900 text-white px-4 py-2 rounded-xl text-xs font-semibold border border-stone-700 shadow-md hover:border-[#34D399] transition-all"
          >
            <FileCode2 className="w-4 h-4 text-[#34D399]" />
            <span>Vercel Free Hosting Files & Instructions</span>
            <ExternalLink className="w-3 h-3 text-stone-400" />
          </button>
        </div>

        {/* Bottom Legal & Credits */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-400">
          <div>
            © {new Date().getFullYear()} New Friends Jewellers. All Rights Reserved. Leh Ladakh, India.
          </div>
          <div className="flex items-center gap-4">
            <span className="hover:text-stone-300 cursor-pointer">Privacy Policy</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">Terms of Service</span>
            <span>•</span>
            <span className="hover:text-stone-300 cursor-pointer">BIS 916 Compliance</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
