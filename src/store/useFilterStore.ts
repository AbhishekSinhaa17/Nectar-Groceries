import { create } from "zustand";
import { persist } from "zustand/middleware";
import { ProductCategory } from "@/types";

export type SortOption = "popularity" | "price_low_high" | "price_high_low" | "rating" | "newest";

interface FilterState {
  selectedCategories: ProductCategory[];
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: SortOption;

  setCategory: (category: ProductCategory, active: boolean) => void;
  toggleCategory: (category: ProductCategory) => void;
  toggleBrand: (brand: string) => void;
  setPriceRange: (min: number, max: number) => void;
  setRating: (rating: number) => void;
  toggleInStock: () => void;
  setSortBy: (sort: SortOption) => void;
  resetFilters: () => void;
  removeFilter: (type: "category" | "brand" | "price" | "rating" | "stock", value?: string) => void;
}

const initialState = {
  selectedCategories: [],
  selectedBrands: [],
  minPrice: 0,
  maxPrice: 100,
  minRating: 0,
  inStockOnly: false,
  sortBy: "popularity" as SortOption,
};

export const useFilterStore = create<FilterState>()(
  persist(
    (set) => ({
      ...initialState,

      setCategory: (category, active) =>
        set((state) => ({
          selectedCategories: active
            ? [...state.selectedCategories, category]
            : state.selectedCategories.filter((c) => c !== category),
        })),

      toggleCategory: (category) =>
        set((state) => {
          const exists = state.selectedCategories.includes(category);
          return {
            selectedCategories: exists
              ? state.selectedCategories.filter((c) => c !== category)
              : [...state.selectedCategories, category],
          };
        }),

      toggleBrand: (brand) =>
        set((state) => {
          const exists = state.selectedBrands.includes(brand);
          return {
            selectedBrands: exists
              ? state.selectedBrands.filter((b) => b !== brand)
              : [...state.selectedBrands, brand],
          };
        }),

      setPriceRange: (min, max) => set({ minPrice: min, maxPrice: max }),

      setRating: (rating) => set({ minRating: rating }),

      toggleInStock: () => set((state) => ({ inStockOnly: !state.inStockOnly })),

      setSortBy: (sort) => set({ sortBy: sort }),

      resetFilters: () => set({ ...initialState }),

      removeFilter: (type, value) =>
        set((state) => {
          switch (type) {
            case "category":
              return {
                selectedCategories: state.selectedCategories.filter((c) => c !== value),
              };
            case "brand":
              return {
                selectedBrands: state.selectedBrands.filter((b) => b !== value),
              };
            case "price":
              return { minPrice: initialState.minPrice, maxPrice: initialState.maxPrice };
            case "rating":
              return { minRating: initialState.minRating };
            case "stock":
              return { inStockOnly: initialState.inStockOnly };
            default:
              return state;
          }
        }),
    }),
    {
      name: "filter-storage",
    },
  ),
);
