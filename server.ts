import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Knowledge Base for New Friends Jewellers
const NFJ_KNOWLEDGE = {
  showrooms: [
    {
      name: 'New Friends Jewellers — Leh Main Bazaar (Heritage Boutique)',
      city: 'Leh',
      address: 'Skitchan Ngodup Complex, Near Old Bus Stand, Leh, Ladakh 194101',
      timings: 'Daily: 10:00 AM – 8:00 PM (Monday to Sunday)',
      phone: '+91 99285 41909',
      manager: 'Stanzin Angmo',
      highlights: 'Heritage Gold Archive, Diamond Lounge, BIS Hallmark Testing',
    },
    {
      name: 'New Friends Jewellers — Choglamsar Flagship',
      city: 'Choglamsar',
      address: 'Opposite HDFC Bank, Guge Complex, Choglamsar, Leh, Ladakh 194104',
      timings: 'Daily: 10:00 AM – 8:00 PM (Monday to Sunday)',
      phone: '+91 95418 97567',
      manager: 'Dorjay Tsering',
      highlights: 'Private Bridal Suite, Karatmeter Purity Test, Master Goldsmith Custom Studio',
    },
    {
      name: 'New Friends Jewellers — Kargil Market',
      city: 'Kargil',
      address: 'Main Market Square, Silk Route Galleria, Kargil, Ladakh 194103',
      timings: 'Monday – Saturday: 10:00 AM – 7:30 PM (Sunday Closed)',
      phone: '+91 94191 76231',
      manager: 'Mohammad Ali',
      highlights: 'Bridal Gold Lounge, Instant Gold Assay, Savings Scheme Desk',
    },
    {
      name: 'New Friends Jewellers — Padum, Zanskar Valley',
      city: 'Padum / Zanskar',
      address: 'Gompa Road, Central Padum Market, Zanskar Valley, Ladakh 194302',
      timings: 'Daily: 10:30 AM – 6:30 PM (Monday to Sunday)',
      phone: '+91 96229 88124',
      manager: 'Tundup Namgyal',
      highlights: 'Himalayan Rare Gemstones, 22K BIS Wedding Sets, Free Cleaning',
    },
  ],
  rates: {
    gold24k: '₹13,501 per gram (99.9% Pure Bullion)',
    gold22k: '₹12,376 per gram (BIS 916 Standard)',
    gold18k: '₹10,126 per gram (75.0% Fine Diamond Gold)',
    silver999: '₹163.65 per gram (₹1,63,650 per kilogram)',
    platinum950: '₹3,850 per gram (Pt950 Certified)',
    gemstones: {
      solitaires: '₹75,000 – ₹3,50,000+ per carat (IGI / GIA Certified)',
      emeralds: '₹18,000 – ₹1,20,000 per carat (Natural Himalayan / Zambian)',
      rubies: '₹25,000 – ₹1,80,000 per carat (Natural Burmese & Pigeon Blood)',
      sapphires: '₹35,000 – ₹2,50,000 per carat (Royal Kashmir / Ceylon Blue)',
      pearls: '₹4,500 – ₹45,000 per gram (Natural Basra & South Sea Pearls)',
    },
  },
  services: [
    'Bridal Jewellery Rentals from ₹4,500/day',
    'Custom 3D Jewellery Studio & Goldsmithing',
    'Instant Karatmeter Purity Verification',
    '0% Interest EMI Plans (3 to 12 months)',
    'Digital Gold Accumulation (starting at ₹500)',
    'VIP Bridal In-Showroom Appointments',
  ],
};

// Lazy initialization of Gemini client
let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient && process.env.GEMINI_API_KEY) {
    geminiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return geminiClient;
}

// Fallback rule-based response generator
function getRuleBasedResponse(message: string): { reply: string; structuredData?: any } {
  const query = message.toLowerCase();

  // 1. Timings
  if (
    query.includes('timing') ||
    query.includes('time') ||
    query.includes('open') ||
    query.includes('close') ||
    query.includes('hour') ||
    query.includes('kab') ||
    query.includes('samay')
  ) {
    const timingsText = `✨ **Showroom Timings — New Friends Jewellers**\n\n` +
      `• **Leh Main Bazaar**: Daily 10:00 AM – 8:00 PM\n` +
      `• **Choglamsar Flagship**: Daily 10:00 AM – 8:00 PM\n` +
      `• **Kargil Market**: Mon – Sat 10:00 AM – 7:30 PM (Sun Closed)\n` +
      `• **Padum, Zanskar**: Daily 10:30 AM – 6:30 PM\n\n` +
      `All showrooms offer private bridal appointments and on-spot Karatmeter purity certification!`;
    return {
      reply: timingsText,
      structuredData: { type: 'timings', showrooms: NFJ_KNOWLEDGE.showrooms },
    };
  }

  // 2. Address & Location & Contact
  if (
    query.includes('address') ||
    query.includes('location') ||
    query.includes('where') ||
    query.includes('phone') ||
    query.includes('contact') ||
    query.includes('call') ||
    query.includes('number') ||
    query.includes('pata') ||
    query.includes('kahan')
  ) {
    const addressText = `📍 **Our 4 Flagship Showrooms & Contact Numbers**\n\n` +
      `1. **Leh Main Bazaar (Heritage Boutique)**\n` +
      `   • Address: Skitchan Ngodup Complex, Near Old Bus Stand, Leh 194101\n` +
      `   • Phone: 📞 **+91 99285 41909** (Manager: Stanzin Angmo)\n\n` +
      `2. **Choglamsar Flagship Store**\n` +
      `   • Address: Opposite HDFC Bank, Guge Complex, Choglamsar, Leh 194104\n` +
      `   • Phone: 📞 **+91 95418 97567** (Manager: Dorjay Tsering)\n\n` +
      `3. **Kargil Market Showroom**\n` +
      `   • Address: Main Market Square, Silk Route Galleria, Kargil 194103\n` +
      `   • Phone: 📞 **+91 94191 76231** (Manager: Mohammad Ali)\n\n` +
      `4. **Padum, Zanskar Valley Boutique**\n` +
      `   • Address: Gompa Road, Central Padum Market, Zanskar 194302\n` +
      `   • Phone: 📞 **+91 96229 88124** (Manager: Tundup Namgyal)`;
    return {
      reply: addressText,
      structuredData: { type: 'contact', showrooms: NFJ_KNOWLEDGE.showrooms },
    };
  }

  // 3. Gold, Silver, Platinum, Gemstones, Prices
  if (
    query.includes('gold') ||
    query.includes('silver') ||
    query.includes('platinum') ||
    query.includes('rate') ||
    query.includes('price') ||
    query.includes('cost') ||
    query.includes('bhav') ||
    query.includes('daam') ||
    query.includes('gem') ||
    query.includes('diamond') ||
    query.includes('emerald') ||
    query.includes('ruby') ||
    query.includes('sapphire') ||
    query.includes('pearl')
  ) {
    const ratesText = `🪙 **Live Bullion & Precious Gemstone Rates Today**\n\n` +
      `• **24K Pure Gold**: **${NFJ_KNOWLEDGE.rates.gold24k}**\n` +
      `• **22K Hallmarked (BIS 916)**: **${NFJ_KNOWLEDGE.rates.gold22k}**\n` +
      `• **18K Diamond Gold**: **${NFJ_KNOWLEDGE.rates.gold18k}**\n` +
      `• **999 Pure Silver**: **${NFJ_KNOWLEDGE.rates.silver999}**\n` +
      `• **950 Platinum**: **${NFJ_KNOWLEDGE.rates.platinum950}**\n\n` +
      `💎 **Certified Gemstones & Solitaires:**\n` +
      `• Solitaire Diamonds (GIA/IGI): ${NFJ_KNOWLEDGE.rates.gemstones.solitaires}\n` +
      `• Kashmir Emeralds: ${NFJ_KNOWLEDGE.rates.gemstones.emeralds}\n` +
      `• Natural Burmese Rubies: ${NFJ_KNOWLEDGE.rates.gemstones.rubies}\n` +
      `• Royal Blue Sapphires: ${NFJ_KNOWLEDGE.rates.gemstones.sapphires}\n` +
      `• Basra & South Sea Pearls: ${NFJ_KNOWLEDGE.rates.gemstones.pearls}\n\n` +
      `*All gold jewellery is 100% BIS Hallmarked with Karatmeter purity certificate.*`;
    return {
      reply: ratesText,
      structuredData: { type: 'rates', rates: NFJ_KNOWLEDGE.rates },
    };
  }

  // 4. Rental / EMI / Custom Jewellery
  if (
    query.includes('rent') ||
    query.includes('rental') ||
    query.includes('emi') ||
    query.includes('custom') ||
    query.includes('bridal') ||
    query.includes('wedding')
  ) {
    const bridalText = `👑 **Bridal Jewellery & Special Services at New Friends Jewellers**\n\n` +
      `• **Bridal Rentals**: Rent royal Polki, Kundan & 22K bridal sets from ₹4,500/day with 100% refundable security deposit.\n` +
      `• **0% Interest EMI**: Available for 3, 6, 9 & 12-month tenures on any gold or diamond purchase.\n` +
      `• **Custom 3D Studio**: View and design your dream jewellery with our 3D visualizer or consult our Master Goldsmith.\n` +
      `• **Book an Appointment**: Visit our Leh, Choglamsar, Kargil, or Zanskar boutiques for private bridal styling!`;
    return {
      reply: bridalText,
      structuredData: { type: 'services', services: NFJ_KNOWLEDGE.services },
    };
  }

  // 5. Default greeting / general inquiry
  const generalText = `Namaste! Welcome to **New Friends Jewellers** — Ladakh's premier luxury jewellery destination since 1982.\n\n` +
    `I can help you with:\n` +
    `• 🕒 **Showroom Timings** across Leh, Choglamsar, Kargil & Zanskar\n` +
    `• 📍 **Addresses & Phone Numbers** of all 4 boutiques\n` +
    `• 🪙 **Today's Gold, Silver & Platinum Rates**\n` +
    `• 💎 **Certified Gemstones & Solitaire Diamond Prices**\n` +
    `• 👑 **Bridal Jewellery Rentals & 0% EMI Schemes**\n\n` +
    `How may I assist your jewellery journey today?`;
  return {
    reply: generalText,
  };
}

// Chat API Endpoint
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { message, history } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const ai = getGeminiClient();

    if (!ai) {
      // Return smart structured knowledge response
      const fallback = getRuleBasedResponse(message);
      return res.json({
        reply: fallback.reply,
        structuredData: fallback.structuredData,
        source: 'knowledge-engine',
      });
    }

    // Prepare system instructions and prompt
    const systemInstruction = `You are the Royal Concierge AI Assistant for "New Friends Jewellers", Ladakh's most prestigious luxury jewellery house established in 1982.
Your tone is warm, refined, polite, knowledgeable, and hospitable (welcoming users with high regard).
You speak English and can also understand and reply naturally in Hinglish if the user asks in Hindi/Hinglish.

Factual Knowledge you must adhere to strictly:
1. Showrooms & Timings:
- Leh Main Bazaar: Skitchan Ngodup Complex, Near Old Bus Stand, Leh 194101. Daily 10:00 AM – 8:00 PM. Phone: +91 99285 41909. Manager: Stanzin Angmo.
- Choglamsar Flagship: Opposite HDFC Bank, Guge Complex, Choglamsar, Leh 194104. Daily 10:00 AM – 8:00 PM. Phone: +91 95418 97567. Manager: Dorjay Tsering.
- Kargil Market: Main Market Square, Silk Route Galleria, Kargil 194103. Mon–Sat 10:00 AM – 7:30 PM (Sunday Closed). Phone: +91 94191 76231. Manager: Mohammad Ali.
- Padum, Zanskar: Gompa Road, Central Padum Market, Zanskar 194302. Daily 10:30 AM – 6:30 PM. Phone: +91 96229 88124. Manager: Tundup Namgyal.

2. Bullion & Precious Metals:
- 24K Pure Gold: ₹13,501 / gram (99.9% Pure)
- 22K Hallmarked Gold: ₹12,376 / gram (BIS 916 Standard)
- 18K Diamond Gold: ₹10,126 / gram
- 999 Pure Silver: ₹163.65 / gram (₹1,63,650 / kg)
- 950 Platinum: ₹3,850 / gram (Pt950 Certified)

3. Gemstones & Diamonds:
- Certified Solitaires (IGI/GIA): ₹75,000 to ₹3,50,000+ per carat
- Kashmir Emeralds: ₹18,000 to ₹1,20,000 per carat
- Burmese Rubies: ₹25,000 to ₹1,80,000 per carat
- Royal Blue Sapphires: ₹35,000 to ₹2,50,000 per carat
- Natural Basra & South Sea Pearls: ₹4,500 to ₹45,000 per gram

4. Key Services:
- Bridal Jewellery on Rent (starts at ₹4,500/day)
- Instant Karatmeter Purity testing for walk-in guests
- 0% EMI plans from 3 to 12 months
- Digital Gold Savings starting from ₹500
- Custom 3D jewellery design studio and master artisan craftsmanship

Provide clear, formatted responses with bullet points, emojis where appropriate, and phone numbers when asked for contact/locations.`;

    const conversationContents: any[] = [];
    if (Array.isArray(history)) {
      for (const turn of history.slice(-6)) {
        conversationContents.push({
          role: turn.role === 'user' ? 'user' : 'model',
          parts: [{ text: turn.content }],
        });
      }
    }
    conversationContents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const timeoutPromise = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('AI response timeout')), 4000)
    );

    const generatePromise = ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: conversationContents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const response = await Promise.race([generatePromise, timeoutPromise]);

    const reply = response.text || getRuleBasedResponse(message).reply;
    const ruleInfo = getRuleBasedResponse(message);

    return res.json({
      reply,
      structuredData: ruleInfo.structuredData,
      source: 'gemini',
    });
  } catch (error) {
    console.error('Chat error:', error);
    const fallback = getRuleBasedResponse(req.body?.message || '');
    return res.json({
      reply: fallback.reply,
      structuredData: fallback.structuredData,
      source: 'fallback',
    });
  }
});

// Rates endpoint for live data
app.get('/api/rates', (req: Request, res: Response) => {
  res.json({
    status: 'success',
    rates: NFJ_KNOWLEDGE.rates,
    showrooms: NFJ_KNOWLEDGE.showrooms,
  });
});

// Setup Vite middleware in dev or static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`New Friends Jewellers Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
