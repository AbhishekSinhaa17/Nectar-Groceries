import { create } from "zustand";
import type { Product } from "@/types";
import { ProductCategory } from "@/types";
import { PRODUCTS } from "@/data/mockData";
import { delay } from "@/utils/helpers";

interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
  searchQuery: string;
  selectedCategory: ProductCategory | null;
  selectedBrands: string[];
  priceRange: [number, number];
  fetchProducts: () => Promise<void>;
  setSearch: (q: string) => void;
  setCategory: (c: ProductCategory | null) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (r: [number, number]) => void;
  applyFilters: () => void;
  resetFilters: () => void;
  getFilteredProducts: () => Product[];
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  error: null,
  searchQuery: "",
  selectedCategory: null,
  selectedBrands: [],
  priceRange: [0, 1000],
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await delay(PRODUCTS, 1000);
      set({ products: data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Failed to load products",
        isLoading: false,
      });
    }
  },
  setSearch: (q) => set({ searchQuery: q }),
  setCategory: (c) => set({ selectedCategory: c }),
  toggleBrand: (brand) =>
    set((s) => ({
      selectedBrands: s.selectedBrands.includes(brand)
        ? s.selectedBrands.filter((b) => b !== brand)
        : [...s.selectedBrands, brand],
    })),
  setPriceRange: (r) => set({ priceRange: r }),
  applyFilters: () => set({}),
  resetFilters: () => set({ selectedBrands: [], selectedCategory: null, priceRange: [0, 1000] }),
  getFilteredProducts: () => {
    const { products, searchQuery, selectedCategory, selectedBrands, priceRange } = get();
    return products.filter((p) => {
      if (searchQuery && !p.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (selectedCategory && p.category !== selectedCategory) return false;
      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand)))
        return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      return true;
    });
  },
}));
