import React, { useState, useEffect } from 'react';
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
  ExternalLink,
  Navigation,
} from 'lucide-react';
import { SHOWROOMS_DATA } from '../data/jewelleryData';
import { Showroom } from '../types';

interface Props {
  onBookAppointment: (showroom: Showroom) => void;
  activeView?: 'showroom' | 'map';
  onViewChange?: (view: 'showroom' | 'map') => void;
  activeShowroomId?: string;
  onSelectShowroomId?: (id: string) => void;
}

export const FlagshipShowrooms: React.FC<Props> = ({
  onBookAppointment,
  activeView: propActiveView,
  onViewChange,
  activeShowroomId: propActiveShowroomId,
  onSelectShowroomId,
}) => {
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [internalView, setInternalView] = useState<'showroom' | 'map'>('showroom');
  const [internalShowroomId, setInternalShowroomId] = useState<string>('choglamsar');

  const activeView = propActiveView !== undefined ? propActiveView : internalView;
  const setActiveView = (view: 'showroom' | 'map') => {
    setInternalView(view);
    if (onViewChange) onViewChange(view);
  };

  const activeShowroomId =
    propActiveShowroomId !== undefined ? propActiveShowroomId : internalShowroomId;
  const setActiveShowroomId = (id: string) => {
    setInternalShowroomId(id);
    if (onSelectShowroomId) onSelectShowroomId(id);
  };

  // If external activeShowroomId changes, ensure city filter stays compatible or resets to all
  useEffect(() => {
    if (propActiveShowroomId) {
      setInternalShowroomId(propActiveShowroomId);
    }
  }, [propActiveShowroomId]);

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
                  referrerPolicy="no-referrer"
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
                      <a
                        href={`tel:${activeShowroom.phone}`}
                        className="text-[#4A1017] font-bold hover:underline"
                        title="Call Store Concierge"
                      >
                        {activeShowroom.phone}
                      </a>
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
                  {/* 4 Store Photos Mini-Thumbnails */}
                  <div className="mt-5 space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-stone-500 uppercase tracking-wider">
                      <span>Explore Our 4 Store Boutique Interiors:</span>
                      <span className="text-[#8C6D23] font-semibold">Click to preview</span>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {SHOWROOMS_DATA.map((s) => {
                        const isSel = activeShowroomId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => setActiveShowroomId(s.id)}
                            className={`relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all group/thumb text-left ${
                              isSel
                                ? 'border-[#D4AF37] ring-2 ring-[#D4AF37]/40 shadow-md'
                                : 'border-stone-200 opacity-80 hover:opacity-100 hover:border-stone-400'
                            }`}
                          >
                            <img
                              src={s.image}
                              alt={s.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover/thumb:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-1.5">
                              <span
                                className={`text-[10px] font-bold truncate ${
                                  isSel ? 'text-[#F3DE8A]' : 'text-white'
                                }`}
                              >
                                {s.city}
                              </span>
                            </div>
                          </button>
                        );
                      })}
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
          /* Interactive Google Maps Store Locator View for all 4 stores */
          <div className="bg-white rounded-3xl border border-[#D4AF37]/30 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-stone-200 pb-5">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6D23] uppercase tracking-wider mb-1">
                  <Navigation className="w-3.5 h-3.5 text-[#B38F2C]" />
                  <span>Google Maps Ladakh Store Locator</span>
                </div>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#2B090F]">
                  Our 4 Flagship Showrooms on Google Maps
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  Live satellite mapping, physical addresses, directions, and concierge hotline for all 4 Ladakh boutiques.
                </p>
              </div>

              {/* External Google Maps Button */}
              {activeShowroom.googleMapsUrl && (
                <a
                  href={activeShowroom.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4A1017] text-white hover:bg-[#681822] text-xs font-bold shadow-sm transition-all shrink-0"
                >
                  <span>Open in Google Maps</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* 4 Showroom Tabs Selector */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              {SHOWROOMS_DATA.map((s) => {
                const isCurrent = s.id === activeShowroomId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setActiveShowroomId(s.id)}
                    className={`p-3.5 rounded-2xl text-left border transition-all ${
                      isCurrent
                        ? 'bg-[#4A1017] text-white border-[#D4AF37] shadow-md ring-2 ring-[#D4AF37]/30'
                        : 'bg-[#FAF7F2] text-stone-700 border-stone-200 hover:border-[#B38F2C]'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className={`text-xs font-bold ${isCurrent ? 'text-[#F5E5B8]' : 'text-[#4A1017]'}`}>
                        {s.city}
                      </span>
                      <span
                        className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                          isCurrent ? 'bg-white/20 text-white' : 'bg-stone-200/80 text-stone-600'
                        }`}
                      >
                        ★ {s.rating}
                      </span>
                    </div>
                    <p className={`text-[11px] truncate mt-1 ${isCurrent ? 'text-stone-200' : 'text-stone-500'}`}>
                      {s.tagline}
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Map & Details Split */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Google Maps Embed Iframe */}
              <div className="lg:col-span-8 rounded-2xl overflow-hidden border border-stone-300 relative bg-stone-100 min-h-[380px] sm:min-h-[460px] shadow-inner">
                {activeShowroom.googleMapsEmbedUrl ? (
                  <iframe
                    title={`Google Map - ${activeShowroom.name}`}
                    src={activeShowroom.googleMapsEmbedUrl}
                    width="100%"
                    height="100%"
                    className="w-full h-full min-h-[380px] sm:min-h-[460px] border-0"
                    loading="lazy"
                    allowFullScreen
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center p-6 text-stone-500 text-xs">
                    Map preview loading...
                  </div>
                )}

                {/* Floating Map Overlay Badge */}
                <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-md text-white px-3.5 py-1.5 rounded-full text-xs font-semibold border border-white/20 flex items-center gap-2 shadow-lg">
                  <MapPin className="w-3.5 h-3.5 text-[#F3DE8A]" />
                  <span className="font-bold">{activeShowroom.city}:</span>
                  <span className="hidden sm:inline text-stone-200 text-[11px] truncate max-w-xs">
                    {activeShowroom.address}
                  </span>
                </div>
              </div>

              {/* Showroom Details & Direction Actions */}
              <div className="lg:col-span-4 bg-[#FAF7F2] p-5 sm:p-6 rounded-2xl border border-stone-200 flex flex-col justify-between space-y-5">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#8C6D23] uppercase tracking-wider bg-white px-2.5 py-1 rounded-full border border-stone-200 mb-2">
                    <Sparkles className="w-3 h-3 text-[#B38F2C]" />
                    <span>{activeShowroom.city} Flagship Boutique</span>
                  </div>

                  <h4 className="font-playfair text-xl sm:text-2xl font-bold text-[#2B090F] leading-snug">
                    {activeShowroom.name}
                  </h4>

                  <div className="mt-4 space-y-3 text-xs text-stone-600">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="w-4 h-4 text-[#4A1017] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Physical Address:</span>
                        <p className="mt-0.5">{activeShowroom.address}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Clock className="w-4 h-4 text-[#4A1017] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Visiting Hours:</span>
                        <p className="mt-0.5">{activeShowroom.timings}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <Phone className="w-4 h-4 text-[#4A1017] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Concierge Hotline:</span>
                        <p className="mt-0.5">
                          <a
                            href={`tel:${activeShowroom.phone}`}
                            className="text-[#4A1017] font-bold hover:underline"
                          >
                            {activeShowroom.phone}
                          </a>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <UserCheck className="w-4 h-4 text-[#4A1017] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-stone-800">Store Manager:</span>
                        <p className="mt-0.5">{activeShowroom.conciergeManager}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-2 pt-3 border-t border-stone-200">
                  {activeShowroom.googleMapsUrl && (
                    <a
                      href={activeShowroom.googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-2.5 px-4 bg-[#4A1017] hover:bg-[#681822] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all"
                    >
                      <Navigation className="w-3.5 h-3.5 text-[#F3DE8A]" />
                      <span>Get Directions on Google Maps ↗</span>
                    </a>
                  )}

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => onBookAppointment(activeShowroom)}
                      className="py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Calendar className="w-3 h-3 text-[#B38F2C]" />
                      <span>Book Visit</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveView('showroom')}
                      className="py-2 px-3 bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 rounded-xl text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <Store className="w-3 h-3 text-[#4A1017]" />
                      <span>View Photos</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* 4 Flagship Boutiques Summary Cards */}
            <div className="pt-4 border-t border-stone-200">
              <div className="text-xs font-bold text-[#4A1017] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5" />
                <span>All 4 Ladakh Flagship Boutiques at a Glance</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {SHOWROOMS_DATA.map((s) => (
                  <div
                    key={s.id}
                    className={`p-3.5 rounded-2xl border transition-all ${
                      s.id === activeShowroomId
                        ? 'bg-[#FAF1E4] border-[#D4AF37] shadow-sm'
                        : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs text-[#2B090F]">{s.city}</span>
                      <span className="text-[10px] text-emerald-600 font-semibold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        <span>Open Today</span>
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-600 mt-1 line-clamp-2">{s.address}</p>
                    <a
                      href={`tel:${s.phone}`}
                      className="text-[11px] text-[#8C6D23] hover:text-[#4A1017] font-semibold mt-1.5 inline-flex items-center gap-1 hover:underline"
                      title={`Call ${s.city} Boutique`}
                    >
                      <Phone className="w-3 h-3 text-[#B38F2C]" />
                      <span>{s.phone}</span>
                    </a>
                    <div className="mt-2.5 pt-2 border-t border-stone-100 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setActiveShowroomId(s.id)}
                        className="text-[11px] text-[#4A1017] font-bold hover:underline"
                      >
                        Select on Map
                      </button>
                      {s.googleMapsUrl && (
                        <a
                          href={s.googleMapsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[11px] text-[#B38F2C] hover:underline flex items-center gap-0.5"
                        >
                          <span>Directions ↗</span>
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
