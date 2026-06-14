import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { MapPin, Search as SearchIcon, X, AlertCircle, PackageSearch } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import type { Product } from "@/types";
import { useAuthStore } from "@/store/useAuthStore";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton, CategorySkeleton } from "@/components/shared/Skeletons";
import { CategoryCard } from "@/components/shared/CategoryCard";
import { CATEGORIES } from "@/data/mockData";
import { useDebounce } from "@/hooks/useDebounce";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import { useRecentlyViewedStore } from "@/stores/useRecentlyViewedStore";
import { ErrorState } from "@/components/shared/ErrorState";
import { motion, AnimatePresence } from "framer-motion";
import { slugify } from "@/utils/helpers";

export const Route = createFileRoute("/_app/home")({
  head: () => ({
    meta: [
      { title: "Shop — Nectar" },
      {
        name: "description",
        content: "Browse fresh groceries: fruits, vegetables, dairy, meat, and more.",
      },
    ],
  }),
  component: Home,
});

const BANNERS = [
  {
    title: "Fresh Vegetables",
    sub: "Get Up To 40% OFF",
    from: "from-emerald-500",
    to: "to-emerald-700",
    image: "/images/mock/veg.png",
    fullImage: "/images/mock/banner_veg.png",
  },
  {
    title: "Dairy & Eggs",
    sub: "Daily essentials, daily fresh",
    from: "from-[#FFF9E5]",
    to: "to-[#FFF0C2]",
    textColor: "text-[#181725]",
    subColor: "text-[#E6A000]",
    images: [
      { src: "/images/mock/milk.png", className: "absolute -left-6 lg:-left-12 bottom-0 h-[120%] lg:h-[130%] object-contain drop-shadow-2xl" },
      { src: "/images/mock/egg.png", className: "absolute left-24 lg:left-36 -top-4 h-[40%] lg:h-[50%] object-contain opacity-90 drop-shadow-xl" },
      { src: "/images/mock/cheese.png", className: "absolute -right-4 lg:-right-8 bottom-0 h-[80%] lg:h-[100%] object-contain drop-shadow-2xl" }
    ]
  },
  { 
    title: "Beverages", 
    sub: "Chill, sip, repeat", 
    from: "from-[#F2F8FF]", 
    to: "to-[#D9EBFF]",
    textColor: "text-[#181725]",
    subColor: "text-[#0066CC]",
    images: [
      { src: "/images/mock/drinks.png", className: "absolute -left-4 lg:-left-8 bottom-0 h-[110%] lg:h-[120%] object-contain drop-shadow-2xl" },
      { src: "/images/mock/coke.png", className: "absolute right-12 lg:right-24 -top-8 h-[60%] lg:h-[70%] object-contain opacity-90 drop-shadow-xl rotate-12" },
      { src: "/images/mock/sprite.png", className: "absolute -right-8 lg:-right-12 -bottom-4 h-[70%] lg:h-[90%] object-contain drop-shadow-2xl -rotate-12" }
    ]
  },
];

function Home() {
  const { products, isLoading, error, fetchProducts } = useProductStore();
  const user = useAuthStore((s) => s.user);
  const { viewedItems } = useRecentlyViewedStore();
  const [banner, setBanner] = useState(0);
  const isCategoryLoading = useDelayedLoading(1000);

  const [input, setInput] = useState("");
  const debouncedQuery = useDebounce(input, 500);
  const isSearching = input !== debouncedQuery;

  useEffect(() => {
    if (products.length === 0) void fetchProducts();
  }, [products.length, fetchProducts]);

  useEffect(() => {
    const t = window.setInterval(() => setBanner((b) => (b + 1) % BANNERS.length), 3000);
    return () => window.clearInterval(t);
  }, []);

  const searchResults = useMemo(() => {
    if (!debouncedQuery.trim()) return [];
    return products.filter((p) => p.name.toLowerCase().includes(debouncedQuery.toLowerCase()));
  }, [products, debouncedQuery]);

  const exclusive = products.slice(0, 6);
  const bestSelling = products.slice(6, 12);
  const grocery = useMemo(() => {
    const beef = products.find((p) => p.name === "Beef Bone");
    const chicken = products.find((p) => p.name === "Broiler Chicken");
    const baseGrocery = products.slice(12, 22).filter(
      (p) => p.name !== "Beef Bone" && p.name !== "Broiler Chicken"
    );
    return [beef, chicken, ...baseGrocery].filter(Boolean) as typeof products;
  }, [products]);

  const groceryCategories = useMemo(() => {
    const pulses = CATEGORIES.find((c) => c.name === "Pulses");
    const rice = CATEGORIES.find((c) => c.name === "Rice");
    const rest = CATEGORIES.filter((c) => c.name !== "Pulses" && c.name !== "Rice");
    return [pulses, rice, ...rest].filter(Boolean).slice(0, 4) as typeof CATEGORIES;
  }, []);

  return (
    <div className="animate-page-in mx-auto max-w-7xl px-4 pt-6 lg:px-8">
      <div className="mb-6 flex flex-col items-center gap-1">
        <span className="text-3xl lg:hidden">🥕</span>
        <span className="flex items-center gap-1 text-sm font-semibold text-[#4C4F4D] lg:hidden">
          <MapPin className="h-4 w-4" /> {user?.location ?? "Dhaka, Bansree"}
        </span>
      </div>

      <div className="mb-6 flex h-14 items-center gap-2 rounded-2xl bg-[#F2F3F2] px-4 border border-transparent focus-within:border-[#53B175] transition-colors shadow-sm relative z-20">
        <SearchIcon className="h-5 w-5 text-[#181725]" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Search store"
          className="flex-1 bg-transparent text-base font-medium outline-none placeholder:text-[#7C7C7C] text-[#181725]"
        />
        {input && (
          <button
            onClick={() => setInput("")}
            className="p-1 rounded-full hover:bg-gray-200 transition"
          >
            <X className="h-4 w-4 text-[#7C7C7C]" />
          </button>
        )}
      </div>

      <AnimatePresence mode="wait">
        {error ? (
          <motion.div
            key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-16"
          >
            <ErrorState title="Failed to load store" description={error} onRetry={fetchProducts} />
          </motion.div>
        ) : input ? (
          <motion.div
            key="search-results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {isSearching ? (
              <div className="py-16 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-[#E2E2E2] border-t-[#53B175] mb-4" />
                <p className="text-sm font-semibold text-[#7C7C7C]">Searching...</p>
              </div>
            ) : (
              <div className="mt-2">
                <h3 className="text-lg font-bold text-[#181725] mb-4">
                  Search Results for "{debouncedQuery}"
                </h3>
                {searchResults.length === 0 ? (
                  <div className="py-16 text-center">
                    <p className="text-sm font-semibold text-[#7C7C7C]">No products found</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {searchResults.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </motion.div>
        ) : products.length === 0 && !isLoading ? (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <div className="rounded-full bg-gray-100 p-6 mb-4">
              <PackageSearch className="h-12 w-12 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#181725]">No products found</h2>
            <p className="mt-2 text-[#7C7C7C]">We couldn't find any products in our store.</p>
                      </motion.div>
        ) : (
          <motion.div
            key="home-content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="lg:flex lg:gap-8 lg:items-start">
              <aside className="hidden lg:block lg:w-72 lg:shrink-0 sticky top-24">
                <h2 className="text-xl font-bold text-[#181725] mb-6">Explore Categories</h2>
                <div className="space-y-4">
                  {isCategoryLoading
                    ? Array.from({ length: 6 }).map((_, i) => (
                        <div
                          key={i}
                          className="flex items-center gap-4 rounded-2xl border border-[#E2E2E2] p-4 bg-white"
                        >
                          <div className="h-12 w-12 animate-pulse rounded-xl bg-gray-200 shrink-0" />
                          <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
                        </div>
                      ))
                    : CATEGORIES.map((c) => (
                        <Link
                          key={c.name}
                          to="/category/$name"
                          params={{ name: slugify(c.name) }}
                          className={`flex items-center gap-4 rounded-2xl border border-[#E2E2E2] p-4 transition active:scale-95 hover:shadow-sm ${c.bg}`}
                        >
                          <img src={c.image} alt={c.name} className="h-12 w-12 object-contain" />
                          <span className="font-semibold text-[#181725]">{c.name}</span>
                        </Link>
                      ))}
                </div>
              </aside>

              <div className="flex-1 min-w-0">
                <div
                  className={`relative overflow-hidden w-full rounded-2xl ${
                    BANNERS[banner].fullImage 
                      ? "bg-[#F2F3F2]" 
                      : `bg-gradient-to-r ${BANNERS[banner].from} ${BANNERS[banner].to} p-6 lg:p-16 flex items-center justify-center`
                  } min-h-[160px] lg:h-[400px] transition-all duration-500`}
                >
                  {BANNERS[banner].fullImage ? (
                    <img src={BANNERS[banner].fullImage} alt={BANNERS[banner].title} className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <>
                      <div className="relative z-10 flex flex-col items-center justify-center text-center">
                        <h2 className={`text-2xl lg:text-5xl font-bold ${BANNERS[banner].textColor || 'text-white'}`}>{BANNERS[banner].title}</h2>
                        <p className={`mt-1 lg:mt-4 text-xs lg:text-lg font-medium ${BANNERS[banner].subColor || 'text-white opacity-90'}`}>
                          {BANNERS[banner].sub}
                        </p>
                      </div>
                      {BANNERS[banner].images && BANNERS[banner].images.map((img, idx) => (
                        <img 
                          key={idx}
                          src={img.src} 
                          alt="" 
                          className={img.className}
                        />
                      ))}
                    </>
                  )}
                </div>
                <div className="mt-3 flex justify-center gap-2">
                  {BANNERS.map((_, i) => (
                    <span
                      key={i}
                      className={`h-1.5 w-1.5 rounded-full ${i === banner ? "bg-[#53B175]" : "bg-[#E2E2E2]"}`}
                    />
                  ))}
                </div>

                <Section title="Exclusive Offer" items={exclusive} loading={isLoading} />
                <Section title="Best Selling" items={bestSelling} loading={isLoading} />

                <div className="mt-8 lg:hidden">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-[#181725]">Groceries</h3>
                    <Link to="/explore" className="text-sm font-semibold text-[#53B175]">
                      See all
                    </Link>
                  </div>
                  <div className="mt-4 flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar">
                    {isCategoryLoading
                      ? Array.from({ length: 4 }).map((_, i) => (
                          <div key={i} className="w-[248px] shrink-0">
                            <CategorySkeleton />
                          </div>
                        ))
                      : groceryCategories.map((c) => (
                          <div key={c.name} className="w-[248px] shrink-0">
                            <CategoryCard category={c} variant="horizontal" />
                          </div>
                        ))}
                  </div>
                </div>

                <div className="mt-6 lg:mt-8">

                  <div className="flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:overflow-visible lg:pb-0">
                    {isLoading
                      ? Array.from({ length: 10 }).map((_, i) => (
                          <div key={i} className="w-44 shrink-0 lg:w-auto">
                            <ProductCardSkeleton />
                          </div>
                        ))
                      : grocery.map((p) => (
                          <div key={p.id} className="w-44 shrink-0 lg:w-auto">
                            <ProductCard product={p} />
                          </div>
                        ))}
                  </div>
                </div>

                {viewedItems.length > 0 && (
                  <Section title="Recently Viewed" items={viewedItems} loading={false} />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section({ title, items, loading }: { title: string; items: Product[]; loading: boolean }) {
  return (
    <div className="mt-8 lg:mt-12">
      <div className="flex items-center justify-between">
        <h3 className="text-lg lg:text-xl font-bold text-[#181725]">{title}</h3>
        <Link to="/explore" className="text-sm font-semibold text-[#53B175]">
          See all
        </Link>
      </div>
      <div className="mt-4 flex gap-4 overflow-x-auto pb-4 pt-2 hide-scrollbar lg:grid lg:grid-cols-4 xl:grid-cols-5 lg:overflow-visible lg:pb-0">
        {loading
          ? Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="w-[160px] shrink-0 lg:w-auto">
                <ProductCardSkeleton />
              </div>
            ))
          : items.slice(0, 5).map((p) => (
              <div key={p.id} className="w-44 shrink-0 lg:w-auto">
                <ProductCard product={p} />
              </div>
            ))}
      </div>
    </div>
  );
}
