"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "@/types";

// Zustand-compatible cookie storage
const cookieStorage = {
  getItem: (name: string): string | null => Cookies.get(name) || null,
  setItem: (name: string, value: string): void => {
    Cookies.set(name, value, {
      expires: 7,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });
  },
  removeItem: (name: string): void => {
    Cookies.remove(name);
  },
};

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (username, password) => {
        try {
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
          });

          if (res.ok) {
            const user = await res.json();
            set({ user, isAuthenticated: true });
            return true;
          }
          return false;
        } catch (e) {
          console.error("Login error", e);
          return false;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => cookieStorage),
      // Prevent Zustand from resetting state on Fast Refresh
      partialize: (state) => ({ isAuthenticated: state.isAuthenticated, user: state.user }),
    }
  )
);
