import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { X } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useCartStore } from "@/store/useCartStore";

export const Route = createFileRoute("/order-failed")({
  head: () => ({
    meta: [
      { title: "Order Failed — Nectar" },
      { name: "description", content: "Your order could not be placed." },
    ],
  }),
  component: OrderFailed,
});

function OrderFailed() {
  const navigate = useNavigate();
  const { error, placeOrder, completeOrder, failOrder, loading } = useOrderStore();
  const { clearCart } = useCartStore();

  const handleRetry = () => {
    placeOrder();

    setTimeout(() => {
      if (Math.random() > 0.2) {
        completeOrder();
        clearCart();
        navigate({ to: "/order-accepted" });
      } else {
        failOrder("Something went tembly wrong.");
      }
    }, 2000);
  };

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-[#181725]/40 px-4">
      <div className="relative w-full max-w-sm rounded-[30px] bg-white px-6 pb-8 pt-6 shadow-2xl animate-scale-in flex flex-col items-center text-center">
        <Link
          to="/cart"
          aria-label="Close"
          className="absolute left-6 top-6 transition active:scale-90"
        >
          <X className="h-6 w-6 text-[#181725]" strokeWidth={2.5} />
        </Link>

        <div className="mt-12 mb-8 relative flex items-center justify-center w-48 h-48">
          <div className="absolute inset-0 rounded-full bg-[#53B175]/10" />

          <div className="relative w-32 h-36">
            <div className="absolute bottom-0 w-full h-[60%] bg-[#C69A6B] rounded-sm" />

            <svg
              className="absolute top-2 left-2 w-8 h-16 text-[#84CC16]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 22 C4 10 12 2 12 2 C12 2 20 10 20 22 Z" />
            </svg>
            <svg
              className="absolute top-4 left-6 w-6 h-12 text-[#22C55E]"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M4 22 C4 10 12 2 12 2 C12 2 20 10 20 22 Z" />
            </svg>

            <div className="absolute top-8 right-6 w-6 h-12 bg-[#7E22CE] rounded-full rotate-[15deg]" />
            <div className="absolute top-7 right-8 w-2 h-3 bg-[#22C55E] rounded-t-sm rotate-[15deg]" />

            <div className="absolute top-4 right-2 w-8 h-20 bg-[#FBBF24] rounded-t-full rounded-b-sm rotate-[20deg]">
              <div className="absolute top-2 left-2 w-4 h-1 bg-[#D97706] rounded-full rotate-[-20deg]" />
              <div className="absolute top-6 left-2 w-4 h-1 bg-[#D97706] rounded-full rotate-[-20deg]" />
              <div className="absolute top-10 left-2 w-4 h-1 bg-[#D97706] rounded-full rotate-[-20deg]" />
            </div>

            <div className="absolute top-10 left-2 w-8 h-8 bg-[#EF4444] rounded-full" />
            <div className="absolute top-7 left-2 w-1 h-4 bg-[#22C55E] rotate-[-20deg]" />

            <div className="absolute top-8 left-8 w-8 h-14 bg-[#93C5FD] rounded-b-lg rounded-t-sm border-t-8 border-[#3B82F6]" />
            <div className="absolute top-6 left-10 w-4 h-2 bg-[#1E3A8A]" />

            <div className="absolute top-12 left-16 w-6 h-12 bg-[#EA580C] rounded-full">
              <div className="absolute top-2 left-2 w-1 h-1 bg-[#9A3412] rounded-full" />
              <div className="absolute top-6 left-3 w-1 h-1 bg-[#9A3412] rounded-full" />
              <div className="absolute top-8 left-1 w-1 h-1 bg-[#9A3412] rounded-full" />
            </div>

            <div className="absolute top-14 left-4 w-10 h-8 bg-[#EF4444] rounded-full" />
            <div className="absolute top-13 left-8 w-2 h-2 bg-[#22C55E]" />

            <div className="absolute top-10 right-0 w-4 h-10 bg-[#FDE047] rounded-full rotate-[10deg]" />

            <div className="absolute bottom-0 w-full h-[55%] bg-[#D4A373] rounded-sm shadow-inner" />
            <div className="absolute bottom-0 left-2 w-2 h-[55%] bg-[#C69A6B]" />
          </div>
        </div>

        <h1 className="text-[26px] font-bold text-[#181725] mb-3">Oops! Order Failed</h1>
        <p className="text-[#7C7C7C] text-sm mb-10">Something went tembly wrong.</p>

        <div className="w-full flex flex-col gap-3">
          <button
            onClick={handleRetry}
            disabled={loading}
            className="w-full py-[18px] rounded-[20px] bg-[#53B175] text-white font-semibold text-lg transition active:scale-95 disabled:opacity-70 flex items-center justify-center"
          >
            {loading ? "Retrying..." : "Please Try Again"}
          </button>
          <Link
            to="/home"
            className="w-full py-[18px] rounded-[20px] bg-transparent text-[#181725] font-semibold text-lg transition active:scale-95"
          >
            Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
