import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle2, X, MapPin } from 'lucide-react';
import { Showroom } from '../types';
import confetti from 'canvas-confetti';

interface Props {
  showroom: Showroom | null;
  isOpen: boolean;
  onClose: () => void;
}

export const AppointmentModal: React.FC<Props> = ({ showroom, isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('11:00 AM - 01:00 PM');
  const [service, setService] = useState('Private VIP Bridal Suite & Trousseau');
  const [confirmed, setConfirmed] = useState(false);

  if (!isOpen || !showroom) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
    setConfirmed(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-[#FAF7F2] text-[#1F1615] rounded-3xl max-w-xl w-full border border-[#D4AF37]/50 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#4A1017] text-white p-5 flex items-center justify-between border-b border-[#D4AF37]/30">
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#F3DE8A]">
              VIP BOUTIQUE RESERVATION
            </div>
            <h3 className="font-cormorant text-2xl font-bold text-[#F5E5B8]">
              Reserve Concierge Appointment
            </h3>
            <div className="text-xs text-stone-300 mt-0.5 flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#D4AF37]" />
              <span>{showroom.name} ({showroom.city})</span>
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
        <div className="p-6 overflow-y-auto space-y-4 text-xs text-stone-700">
          {!confirmed ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-stone-600 leading-relaxed">
                Enjoy personalized hospitality with complimentary Kahwa tea, one-on-one bridal stylist consultation, and private Karatmeter gold assay at our {showroom.city} flagship atelier.
              </p>

              <div>
                <label className="font-bold text-[#4A1017] block mb-1">
                  Select Desired Service:
                </label>
                <select
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                >
                  <option value="Private VIP Bridal Suite & Trousseau">
                    Private VIP Bridal Suite & Trousseau
                  </option>
                  <option value="Custom 3D Jewellery CAD Atelier">
                    Custom 3D Jewellery CAD Atelier
                  </option>
                  <option value="Instant Karatmeter Gold Testing & Valuation">
                    Instant Karatmeter Gold Testing & Valuation
                  </option>
                  <option value="Swarn Bandhan Savings Scheme Enrollment">
                    Swarn Bandhan Savings Scheme Enrollment
                  </option>
                  <option value="Certified Natural Solitaire Diamond Selection">
                    Certified Natural Solitaire Diamond Selection
                  </option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A1017] block mb-1">Preferred Date:</label>
                  <input
                    required
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A1017] block mb-1">Time Slot:</label>
                  <select
                    value={timeSlot}
                    onChange={(e) => setTimeSlot(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                  >
                    <option value="11:00 AM - 01:00 PM">Morning (11:00 AM - 01:00 PM)</option>
                    <option value="02:00 PM - 04:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                    <option value="04:30 PM - 06:30 PM">Evening High Tea (04:30 PM - 06:30 PM)</option>
                    <option value="07:00 PM - 08:00 PM">Twilight VIP (07:00 PM - 08:00 PM)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-[#4A1017] block mb-1">Your Name:</label>
                  <input
                    required
                    type="text"
                    placeholder="e.g. Stanzin Norboo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#4A1017] block mb-1">Phone Number:</label>
                  <input
                    required
                    type="tel"
                    placeholder="e.g. 9419178901"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-white border border-stone-300 rounded-xl px-3 py-2 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#4A1017]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-[#4A1017] hover:bg-[#6B1724] text-white rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-xl transition-all"
              >
                Confirm VIP Appointment
              </button>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-[#10B981]/20 text-[#10B981] rounded-full mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="font-cormorant text-3xl font-bold text-[#2B090F]">
                VIP Booking Confirmed!
              </h3>
              <p className="text-stone-600 max-w-sm mx-auto">
                Thank you, <strong>{name}</strong>. Your private appointment at <strong>{showroom.name}</strong> for <strong>{service}</strong> on <strong>{date || 'Upcoming Date'} ({timeSlot})</strong> has been scheduled.
              </p>
              <div className="text-[11px] text-[#6B1724] bg-[#FAF1E4] p-3 rounded-xl border border-[#D4AF37]/40 max-w-xs mx-auto">
                Concierge Manager {showroom.conciergeManager} has reserved your private suite.
              </div>
              <button
                type="button"
                onClick={() => {
                  setConfirmed(false);
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
