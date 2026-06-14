import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Package, Clock, ChevronRight } from "lucide-react";
import { useOrderStore, OrderStatus } from "@/store/useOrderStore";
import { formatPrice } from "@/utils/helpers";
import { EmptyState } from "@/components/shared/EmptyState";
import { OrderSkeleton } from "@/components/shared/Skeletons";
import { useDelayedLoading } from "@/hooks/useDelayedLoading";
import { useState, Fragment } from "react";

export const Route = createFileRoute("/_app/orders")({
  head: () => ({
    meta: [
      { title: "Order History — Nectar" },
      { name: "description", content: "View your past orders." },
    ],
  }),
  component: Orders,
});

function Orders() {
  const navigate = useNavigate();
  const { orderHistory } = useOrderStore();
  const isPageLoading = useDelayedLoading();

  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleExpand = (id: string) => {
    setExpandedOrderId((prev) => (prev === id ? null : id));
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Completed:
        return "bg-emerald-100 text-emerald-700";
      case OrderStatus.Processing:
        return "bg-blue-100 text-blue-700";
      case OrderStatus.Failed:
        return "bg-red-100 text-red-700";
      default:
        return "bg-orange-100 text-orange-700";
    }
  };

  return (
    <div className="animate-page-in mx-auto max-w-7xl px-4 pt-6 lg:px-8 pb-24 lg:pb-8">
      <h1 className="border-b border-[#E2E2E2] pb-4 text-center lg:text-left text-xl font-bold text-[#181725]">
        Order History
      </h1>

      {isPageLoading ? (
        <div className="mt-6 space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <OrderSkeleton key={i} />
          ))}
        </div>
      ) : orderHistory.length === 0 ? (
        <EmptyState
          title="No Orders Yet"
          description="You haven't placed any orders yet."
          icon={<Package className="h-10 w-10" />}
          actionLabel="Start Shopping"
          onAction={() => navigate({ to: "/home" })}
        />
      ) : (
        <div className="mt-6">
          <div className="space-y-4 lg:hidden">
            {orderHistory.map((order) => {
              const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
              });
              const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

              return (
                <div
                  key={order.id}
                  className="rounded-2xl border border-[#E2E2E2] p-5 shadow-sm transition hover:border-[#53B175] cursor-pointer"
                  onClick={() => toggleExpand(order.id)}
                >
                  <div className="flex items-start justify-between border-b border-[#E2E2E2] pb-4">
                    <div>
                      <h3 className="font-bold text-[#181725]">{order.id}</h3>
                      <p className="flex items-center gap-1 text-xs text-[#7C7C7C] mt-1">
                        <Clock className="h-3 w-3" /> {date}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                    <div>
                      <p className="text-sm text-[#7C7C7C]">Items</p>
                      <p className="font-semibold text-[#181725]">{itemCount}</p>
                    </div>
                    <div>
                      <p className="text-sm text-[#7C7C7C]">Total</p>
                      <p className="font-bold text-[#53B175]">{formatPrice(order.total)}</p>
                    </div>
                    <button className="flex h-10 w-10 items-center justify-center rounded-full bg-[#F2F3F2] text-[#181725] transition hover:bg-[#E2E2E2] active:scale-95">
                      <ChevronRight
                        className={`h-5 w-5 transition-transform ${expandedOrderId === order.id ? "rotate-90" : ""}`}
                      />
                    </button>
                  </div>

                  {expandedOrderId === order.id && (
                    <div className="mt-4 pt-4 border-t border-[#E2E2E2] space-y-3 animate-in fade-in slide-in-from-top-2">
                      <h4 className="font-semibold text-[#181725] text-sm mb-2">Order Items</h4>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-12 h-12 object-contain rounded bg-gray-50 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-[#181725] truncate">
                              {item.product.name}
                            </p>
                            <p className="text-xs text-[#7C7C7C]">
                              {item.quantity} x {formatPrice(item.product.price)}
                            </p>
                          </div>
                          <p className="text-sm font-bold text-[#181725]">
                            {formatPrice(item.quantity * item.product.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="hidden lg:block overflow-hidden rounded-2xl border border-[#E2E2E2] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="bg-[#F2F3F2] text-[#7C7C7C]">
                <tr>
                  <th className="p-4 font-semibold">Order ID</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Items</th>
                  <th className="p-4 font-semibold">Total</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E2E2]">
                {orderHistory.map((order) => {
                  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  });
                  const itemCount = order.items.reduce((acc, item) => acc + item.quantity, 0);

                  return (
                    <Fragment key={order.id}>
                      <tr className="transition hover:bg-gray-50/50">
                        <td className="p-4 font-bold text-[#181725]">{order.id}</td>
                        <td className="p-4 text-[#7C7C7C]">{date}</td>
                        <td className="p-4 text-center font-semibold text-[#181725]">
                          {itemCount}
                        </td>
                        <td className="p-4 font-bold text-[#53B175]">{formatPrice(order.total)}</td>
                        <td className="p-4">
                          <span
                            className={`inline-block rounded-full px-3 py-1 text-xs font-bold ${getStatusColor(order.status)}`}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => toggleExpand(order.id)}
                            className="text-sm font-semibold text-[#53B175] hover:underline"
                          >
                            {expandedOrderId === order.id ? "Hide Details" : "View Details"}
                          </button>
                        </td>
                      </tr>
                      {expandedOrderId === order.id && (
                        <tr className="bg-gray-50/30">
                          <td colSpan={6} className="p-4 border-t-0">
                            <div className="space-y-3 max-w-2xl animate-in fade-in slide-in-from-top-2">
                              <h4 className="font-semibold text-[#181725] text-sm mb-2 border-b border-[#E2E2E2] pb-2">
                                Order Items
                              </h4>
                              {order.items.map((item, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-4 py-2 border-b border-[#E2E2E2]/50 last:border-0"
                                >
                                  <img
                                    src={item.product.image}
                                    alt={item.product.name}
                                    className="w-14 h-14 object-contain rounded bg-white border border-[#E2E2E2] shrink-0"
                                  />
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-[#181725] truncate">
                                      {item.product.name}
                                    </p>
                                    <p className="text-sm text-[#7C7C7C]">
                                      {item.quantity} x {formatPrice(item.product.price)}
                                    </p>
                                  </div>
                                  <p className="font-bold text-[#181725]">
                                    {formatPrice(item.quantity * item.product.price)}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
