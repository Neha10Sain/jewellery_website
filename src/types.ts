export type MetalType = 'gold24k' | 'gold22k' | 'rosegold' | 'platinum' | 'leh_antique';

export type GemstoneType = 'diamond' | 'sapphire' | 'emerald' | 'ruby';

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
  category: 'rings' | 'necklaces' | 'earrings' | 'pendants' | 'mangalsutra' | 'coins';
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
  mapCoords: { x: number; y: number }; // percentage on stylized Ladakh map
  privileges: string[];
  features: string[];
}

export interface CartItem {
  id: string;
  product: JewelleryItem;
  selectedMetal: MetalType;
  selectedGemstone: GemstoneType;
  ringSize?: string;
  quantity: number;
}
