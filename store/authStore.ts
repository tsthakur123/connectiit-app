import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AuthService, AuthResponse } from "@/services/api";

interface User {
  id: string;
  name: string;
  username?: string;
  email: string;
  image?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setError: (error: string | null) => void;
  setLoading: (loading: boolean) => void;
  
  // Auth methods
  login: (email: string, name: string, image: string) => Promise<boolean>;
  googleLogin: (googleToken: string) => Promise<boolean>;
  verifyToken: () => Promise<boolean>;
  logout: () => Promise<void>;
  hydrate: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  loading: true,
  error: null,

  setUser: (user) => {
    set({ user });
    AsyncStorage.setItem('user', JSON.stringify(user));
  },

  setToken: (token) => {
    set({ token });
    AsyncStorage.setItem('token', token || '');
  },

  setError: (error) => {
    set({ error });
  },

  setLoading: (loading) => {
    set({ loading });
  },

  login: async (email: string, name: string, image: string) => {
    set({ loading: true, error: null });
    
    try {
      const response = await AuthService.createToken(email, name, image);
      
      if (response.success && response.data) {
        const { token, user } = response.data;
        
        // Update store
        set({ 
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          token,
          loading: false,
          error: null
        });
        
        // Save to storage
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        
        return true;
      } else {
        set({ 
          loading: false, 
          error: response.error || 'Login failed' 
        });
        return false;
      }
    } catch (error) {
      set({ 
        loading: false, 
        error: error instanceof Error ? error.message : 'Login failed' 
      });
      return false;
    }
  },

  googleLogin: async (googleToken: string) => {
    set({ loading: true, error: null });
  
    try {
      let response: AuthResponse;
  
      if (googleToken === "mock_google_token_for_testing") {
        // Mock user payload for development
        response = {
          success: true,
          data: {
            token: "mock_token_123",
            user: {
              id: "mock_user_id",
              name: "Test User",
              email: "test@iit.ac.in",
              image: "https://api.dicebear.com/7.x/avataaars/png?seed=test"
            }
          }
        };
      } else {
        response = await AuthService.googleAuth(googleToken);
      }
  
      if (response.success && response.data) {
        const { token, user } = response.data;
  
        set({
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            image: user.image,
          },
          token,
          loading: false,
          error: null,
        });
  
        await AsyncStorage.setItem("user", JSON.stringify(user));
        await AsyncStorage.setItem("token", token);
  
        return true;
      } else {
        set({
          loading: false,
          error: response.error || "Google login failed",
        });
        return false;
      }
    } catch (error) {
      set({
        loading: false,
        error: error instanceof Error ? error.message : "Google login failed",
      });
      return false;
    }
  },

  verifyToken: async () => {
    const { token } = get();
    if (!token) return false;
    
    try {
      const response = await AuthService.verifyToken(token);
      
      if (response.success && response.data?.valid) {
        // Token is valid, update user info if needed
        const claims = response.data.claims;
        const currentUser = get().user;
        
        if (currentUser && currentUser.id !== claims.user_id) {
          // Update user info from token claims
          set({
            user: {
              id: claims.user_id,
              name: claims.name,
              email: claims.email,
              image: claims.image,
            }
          });
          await AsyncStorage.setItem('user', JSON.stringify({
            id: claims.user_id,
            name: claims.name,
            email: claims.email,
            image: claims.image,
          }));
        }
        
        return true;
      } else {
        // Token is invalid, logout
        await get().logout();
        return false;
      }
    } catch (error) {
      console.log('Token verification error:', error);
      return false;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  },

  hydrate: async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      const storedToken = await AsyncStorage.getItem('token');
      
      if (storedUser && storedToken) {
        const user = JSON.parse(storedUser);
        set({
          user,
          token: storedToken,
          loading: false,
        });
        
        // Verify token on app start
        const isValid = await get().verifyToken();
        if (!isValid) {
          set({ loading: false });
        }
      } else {
        set({ loading: false });
      }
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