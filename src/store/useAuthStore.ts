import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  tempLocation: string;
  setTempLocation: (location: string) => void;
  login: (email: string, password: string) => void;
  signup: (data: Partial<User>) => void;
  logout: () => void;
  setLocation: (location: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      tempLocation: "Bangalore, HSR Layout",
      setTempLocation: (loc) => set({ tempLocation: loc }),
      login: (email) =>
        set((state) => ({
          isAuthenticated: true,
          user: {
            id: "u1",
            name: email.split("@")[0] ?? "Guest",
            email,
            phone: "+91",
            location: state.tempLocation,
          },
        })),
      signup: (data) =>
        set((state) => ({
          isAuthenticated: true,
          user: {
            id: "u1",
            name: data.name ?? "Guest",
            email: data.email ?? "",
            phone: data.phone ?? "+91",
            location: data.location ?? state.tempLocation,
          },
        })),
      logout: () => set({ user: null, isAuthenticated: false }),
      setLocation: (location) => set((s) => (s.user ? { user: { ...s.user, location } } : s)),
    }),
    { name: "nectar-auth" },
  ),
);
