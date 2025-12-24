import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { router } from 'expo-router';

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({ children }) => {
  const { user, loading, token } = useAuthStore();

  useEffect(() => {
    if (!loading) {
      if (!user || !token) {
        // User is not authenticated, redirect to login
        router.replace('/');
      }
    }
  }, [user, token, loading]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-[#1B1730]">
        <ActivityIndicator size="large" color="#FE744D" />
        <Text className="text-white mt-4">Loading...</Text>
      </View>
    );
  }

  if (!user || !token) {
    return null; // Will redirect to login
  }

  return <>{children}</>;
}; 