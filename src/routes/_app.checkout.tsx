import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useOrderStore, type Address } from "@/stores/useOrderStore";
import { formatPrice } from "@/utils/helpers";
import { MapPin, CreditCard, Clock, Tag, ChevronRight, CheckCircle2, XCircle } from "lucide-react";
import { CheckoutSkeleton } from "@/components/shared/Skeletons";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";

export const Route = createFileRoute("/_app/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Nectar" },
      { name: "description", content: "Complete your grocery order." },
    ],
  }),
  component: CheckoutPage,
});

const DELIVERY_METHODS = [
  { id: "standard", name: "Standard Delivery", price: 0, time: "2-3 days" },
  { id: "express", name: "Express Delivery", price: 5, time: "Tomorrow" },
  { id: "same_day", name: "Same Day Delivery", price: 10, time: "Today by 8 PM" },
];

const PAYMENT_METHODS = [
  { id: "upi", name: "UPI" },
  { id: "credit_card", name: "Credit Card" },
  { id: "debit_card", name: "Debit Card" },
  { id: "wallet", name: "Wallet" },
  { id: "cod", name: "Cash On Delivery" },
];

const PROMO_CODES: Record<string, number> = {
  WELCOME10: 0.1,
  SAVE20: 0.2,
  FRESH5: 0.05,
};

type ToastState = { message: string; type: "success" | "error" } | null;

function CheckoutPage() {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCartStore();
  const {
    addresses,
    defaultAddressId,
    addAddress,
    setDefaultAddress,
    createOrder,
    placeOrder,
    completeOrder,
    failOrder,
    loading,
  } = useOrderStore();

  const [deliveryMethod, setDeliveryMethod] = useState(DELIVERY_METHODS[0].id);
  const [paymentMethod, setPaymentMethod] = useState(PAYMENT_METHODS[0].id);

  const [promoCode, setPromoCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);

  const [showAddressForm, setShowAddressForm] = useState(addresses.length === 0);
  const [newAddress, setNewAddress] = useState({ name: "", street: "", city: "", zip: "" });
  const [addressError, setAddressError] = useState("");

  const [toast, setToast] = useState<ToastState>(null);
  const isPageLoading = useDelayedLoading(1000);

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
  };

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    if (PROMO_CODES[code]) {
      setAppliedDiscount(PROMO_CODES[code]);
      setAppliedPromo(code);
      showToast(`Coupon ${code} applied successfully!`, "success");
    } else {
      setAppliedDiscount(0);
      setAppliedPromo(null);
      showToast("Invalid coupon code", "error");
    }
    setPromoCode("");
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.name || !newAddress.street || !newAddress.city || !newAddress.zip) {
      setAddressError("All fields are required");
      return;
    }
    addAddress(newAddress);
    setNewAddress({ name: "", street: "", city: "", zip: "" });
    setShowAddressForm(false);
    setAddressError("");
  };

  const subtotal = totalPrice();
  const selectedDelivery = DELIVERY_METHODS.find((d) => d.id === deliveryMethod)!;
  const deliveryFee = selectedDelivery.price;
  const tax = subtotal * 0.05; // 5% tax
  const discountAmount = subtotal * appliedDiscount;
  const total = subtotal + deliveryFee + tax - discountAmount;
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const selectedAddress = addresses.find((a) => a.id === defaultAddressId);

  const handlePlaceOrder = () => {
    if (items.length === 0) return;
    if (!selectedAddress) {
      showToast("Please select a delivery address", "error");
      return;
    }

    createOrder({
      items,
      subtotal,
      deliveryFee,
      tax,
      discount: discountAmount,
      total,
      address: selectedAddress,
      paymentMethod: PAYMENT_METHODS.find((p) => p.id === paymentMethod)?.name || paymentMethod,
      deliveryMethod: selectedDelivery.name,
      estimatedDeliveryTime: selectedDelivery.time,
    });

    placeOrder();

    setTimeout(() => {
      if (Math.random() > 0.2) {
        completeOrder();
        showToast("Order placed successfully!", "success");
        clearCart();
        navigate({ to: "/order-accepted" });
      } else {
        failOrder("Payment processing failed. Please try again.");
        showToast("Order placement failed", "error");
        navigate({ to: "/order-failed" });
      }
    }, 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-8 animate-page-in relative">
      {toast && (
        <div
          className={`fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg px-4 py-3 text-white shadow-lg transition-all animate-in slide-in-from-top-2 ${toast.type === "success" ? "bg-emerald-600" : "bg-red-500"}`}
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <XCircle className="h-5 w-5" />
          )}
          <span className="font-semibold">{toast.message}</span>
        </div>
      )}

      <h1 className="text-2xl font-bold text-[#181725] mb-8">Checkout</h1>

      {isPageLoading ? (
        <CheckoutSkeleton />
      ) : (
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1 space-y-8">
            <section className="rounded-2xl border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 border-b border-[#E2E2E2] pb-4 mb-4">
                <MapPin className="text-[#53B175]" />
                <h2 className="text-lg font-bold text-[#181725]">Delivery Address</h2>
              </div>

              {addresses.length > 0 && !showAddressForm && (
                <div className="space-y-4">
                  {addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`flex items-start gap-4 rounded-xl border p-4 cursor-pointer transition ${defaultAddressId === addr.id ? "border-[#53B175] bg-[#53B175]/5" : "border-[#E2E2E2]"}`}
                    >
                      <input
                        type="radio"
                        name="address"
                        className="mt-1 h-4 w-4 text-[#53B175] accent-[#53B175]"
                        checked={defaultAddressId === addr.id}
                        onChange={() => setDefaultAddress(addr.id)}
                      />
                      <div>
                        <p className="font-bold text-[#181725]">{addr.name}</p>
                        <p className="text-sm text-[#7C7C7C]">
                          {addr.street}, {addr.city}, {addr.zip}
                        </p>
                      </div>
                    </label>
                  ))}
                  <button
                    onClick={() => setShowAddressForm(true)}
                    className="text-sm font-semibold text-[#53B175] hover:underline"
                  >
                    + Add New Address
                  </button>
                </div>
              )}

              {showAddressForm && (
                <form onSubmit={handleSaveAddress} className="space-y-4">
                  {addressError && <p className="text-sm text-red-500">{addressError}</p>}
                  <div>
                    <label className="text-sm font-semibold text-[#7C7C7C]">Full Name</label>
                    <input
                      type="text"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E2E2E2] p-3 text-[#181725] outline-none focus:border-[#53B175]"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-[#7C7C7C]">Street Address</label>
                    <input
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="mt-1 w-full rounded-xl border border-[#E2E2E2] p-3 text-[#181725] outline-none focus:border-[#53B175]"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-semibold text-[#7C7C7C]">City</label>
                      <input
                        type="text"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#E2E2E2] p-3 text-[#181725] outline-none focus:border-[#53B175]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-semibold text-[#7C7C7C]">ZIP Code</label>
                      <input
                        type="text"
                        value={newAddress.zip}
                        onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-[#E2E2E2] p-3 text-[#181725] outline-none focus:border-[#53B175]"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-2">
                    <button
                      type="submit"
                      className="flex-1 rounded-xl bg-[#53B175] py-3 font-semibold text-white transition active:scale-95"
                    >
                      Save Address
                    </button>
                    {addresses.length > 0 && (
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1 rounded-xl bg-gray-100 py-3 font-semibold text-[#181725] transition active:scale-95"
                      >
                        Cancel
                      </button>
                    )}
                  </div>
                </form>
              )}
            </section>

            <section className="rounded-2xl border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 border-b border-[#E2E2E2] pb-4 mb-4">
                <Clock className="text-[#53B175]" />
                <h2 className="text-lg font-bold text-[#181725]">Delivery Method</h2>
              </div>
              <div className="space-y-3">
                {DELIVERY_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition ${deliveryMethod === method.id ? "border-[#53B175] bg-[#53B175]/5" : "border-[#E2E2E2]"}`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="deliveryMethod"
                        value={method.id}
                        checked={deliveryMethod === method.id}
                        onChange={(e) => setDeliveryMethod(e.target.value)}
                        className="h-4 w-4 text-[#53B175] accent-[#53B175]"
                      />
                      <div>
                        <p className="font-bold text-[#181725]">{method.name}</p>
                        <p className="text-xs text-[#7C7C7C]">Est: {method.time}</p>
                      </div>
                    </div>
                    <span className="font-semibold text-[#181725]">
                      {method.price === 0 ? "Free" : `+${formatPrice(method.price)}`}
                    </span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 border-b border-[#E2E2E2] pb-4 mb-4">
                <CreditCard className="text-[#53B175]" />
                <h2 className="text-lg font-bold text-[#181725]">Payment Method</h2>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition ${paymentMethod === method.id ? "border-[#53B175] bg-[#53B175]/5" : "border-[#E2E2E2]"}`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="h-4 w-4 text-[#53B175] accent-[#53B175]"
                    />
                    <span className="font-semibold text-[#181725]">{method.name}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-[#E2E2E2] p-6">
              <div className="flex items-center gap-2 border-b border-[#E2E2E2] pb-4 mb-4">
                <Tag className="text-[#53B175]" />
                <h2 className="text-lg font-bold text-[#181725]">Promo Code</h2>
              </div>
              <form onSubmit={handleApplyPromo} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 rounded-xl border border-[#E2E2E2] p-3 text-[#181725] outline-none uppercase placeholder:normal-case focus:border-[#53B175]"
                />
                <button
                  type="submit"
                  className="rounded-xl bg-[#181725] px-6 font-semibold text-white transition active:scale-95"
                >
                  Apply
                </button>
              </form>
              {appliedPromo && (
                <p className="mt-2 text-sm font-semibold text-[#53B175]">
                  Coupon {appliedPromo} applied! ({appliedDiscount * 100}% off)
                </p>
              )}
            </section>
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="sticky top-24 rounded-2xl border border-[#E2E2E2] bg-[#F2F3F2]/50 p-6">
              <h2 className="text-lg font-bold text-[#181725] mb-4">Order Summary</h2>

              <div className="space-y-3 text-sm border-b border-[#E2E2E2] pb-4">
                <div className="flex justify-between text-[#7C7C7C]">
                  <span>Items ({totalItems})</span>
                  <span className="font-semibold text-[#181725]">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-[#7C7C7C]">
                  <span>Delivery Fee</span>
                  <span className="font-semibold text-[#181725]">
                    {deliveryFee === 0 ? "Free" : formatPrice(deliveryFee)}
                  </span>
                </div>
                <div className="flex justify-between text-[#7C7C7C]">
                  <span>Estimated Tax (5%)</span>
                  <span className="font-semibold text-[#181725]">{formatPrice(tax)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#53B175]">
                    <span>Discount ({appliedPromo})</span>
                    <span className="font-semibold">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex items-center justify-between font-bold text-xl text-[#181725]">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>

              <p className="mt-2 text-xs text-center text-[#7C7C7C]">
                Est. Delivery: {selectedDelivery.time}
              </p>

              <button
                onClick={handlePlaceOrder}
                disabled={loading || items.length === 0}
                className="mt-6 flex h-14 w-full items-center justify-center gap-2 rounded-full bg-[#53B175] font-semibold text-white transition active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Placing Order...
                  </>
                ) : (
                  <>
                    Place Order <ChevronRight className="h-5 w-5" />
                  </>
                )}
              </button>

              {items.length === 0 && (
                <p className="mt-3 text-center text-sm text-red-500 font-semibold">
                  Your cart is empty.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
