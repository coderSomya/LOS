"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User, UserType } from "@/types";

// Dummy users for local authentication
const dummyUsers = [
  {
    id: "1",
    username: "user1",
    password: "123",
    userType: UserType.SALES_MAKER,
    pincode: "111111",
  },
  {
    id: "2",
    username: "user2",
    password: "123",
    userType: UserType.SALES_CHECKER,
    pincode: "222222",
  },
];

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
      login: async (username: string, password: string) => {
        // Find user
        const user = dummyUsers.find(
          (u) => u.username === username && u.password === password
        );

        if (user) {
          const { password, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
    }
  )
);