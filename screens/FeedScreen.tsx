// components/FeedContent.tsx
import { Topbar } from '@/components/Topbar';
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const FeedScreen = () => {
  return (
    <View style={styles.container}>
      <Topbar/>
      {/* <View style={styles.header}>
        <Text style={styles.headerTitle}>Feed</Text>
      </View> */}
      <ScrollView style={styles.scrollView}>
        {Array(10).fill(0).map((_, i) => (
          <View key={i} style={styles.post}>
            <View style={styles.postHeader}>
              <View style={styles.avatar} />
              <Text style={styles.username}>User {i + 1}</Text>
            </View>
            <View style={styles.postImage} />
            <View style={styles.postActions}>
              <Text style={styles.actionText}>Like • Comment • Share</Text>
            </View>
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
  post: {
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    paddingBottom: 15,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  avatar: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#e0e0e0',
    marginRight: 10,
  },
  username: {
    fontWeight: '600',
  },
  postImage: {
    height: 300,
    backgroundColor: '#f5f5f5',
  },
  postActions: {
    padding: 10,
  },
  actionText: {
    color: '#333',
  },
});

export default FeedScreen;