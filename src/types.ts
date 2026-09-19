export type MetalType = 'gold24k' | 'gold22k' | 'rosegold' | 'platinum' | 'leh_antique';

export type GemstoneType = 'diamond' | 'sapphire' | 'emerald' | 'ruby';

export type OrnamentType = 'ring' | 'necklace' | 'bangle' | 'earrings';

export interface BullionRate {
  name: string;
  purity: string;
  ratePerGram: number;
  changePercent: number;
  isPositive: boolean;
}

export interface JewelleryItem {
  id: string;
  name: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bangles' | 'pendants' | 'coins';
  ornamentType?: OrnamentType;
  collection: string;
  price: number;
  weightGrams: number;
  purity: string;
  metal: MetalType;
  gemstone: GemstoneType;
  carat?: number;
  image: string;
  tag?: string;
  rating: number;
  reviewsCount: number;
  description: string;
  hallmarkCertified: boolean;
  has3DModel?: boolean;
  // Rental feature fields
  isAvailableForRent?: boolean;
  rentalPricePerDay?: number;
  rentalDeposit?: number;
}

export interface Showroom {
  id: string;
  name: string;
  tagline: string;
  city: string;
  address: string;
  timings: string;
  conciergeManager: string;
  phone: string;
  rating: number;
  reviewsCount: number;
  image: string;
  mapCoords: { x: number; y: number };
  privileges: string[];
  features: string[];
  googleMapsUrl?: string;
  googleMapsEmbedUrl?: string;
  coordinates?: { lat: number; lng: number };
}

export interface CartItem {
  id: string;
  product: JewelleryItem;
  selectedMetal: MetalType;
  selectedGemstone: GemstoneType;
  ringSize?: string;
  quantity: number;
  isRental?: boolean;
  rentalDays?: number;
  rentalStartDate?: string;
}

export interface PromotionalOffer {
  id: string;
  title: string;
  code: string;
  discountPercent: number;
  description: string;
  badge: string;
  expiryDate: string;
  isActive: boolean;
}
