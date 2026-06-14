import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, X, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { formatPrice } from "@/utils/helpers";
import { EmptyState } from "@/components/shared/EmptyState";
import { CartSkeleton } from "@/components/shared/Skeletons";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import { useState } from "react";
import { CheckoutBottomSheet } from "@/components/checkout/CheckoutBottomSheet";

export const Route = createFileRoute("/_app/cart")({
  head: () => ({
    meta: [
      { title: "My Cart — Nectar" },
      { name: "description", content: "Review your grocery cart and checkout." },
    ],
  }),
  component: Cart,
});

function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, totalPrice } = useCartStore();
  const total = totalPrice();
  const isPageLoading = useDelayedLoading();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  return (
    <>
      <div className="animate-page-in mx-auto max-w-7xl px-4 pt-6 lg:px-8">
        <h1 className="border-b border-[#E2E2E2] pb-4 text-center text-xl font-bold text-[#181725]">
          My Cart
        </h1>

        {isPageLoading ? (
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 pb-24 lg:pb-0">
            <ul className="divide-y divide-[#E2E2E2]">
              {Array.from({ length: 3 }).map((_, i) => (
                <CartSkeleton key={i} />
              ))}
            </ul>
          </div>
        ) : items.length === 0 ? (
          <EmptyState
            title="Your cart is empty"
            description="Looks like you haven't added any items to your cart yet."
            icon={<ShoppingBag className="h-10 w-10" />}
            actionLabel="Start Shopping"
            onAction={() => navigate({ to: "/home" })}
          />
        ) : (
          <div className="lg:grid lg:grid-cols-[1fr_400px] lg:gap-8 pb-24 lg:pb-0">
            <div className="lg:rounded-2xl lg:border lg:border-[#E2E2E2] lg:p-6 bg-white">
              <ul className="divide-y divide-[#E2E2E2]">
                {items.map(({ product, quantity }) => (
                  <li key={product.id} className="flex gap-6 py-8 lg:py-8">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-20 lg:h-24 lg:w-24 rounded-xl bg-transparent object-contain shrink-0"
                    />
                    <div className="flex flex-1 flex-col justify-between gap-4 lg:gap-6">
                      <div className="flex items-start justify-between">
                        <div className="min-w-0 pr-4">
                          <p className="truncate font-semibold text-[#181725] lg:text-lg">
                            {product.name}
                          </p>
                          <p className="text-xs lg:text-sm text-[#7C7C7C]">
                            {product.weight}, Price
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          aria-label="Remove"
                          className="shrink-0 p-2 -mr-2 transition active:scale-90 hover:bg-[#F2F3F2] rounded-full"
                        >
                          <X className="h-4 w-4 lg:h-5 lg:w-5 text-[#7C7C7C]" />
                        </button>
                      </div>
                      <div className="flex items-end justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="grid h-10 w-10 lg:h-12 lg:w-12 place-items-center rounded-xl border border-[#E2E2E2] text-[#B6B6B6] transition active:scale-95 hover:border-[#53B175] hover:text-[#53B175]"
                            aria-label="Decrease"
                          >
                            <Minus className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                          <span className="w-6 text-center font-semibold text-[#181725] lg:text-lg">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            className="grid h-10 w-10 lg:h-12 lg:w-12 place-items-center rounded-xl border border-[#E2E2E2] text-[#53B175] transition active:scale-95 hover:border-[#53B175]"
                            aria-label="Increase"
                          >
                            <Plus className="h-3 w-3 lg:h-4 lg:w-4" />
                          </button>
                        </div>
                        <span className="text-base lg:text-lg font-bold text-[#181725]">
                          {formatPrice(product.price * quantity)}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <aside className="mt-6 hidden lg:sticky lg:top-24 lg:block lg:h-fit lg:rounded-2xl lg:border lg:border-[#E2E2E2] lg:p-6">
              <h2 className="text-lg font-bold text-[#181725]">Order Summary</h2>
              <div className="mt-4 flex justify-between text-sm text-[#7C7C7C]">
                <span>Subtotal</span>
                <span className="font-semibold text-[#181725]">{formatPrice(total)}</span>
              </div>
              <div className="mt-2 flex justify-between text-sm text-[#7C7C7C]">
                <span>Delivery</span>
                <span className="font-semibold text-[#181725]">Calculated at checkout</span>
              </div>
              <div className="mt-4 flex justify-between border-t border-[#E2E2E2] pt-4 text-base font-bold text-[#181725]">
                <span>Subtotal</span>
                <span>{formatPrice(total)}</span>
              </div>
              <button
                onClick={() => setIsCheckoutOpen(true)}
                className="mt-6 flex h-14 w-full items-center justify-center rounded-full bg-[#53B175] font-semibold text-white transition active:scale-95 hover:bg-[#53B175]/90"
              >
                Go to Checkout
              </button>
            </aside>
          </div>
        )}
      </div>

      {items.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 z-40 border-t border-[#E2E2E2] bg-white p-4 lg:hidden">
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex h-14 w-full items-center justify-between rounded-full bg-[#53B175] px-6 font-semibold text-white transition active:scale-95 hover:bg-[#53B175]/90"
          >
            <span>Go to Checkout</span>
            <span className="rounded-md bg-white/20 px-2 py-1 text-xs">{formatPrice(total)}</span>
          </button>
        </div>
      )}

      <CheckoutBottomSheet isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />
    </>
  );
}
