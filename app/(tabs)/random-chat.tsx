import React, { useState } from 'react';
import { View, Text, TextInput, Pressable, ScrollView, StyleSheet, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import { ArrowLeft, Users, Search, Tags } from 'lucide-react-native';
import { useRouter } from 'expo-router';

const AnonymousChat = () => {
  const [anonymousId, setAnonymousId] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);
  const [mode, setMode] = useState<'interest' | 'random'>('random');
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const modeOptions = [
    { label: 'Random Match', value: 'random' },
    { label: 'Interest-based Match', value: 'interest' },
  ];

  const handleOptionSelect = (value: 'interest' | 'random') => {
    setMode(value);
    setModalVisible(false); // Close modal when option is selected
  };

  const handleRequestChat = () => {
    setLoading(true);
    // Placeholder logic for matchmaking
    setTimeout(() => {
      setLoading(false);
      router.push('/');
    }, 2000);
  };

  const handleInterestChange = (text: string) => {
    setHobbies(text.split(',').map(item => item.trim()).filter(item => item !== ''));
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="#fff" />
              <Text style={styles.backText}>Back</Text>
            </Pressable>
            <Users size={30} color="#fff" />
          </View>
          <Text style={styles.title}>
            <View style={styles.greenDot} />
            Anonymous Mode
          </Text>
          <Text style={styles.subtitle}>Your identity is hidden. Chat safely and freely.</Text>
        </View>

        {/* Main Content */}
        <ScrollView style={styles.mainContent}>
          {/* Conditional rendering for Interests Input */}
          {mode === 'interest' && (
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>Your Interests</Text>
              <View style={styles.inputWrapper}>
                <Tags size={22} color="#bbb" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="Gaming, Music, Travel..."
                  placeholderTextColor="#aaa"
                  onChangeText={handleInterestChange}
                />
              </View>
              {hobbies.length > 0 && (
                <View style={styles.hobbiesContainer}>
                  {hobbies.map((hobby, index) => (
                    <Text key={index} style={styles.hobby}>
                      {hobby}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* Match Mode */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Match Mode</Text>

            {/* Touchable to open modal */}
            <TouchableOpacity style={styles.input} onPress={() => setModalVisible(true)}>
              <Text style={styles.inputText}>{mode === 'interest' ? 'Interest-based Match' : 'Random Match'}</Text>
            </TouchableOpacity>

            {/* Modal with options */}
            <Modal
              transparent={true}
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={() => setModalVisible(false)}
            >
              <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                <View style={styles.modalContent}>
                  {modeOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      style={styles.option}
                      onPress={() => handleOptionSelect(option.value as 'interest' | 'random')}
                    >
                      <Text style={styles.optionText}>{option.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </TouchableOpacity>
            </Modal>

            {/* Conditional info */}
            {mode === 'interest' && (
              <Text style={styles.modeInfo}>
                You'll be matched with users who share at least one of your interests.
              </Text>
            )}
          </View>

          {/* Find Chat Partner Button */}
          <Pressable
            onPress={handleRequestChat}
            disabled={loading || !anonymousId}
            style={[styles.findButton, (loading || !anonymousId) && styles.buttonDisabled]}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <View style={styles.buttonContent}>
                <Search size={22} color="#fff" />
                <Text style={styles.buttonText}>Find a Chat Partner</Text>
              </View>
            )}
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonDisabled:{
    backgroundColor: '#141414',
  },
  container: {
    flex: 1,
    backgroundColor: '#141414',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#1f1f1f',
    borderRadius: 25,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  header: {
    marginBottom: 24,
    backgroundColor: 'transparent',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
  },
  greenDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#00FF00',
    marginRight: 8,
  },
  subtitle: {
    color: '#aaa',
    fontSize: 14,
  },
  mainContent: {
    marginTop: 12,
  },
  inputContainer: {
    marginBottom: 24,
  },
  inputLabel: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 8,
  },
  inputWrapper: {
    position: 'relative',
  },
  icon: {
    position: 'absolute',
    left: 12,
    top: 12,
  },
  input: {
    width: '100%',
    paddingLeft: 40,
    paddingVertical: 14,
    backgroundColor: '#2a2a2a',
    borderRadius: 12,
    borderColor: '#444',
    borderWidth: 1,
    color: '#fff',
    fontSize: 16,
  },
  inputText: {
    fontSize: 16,
    color: '#fff',
  },
  hobbiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  hobby: {
    backgroundColor: '#00FF00',
    color: '#fff',
    paddingVertical: 6,
    paddingHorizontal: 14,
    margin: 6,
    borderRadius: 20,
    fontSize: 12,
  },
  modeInfo: {
    color: '#aaa',
    fontSize: 12,
    marginTop: 8,
  },
  findButton: {
    backgroundColor: '#FF4081',
    paddingVertical: 16,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  findButtonDisabled: {
    backgroundColor: '#555',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#1f1f1f',
    padding: 20,
    borderRadius: 12,
    width: 300,
    maxHeight: 400,
  },
  option: {
    paddingVertical: 15,
  },
  optionText: {
    fontSize: 18,
    color: '#fff',
  },
});


export default AnonymousChat;
