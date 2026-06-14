import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";

export enum OrderStatus {
  Pending = "PENDING",
  Processing = "PROCESSING",
  Completed = "COMPLETED",
  Failed = "FAILED",
}

export interface Address {
  id: string;
  name: string;
  street: string;
  city: string;
  zip: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  total: number;
  address: Address;
  paymentMethod: string;
  deliveryMethod: string;
  estimatedDeliveryTime: string;
  status: OrderStatus;
  createdAt: string;
}

interface OrderState {
  currentOrder: Order | null;
  orderHistory: Order[];
  addresses: Address[];
  defaultAddressId: string | null;
  loading: boolean;
  error: string | null;

  createOrder: (orderData: Omit<Order, "id" | "status" | "createdAt">) => void;
  placeOrder: () => void;
  completeOrder: () => void;
  failOrder: (errorMessage: string) => void;
  clearCurrentOrder: () => void;
  addToHistory: (order: Order) => void;

  addAddress: (address: Omit<Address, "id">) => void;
  setDefaultAddress: (id: string) => void;
}

export const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      currentOrder: null,
      orderHistory: [],
      addresses: [],
      defaultAddressId: null,
      loading: false,
      error: null,

      createOrder: (orderData) => {
        const timestamp = Date.now().toString(36);
        const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
        const uniqueId = `ORD-${timestamp}-${randomSuffix}`;

        const newOrder: Order = {
          ...orderData,
          id: uniqueId,
          status: OrderStatus.Pending,
          createdAt: new Date().toISOString(),
        };
        set({ currentOrder: newOrder, error: null });
      },

      placeOrder: () => {
        const { currentOrder } = get();
        if (currentOrder) {
          set({
            currentOrder: { ...currentOrder, status: OrderStatus.Processing },
            loading: true,
            error: null,
          });
        }
      },

      completeOrder: () => {
        const { currentOrder, orderHistory } = get();
        if (currentOrder) {
          const completedOrder = { ...currentOrder, status: OrderStatus.Completed };
          set({
            currentOrder: null,
            orderHistory: [completedOrder, ...orderHistory],
            loading: false,
          });
        }
      },

      failOrder: (errorMessage) => {
        const { currentOrder } = get();
        if (currentOrder) {
          set({
            currentOrder: { ...currentOrder, status: OrderStatus.Failed },
            loading: false,
            error: errorMessage,
          });
        } else {
          set({ loading: false, error: errorMessage });
        }
      },

      clearCurrentOrder: () => {
        set({ currentOrder: null, error: null });
      },

      addToHistory: (order) => {
        set((state) => ({
          orderHistory: [order, ...state.orderHistory],
        }));
      },

      addAddress: (addressData) => {
        const id = crypto.randomUUID();
        const newAddress = { ...addressData, id };
        set((state) => {
          const newAddresses = [...state.addresses, newAddress];
          return {
            addresses: newAddresses,
            defaultAddressId: state.defaultAddressId || id,
          };
        });
      },

      setDefaultAddress: (id) => {
        set({ defaultAddressId: id });
      },
    }),
    {
      name: "nectar-orders-storage",
      partialize: (state) => ({
        orderHistory: state.orderHistory,
        addresses: state.addresses,
        defaultAddressId: state.defaultAddressId,
      }),
    },
  ),
);
