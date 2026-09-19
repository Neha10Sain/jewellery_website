import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  UserCheck,
  Phone,
  Calendar,
  Navigation,
  Sparkles,
  CheckCircle2,
  Search,
  Layers,
  Map as MapIcon,
  Store,
} from 'lucide-react';
import { SHOWROOMS_DATA } from '../data/jewelleryData';
import { Showroom } from '../types';

interface Props {
  onBookAppointment: (showroom: Showroom) => void;
}

export const FlagshipShowrooms: React.FC<Props> = ({ onBookAppointment }) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeView, setActiveView] = useState<'showroom' | 'map'>('showroom');
  const [activeShowroomId, setActiveShowroomId] = useState<string>('choglamsar');

  const filteredShowrooms = SHOWROOMS_DATA.filter((s) => {
    const matchesCity = selectedCity === 'all' || s.id === selectedCity;
    const matchesSearch =
      !searchQuery.trim() ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.city.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const activeShowroom =
    SHOWROOMS_DATA.find((s) => s.id === activeShowroomId) || SHOWROOMS_DATA[0];

  return (
    <section id="showrooms-section" className="py-16 bg-[#FAF7F2] relative border-b border-[#E8DFC8]">
      <div className="max-w-7xl mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-white px-4 py-1.5 rounded-full border border-[#D4AF37]/50 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-bold tracking-widest text-[#6B1724] uppercase font-cinzel">
              EXPERIENCE ROYAL HIMALAYAN HOSPITALITY
            </span>
          </div>

          <h2 className="font-cormorant text-4xl sm:text-5xl font-bold text-[#2B090F] tracking-tight">
            Our 4 Flagship{' '}
            <span className="text-[#B38F2C] italic">Showrooms</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            Step into our palatial jewellery boutiques in Choglamsar, Leh, Kargil, and Zanskar crafted with Himalayan warmth, private bridal suites, and transparent Karatmeter testing.
          </p>

          {/* 4 Stats Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-cinzel text-2xl font-bold text-[#4A1017]">4</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                SHOWROOMS
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-cinzel text-2xl font-bold text-[#4A1017]">100%</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                BIS 916 HALLMARK
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-cinzel text-2xl font-bold text-[#4A1017]">4.9 ★</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                GOOGLE RATING
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-cinzel text-2xl font-bold text-[#4A1017]">Free</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                KARATMETER TEST
              </div>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="max-w-2xl mx-auto mb-8 space-y-4">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search showroom by city, landmark, or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white pl-11 pr-4 py-3 rounded-full text-xs text-stone-800 border border-[#D4AF37]/40 shadow-xs focus:outline-none focus:ring-2 focus:ring-[#6B1724]/20"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedCity('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                selectedCity === 'all'
                  ? 'bg-[#4A1017] text-white shadow-sm'
                  : 'bg-white text-stone-700 border border-stone-200 hover:border-[#B38F2C]'
              }`}
            >
              All 4 Showrooms
            </button>
            {SHOWROOMS_DATA.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => {
                  setSelectedCity(s.id);
                  setActiveShowroomId(s.id);
                }}
                className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  selectedCity === s.id
                    ? 'bg-[#4A1017] text-white shadow-sm'
                    : 'bg-white text-stone-700 border border-stone-200 hover:border-[#B38F2C]'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#B38F2C]" />
                <span>{s.city}</span>
              </button>
            ))}
          </div>
        </div>

        {/* View Switcher Tabs (Showroom View vs Interactive Map) */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex p-1 rounded-2xl bg-white border border-[#D4AF37]/30 shadow-xs">
            <button
              type="button"
              onClick={() => setActiveView('showroom')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'showroom'
                  ? 'bg-[#4A1017] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Showroom View</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveView('map')}
              className={`flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold transition-all ${
                activeView === 'map'
                  ? 'bg-[#4A1017] text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <MapIcon className="w-4 h-4" />
              <span>Interactive Map</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display */}
        {activeView === 'showroom' ? (
          <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12">
              {/* Left Showroom Photo with Mountain View */}
              <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-[500px] overflow-hidden group">
                <img
                  src={activeShowroom.image}
                  alt={activeShowroom.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                {/* Floating Status Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Open Today</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20">
                  ★ {activeShowroom.rating} ({activeShowroom.reviewsCount.toLocaleString()}+)
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3DE8A]">
                    {activeShowroom.city} Valley Boutique
                  </span>
                  <div className="text-lg font-bold font-cormorant">{activeShowroom.name}</div>
                </div>
              </div>

              {/* Right Boutique Details & Services */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#B38F2C] font-cinzel">
                      FLAGSHIP SHOWROOM
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      {activeShowroom.city}, Ladakh
                    </span>
                  </div>

                  <h3 className="font-cormorant text-2xl sm:text-3xl font-bold text-[#2B090F]">
                    {activeShowroom.name}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-500 italic mt-1 font-serif">
                    &ldquo;{activeShowroom.tagline}&rdquo;
                  </p>

                  {/* Metadata Rows */}
                  <div className="mt-6 space-y-3.5 text-xs text-stone-700">
                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FAF1E4] flex items-center justify-center shrink-0 text-[#B38F2C] mt-0.5">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                          ADDRESS
                        </div>
                        <div className="text-stone-600 mt-0.5">{activeShowroom.address}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FAF1E4] flex items-center justify-center shrink-0 text-[#B38F2C] mt-0.5">
                        <Clock className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                          SHOWROOM TIMINGS
                        </div>
                        <div className="text-stone-600 mt-0.5">{activeShowroom.timings}</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#FAF1E4] flex items-center justify-center shrink-0 text-[#B38F2C] mt-0.5">
                        <UserCheck className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider">
                          STORE CONCIERGE MANAGER
                        </div>
                        <div className="text-stone-600 mt-0.5">
                          {activeShowroom.conciergeManager}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Showroom Privileges & Services */}
                  <div className="mt-6 pt-5 border-t border-stone-200">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-[#4A1017] mb-2.5">
                      SHOWROOM PRIVILEGES & SERVICES:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeShowroom.privileges.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 text-[11px] text-stone-700 bg-[#FAF7F2] p-2 rounded-xl border border-stone-200/70"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span className="font-medium">{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-stone-200">
                  <button
                    type="button"
                    onClick={() => onBookAppointment(activeShowroom)}
                    className="flex-1 py-3 px-4 bg-[#4A1017] hover:bg-[#6B1724] text-white rounded-xl text-xs font-bold tracking-wider uppercase shadow-md flex items-center justify-center gap-2 transition-all active:scale-95"
                  >
                    <Calendar className="w-4 h-4 text-[#F3DE8A]" />
                    <span>BOOK PRIVATE VIP APPOINTMENT</span>
                  </button>

                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(activeShowroom.address)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-3 px-4 bg-white hover:bg-stone-50 text-[#4A1017] border border-[#4A1017]/30 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Navigation className="w-4 h-4 text-[#B38F2C]" />
                    <span>Directions</span>
                  </a>

                  <a
                    href={`tel:${activeShowroom.phone}`}
                    className="py-3 px-4 bg-[#FAF1E4] hover:bg-[#F5E5B8] text-[#8C6D23] border border-[#D4AF37]/40 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Phone className="w-4 h-4 text-[#8C6D23]" />
                    <span>Call Concierge</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Ladakh Map View */
          <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-xl p-6 relative overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-cormorant text-2xl font-bold text-[#2B090F]">
                  Ladakh Boutique Coordinates Map
                </h3>
                <p className="text-xs text-stone-500">
                  Click any flagship marker to view boutique details & VIP bridal concierge services.
                </p>
              </div>
              <span className="text-xs bg-[#FAF1E4] text-[#6B1724] font-bold px-3 py-1 rounded-full border border-[#D4AF37]/30">
                Union Territory of Ladakh
              </span>
            </div>

            {/* Stylized Visual Map Canvas */}
            <div className="relative w-full h-[450px] bg-gradient-to-b from-[#EAEFE9] via-[#F4EDE2] to-[#DFD5C6] rounded-2xl border border-stone-300 overflow-hidden">
              {/* Mountain Silhouettes Overlay */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#4A1017_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Himalayan Mountain Graphics */}
              <div className="absolute top-6 left-12 text-[11px] font-bold text-stone-600 tracking-widest uppercase">
                ▲ Karakoram Range
              </div>
              <div className="absolute top-10 right-16 text-[11px] font-bold text-stone-600 tracking-widest uppercase">
                ▲ Ladakh Range
              </div>
              <div className="absolute bottom-8 left-20 text-[11px] font-bold text-stone-600 tracking-widest uppercase">
                ▲ Zanskar Range
              </div>

              {/* River Indus representation */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
                <path
                  d="M 50 300 Q 250 200 450 240 T 800 180 T 1100 120"
                  fill="transparent"
                  stroke="#4A90E2"
                  strokeWidth="6"
                  strokeDasharray="4 2"
                />
              </svg>

              {/* Showroom Interactive Map Pins */}
              {SHOWROOMS_DATA.map((s) => {
                const isSelected = activeShowroom.id === s.id;
                return (
                  <div
                    key={s.id}
                    onClick={() => setActiveShowroomId(s.id)}
                    style={{ left: `${s.mapCoords.x}%`, top: `${s.mapCoords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20"
                  >
                    <div
                      className={`relative flex items-center gap-2 p-2 rounded-2xl shadow-xl transition-all ${
                        isSelected
                          ? 'bg-[#4A1017] text-white scale-110 ring-4 ring-[#D4AF37]/50'
                          : 'bg-white text-[#2B090F] hover:scale-105 border border-stone-300'
                      }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-cinzel text-xs font-bold ${
                          isSelected ? 'bg-[#D4AF37] text-[#2B090F]' : 'bg-[#FAF1E4] text-[#8C6D23]'
                        }`}
                      >
                        NFJ
                      </div>
                      <div className="pr-2">
                        <div className="text-[11px] font-bold whitespace-nowrap">{s.city}</div>
                        <div className="text-[9px] opacity-80 whitespace-nowrap">4.9 ★ Rating</div>
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Active Boutique Quick Drawer */}
              <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md rounded-xl p-4 border border-[#D4AF37]/40 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-3 z-30">
                <div>
                  <div className="text-xs font-bold text-[#6B1724] uppercase font-cinzel">
                    Selected Flagship: {activeShowroom.name}
                  </div>
                  <div className="text-[11px] text-stone-600 mt-0.5">{activeShowroom.address}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActiveView('showroom')}
                    className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-lg"
                  >
                    View Boutique Interior
                  </button>
                  <button
                    type="button"
                    onClick={() => onBookAppointment(activeShowroom)}
                    className="px-4 py-2 bg-[#4A1017] text-white text-xs font-bold rounded-lg shadow hover:bg-[#6B1724]"
                  >
                    Book VIP Visit
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
