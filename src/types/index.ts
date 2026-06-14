export enum ProductCategory {
  FRESH_FRUITS = "Fresh Fruits & Vegetable",
  COOKING_OIL = "Cooking Oil & Ghee",
  MEAT_FISH = "Meat & Fish",
  BAKERY = "Bakery & Snacks",
  DAIRY = "Dairy & Eggs",
  BEVERAGES = "Beverages",
  PULSES = "Pulses",
  RICE = "Rice",
  FAST_FOOD = "Fast Food",
  NOODLES = "Noodles & Pasta",
  CHIPS = "Chips & Crisps",
}

export enum OrderStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  FAILED = "failed",
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: ProductCategory;
  unit: string;
  weight: string;
  inStock: boolean;
  description: string;
  nutritions?: string;
  rating: number;
  reviewCount: number;
  discount?: number;
  brand?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  status: OrderStatus;
  delivery: string;
  payment: string;
  promoCode?: string;
  createdAt: string;
}
