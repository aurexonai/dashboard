import { create } from 'zustand';

export interface User {
  name: string;
  email: string;
  isAuthenticated: boolean;
}

export interface Product {
  name: string;
  category: string;
  basePrice: number;
  condition: string;
  description: string;
}

export interface Pricing {
  suggestedPrice: number;
  minPrice: number;
  maxPrice: number;
  status: 'Optimal' | 'Overpriced' | 'Underpriced';
  confidence: number;
}

export interface Evaluation {
  trustScore: number;
  valueRating: number;
  dimensions: { label: string; score: number }[];
}

export interface TrendPoint {
  day: string;
  demand: number;
}

export interface Insight {
  icon: string;
  title: string;
  description: string;
}

export interface Listing {
  id: string;
  name: string;
  price: number;
  category: string;
  status: string;
}

interface AppState {
  user: User;
  product: Product | null;
  pricing: Pricing | null;
  evaluation: Evaluation | null;
  trends: TrendPoint[];
  insights: Insight[];
  listings: Listing[];
  sidebarOpen: boolean;

  login: (email: string, password: string) => boolean;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  setProduct: (data: Product) => void;
  runAI: () => void;
  addListing: (listing: Omit<Listing, 'id'>) => void;
  updateListing: (id: string, listing: Partial<Listing>) => void;
  deleteListing: (id: string) => void;
  applySuggestedPrice: (price: number) => void;
  toggleSidebar: () => void;
}

const categoryMultipliers: Record<string, number> = {
  'Electronics': 1.35,
  'Clothing': 1.2,
  'Home & Garden': 1.15,
  'Sports': 1.25,
  'Books': 1.1,
  'Toys': 1.3,
  'Automotive': 1.4,
  'Other': 1.18,
};

const conditionMultipliers: Record<string, number> = {
  'New': 1.0,
  'Like New': 0.9,
  'Good': 0.75,
  'Fair': 0.6,
  'Poor': 0.4,
};

export function suggestPrice(product: Product): Pricing {
  const catMul = categoryMultipliers[product.category] || 1.18;
  const condMul = conditionMultipliers[product.condition] || 0.75;
  const suggested = Math.round(product.basePrice * catMul * condMul * 100) / 100;
  const min = Math.round(suggested * 0.85 * 100) / 100;
  const max = Math.round(suggested * 1.15 * 100) / 100;
  const ratio = suggested / product.basePrice;
  const status: Pricing['status'] = ratio > 1.1 ? 'Overpriced' : ratio < 0.9 ? 'Underpriced' : 'Optimal';
  const confidence = Math.min(95, 60 + product.description.length * 0.5 + (product.name.length * 2));
  return { suggestedPrice: suggested, minPrice: min, maxPrice: max, status, confidence: Math.round(confidence) };
}

function generateTrends(product: Product): TrendPoint[] {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const base = product.basePrice > 100 ? 70 : 50;
  const pattern = [0, 5, 12, 8, 18, 25, 20];
  return days.map((day, i) => ({ day, demand: base + pattern[i] + (product.category.length % 10) }));
}

function calcTrustScore(product: Product): Evaluation {
  let score = 0;
  if (product.name.length > 3) score += 20;
  if (product.category) score += 20;
  if (product.basePrice > 0) score += 20;
  if (product.condition) score += 20;
  if (product.description.length > 10) score += 20;
  const valueRating = score >= 80 ? 4.5 : score >= 60 ? 3.5 : 2.5;
  return {
    trustScore: score,
    valueRating,
    dimensions: [
      { label: 'Data Completeness', score: Math.min(100, product.description.length + product.name.length) },
      { label: 'Price Accuracy', score: score >= 80 ? 92 : 68 },
      { label: 'Market Fit', score: score >= 60 ? 85 : 55 },
      { label: 'Demand Signal', score: score >= 80 ? 88 : 60 },
    ],
  };
}

function produceInsights(pricing: Pricing, product: Product): Insight[] {
  const insights: Insight[] = [];
  if (pricing.status === 'Overpriced') {
    insights.push({ icon: '⚠️', title: 'Price Adjustment Recommended', description: `Consider reducing the price by ${Math.round((pricing.suggestedPrice / (product.basePrice * 1.35) - 1) * -100)}% to match current market demand for ${product.category}.` });
  }
  if (pricing.status === 'Underpriced') {
    insights.push({ icon: '📈', title: 'Opportunity to Increase Price', description: `Your product is priced below market value. You could increase the price by up to $${(pricing.maxPrice - product.basePrice).toFixed(2)} while remaining competitive.` });
  }
  insights.push({ icon: '🎯', title: 'Target Audience Alignment', description: `${product.category} products in ${product.condition} condition are trending among value-conscious buyers this quarter.` });
  insights.push({ icon: '📊', title: 'Competitive Positioning', description: `Your listing ranks in the top 30% for ${product.category}. Improve your description to reach the top 15%.` });
  insights.push({ icon: '⏰', title: 'Best Time to List', description: 'Data suggests listing on Thursday or Friday yields 18% higher visibility for this category.' });
  return insights;
}

const storedUser = localStorage.getItem('aurexon_user');
const initialUser: User = storedUser
  ? JSON.parse(storedUser)
  : { name: '', email: '', isAuthenticated: false };

export const useStore = create<AppState>((set, get) => ({
  user: initialUser,
  product: null,
  pricing: null,
  evaluation: null,
  trends: [],
  insights: [],
  listings: JSON.parse(localStorage.getItem('aurexon_listings') || '[]'),
  sidebarOpen: true,

  login: (email, password) => {
    const users = JSON.parse(localStorage.getItem('aurexon_users') || '[]');
    const found = users.find((u: any) => u.email === email && u.password === password);
    if (found) {
      const user = { name: found.name, email: found.email, isAuthenticated: true };
      localStorage.setItem('aurexon_user', JSON.stringify(user));
      set({ user });
      return true;
    }
    return false;
  },

  signup: (name, email, password) => {
    const users = JSON.parse(localStorage.getItem('aurexon_users') || '[]');
    users.push({ name, email, password });
    localStorage.setItem('aurexon_users', JSON.stringify(users));
  },

  logout: () => {
    localStorage.removeItem('aurexon_user');
    set({ user: { name: '', email: '', isAuthenticated: false }, product: null, pricing: null, evaluation: null, trends: [], insights: [] });
  },

  setProduct: (data) => set({ product: data }),

  runAI: () => {
    const { product } = get();
    if (!product) return;
    const pricing = suggestPrice(product);
    const trends = generateTrends(product);
    const evaluation = calcTrustScore(product);
    const insights = produceInsights(pricing, product);
    set({ pricing, trends, evaluation, insights });
  },

  addListing: (listing) => {
    const id = Date.now().toString();
    const newListings = [...get().listings, { ...listing, id }];
    localStorage.setItem('aurexon_listings', JSON.stringify(newListings));
    set({ listings: newListings });
  },

  updateListing: (id, data) => {
    const newListings = get().listings.map(l => l.id === id ? { ...l, ...data } : l);
    localStorage.setItem('aurexon_listings', JSON.stringify(newListings));
    set({ listings: newListings });
  },

  deleteListing: (id) => {
    const newListings = get().listings.filter(l => l.id !== id);
    localStorage.setItem('aurexon_listings', JSON.stringify(newListings));
    set({ listings: newListings });
  },

  applySuggestedPrice: (price) => {
    const newListings = get().listings.map(l => ({ ...l, price }));
    localStorage.setItem('aurexon_listings', JSON.stringify(newListings));
    set({ listings: newListings });
  },

  toggleSidebar: () => set(s => ({ sidebarOpen: !s.sidebarOpen })),
}));
