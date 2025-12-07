// store/userProfileStore.ts

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserProfile = {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
};

interface UserProfileStore {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  updateProfile: (partial: Partial<UserProfile>) => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileStore>()(
  persist(
    (set, get) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      updateProfile: (partial) => {
        const current = get().profile;
        if (!current) return;
        set({
          profile: {
            ...current,
            ...partial,
          } as UserProfile,
        });
      },
      clearProfile: () => set({ profile: null }),
    }),
    {
      name: 'user-profile-store',
      storage: {
        getItem: async (name) => {
          const value = await AsyncStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: async (name, value) => {
          await AsyncStorage.setItem(name, JSON.stringify(value));
        },
        removeItem: async (name) => {
          await AsyncStorage.removeItem(name);
        },
      },
    }
  )
);


// On Login Success




// On Logout

// import { useUserProfileStore } from '../store/userProfileStore';

// useUserProfileStore.getState().clearProfile();