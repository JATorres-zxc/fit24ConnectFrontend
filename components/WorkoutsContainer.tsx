import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import Toast from 'react-native-toast-message';

const WorkoutsContainer = () => {
  const [workouts, setWorkouts] = useState([
    { id: '1', title: 'Morning Yoga', description: 'A relaxing morning yoga session.' },
    { id: '2', title: 'HIIT Workout', description: 'High-intensity interval training.' },
    { id: '3', title: 'Strength Training', description: 'Build muscle with strength training.' },
  ]); // State to store workouts

  // Placeholder for API call to fetch workouts
  // useEffect(() => {
  //   fetch('https://api.example.com/workouts')
  //     .then(response => response.json())
  //     .then(data => setWorkouts(data))
  //     .catch(error => {
  //       Toast.show({
  //         type: 'error',
  //         text1: 'Error',
  //         text2: 'Failed to fetch workouts.',
  //       });
  //     });
  // }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <Text style={styles.workoutTitle}>{item.title}</Text>
            <Text style={styles.workoutDescription}>{item.description}</Text>
          </View>
        )}
      />
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  workoutItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutDescription: {
    fontSize: 16,
    color: '#666',
  },
});

export default WorkoutsContainer;