import React, { useState } from 'react';
import { View, Text, Pressable, Alert } from 'react-native';
import { AuthService } from '@/services/api';

export const BackendTest: React.FC = () => {
  const [testing, setTesting] = useState(false);

  const testBackendConnection = async () => {
    setTesting(true);
    
    try {
      // Test the demo endpoint
      const response = await AuthService.demo();
      
      if (response.success) {
        Alert.alert(
          "Backend Connection Success", 
          "Your backend is connected and working!",
          [{ text: "OK" }]
        );
      } else {
        Alert.alert(
          "Backend Connection Failed", 
          `Error: ${response.error}`,
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "Connection Error", 
        "Failed to connect to backend. Make sure your Go server is running on port 3008.",
        [{ text: "OK" }]
      );
    } finally {
      setTesting(false);
    }
  };

  return (
    <View className="p-4">
      <Pressable
        onPress={testBackendConnection}
        disabled={testing}
        className={`px-4 py-2 rounded-lg ${
          testing ? 'bg-gray-400' : 'bg-green-600'
        }`}
      >
        <Text className="text-white text-center font-semibold">
          {testing ? 'Testing...' : 'Test Backend Connection'}
        </Text>
      </Pressable>
    </View>
  );
}; 