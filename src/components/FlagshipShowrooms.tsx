import React, { useState } from 'react';
import {
  MapPin,
  Clock,
  UserCheck,
  Phone,
  Calendar,
  Sparkles,
  CheckCircle2,
  Search,
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
            <span className="text-xs font-bold tracking-widest text-[#6B1724] uppercase">
              EXPERIENCE ROYAL HIMALAYAN HOSPITALITY
            </span>
          </div>

          <h2 className="font-playfair text-4xl sm:text-5xl font-bold text-[#2B090F] tracking-tight">
            Our 4 Flagship{' '}
            <span className="text-[#B38F2C] italic">Showrooms</span>
          </h2>

          <p className="mt-4 text-sm sm:text-base text-stone-600 leading-relaxed">
            Step into our palatial jewellery boutiques in Choglamsar, Leh, Kargil, and Zanskar crafted with Himalayan warmth, private bridal suites, and transparent Karatmeter testing.
          </p>

          {/* 4 Stats Cards */}
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-playfair text-2xl font-bold text-[#4A1017]">4</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                SHOWROOMS
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-playfair text-2xl font-bold text-[#4A1017]">100%</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                BIS 916 HALLMARK
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-playfair text-2xl font-bold text-[#4A1017]">4.9 ★</div>
              <div className="text-[10px] tracking-wider text-stone-500 font-bold uppercase mt-0.5">
                GOOGLE RATING
              </div>
            </div>
            <div className="bg-white rounded-2xl p-3.5 border border-stone-200/80 shadow-xs text-center">
              <div className="font-playfair text-2xl font-bold text-[#4A1017]">Free</div>
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
              onClick={() => {
                setSelectedCity('all');
                setActiveShowroomId('choglamsar');
              }}
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
                    ? 'bg-[#4A1017] text-white shadow-sm font-bold'
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
              {/* Left Showroom Photo */}
              <div className="lg:col-span-6 relative min-h-[360px] lg:min-h-[500px] overflow-hidden group">
                <img
                  src={activeShowroom.image}
                  alt={activeShowroom.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                {/* Floating Status Badges */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-semibold border border-white/20">
                    <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
                    <span>Open Today</span>
                  </div>
                </div>

                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full text-white text-xs font-bold border border-white/20">
                  ★ {activeShowroom.rating} ({activeShowroom.reviewsCount.toLocaleString()}+ reviews)
                </div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#F3DE8A]">
                    {activeShowroom.city} Flagship Boutique
                  </span>
                  <div className="text-xl font-bold font-playfair">{activeShowroom.name}</div>
                </div>
              </div>

              {/* Right Showroom Details */}
              <div className="lg:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-6">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-[#8C6D23] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{activeShowroom.tagline}</span>
                  </div>

                  <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2B090F] mt-1">
                    {activeShowroom.name}
                  </h3>

                  <div className="mt-4 space-y-2.5 text-xs text-stone-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#4A1017] shrink-0 mt-0.5" />
                      <span>{activeShowroom.address}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Clock className="w-4 h-4 text-[#4A1017] shrink-0" />
                      <span>{activeShowroom.timings}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <Phone className="w-4 h-4 text-[#4A1017] shrink-0" />
                      <span>{activeShowroom.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5">
                      <UserCheck className="w-4 h-4 text-[#4A1017] shrink-0" />
                      <span>Concierge Manager: {activeShowroom.conciergeManager}</span>
                    </div>
                  </div>

                  {/* Privileges */}
                  <div className="mt-6">
                    <div className="text-xs font-bold text-[#4A1017] uppercase tracking-wider mb-2">
                      In-Store Client Privileges:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {activeShowroom.privileges.map((p, idx) => (
                        <div
                          key={idx}
                          className="flex items-center gap-2 bg-[#FAF7F2] p-2 rounded-xl text-xs text-stone-800 border border-stone-200"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0" />
                          <span>{p}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Showroom Switcher & Book Appointment */}
                <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                    {SHOWROOMS_DATA.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setActiveShowroomId(s.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                          activeShowroomId === s.id
                            ? 'bg-[#4A1017] text-white'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {s.city}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => onBookAppointment(activeShowroom)}
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all"
                  >
                    <Calendar className="w-3.5 h-3.5 text-[#F3DE8A]" />
                    <span>Book Suite Visit</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Interactive Map View */
          <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-xl p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="font-playfair text-2xl font-bold text-[#2B090F]">
                Ladakh Territory Showroom Map
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Click on any pin to inspect the flagship boutique and concierge timings.
              </p>
            </div>

            {/* Stylized Map Container */}
            <div className="relative aspect-[16/9] max-h-[460px] w-full rounded-2xl bg-[#201B1A] overflow-hidden border-2 border-[#D4AF37]/40 shadow-inner flex items-center justify-center">
              {/* Background mountain contour texture */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:16px_16px]" />

              {/* Map pins for 4 stores */}
              {SHOWROOMS_DATA.map((s) => {
                const isActive = s.id === activeShowroomId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveShowroomId(s.id);
                      setActiveView('showroom');
                    }}
                    style={{ left: `${s.mapCoords.x}%`, top: `${s.mapCoords.y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                  >
                    <div className="relative flex flex-col items-center">
                      <div
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shadow-lg transition-all ${
                          isActive
                            ? 'bg-[#F3DE8A] text-[#4A1017] border-white scale-125'
                            : 'bg-[#4A1017] text-[#F3DE8A] border-[#D4AF37] group-hover:scale-110'
                        }`}
                      >
                        <MapPin className="w-4 h-4" />
                      </div>
                      <span className="mt-1 px-2 py-0.5 rounded-full bg-black/80 text-white text-[10px] font-bold tracking-wider backdrop-blur-xs whitespace-nowrap border border-white/20">
                        {s.city}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
