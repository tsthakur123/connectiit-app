import { View, Text, Pressable, Image, ActivityIndicator, Alert, Platform } from "react-native";
import { router } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { useAuthStore } from "@/store/authStore";
import { useState, useEffect } from "react";
import axios from "axios";
import { BackendTest } from "@/components/BackendTest";
import "@/global.css";
import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import AsyncStorage from '@react-native-async-storage/async-storage';

// expogo "52500388902-b8ukr2pf2lhfntajotoqpb0d1q98gnia.apps.googleusercontent.com"
WebBrowser.maybeCompleteAuthSession();
const AUTH_URI=process.env.EXPO_AUTH_BACKEND_URI || "http://localhost:3008/api/auth";
export default function Login() {
  const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || "";
  if (!GOOGLE_CLIENT_ID) {
    console.warn("Google Client ID is not set in environment variables (EXPO_PUBLIC_GOOGLE_CLIENT_ID)");
  }
  const [request, response, promptAsync] = useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: makeRedirectUri(),
    scopes: ["profile", "email"],
    // responseType: "token", // <-- Added to get accessToken directly
  }, {
    authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
    tokenEndpoint: "https://oauth2.googleapis.com/token",
    revocationEndpoint: "https://oauth2.googleapis.com/o/oauth2/revoke",
  });
  
  const { login, googleLogin, loading, error } = useAuthStore();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Handle OAuth response
  useEffect(() => {
    console.log("OAuth response:", response);
    if (response?.type === 'success') {
      // CODE FLOW: send code and codeVerifier to backend
      if (response.params?.code) {
        (async () => {
          try {
            const res = await axios.post(`${AUTH_URI}/google/code`, {
              code: response.params.code,
              codeVerifier: request?.codeVerifier,
            });
            const { token, user } = res.data;
            // Store in Zustand
            useAuthStore.setState({
              user,
              token,
              error: null,
              loading: false,
            });
            // Store token and user in AsyncStorage for persistence
            await AsyncStorage.setItem('token', token);
            await AsyncStorage.setItem('user', JSON.stringify(user));
            Alert.alert("Login Success", "You've been successfully logged in with Google.");
            router.replace("/(tabs)/home");
          } catch (err) {
            console.error("Google code exchange failed:", err);
            Alert.alert("Login Failed", "Failed to login with Google (code exchange)");
          }
        })();
      } else if (response.authentication?.accessToken) {
        // fallback: access token flow
        Alert.alert("Authentication successful", JSON.stringify(response.authentication));
        handleGoogleOAuthSuccess(response.authentication.accessToken);
      } else {
        Alert.alert("No code or access token", JSON.stringify(response));
      }
    } else if (response?.type === 'error') {
      console.error('OAuth error:', response.error);
      Alert.alert("Login Failed", "Google authentication failed. Please try again.");
    }
  }, [response]);

  // On app start, check for token in AsyncStorage and verify it
  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        try {
          console.log("Verifying token:", token);
          const res = await axios.get(`${AUTH_URI}/verifyToken`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (res.data.valid) {
            // Restore user session
            const user = await AsyncStorage.getItem('user');
            useAuthStore.setState({
              user: user ? JSON.parse(user) : null,
              token,
              error: null,
              loading: false,
            });
            router.replace("/(tabs)/home");
            // Optionally, navigate to home if not already there
          } else {
            // Invalid token, clear storage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');
            useAuthStore.setState({ user: null, token: null, error: null, loading: false });
          }
        } catch (err) {
          // Error verifying token, clear storage
          await AsyncStorage.removeItem('token');
          await AsyncStorage.removeItem('user');
          useAuthStore.setState({ user: null, token: null, error: null, loading: false });
        }
      }
    })();
  }, []);

  const handleGoogleOAuthSuccess = async (accessToken: string) => {
    setIsLoggingIn(true);
    
    try {
      // Use the real access token from Google
      const success = await googleLogin(accessToken);
      
      if (success) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", error || "Failed to login with Google");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    
    try {
      // For now, we'll use a mock Google token
      // In a real app, you'd integrate with Google Sign-In SDK
      const mockGoogleToken = "mock_google_token_for_testing";
      
      const success = await googleLogin(mockGoogleToken);
      
      if (success) {
        router.replace("/(tabs)/home");
      } else {
        Alert.alert("Login Failed", error || "Failed to login with Google");
      }
    } catch (err) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleMockLogin = async () => {
    setIsLoggingIn(true);
  
    try {
      const res = await axios.post(`${AUTH_URI}/createToken`, {
        email: "test123@iit.ac.in",
        name: "Test User",
        image: "https://api.dicebear.com/7.x/avataaars/png?seed=test"
      });
  
      const { token, user } = res.data;
  
      // Store in AsyncStorage (or Zustand, if needed)
      // await AsyncStorage.setItem('user', JSON.stringify(user));
      // await AsyncStorage.setItem('token', token);
  
      // Optional: if you want to update Zustand too
      useAuthStore.setState({
        user,
        token,
        error: null,
        loading: false,
      });
  
      router.replace("/(tabs)/home");
    } catch (err: any) {
      console.log("Mock login failed:", err.message);
      Alert.alert("Login Failed", err.message || "Mock login failed");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#1B1730] px-6">
      {/* Logo / Branding */}
      {/* <Image
        source={require('@/assets/logo.png')} // Replace with your actual logo path
        className="w-24 h-24 mb-6"
        resizeMode="contain"
      /> */}

      {/* Welcome Text */}
      <Text className="text-white text-3xl font-bold mb-2">
        Welcome to ConnectIIT
      </Text>
      <Text className="text-gray-300 text-base text-center mb-8">
        Connect, collaborate, and grow with IITians across the nation.
      </Text>

      {/* Google Sign In Button */}
      <Pressable
        onPress={() => {
          promptAsync();
        }}
        disabled={isLoggingIn || loading}
        className={`flex-row items-center px-5 py-3 rounded-2xl ${
          isLoggingIn || loading ? 'bg-gray-500' : 'bg-[#FE744D]'
        }`}
      >
        {isLoggingIn || loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <AntDesign name="google" size={20} color="white" />
        )}
        <Text className="text-white text-base font-semibold ml-3">
          {isLoggingIn || loading ? 'Signing in...' : 'Continue with Google'}
        </Text>
      </Pressable>

      {/* Test Login Button (for development) */}
      <Pressable
        onPress={handleMockLogin}
        disabled={isLoggingIn || loading}
        className={`mt-4 flex-row items-center px-5 py-3 rounded-2xl ${
          isLoggingIn || loading ? 'bg-gray-500' : 'bg-blue-600'
        }`}
      >
        {isLoggingIn || loading ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-base font-semibold">
            Test Login (Dev)
          </Text>
        )}
      </Pressable>

      {/* Backend Test Component */}
      <View className="mt-6 w-full">
        <BackendTest />
      </View>

      {/* Error Display */}
      {error && (
        <Text className="text-red-400 text-sm mt-4 text-center">
          {error}
        </Text>
      )}

      {/* Footer */}
      <Text className="text-gray-400 text-xs mt-10 text-center">
        Only accessible by verified IITians.
      </Text>
    </View>
  );
}
