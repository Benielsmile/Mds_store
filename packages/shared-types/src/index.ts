export interface Product {
  id: string;
  title: string;
  description: string;
  price: string;
  imageUrl: string | null;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  productId: string;
  status: 'pending' | 'completed' | 'failed';
  paypalOrderId: string | null;
  amount: string;
  createdAt: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface HeroContent {
  headline: string;
  subheadline: string;
  ctaText: string;
  badgeText: string;
}

export interface StoreSettings {
  storeName: string;
  storeDescription: string;
  contactEmail: string;
  twitterHandle: string;
  githubUrl: string;
  currency: string;
}
