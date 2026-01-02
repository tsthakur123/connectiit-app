import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useAuthStore } from '@/store/authStore';
import { apiClient } from '@/services/api';
import '@/global.css';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

export default function Onboarding() {
  const [username, setUsername] = useState('');
  const [bio, setBio] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!username.trim()) {
      Alert.alert('Validation', 'Please choose a username');
      return;
    }
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('token');
       if (!token) return;
              const userinfo: any = jwtDecode(token);
      const body={ username: username.trim(), bio: bio.trim(),id:userinfo.user_id };


      await axios.patch(
        "http://localhost:3006/api/users/update",
        body,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      Alert.alert("Success", "Profile updated");
      // Update local store user
      const updatedUser = { ...(useAuthStore.getState().user || {}), username };
      useAuthStore.getState().setUser(updatedUser as any);

      router.replace('/(tabs)/home');
    } catch (err) {
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-[#1B1730] px-6 items-center justify-center">
      <Text className="text-white text-2xl font-bold mb-4">Welcome — Set up your profile</Text>

      <Text className="text-gray-300 mb-2 w-full">Choose a username</Text>
      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="e.g., rahul_k"
        placeholderTextColor="#999"
        className="w-full bg-[#2A2438] rounded-md px-4 py-3 text-white mb-4"
      />

      <Text className="text-gray-300 mb-2 w-full">Short bio (optional)</Text>
      <TextInput
        value={bio}
        onChangeText={setBio}
        placeholder="A line about you"
        placeholderTextColor="#999"
        className="w-full bg-[#2A2438] rounded-md px-4 py-3 text-white mb-6"
      />

      <Pressable
        onPress={handleSubmit}
        className={`w-full items-center py-3 rounded-2xl ${loading ? 'bg-gray-500' : 'bg-[#FE744D]'}`}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="text-white font-semibold">Continue</Text>
        )}
      </Pressable>
    </View>
  );
}
