import { create } from "zustand";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthState {
  user: User | null;
  token: string | null;

  // actions
  login: (user: User, token: string) => void;
  logout: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,

  hydrate: () => {
    const token = localStorage.getItem("auth.token");
    const rawUser = localStorage.getItem("auth.user");
    if (token && rawUser) {
      set({ token, user: JSON.parse(rawUser) });
    }
  },

  login: (user, token) => {
    localStorage.setItem("auth.token", token);
    localStorage.setItem("auth.user", JSON.stringify(user));
    set({ user, token });
  },

  logout: () => {
    localStorage.removeItem("auth.token");
    localStorage.removeItem("auth.user");
    set({ user: null, token: null });
  },
}));
