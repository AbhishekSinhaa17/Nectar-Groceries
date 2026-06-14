import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, SlidersHorizontal, X, Search, Star, ChevronDown } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useFilterStore, SortOption } from "@/stores/useFilterStore";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton } from "@/components/shared/Skeletons";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { CATEGORIES, BRANDS } from "@/data/mockData";
import { unslugify } from "@/utils/helpers";
import { ProductCategory } from "@/types";

export const Route = createFileRoute("/_app/category/$name")({
  head: ({ params }) => ({
    meta: [
      { title: `${unslugify(params.name)} — Nectar` },
      { name: "description", content: `Shop ${unslugify(params.name)} on Nectar.` },
    ],
  }),
  component: CategoryListing,
});

const FILTER_BRANDS = BRANDS;

function CategoryListing() {
  const { name } = Route.useParams();
  const navigate = useNavigate();
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const {
    selectedCategories,
    selectedBrands,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
    toggleCategory,
    toggleBrand,
    resetFilters,
    removeFilter,
  } = useFilterStore();

  const [showFilter, setShowFilter] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (products.length === 0) void fetchProducts();
  }, [products.length, fetchProducts]);

  const baseCategory = useMemo(() => {
    const target = unslugify(name).toLowerCase();
    return CATEGORIES.find((c) => c.name.toLowerCase() === target)?.name;
  }, [name]);

  const filtered = useMemo(() => {
    const result = products.filter((p) => {

      const activeCats =
        selectedCategories.length > 0 ? selectedCategories : baseCategory ? [baseCategory] : [];
      if (activeCats.length > 0 && !activeCats.includes(p.category)) return false;

      if (selectedBrands.length > 0 && (!p.brand || !selectedBrands.includes(p.brand))) return false;

      if (p.price < minPrice || p.price > maxPrice) return false;

      if (p.rating < minRating) return false;

      if (inStockOnly && !p.inStock) return false;

      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;

      return true;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "price_low_high":
          return a.price - b.price;
        case "price_high_low":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
          return b.id.localeCompare(a.id);
        case "popularity":
        default:
          return b.reviewCount - a.reviewCount;
      }
    });

    return result;
  }, [
    products,
    baseCategory,
    selectedCategories,
    selectedBrands,
    search,
    minPrice,
    maxPrice,
    minRating,
    inStockOnly,
    sortBy,
  ]);

  const activeChips = useMemo(() => {
    const chips: Array<{ label: string; onRemove: () => void }> = [];
    selectedCategories.forEach((c) => {
      const match = CATEGORIES.find((fc) => fc.name === c);
      chips.push({ label: match ? match.name : c, onRemove: () => removeFilter("category", c) });
    });
    selectedBrands.forEach((b) => {
      chips.push({ label: b, onRemove: () => removeFilter("brand", b) });
    });
    if (minPrice > 0 || maxPrice < 100) {
      chips.push({ label: `$${minPrice} - $${maxPrice}`, onRemove: () => removeFilter("price") });
    }
    if (minRating > 0) {
      chips.push({ label: `${minRating}★+`, onRemove: () => removeFilter("rating") });
    }
    if (inStockOnly) {
      chips.push({ label: "In Stock", onRemove: () => removeFilter("stock") });
    }
    return chips;
  }, [selectedCategories, selectedBrands, minPrice, maxPrice, minRating, inStockOnly, removeFilter]);

  return (
    <div className="animate-page-in mx-auto max-w-7xl px-4 pt-6 lg:flex lg:gap-8 lg:px-8 pb-24 lg:pb-12">
      <aside className="hidden w-72 shrink-0 lg:block">
        <div className="sticky top-24">
          <FilterPanel
            categories={CATEGORIES.map((c) => ({ label: c.name, value: c.name }))}
            selectedCategories={selectedCategories}
            toggleCategory={toggleCategory}
            brands={FILTER_BRANDS}
            selectedBrands={selectedBrands}
            toggleBrand={toggleBrand}
          />
        </div>
      </aside>

      <div className="flex-1">
        <div className="relative flex items-center justify-center min-h-[40px]">
          <button
            onClick={() => navigate({ to: "/explore" })}
            aria-label="Back"
            className="absolute left-0 rounded-full p-2 hover:bg-[#F2F3F2] transition"
          >
            <ArrowLeft className="h-6 w-6 text-[#181725]" />
          </button>
          <h1 className="text-xl font-bold text-[#181725] capitalize text-center">{unslugify(name)}</h1>
          <button
            onClick={() => setShowFilter(true)}
            aria-label="Filters"
            className="absolute right-0 lg:hidden rounded-full p-2 hover:bg-[#F2F3F2] transition"
          >
            <SlidersHorizontal className="h-6 w-6 text-[#181725]" />
          </button>
        </div>

        {activeChips.length > 0 && (
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-[#7C7C7C]">Active Filters:</span>
            {activeChips.map((chip, idx) => (
              <span
                key={idx}
                className="flex items-center gap-1 rounded-full bg-[#53B175]/10 px-3 py-1.5 text-sm font-semibold text-[#53B175] border border-[#53B175]/20"
              >
                {chip.label}
                <button onClick={chip.onRemove} className="ml-1 hover:text-red-500 transition">
                  <X className="h-3.5 w-3.5" />
                </button>
              </span>
            ))}
            <button
              onClick={resetFilters}
              className="text-sm font-semibold text-[#181725] underline ml-2"
            >
              Clear All
            </button>
          </div>
        )}

        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : error ? (
            <div className="col-span-full">
              <ErrorState
                title="Failed to load products"
                description={error}
                onRetry={fetchProducts}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="col-span-full">
              <EmptyState
                title="No products match your filters"
                description="Try adjusting your search or clearing filters."
                icon={<Search className="h-10 w-10" />}
                actionLabel="Clear Filters"
                onAction={resetFilters}
              />
            </div>
          ) : (
            filtered.map((p) => <ProductCard key={p.id} product={p} />)
          )}
        </div>
      </div>

      {showFilter && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 72, zIndex: 999, background: '#fff' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '16px 20px', borderBottom: '1px solid #E2E2E2' }}>
            <button onClick={() => setShowFilter(false)} style={{ position: 'absolute', left: 20, background: 'none', border: 'none', cursor: 'pointer', padding: 4 }}>
              <X className="h-5 w-5 text-[#181725]" />
            </button>
            <span style={{ fontSize: 18, fontWeight: 700, color: '#181725' }}>Filters</span>
          </div>

                    <div style={{ background: '#F2F3F2', borderRadius: '20px 20px 0 0', flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 24px 24px 24px' }}>
                            <div style={{ fontSize: 18, fontWeight: 600, color: '#181725', marginBottom: 16 }}>Categories</div>
              {CATEGORIES.map((c) => {
                const active = selectedCategories.includes(c.name);
                return (
                  <div key={c.name} onClick={() => toggleCategory(c.name)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: active ? '2px solid #53B175' : '2px solid #B1B1B1', background: active ? '#53B175' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {active && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: active ? '#53B175' : '#181725' }}>{c.name}</span>
                  </div>
                );
              })}

                            <div style={{ fontSize: 18, fontWeight: 600, color: '#181725', marginBottom: 16, marginTop: 24 }}>Brand</div>
              {FILTER_BRANDS.map((b) => {
                const active = selectedBrands.includes(b);
                return (
                  <div key={b} onClick={() => toggleBrand(b)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, cursor: 'pointer' }}>
                    <div style={{ width: 22, height: 22, borderRadius: 6, border: active ? '2px solid #53B175' : '2px solid #B1B1B1', background: active ? '#53B175' : '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {active && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 500, color: active ? '#53B175' : '#181725' }}>{b}</span>
                  </div>
                );
              })}
            </div>

                        <div style={{ padding: '16px 24px 32px 24px', flexShrink: 0 }}>
              <button
                onClick={() => setShowFilter(false)}
                style={{ display: 'block', width: '100%', height: 56, borderRadius: 19, backgroundColor: '#53B175', color: '#fff', fontSize: 17, fontWeight: 600, border: 'none', cursor: 'pointer' }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function FilterPanel({
  categories,
  selectedCategories,
  toggleCategory,
  brands,
  selectedBrands,
  toggleBrand,
}: {
  categories: { label: string; value: ProductCategory }[];
  selectedCategories: ProductCategory[];
  toggleCategory: (c: ProductCategory) => void;
  brands: string[];
  selectedBrands: string[];
  toggleBrand: (b: string) => void;
}) {
  return (
    <div className="space-y-8 lg:rounded-2xl lg:border lg:border-[#E2E2E2] lg:bg-white lg:p-6">
      <div>
        <h2 className="text-[20px] font-semibold text-[#181725] mb-5">Categories</h2>
        <ul className="space-y-4">
          {categories.map((c) => (
            <li key={c.value}>
              <label
                className={`flex cursor-pointer items-center gap-3 text-[16px] font-medium transition ${
                  selectedCategories.includes(c.value) ? "text-[#53B175]" : "text-[#181725]"
                }`}
              >
                <Checkbox
                  checked={selectedCategories.includes(c.value)}
                  onChange={() => toggleCategory(c.value)}
                />
                {c.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2 className="text-[20px] font-semibold text-[#181725] mb-5">Brand</h2>
        <ul className="space-y-4">
          {brands.map((b) => (
            <li key={b}>
              <label
                className={`flex cursor-pointer items-center gap-3 text-[16px] font-medium transition ${
                  selectedBrands.includes(b) ? "text-[#53B175]" : "text-[#181725]"
                }`}
              >
                <Checkbox
                  checked={selectedBrands.includes(b)}
                  onChange={() => toggleBrand(b)}
                />
                {b}
              </label>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function Checkbox({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={onChange}
      className={`grid h-[22px] w-[22px] shrink-0 place-items-center rounded-[6px] border transition-colors ${checked ? "border-[#53B175] bg-[#53B175]" : "border-[#C2C2C2] bg-white"}`}
    >
      {checked && <CheckIcon className="h-3.5 w-3.5 text-white" strokeWidth={3} />}
    </button>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}
