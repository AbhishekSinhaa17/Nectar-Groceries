import { X, ChevronRight, ChevronLeft } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore } from "@/stores/useOrderStore";
import { formatPrice } from "@/utils/helpers";
import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

interface CheckoutBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const DELIVERY_METHODS = [
  { id: "standard", name: "Standard Delivery", price: 0, time: "2-3 days" },
  { id: "express", name: "Express Delivery", price: 5, time: "Tomorrow" },
  { id: "same_day", name: "Same Day Delivery", price: 10, time: "Today by 8 PM" },
];

const PAYMENT_METHODS = [
  { id: "credit_card", name: "Credit Card" },
  { id: "debit_card", name: "Debit Card" },
  { id: "upi", name: "UPI" },
  { id: "cod", name: "Cash On Delivery" },
];

type ActiveSheet = "main" | "delivery" | "payment" | "promo";

export function CheckoutBottomSheet({ isOpen, onClose }: CheckoutBottomSheetProps) {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const { createOrder, placeOrder, completeOrder, failOrder, loading, addresses, defaultAddressId } = useOrderStore();
  
  const [isClosing, setIsClosing] = useState(false);
  const [activeSheet, setActiveSheet] = useState<ActiveSheet>("main");

  const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState("");

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setActiveSheet("main");
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const selectedDelivery = DELIVERY_METHODS.find(d => d.id === deliveryMethod)!;
  const selectedPayment = PAYMENT_METHODS.find(p => p.id === paymentMethod)!;

  const handlePlaceOrder = () => {
    if (items.length === 0) return;

    const subtotal = totalPrice();
    const deliveryFee = selectedDelivery.price;
    const tax = subtotal * 0.05;
    const discount = appliedPromo ? subtotal * 0.1 : 0; // Fake 10% discount
    const total = subtotal + deliveryFee + tax - discount;
    const selectedAddress = addresses.find((a) => a.id === defaultAddressId);

    createOrder({
      items,
      subtotal,
      deliveryFee,
      tax,
      discount,
      total,
      address: selectedAddress || { id: "dummy", name: "Guest", street: "123 Main St", city: "City", zip: "12345" },
      paymentMethod: selectedPayment.name,
      deliveryMethod: selectedDelivery.name,
      estimatedDeliveryTime: selectedDelivery.time,
    });

    placeOrder();

    setTimeout(() => {
      if (Math.random() > 0.2) {
        completeOrder();
        clearCart();
        onClose();
        navigate({ to: "/order-accepted" });
      } else {
        failOrder("Payment processing failed. Please try again.");
        onClose();
        navigate({ to: "/order-failed" });
      }
    }, 2000);
  };

  const applyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedPromo(promoCode);
    setActiveSheet("main");
  };

  if (!isOpen && !isClosing) return null;

  const subtotal = totalPrice();
  const currentTotal = subtotal + selectedDelivery.price + (subtotal * 0.05) - (appliedPromo ? subtotal * 0.1 : 0);

  return (
    <>
      <div 
        className={`fixed inset-0 z-[100] bg-black/40 transition-opacity duration-300 ${isOpen && !isClosing ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      />
      
      <div 
        className={`fixed bottom-0 left-0 right-0 z-[101] bg-[#F2F3F2] rounded-t-[30px] transition-transform duration-300 ease-in-out lg:left-1/2 lg:w-full lg:max-w-md lg:-translate-x-1/2 ${isOpen && !isClosing ? "translate-y-0" : "translate-y-full"} overflow-hidden flex flex-col`}
        style={{ maxHeight: '90vh' }}
      >
        {activeSheet === "main" && (
          <>
            <div className="flex items-center justify-between p-6 border-b border-[#E2E2E2]/50 shrink-0">
              <h2 className="text-2xl font-bold text-[#181725]">Checkout</h2>
              <button onClick={handleClose} aria-label="Close Checkout" className="p-1">
                <X className="h-6 w-6 text-[#181725]" />
              </button>
            </div>

            <div className="px-6 py-2 overflow-y-auto">
              <button 
                onClick={() => setActiveSheet("delivery")}
                className="w-full flex items-center justify-between py-5 border-b border-[#E2E2E2]/80 transition active:scale-95"
              >
                <span className="text-[#7C7C7C] font-semibold text-lg">Delivery</span>
                <div className="flex items-center gap-4">
                  <span className="text-[#181725] font-semibold">{selectedDelivery.name === "Standard Delivery" ? "Select Method" : selectedDelivery.name}</span>
                  <ChevronRight className="h-5 w-5 text-[#181725]" />
                </div>
              </button>

              <button 
                onClick={() => setActiveSheet("payment")}
                className="w-full flex items-center justify-between py-5 border-b border-[#E2E2E2]/80 transition active:scale-95"
              >
                <span className="text-[#7C7C7C] font-semibold text-lg">Payment</span>
                <div className="flex items-center gap-4">
                  {paymentMethod === "credit_card" ? (
                     <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Card" className="h-4 object-contain" />
                  ) : (
                     <span className="text-[#181725] font-semibold">{selectedPayment.name}</span>
                  )}
                  <ChevronRight className="h-5 w-5 text-[#181725]" />
                </div>
              </button>

              <button 
                onClick={() => setActiveSheet("promo")}
                className="w-full flex items-center justify-between py-5 border-b border-[#E2E2E2]/80 transition active:scale-95"
              >
                <span className="text-[#7C7C7C] font-semibold text-lg">Promo Code</span>
                <div className="flex items-center gap-4">
                  <span className="text-[#181725] font-semibold">{appliedPromo || "Pick discount"}</span>
                  <ChevronRight className="h-5 w-5 text-[#181725]" />
                </div>
              </button>

              <div className="flex items-center justify-between py-5 border-b border-[#E2E2E2]/80">
                <span className="text-[#7C7C7C] font-semibold text-lg">Total Cost</span>
                <div className="flex items-center gap-4">
                  <span className="text-[#181725] font-semibold">{formatPrice(currentTotal)}</span>
                  <ChevronRight className="h-5 w-5 text-[#181725]" />
                </div>
              </div>

              <p className="mt-6 text-[#7C7C7C] text-sm leading-relaxed text-left">
                By placing an order you agree to our<br/>
                <span className="font-bold text-[#181725]">Terms</span> And <span className="font-bold text-[#181725]">Conditions</span>
              </p>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="mt-6 mb-8 w-full py-5 rounded-[20px] bg-[#53B175] text-white font-semibold text-lg flex items-center justify-center transition active:scale-95 disabled:opacity-70 disabled:active:scale-100"
              >
                {loading ? "Processing..." : "Place Order"}
              </button>
            </div>
          </>
        )}

        {activeSheet === "delivery" && (
          <div className="flex flex-col h-full bg-[#F2F3F2] rounded-t-[30px] overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b border-[#E2E2E2]/50 shrink-0">
              <button onClick={() => setActiveSheet("main")} className="p-1 -ml-1 transition active:scale-90">
                <ChevronLeft className="h-6 w-6 text-[#181725]" />
              </button>
              <h2 className="text-2xl font-bold text-[#181725]">Delivery Method</h2>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {DELIVERY_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setDeliveryMethod(method.id); setActiveSheet("main"); }}
                  className={`w-full flex items-center justify-between p-4 rounded-xl border bg-white transition active:scale-95 ${deliveryMethod === method.id ? "border-[#53B175]" : "border-transparent"}`}
                >
                  <div className="flex flex-col items-start gap-1">
                    <span className="font-bold text-[#181725]">{method.name}</span>
                    <span className="text-sm text-[#7C7C7C]">{method.time}</span>
                  </div>
                  <span className="font-semibold text-[#181725]">
                    {method.price === 0 ? "Free" : `+${formatPrice(method.price)}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSheet === "payment" && (
          <div className="flex flex-col h-full bg-[#F2F3F2] rounded-t-[30px] overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b border-[#E2E2E2]/50 shrink-0">
              <button onClick={() => setActiveSheet("main")} className="p-1 -ml-1 transition active:scale-90">
                <ChevronLeft className="h-6 w-6 text-[#181725]" />
              </button>
              <h2 className="text-2xl font-bold text-[#181725]">Payment Method</h2>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method.id}
                  onClick={() => { setPaymentMethod(method.id); setActiveSheet("main"); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-xl border bg-white transition active:scale-95 ${paymentMethod === method.id ? "border-[#53B175]" : "border-transparent"}`}
                >
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id ? "border-[#53B175]" : "border-[#E2E2E2]"}`}>
                     {paymentMethod === method.id && <div className="h-2.5 w-2.5 rounded-full bg-[#53B175]" />}
                  </div>
                  <span className="font-bold text-[#181725]">{method.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {activeSheet === "promo" && (
          <div className="flex flex-col h-full bg-[#F2F3F2] rounded-t-[30px] overflow-hidden">
            <div className="flex items-center gap-4 p-6 border-b border-[#E2E2E2]/50 shrink-0">
              <button onClick={() => setActiveSheet("main")} className="p-1 -ml-1 transition active:scale-90">
                <ChevronLeft className="h-6 w-6 text-[#181725]" />
              </button>
              <h2 className="text-2xl font-bold text-[#181725]">Promo Code</h2>
            </div>
            <form onSubmit={applyPromo} className="p-6 flex flex-col gap-4 overflow-y-auto">
              <input
                type="text"
                placeholder="Enter promo code (e.g. WELCOME10)"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-transparent bg-white p-4 text-[#181725] font-semibold outline-none focus:border-[#53B175]"
                autoFocus
              />
              <button
                type="submit"
                className="w-full py-4 rounded-[20px] bg-[#53B175] text-white font-semibold text-lg flex items-center justify-center transition active:scale-95"
              >
                Apply Code
              </button>
            </form>
          </div>
        )}
      </div>
    </>
  );
}
