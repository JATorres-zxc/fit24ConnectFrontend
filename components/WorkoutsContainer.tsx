import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Modal, TextInput } from "react-native";
import { Picker } from '@react-native-picker/picker';
import Toast from 'react-native-toast-message';

const colors = {
  background: '#f9f9f9',
  white: '#fff',
  shadow: '#000',
  placeholder: '#ddd',
  textPrimary: '#666',
  border: '#ccc',
  buttonBackground: '#d7be69',
  buttonText: '#fff',
  modalBackground: 'rgba(0, 0, 0, 0.5)',
};

interface Exercise {
  id: string;
  name: string;
  duration: string;
}

interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

interface Workout {
  id: string;
  title: string;
  fitness_goal: string;
  intensity_level: string;
  trainer: string;
  exercises: Exercise[];
  feedbacks: Feedback[];
}

interface Props {
  workouts: Workout[];
  setWorkouts: (workouts: Workout[]) => void;
}

export default function WorkoutsContainer({ workouts, setWorkouts }: Props) {
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState('');
  const [viewState, setViewState] = useState("list"); // "list", "details", "feedback", "request"
  const [fitnessGoal, setFitnessGoal] = useState('');
  const [weightGoal, setWeightGoal] = useState('');

  const handleWorkoutPress = (workout: Workout) => {
    setSelectedWorkout(workout);
    setViewState("details");
  };

  const handleCloseModal = () => {
    setSelectedWorkout(null);
  };

  const handleSendFeedback = () => {
    if (!feedback || !rating) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before submitting feedback.',
        position: 'bottom'
      });
      return;
    }

    const newFeedback: Feedback = {
      id: `${selectedWorkout?.id}-${Date.now()}`,
      feedback,
      rating: parseInt(rating),
      createdAt: new Date(),
    };

    const updatedWorkouts = workouts.map(workout =>
      workout.id === selectedWorkout?.id
        ? { ...workout, feedbacks: [...workout.feedbacks, newFeedback] }
        : workout
    );

    setWorkouts(updatedWorkouts);

    // Placeholder for API call to send feedback
    // try {
    //   const response = await fetch('https://api.example.com/sendFeedback', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ feedback, rating, workoutId: selectedWorkout?.id }),
    //   });
  
    //   const result = await response.json();
  
    //   if (response.ok) {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Feedback Sent',
    //       text2: 'Your feedback has been sent successfully.',
    //       position: 'bottom'
    //     });
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Feedback Failed',
    //       text2: 'There was an error sending your feedback.',
    //       position: 'bottom'
    //     });
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Feedback Failed',
    //     text2: 'There was an error sending your feedback.',
    //     position: 'bottom'
    //   });
    // }

    // Temporary success response for testing
    Toast.show({
      type: 'success',
      text1: 'Feedback Sent',
      text2: 'Your feedback has been sent successfully.',
      position: 'bottom'
    });
    setFeedback('');
    setRating('');
    setViewState("details");;
  };

  const handleRequestSubmit = () => {
    if (!fitnessGoal || !weightGoal) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before submitting your request.',
        position: 'bottom'
      });
      return;
    }

    // Placeholder for API call to request a personal workout
    // try {
    //   const response = await fetch('https://api.example.com/requestPersonalWorkout', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({ fitnessGoal, weightGoal }),
    //   });
  
    //   const result = await response.json();
  
    //   if (response.ok) {
    //     Toast.show({
    //       type: 'success',
    //       text1: 'Request Sent',
    //       text2: 'Your personal workout request has been sent successfully.',
    //       position: 'bottom'
    //     });
    //   } else {
    //     Toast.show({
    //       type: 'error',
    //       text1: 'Request Failed',
    //       text2: 'There was an error sending your request.',
    //       position: 'bottom'
    //     });
    //   }
    // } catch (error) {
    //   Toast.show({
    //     type: 'error',
    //     text1: 'Request Failed',
    //     text2: 'There was an error sending your request.',
    //     position: 'bottom'
    //   });
    // }

    // Temporary success response for testing
    Toast.show({
      type: 'success',
      text1: 'Request Sent',
      text2: 'Your personal workout request has been sent successfully.',
      position: 'bottom'
    });
    setFitnessGoal('');
    setWeightGoal('');
    setViewState("details");;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={workouts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.workoutItem}>
            <TouchableOpacity onPress={() => handleWorkoutPress(item)}>
              <View style={styles.workoutContent}>
                <View style={styles.imagePlaceholder} />
                <View style={styles.textContainer}>
                  <Text style={styles.workoutTitle}>{item.title}</Text>
                  <Text style={styles.workoutDescription}>{item.fitness_goal}</Text>
                  <Text style={styles.workoutDescription}>Intensity: {item.intensity_level}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )}
      />

      {viewState === "details" && selectedWorkout && (
        <View style={styles.detailsContainer}>
          <Text style={styles.workoutTitle}>{selectedWorkout.title}</Text>
          <FlatList
            data={selectedWorkout.exercises}
            keyExtractor={(exercise) => exercise.id}
            renderItem={({ item: exercise }) => (
              <View style={styles.exerciseItem}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDuration}>{exercise.duration}</Text>
              </View>
            )}
          />
          <TouchableOpacity style={styles.button} onPress={() => setViewState("feedback")}>
            <Text style={styles.buttonText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
            <Text style={styles.buttonText}>Request Workout</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setViewState("list")}>
            <Text style={styles.buttonText}>Back</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewState === "feedback" && (
        <View style={styles.detailsContainer}>
          <TextInput placeholder="Enter your feedback" style={styles.input} value={feedback} onChangeText={setFeedback} />
          <Picker selectedValue={rating} style={styles.picker} onValueChange={(itemValue) => setRating(itemValue)}>
            <Picker.Item label="Select Rating" value="" />
            <Picker.Item label="1 - Poor" value="1" />
            <Picker.Item label="5 - Excellent" value="5" />
          </Picker>
          <TouchableOpacity style={styles.button} onPress={handleSendFeedback}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setViewState("details")}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}

      {viewState === "request" && (
        <View style={styles.detailsContainer}>
          <TextInput placeholder="Enter Fitness Goal" style={styles.input} value={fitnessGoal} onChangeText={setFitnessGoal} />
          <TextInput placeholder="Enter Weight Goal" style={styles.input} value={weightGoal} onChangeText={setWeightGoal} />
          <TouchableOpacity style={styles.button} onPress={handleRequestSubmit}>
            <Text style={styles.buttonText}>Submit</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setViewState("details")}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  detailsContainer: {
    padding: 20,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    marginBottom: 20,
    width: '100%',
  },
  trainerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
  },
  feedbackInput: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    marginRight: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "flex-start",
    verticalAlign: "middle",
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 0,
    marginBottom: 10,
  },
  workoutItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  workoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imagePlaceholder: {
    width: 50,
    height: 50,
    backgroundColor: colors.placeholder,
    borderRadius: 5,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  workoutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  workoutDescription: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  intensityDescription: {
    marginBottom: 20,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  exerciseTextContainer: {
    flex: 1,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  exerciseDuration: {
    fontSize: 16,
    color: colors.textPrimary,
  },
  feedbackModalContent: {
    width: '80%',
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 10,
  },
  button: {
    backgroundColor: colors.buttonBackground,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: colors.buttonText,
    fontSize: 16,
    fontWeight: 'bold',
  },
  closeButtonContainer: {
    marginTop: 20,
  },
});
