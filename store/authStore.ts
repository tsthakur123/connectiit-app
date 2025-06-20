import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  // Add other user fields as needed
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;

  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  loading: true,

  setUser: (user) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  setToken: (token) => {
    set({ token });
    AsyncStorage.setItem('token', token || '');
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null });
  },

  hydrate: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      set({
        user: storedUser ? JSON.parse(storedUser) : null,
        token: storedToken || null,
        loading: false,
      });
    } catch (err) {
      console.log('Error hydrating auth store:', err);
      set({ loading: false });
    }
  },
}));


// Right after login/signup response from backend:

// tsx
// Copy
// Edit
// const { setUser, setToken } = useAuthStore.getState();

// setUser(response.user);
// setToken(response.token);