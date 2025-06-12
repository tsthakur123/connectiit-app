import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
  FlatList,
  ActivityIndicator,
  Platform,
  KeyboardAvoidingView,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Dummy data
const DUMMY_TRIPS = [
  {
    id: '1',
    tripName: 'Summer Beach Vacation',
    description: 'A relaxing trip to the beach with friends',
    from: 'New York',
    to: 'Miami',
    date: '2024-07-15',
    createdBy: 'John Doe',
    participants: ['1', '2', '3'],
    modeOfTravel: 'Airways',
  },
  {
    id: '2',
    tripName: 'Mountain Hiking Adventure',
    description: 'Weekend hiking trip to the mountains',
    from: 'Los Angeles',
    to: 'Yosemite',
    date: '2024-06-20',
    createdBy: 'Me',
    participants: ['1', '2'],
    modeOfTravel: 'Roadways',
  },
  {
    id: '3',
    tripName: 'City Exploration',
    description: 'Exploring the city with friends',
    from: 'Chicago',
    to: 'Chicago',
    date: '2024-08-01',
    createdBy: 'Sarah Smith',
    participants: ['1', '2', '3', '4'],
    modeOfTravel: 'Railways',
  },
];

const DUMMY_MESSAGES = [
  {
    id: '1',
    content: 'Hey everyone! Excited for the trip!',
    userId: '2',
    createdAt: '2024-03-15T10:00:00Z',
  },
  {
    id: '2',
    content: 'Me too! What time are we meeting?',
    userId: '1',
    createdAt: '2024-03-15T10:05:00Z',
  },
  {
    id: '3',
    content: 'Let\'s meet at 9 AM at the station',
    userId: '2',
    createdAt: '2024-03-15T10:10:00Z',
  },
];

const DUMMY_PARTICIPANTS = {
  '1': 'John Doe',
  '2': 'Jane Smith',
  '3': 'Mike Johnson',
  '4': 'Sarah Wilson',
};

const TripsScreen = () => {
  const insets = useSafeAreaInsets();
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isMembersModalVisible, setIsMembersModalVisible] = useState(false);
  const [newTripMessage, setNewTripMessage] = useState('');

  const renderTripCard = ({ item: trip }) => (
    <TouchableOpacity
      onPress={() => setSelectedTrip(trip)}
      className={`mb-4 rounded-2xl overflow-hidden ${
        selectedTrip?.id === trip.id ? 'bg-primary' : 'bg-secondary'
      }`}
    >
      <LinearGradient
        colors={['rgba(79, 70, 229, 0.1)', 'rgba(79, 70, 229, 0.05)']}
        className="p-4"
      >
        <Text className="text-xl font-semibold text-white2 mb-2">{trip.tripName}</Text>
        <Text className="text-gray-300 mb-4">{trip.description}</Text>

        <View className="flex-row justify-between mb-4">
          <View>
            <Text className="text-gray-400 text-xs">From</Text>
            <Text className="text-white2">{trip.from}</Text>
          </View>
          <View>
            <Text className="text-gray-400 text-xs">To</Text>
            <Text className="text-white2">{trip.to}</Text>
          </View>
          <View>
            <Text className="text-gray-400 text-xs">Date</Text>
            <Text className="text-white2">
              {new Date(trip.date).toLocaleDateString()}
            </Text>
          </View>
        </View>

        <View className="flex-row justify-between items-center">
          <View className="flex-row items-center">
            <Text className="text-gray-300 mr-2">
              Created by <Text className="text-white">{trip.createdBy}</Text>
            </Text>
            <TouchableOpacity
              onPress={() => {
                setSelectedTrip(trip);
                setIsMembersModalVisible(true);
              }}
              className="flex-row items-center bg-gray-700 px-3 py-1 rounded-full"
            >
              <Ionicons name="people" size={16} color="#fff" />
              <Text className="text-white ml-1">{trip.participants.length}</Text>
            </TouchableOpacity>
          </View>

          {trip.createdBy !== 'Me' && (
            <TouchableOpacity
              className="bg-[#04AA6D] px-4 py-2 rounded-full"
            >
              <Text className="text-white">Join Trip</Text>
            </TouchableOpacity>
          )}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );

  const renderMessage = ({ item: message }) => (
    <View
      className={`mb-4 max-w-[80%] ${
        message.userId === '1' ? 'self-end' : 'self-start'
      }`}
    >
      <View
        className={`p-3 rounded-2xl ${
          message.userId === '1'
            ? 'bg-orange'
            : 'bg-white2'
        }`}
      >
        <Text className={`${
          message.userId === '1'
            ? 'text-white2'
            : 'text-black'
        }`}>{message.content}</Text>
        <Text className="text-gray-600 text-xs mt-1">
          {new Date(message.createdAt).toLocaleTimeString()}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-primary">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 pt-4">
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-2xl font-bold text-white2">Your Trips</Text>
            <TouchableOpacity
              onPress={() => setIsCreateModalVisible(true)}
              className="bg-orange p-3 px-4 rounded-full"
            >
              <Text className="text-white2 ">Create Trip</Text>
            </TouchableOpacity>
          </View>

          {selectedTrip ? (
            <View className="flex-1">
              <View className="flex-row items-center mb-4">
                <TouchableOpacity
                  onPress={() => setSelectedTrip(null)}
                  className="mr-3"
                >
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
                <View>
                  <Text className="text-xl font-semibold text-white2">
                    {selectedTrip.tripName}
                  </Text>
                  <Text className="text-gray-400">Trip Discussion</Text>
                </View>
              </View>

              <FlatList
                data={DUMMY_MESSAGES}
                renderItem={renderMessage}
                keyExtractor={(item) => item.id}
                className="flex-1"
                inverted
              />

              <View className="flex-row items-center mt-4 mb-28">
                <TextInput
                  value={newTripMessage}
                  onChangeText={setNewTripMessage}
                  placeholder="Type your message..."
                  placeholderTextColor="#9ca3af"
                  className="flex-1 bg-secondary text-white2 rounded-full px-4 py-4 mr-2"
                />
                <TouchableOpacity
                  className="p-3 rounded-full bg-orange"
                >
                  <Ionicons name="send" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <FlatList
              data={DUMMY_TRIPS}
              renderItem={renderTripCard}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
            />
          )}
        </View>

        {/* Create Trip Modal */}
        <Modal
          visible={isCreateModalVisible}
          animationType="slide"
          transparent
        >
          <View className="flex-1 bg-black/50">
            <BlurView intensity={20} className="flex-1">
              <View className="flex-1 mt-20 bg-gray-900 rounded-t-3xl">
                <View className="p-4 border-b border-gray-800">
                  <Text className="text-xl font-semibold text-white2">
                    Create New Trip
                  </Text>
                </View>

                <ScrollView className="p-4">
                  <View className="space-y-4">
                    <View>
                      <Text className="text-gray-400 mb-2">Trip Name</Text>
                      <TextInput
                        placeholder="Enter trip name"
                        placeholderTextColor="#6b7280"
                        className="bg-gray-800 text-white2 rounded-full p-3"
                      />
                    </View>

                    <View>
                      <Text className="text-gray-400 mb-2">Description</Text>
                      <TextInput
                        placeholder="Enter trip description"
                        placeholderTextColor="#6b7280"
                        multiline
                        numberOfLines={3}
                        className="bg-gray-800 text-white2 rounded-full p-3"
                      />
                    </View>

                    <View className="flex-row space-x-4">
                      <View className="flex-1">
                        <Text className="text-gray-400 mb-2">From</Text>
                        <TextInput
                          placeholder="Starting point"
                          placeholderTextColor="#6b7280"
                          className="bg-gray-800 text-white2 rounded-full p-3"
                        />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-400 mb-2">To</Text>
                        <TextInput
                          placeholder="Destination"
                          placeholderTextColor="#6b7280"
                          className="bg-gray-800 text-white rounded-full p-3"
                        />
                      </View>
                    </View>

                    <View>
                      <Text className="text-gray-400 mb-2">Date</Text>
                      <TextInput
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#6b7280"
                        className="bg-gray-800 text-white rounded-full p-3"
                      />
                    </View>

                    <View>
                      <Text className="text-gray-400 mb-2">Mode of Travel</Text>
                      <View className="bg-gray-800 rounded-full p-3">
                        <Text className="text-white">Select travel mode</Text>
                      </View>
                    </View>
                  </View>
                </ScrollView>

                <View className="p-4 border-t border-gray-800 flex-row justify-end space-x-4 gap-1">
                  <TouchableOpacity
                    onPress={() => setIsCreateModalVisible(false)}
                    className="px-6 py-2 border border-gray-700 rounded-full"
                  >
                    <Text className="text-white2 ">Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="px-6 py-2 rounded-full bg-orange"
                  >
                    <Text className="text-white">Create Trip</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>

        {/* Members Modal */}
        <Modal
          visible={isMembersModalVisible}
          animationType="slide"
          transparent
        >
          <View className="flex-1 bg-black/50">
            <BlurView intensity={20} className="flex-1">
              <View className="flex-1 mt-20 bg-primary rounded-t-3xl">
                <View className="p-4 border-b border-secondary">
                  <Text className="text-xl font-semibold text-white2">
                    Trip Members ({selectedTrip?.participants.length})
                  </Text>
                </View>

                <ScrollView className="p-4">
                  {selectedTrip?.participants.map((userId) => (
                    <View
                      key={userId}
                      className="flex-row items-center py-3 border-b border-gray-800"
                    >
                      <View className="w-10 h-10 rounded-full bg-orange items-center justify-center mr-3">
                        <Text className="text-white font-bold">
                          {DUMMY_PARTICIPANTS[userId]?.charAt(0).toUpperCase() || 'U'}
                        </Text>
                      </View>
                      <Text className="text-white flex-1">
                        {DUMMY_PARTICIPANTS[userId]}
                      </Text>
                      {userId === '1' && (
                        <View className="bg-orange px-2 py-1 rounded">
                          <Text className="text-white text-xs">Creator</Text>
                        </View>
                      )}
                    </View>
                  ))}
                </ScrollView>

                <View className="p-4 border-t border-secondary">
                  <TouchableOpacity
                    onPress={() => setIsMembersModalVisible(false)}
                    className="w-full py-3 rounded-xl bg-secondary"
                  >
                    <Text className="text-white2 text-center">Close</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </BlurView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default TripsScreen; 