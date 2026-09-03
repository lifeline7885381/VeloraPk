export type Currency = 'PKR' | 'USD' | 'AED';

export type StockStatus = 'In Stock' | 'Low Stock' | 'Out of Stock' | 'Pre-Order';

export interface Product {
  id: string;
  name: string;
  urduName?: string;
  subtitle: string;
  category: 'Couture' | 'Jewelry' | 'Footwear' | 'Oud' | 'Horology' | 'Accessories';
  sku?: string;
  stockStatus?: StockStatus;
  pricePKR: number;
  priceUSD: number;
  priceAED: number;
  rating: number;
  reviewsCount: number;
  image: string;
  badge: string;
  originCity: 'Lahore' | 'Karachi' | 'Peshawar' | 'Multan' | 'Swat Valley' | 'Islamabad';
  artisanHouse: string;
  purityCert: string;
  description: string;
  specs: Record<string, string>;
  isExclusive?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedSize?: string;
  customEngraving?: string;
}

export type CategoryFilter = 'All' | 'Couture' | 'Jewelry' | 'Footwear' | 'Oud' | 'Horology' | 'Accessories';

export interface FilterOptions {
  category: CategoryFilter;
  origin: string;
  priceRange: [number, number];
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating';
  searchQuery: string;
}
