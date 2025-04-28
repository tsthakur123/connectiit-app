// components/DMContent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const DMScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Direct Messages</Text>
      </View>
      <ScrollView style={styles.scrollView}>
        {Array(12).fill(0).map((_, i) => (
          <View key={i} style={styles.conversation}>
            <View style={styles.avatar} />
            <View style={styles.messagePreview}>
              <Text style={styles.username}>User {i + 1}</Text>
              <Text style={styles.message}>This is a message preview...</Text>
            </View>
            <Text style={styles.time}>5m</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  conversation: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e0e0e0',
    marginRight: 15,
  },
  messagePreview: {
    flex: 1,
  },
  username: {
    fontWeight: '600',
    marginBottom: 5,
  },
  message: {
    color: '#666',
  },
  time: {
    color: '#aaa',
    fontSize: 12,
  },
});

export default DMScreen;