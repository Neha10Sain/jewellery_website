import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  Coins,
  Gem,
  Crown,
  ChevronDown,
  RotateCcw,
  ExternalLink,
  Bot,
  HelpCircle
} from 'lucide-react';
import { Showroom } from '../types';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  structuredData?: {
    type: 'timings' | 'contact' | 'rates' | 'services';
    showrooms?: Showroom[] | any[];
    rates?: any;
    services?: string[];
  };
}

interface ConciergeChatbotProps {
  onOpenAppointment?: (showroom?: Showroom) => void;
  onOpenShowrooms?: () => void;
  onOpenDigitalGold?: () => void;
}

const QUICK_PROMPTS = [
  { label: '🕒 Store Timings', query: 'What are the showroom timings in Leh and Ladakh?' },
  { label: '📍 Addresses & Phone', query: 'Give me showroom addresses and contact phone numbers' },
  { label: '🪙 Gold & Silver Rates', query: 'What are today live gold, silver and platinum rates?' },
  { label: '💎 Gemstone & Diamonds', query: 'What are the prices for certified diamonds and gemstones?' },
  { label: '👑 Bridal Rental', query: 'Tell me about bridal jewellery on rent and 0% EMI' },
];

const STORE_BACKEND_PHONE_HOTLINE = '+919928541909';
const STORE_DISPLAY_PHONE = '+91-9928541909';

export const ConciergeChatbot: React.FC<ConciergeChatbotProps> = ({
  onOpenAppointment,
  onOpenShowrooms,
  onOpenDigitalGold,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [unreadPrompt, setUnreadPrompt] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-1',
      sender: 'bot',
      text: `Namaste & Welcome to **New Friends Jewellers**! ✨\n\nI am your 24/7 Royal Concierge. How can I assist you today? You can ask me for **showroom timings**, **store addresses & phone numbers**, **live gold/silver/platinum rates**, or call our direct helpline at **+91-9928541909**.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
      setUnreadPrompt(false);
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen, messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsLoading(true);

    try {
      // Build conversation history for context
      const history = messages.slice(-5).map((m) => ({
        role: m.sender === 'user' ? 'user' : 'model',
        content: m.text,
      }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, history }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: data.reply || 'Thank you for inquiring with New Friends Jewellers.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: data.structuredData,
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      console.warn('Backend chat fallback triggered:', error);
      // Instant client-side intelligent fallback
      const fallbackReply = generateClientFallback(query);
      const botMsg: Message = {
        id: `bot-fallback-${Date.now()}`,
        sender: 'bot',
        text: fallbackReply.text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        structuredData: fallbackReply.structuredData,
      };
      setMessages((prev) => [...prev, botMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // Client-side fallback rule engine
  const generateClientFallback = (query: string): { text: string; structuredData?: any } => {
    const q = query.toLowerCase();

    if (q.includes('time') || q.includes('timing') || q.includes('hour') || q.includes('open') || q.includes('close')) {
      return {
        text: `✨ **New Friends Jewellers Showroom Timings**:\n\n• **Leh Main Bazaar**: Daily 10:00 AM – 8:00 PM\n• **Choglamsar Flagship**: Daily 10:00 AM – 8:00 PM\n• **Kargil Market**: Mon – Sat 10:00 AM – 7:30 PM (Sun Closed)\n• **Padum, Zanskar**: Daily 10:30 AM – 6:30 PM\n\nAll locations feature private bridal consultation suites and on-spot Karatmeter purity checks.`,
        structuredData: {
          type: 'timings',
        },
      };
    }

    if (q.includes('address') || q.includes('phone') || q.includes('contact') || q.includes('call') || q.includes('location') || q.includes('where')) {
      return {
        text: `📍 **Showroom Locations & Direct Phone Numbers**:\n\n1. **Leh Main Bazaar**: Skitchan Ngodup Complex, Near Old Bus Stand, Leh 194101\n📞 **+91 99285 41909**\n\n2. **Choglamsar Flagship**: Opp. HDFC Bank, Guge Complex, Leh 194104\n📞 **+91 95418 97567**\n\n3. **Kargil Market**: Main Market Square, Silk Route Galleria, Kargil 194103\n📞 **+91 94191 76231**\n\n4. **Padum, Zanskar**: Central Padum Market, Zanskar 194302\n📞 **+91 96229 88124**`,
        structuredData: {
          type: 'contact',
        },
      };
    }

    if (q.includes('rate') || q.includes('price') || q.includes('gold') || q.includes('silver') || q.includes('platinum') || q.includes('gem') || q.includes('diamond')) {
      return {
        text: `🪙 **Today's Official Bullion & Gemstone Rates**:\n\n• **24K Pure Gold**: ₹13,501 / gm (99.9% Pure)\n• **22K Hallmarked Gold**: ₹12,376 / gm (BIS 916 Standard)\n• **18K Diamond Gold**: ₹10,126 / gm\n• **999 Pure Silver**: ₹163.65 / gm (₹1,63,650 / kg)\n• **950 Platinum**: ₹3,850 / gm\n\n💎 **Gemstones & Solitaires:**\n• Certified Diamonds (IGI/GIA): ₹75,000 to ₹3,50,000+ / ct\n• Natural Kashmir Emeralds: ₹18,000 to ₹1,20,000 / ct\n• Burmese Natural Rubies: ₹25,000 to ₹1,80,000 / ct\n• Royal Blue Sapphires: ₹35,000 to ₹2,50,000 / ct`,
        structuredData: {
          type: 'rates',
        },
      };
    }

    return {
      text: `Thank you for connecting with **New Friends Jewellers**. We are happy to help you with:\n\n• Showroom timings & directions in Leh, Choglamsar, Kargil & Zanskar\n• Today's live Gold, Silver, Platinum & Gemstone rates\n• Bridal jewellery on rent & 0% interest EMI options\n\nWhat would you like to know more about?`,
    };
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `Chat refreshed. Namaste! How may I assist you with New Friends Jewellers today?`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  return (
    <>
      {/* Floating Action Button Stack on Bottom Right */}
      <div className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-2.5 pointer-events-auto">
        {/* Phone Dialler Button Above Help Chatbot */}
        <motion.a
          id="phone-dialler-btn"
          href={`tel:${STORE_BACKEND_PHONE_HOTLINE}`}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative flex items-center gap-2 px-4 py-2.5 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-300 border border-[#D4AF37] bg-gradient-to-r from-[#113824] via-[#1B4D3E] to-[#0D281A] text-white hover:border-[#F3DE8A] hover:shadow-[0_0_20px_rgba(16,185,129,0.35)]"
          aria-label="Call New Friends Jewellers on Phone Dialer"
          title="Open phone dialler to connect with store concierge"
        >
          <div className="relative flex items-center justify-center">
            <Phone className="w-4 h-4 text-emerald-300" />
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
          </div>

          <span className="text-xs sm:text-sm font-bold tracking-wide text-white">Call</span>
        </motion.a>

        {/* Unread teaser tooltip if chatbot is closed */}
        {!isOpen && unreadPrompt && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.8 }}
            className="mr-1 bg-[#1F1615] text-[#FAF7F2] border border-[#D4AF37]/50 shadow-2xl rounded-2xl px-4 py-2.5 text-xs max-w-[240px] flex items-center gap-2.5"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
            <div>
              <p className="font-semibold text-[#D4AF37]">Need Help?</p>
              <p className="text-[#C4A77D] text-[11px] leading-tight">
                Ask timings, phone, address & live gold/gem rates!
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setUnreadPrompt(false);
              }}
              className="text-stone-400 hover:text-white ml-auto"
              aria-label="Dismiss help prompt"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}

        {/* Help Button */}
        <motion.button
          id="help-chat-toggle-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className={`relative flex items-center gap-2.5 px-4 py-3 rounded-full shadow-[0_10px_35px_rgba(31,22,21,0.35)] transition-all duration-300 border ${
            isOpen
              ? 'bg-[#4A1017] text-white border-[#D4AF37]'
              : 'bg-gradient-to-r from-[#4A1017] via-[#5F131E] to-[#36090E] text-white border-[#D4AF37]/80 hover:border-[#F3DE8A]'
          }`}
          aria-label={isOpen ? 'Close Help Assistant' : 'Open Help Concierge'}
        >
          <div className="relative flex items-center justify-center">
            {isOpen ? (
              <X className="w-5 h-5 text-[#D4AF37]" />
            ) : (
              <HelpCircle className="w-5 h-5 text-[#D4AF37]" />
            )}
            {!isOpen && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10B981] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#10B981]" />
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-sm font-bold tracking-wide text-white">
              {isOpen ? 'Close' : 'Help'}
            </span>
            <span className="hidden sm:inline-block text-[11px] font-medium text-[#E5C365] pl-1.5 border-l border-white/20">
              {isOpen ? 'Assistant' : 'Timings & Rates'}
            </span>
          </div>
        </motion.button>
      </div>

      {/* Chat Window Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="concierge-chat-window"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[420px] h-[580px] max-h-[82vh] bg-[#FAF7F2] rounded-3xl shadow-[0_20px_60px_rgba(31,22,21,0.35)] border border-[#C4A77D]/40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#36090E] via-[#4A1017] to-[#2B060B] text-white px-5 py-4 flex items-center justify-between border-b border-[#D4AF37]/30 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] via-[#F3E5AB] to-[#9B781E] p-0.5 shadow-md flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-[#4A1017] flex items-center justify-center">
                    <Crown className="w-5 h-5 text-[#D4AF37]" />
                  </div>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-playfair text-base font-semibold text-white tracking-wide">
                      NFJ Royal Concierge
                    </h3>
                    <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-400 border border-emerald-500/30">
                      Live
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-[11px] text-[#D4AF37] font-sans">
                      New Friends Jewellers • Ladakh
                    </p>
                    <span className="text-[10px] text-stone-400">•</span>
                    <a
                      href={`tel:${STORE_BACKEND_PHONE_HOTLINE}`}
                      className="text-[11px] text-[#F3DE8A] hover:underline flex items-center gap-1 font-semibold"
                      title="Call Helpline: +91-9928541909"
                    >
                      <Phone className="w-2.5 h-2.5" />
                      <span>+91-9928541909</span>
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={handleResetChat}
                  title="Restart chat"
                  className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close chat"
                  className="p-1.5 rounded-full text-stone-300 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Action Chips Bar */}
            <div className="bg-[#F5EFE6] px-3 py-2 border-b border-[#E8DCC9] overflow-x-auto no-scrollbar flex items-center gap-1.5 shrink-0">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendMessage(prompt.query)}
                  className="whitespace-nowrap px-2.5 py-1 rounded-full text-[11px] font-medium bg-white text-[#4A1017] border border-[#C4A77D]/40 hover:bg-[#4A1017] hover:text-white hover:border-[#4A1017] transition-all shadow-xs"
                >
                  {prompt.label}
                </button>
              ))}
            </div>

            {/* Message Feed */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF7F2] text-sm">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${
                    msg.sender === 'user' ? 'items-end' : 'items-start'
                  }`}
                >
                  <div
                    className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-xs leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#4A1017] text-white rounded-br-xs'
                        : 'bg-white text-[#1F1615] border border-[#E8DCC9] rounded-bl-xs'
                    }`}
                  >
                    {/* Render message text with simple markdown-like formatting */}
                    <div className="space-y-1.5 whitespace-pre-wrap">
                      {msg.text.split('\n\n').map((para, pIdx) => (
                        <p key={pIdx}>
                          {para.split('\n').map((line, lIdx) => {
                            // Format bold items (**text**)
                            const parts = line.split(/(\*\*.*?\*\*)/g);
                            return (
                              <React.Fragment key={lIdx}>
                                {parts.map((part, i) => {
                                  if (part.startsWith('**') && part.endsWith('**')) {
                                    return (
                                      <strong
                                        key={i}
                                        className={
                                          msg.sender === 'user'
                                            ? 'text-[#F3E5AB] font-bold'
                                            : 'text-[#4A1017] font-semibold'
                                        }
                                      >
                                        {part.slice(2, -2)}
                                      </strong>
                                    );
                                  }
                                  return part;
                                })}
                                {lIdx < para.split('\n').length - 1 && <br />}
                              </React.Fragment>
                            );
                          })}
                        </p>
                      ))}
                    </div>

                    {/* Interactive Action Badges based on query response */}
                    {msg.sender === 'bot' && (
                      <div className="mt-3 pt-2.5 border-t border-stone-100 flex flex-wrap gap-1.5">
                        <button
                          onClick={() => handleSendMessage('What are today gold and silver prices?')}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#FAF7F2] text-[#4A1017] border border-[#C4A77D]/50 px-2 py-0.5 rounded-full hover:bg-[#4A1017] hover:text-white transition-colors"
                        >
                          <Coins className="w-3 h-3 text-[#D4AF37]" />
                          Check Rates
                        </button>
                        <button
                          onClick={() => handleSendMessage('Give me showroom addresses and contact numbers')}
                          className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#FAF7F2] text-[#4A1017] border border-[#C4A77D]/50 px-2 py-0.5 rounded-full hover:bg-[#4A1017] hover:text-white transition-colors"
                        >
                          <Phone className="w-3 h-3 text-[#D4AF37]" />
                          Call Store
                        </button>
                        {onOpenAppointment && (
                          <button
                            onClick={() => {
                              setIsOpen(false);
                              onOpenAppointment();
                            }}
                            className="inline-flex items-center gap-1 text-[10px] font-semibold bg-[#D4AF37]/15 text-[#6B1724] border border-[#D4AF37]/60 px-2 py-0.5 rounded-full hover:bg-[#4A1017] hover:text-white transition-colors"
                          >
                            <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                            Book VIP Visit
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {/* Loading indicator */}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white border border-[#E8DCC9] rounded-2xl px-4 py-2.5 shadow-xs flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#D4AF37] animate-spin" />
                    <span className="text-xs text-stone-600 font-medium">
                      Checking live rates & showroom concierge...
                    </span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Direct Connect Quick Action Bar */}
            <div className="bg-[#F5EFE6]/80 px-4 py-1.5 border-t border-[#E8DCC9] flex items-center justify-between text-[11px] text-stone-600 shrink-0">
              <span className="flex items-center gap-1 text-[#4A1017] font-medium">
                <Phone className="w-3 h-3 text-[#D4AF37]" />
                Leh Hotline: <a href="tel:+919928541909" className="font-semibold underline hover:text-[#D4AF37]">+91 99285 41909</a>
              </span>
              <a
                href="https://wa.me/919928541909?text=Hello%20New%20Friends%20Jewellers,%20I%20would%20like%20to%20inquire%20about%20rates%20and%20bridal%20jewellery"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>WhatsApp</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="p-3 bg-white border-t border-[#E8DCC9] flex items-center gap-2 shrink-0"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about timings, addresses, rates, gold, diamonds..."
                className="flex-1 bg-[#FAF7F2] border border-[#C4A77D]/50 rounded-full px-4 py-2.5 text-xs text-[#1F1615] placeholder:text-stone-400 focus:outline-none focus:border-[#4A1017] focus:ring-1 focus:ring-[#4A1017]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[#4A1017] text-white flex items-center justify-center hover:bg-[#6B1724] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shrink-0 shadow-xs border border-[#D4AF37]/50"
                aria-label="Send query"
              >
                <Send className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
