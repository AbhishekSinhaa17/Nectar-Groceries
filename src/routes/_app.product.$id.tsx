import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { ArrowLeft, ChevronDown, ChevronUp, Heart, Minus, Plus, Share2, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { useProductStore } from "@/store/useProductStore";
import { useCartStore } from "@/store/useCartStore";
import { useFavouritesStore } from "@/store/useFavouritesStore";
import { useRecentlyViewedStore } from "@/store/useRecentlyViewedStore";
import { formatPrice } from "@/utils/helpers";
import { PRODUCTS } from "@/data/mockData";
import { ProductCard } from "@/components/shared/ProductCard";
import { ProductCardSkeleton, ProductDetailsSkeleton } from "@/components/shared/Skeletons";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";

export const Route = createFileRoute("/_app/product/$id")({
  head: ({ params }) => {
    const p = PRODUCTS.find((x) => x.id === params.id);
    return {
      meta: [
        { title: `${p?.name ?? "Product"} — Nectar` },
        { name: "description", content: p?.description ?? "Fresh grocery item on Nectar." },
        ...(p ? [{ property: "og:image", content: p.image }] : []),
      ],
    };
  },
  component: ProductDetail,
});

function ProductDetail() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const addItem = useCartStore((s) => s.addItem);
  const { isFavourite, toggleFavourite } = useFavouritesStore();
  const { viewedItems, addViewedProduct } = useRecentlyViewedStore();
  const [qty, setQty] = useState(1);
  const [openDetail, setOpenDetail] = useState(true);
  const isPageLoading = useDelayedLoading();

  useEffect(() => {
    if (products.length === 0) void fetchProducts();
  }, [products.length, fetchProducts]);

  const product = (products.length > 0 ? products : PRODUCTS).find((p) => p.id === id);

  useEffect(() => {
    if (product) {
      addViewedProduct(product);
    }
  }, [product, addViewedProduct]);

  if (!product) {
    return <div className="p-12 text-center text-sm text-[#7C7C7C]">Product not found.</div>;
  }

  const relatedProducts = products
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 5);

  const fav = isFavourite(product.id);

  const addToBasket = () => {
    for (let i = 0; i < qty; i++) addItem(product);
    navigate({ to: "/cart" });
  };

  if (isPageLoading) {
    return <ProductDetailsSkeleton />;
  }

  return (
    <>
      <div className="animate-page-in mx-auto max-w-7xl pb-32 lg:px-8 lg:pt-8 lg:pb-12">
        <div className="lg:grid lg:grid-cols-2 lg:gap-12">
          <div className="bg-transparent lg:rounded-3xl">
            <div className="flex items-center justify-between px-6 pt-6 lg:hidden">
              <button onClick={() => window.history.back()} aria-label="Back">
                <ArrowLeft className="h-6 w-6 text-[#181725]" />
              </button>
              <button aria-label="Share">
                <Share2 className="h-5 w-5 text-[#181725]" />
              </button>
            </div>
            <div className="flex h-64 items-center justify-center px-6 lg:h-96">
              <img src={product.image} alt={product.name} className="max-h-full object-contain" />
            </div>
          </div>

          <div className="px-6 pt-6 lg:pt-0">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-2xl font-bold text-[#181725]">{product.name}</h1>
                <p className="mt-1 text-sm text-[#7C7C7C]">{product.weight}, Price</p>
              </div>
              <button
                onClick={() => toggleFavourite(product)}
                aria-label="Favourite"
                className="shrink-0"
              >
                <Heart
                  className={`h-6 w-6 ${fav ? "fill-[#53B175] stroke-[#53B175]" : "stroke-[#7C7C7C]"}`}
                />
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-[#E2E2E2] text-[#B6B6B6]"
                  aria-label="Decrease"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center text-lg font-semibold text-[#181725]">{qty}</span>
                <button
                  onClick={() => setQty((q) => q + 1)}
                  className="grid h-12 w-12 place-items-center rounded-2xl border border-[#E2E2E2] text-[#53B175]"
                  aria-label="Increase"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <span className="text-2xl font-bold text-[#181725]">
                {formatPrice(product.price * qty)}
              </span>
            </div>

            <div className="mt-6 border-t border-[#E2E2E2]">
              <button
                onClick={() => setOpenDetail((v) => !v)}
                className="flex w-full items-center justify-between py-4"
              >
                <span className="text-base font-semibold text-[#181725]">Product Detail</span>
                {openDetail ? (
                  <ChevronUp className="h-5 w-5 text-[#181725]" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-[#181725]" />
                )}
              </button>
              {openDetail && (
                <p className="pb-4 text-sm leading-relaxed text-[#7C7C7C]">{product.description}</p>
              )}
            </div>

            <Row
              label="Nutritions"
              right={
                <span className="rounded bg-[#EBEBEB] px-2 py-0.5 text-xs font-semibold text-[#7C7C7C]">
                  {product.nutritions ?? "100gr"}
                </span>
              }
            />
            <Row
              label="Review"
              right={
                <span className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-[#F3603F] text-[#F3603F]" : "fill-transparent stroke-[#E2E2E2]"}`}
                    />
                  ))}
                </span>
              }
            />
          </div>

          <div className="hidden lg:block lg:col-span-2 lg:pt-6">
            <button
              onClick={addToBasket}
              className="h-[60px] w-full rounded-[20px] bg-[#53B175] font-semibold text-lg text-white transition active:scale-95 lg:max-w-sm"
            >
              Add To Basket
            </button>
          </div>
        </div>

        <div className="hidden lg:block mt-16 space-y-12 px-6 lg:px-0">
          {relatedProducts.length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-[#181725] mb-6">Related Products</h3>
              <div className="grid grid-cols-5 gap-4">
                {relatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          )}

          {viewedItems.filter((p) => p.id !== product.id).length > 0 && (
            <div>
              <h3 className="text-xl font-bold text-[#181725] mb-6">Recently Viewed</h3>
              <div className="grid grid-cols-5 gap-4">
                {viewedItems
                  .filter((p) => p.id !== product.id)
                  .slice(0, 5)
                  .map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#E2E2E2] bg-white p-4 pb-8 lg:hidden shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
        <button
          onClick={addToBasket}
          className="h-[60px] w-full rounded-[20px] bg-[#53B175] font-semibold text-lg text-white transition active:scale-95"
        >
          Add To Basket
        </button>
      </div>
    </>
  );
}

function Row({ label, right }: { label: string; right: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-t border-[#E2E2E2] py-4">
      <span className="text-base font-semibold text-[#181725]">{label}</span>
      <div className="flex items-center gap-2 text-sm text-[#7C7C7C]">
        {right}
        <ChevronDown className="h-4 w-4 -rotate-90" />
      </div>
    </div>
  );
}
