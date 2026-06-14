import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Check } from "lucide-react";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";

export const Route = createFileRoute("/order-accepted")({
  head: () => ({
    meta: [
      { title: "Order Accepted — Nectar" },
      { name: "description", content: "Your order has been accepted." },
    ],
  }),
  component: OrderAccepted,
});

function OrderAccepted() {
  const navigate = useNavigate();
  const { orderHistory } = useOrderStore();
  const order = orderHistory[0];

  useEffect(() => {
    if (!order) {

    }
  }, [order, navigate]);

  return (
    <div className="min-h-screen bg-[#F2F3F2] lg:py-12 lg:px-4 flex flex-col justify-center">
      <div className="relative flex min-h-[100dvh] flex-col items-center overflow-hidden bg-white px-6 pb-12 pt-20 lg:px-8 lg:max-w-md lg:mx-auto lg:w-full lg:h-[90vh] lg:max-h-[800px] lg:min-h-[650px] lg:py-8 lg:rounded-[30px] lg:shadow-2xl">
            <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-[10%] -left-[10%] w-[60%] h-[60%] rounded-full bg-[#F3F4F6] blur-3xl mix-blend-multiply opacity-70" />
        <div className="absolute top-[20%] -right-[10%] w-[50%] h-[50%] rounded-full bg-[#FCE7F3] blur-3xl mix-blend-multiply opacity-50" />
        <div className="absolute bottom-[0%] left-[10%] w-[70%] h-[70%] rounded-full bg-[#E0E7FF] blur-3xl mix-blend-multiply opacity-40" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-sm text-center h-full flex-1">
        
        <div className="flex flex-col items-center justify-center flex-1 w-full">
                    <div className="relative w-64 h-64 flex items-center justify-center mb-6">
            
                        <div className="absolute inset-0 pointer-events-none">
                            <svg className="absolute top-10 right-4 w-12 h-12 text-[#F25A38]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 20 80 Q 50 80 50 50 T 80 20" />
              </svg>
                            <svg className="absolute bottom-16 left-2 w-16 h-16 text-[#5A7CFF]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 10 90 Q 40 90 40 60 T 90 30" />
              </svg>
                            <svg className="absolute bottom-8 right-12 w-8 h-8 text-[#FFBE3B]" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round">
                <path d="M 20 20 A 40 40 0 0 1 80 80" />
              </svg>
              
                            <div className="absolute top-6 left-24 w-4 h-4 rounded-full bg-[#53B175]" />
              <div className="absolute top-12 left-32 w-2 h-2 rounded-full bg-[#F25A38]" />
              <div className="absolute top-24 left-8 w-3 h-3 rounded-full border-2 border-[#FFBE3B]" />
              <div className="absolute top-32 right-8 w-3 h-3 rounded-full border-2 border-[#D946EF]" />
              <div className="absolute bottom-24 left-16 w-3 h-3 rounded-full border-2 border-[#53B175]" />
              <div className="absolute bottom-20 right-28 w-2 h-2 rounded-full bg-[#53B175]" />
              <div className="absolute bottom-16 right-20 w-4 h-4 rounded-full bg-[#5A7CFF]" />
            </div>

                        <div className="absolute inset-10 rounded-full border-[3px] border-[#53B175] opacity-20" />
            
                        <div className="absolute inset-12 rounded-full border-[3px] border-[#53B175]" />
            
                        <div className="absolute inset-14 rounded-full bg-[#53B175] flex items-center justify-center shadow-lg shadow-[#53B175]/30 animate-scale-in">
              <Check className="w-14 h-14 text-white" strokeWidth={4} />
            </div>
          </div>

                    <h1 className="text-3xl font-bold text-[#181725] mb-4 leading-tight">
            Your Order has been<br />accepted
          </h1>
          <p className="text-[15px] text-[#7C7C7C] leading-relaxed mb-8 px-4">
            Your items has been placcd and is on<br />it's way to being processed
          </p>
        </div>

                <div className="w-full space-y-4 mt-auto">
          <Link
            to="/orders"
            className="flex h-[60px] w-full items-center justify-center rounded-[20px] bg-[#53B175] font-semibold text-white text-lg transition active:scale-95 hover:bg-[#53B175]/90"
          >
            Track Order
          </Link>
          <Link
            to="/home"
            className="flex h-[60px] w-full items-center justify-center rounded-[20px] bg-transparent font-semibold text-[#181725] text-lg transition active:scale-95 hover:bg-black/5"
          >
            Back to home
          </Link>
        </div>
      </div>
      </div>
    </div>
  );
}
