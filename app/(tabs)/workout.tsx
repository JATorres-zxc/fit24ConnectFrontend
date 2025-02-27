import React, { useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, 
  TextInput
} from "react-native";
import Header from '@/components/WorkoutHeader';
import Toast from 'react-native-toast-message';
import ProgramHeader from '@/components/ProgramHeaderWO';
import { Ionicons } from '@expo/vector-icons';
import WorkoutsContainer from '@/components/WorkoutsContainer';
import ExerciseContainer from '@/components/ExerciseContainer';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Exercise {
  name: string;
  description: string;
  image: string;
}
interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

interface Workout {
  title: string;
  fitnessGoal: string;
  intensityLevel: string;
  exercises: Exercise[];
  visibleTo: "everyone" | "userEmail" | string;
  feedbacks: Feedback[];
}

const WorkoutScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [workout, setWorkout] = useState<Workout | null>(null);

  const workouts: Workout[] = [
    {
      title: "Full Body Workout",
      fitnessGoal: "Strength and Conditioning",
      intensityLevel: "High",
      exercises: [
        { name: "Push-ups", description: "Perform push-ups to work on upper body strength.", image: "https://example.com/pushups.jpg" },
        { name: "Squats", description: "Perform squats to work on lower body strength.", image: "https://example.com/squats.jpg" },
      ],
      visibleTo: "everyone",
      feedbacks: [
        { id: "feedback1", feedback: "Great workout!", rating: 5, createdAt: new Date() },
      ],
    },
    {
      title: "Cardio Blast",
      fitnessGoal: "Cardiovascular Health",
      intensityLevel: "Medium",
      exercises: [
        { name: "Jumping Jacks", description: "Perform jumping jacks to get your heart rate up.", image: "https://example.com/jumpingjacks.jpg" },
        { name: "Burpees", description: "Perform burpees to improve endurance.", image: "https://example.com/burpees.jpg" },
      ],
      visibleTo: "userEmail",
      feedbacks: [
        { id: "feedback2", feedback: "Intense but effective!", rating: 4, createdAt: new Date() },
      ],
    },
  ];

  const handleWorkoutPress = (selectedWorkout: Workout) => {
    setWorkout(selectedWorkout);
    setViewState("exercises");
  };

  const handleTrashPress = () => {
    setViewState("delete");
  };

  const handleUpdate = (updatedWorkout: Workout) => {
    setWorkout(updatedWorkout);
  };

  const handleDelete = async () => {
      try {
        // // Replace with actual API call
        // const response = await fetch('https://api.example.com/deleteMealPlan', {
        //   method: 'DELETE',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        // });
        
        const temp_response = true;
  
        // response.ok
  
        if (temp_response) {
          Toast.show({
            type: 'success',
            text1: 'Workout Deleted',
            text2: 'Your workout has been deleted successfully.',
            position: 'bottom'
          });
          
          // TEMPORARY: DELETE SNIPPET WHEN API IS AVAILABLE.
          setWorkout(null); // Clear the workout plan by resetting to initial structure

          setViewState("plan");
        } else {
          Toast.show({
            type: 'error',
            text1: 'Delete Failed',
            text2: 'There was an error deleting your workout.',
            position: 'bottom'
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: 'There was an error deleting your workout.',
          position: 'bottom'
        });
      }
    };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          { viewState === "exercises" ? (
            <View style={styles.planContainer}>
              <ProgramHeader setViewState={setViewState} title={workout?.title || "Workout Program"} />
              <ExerciseContainer exercises={workout!.exercises} />
              <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("plan")}>
                <Text style={styles.buttonText}>Back to Plan</Text>
              </TouchableOpacity>
            </View> 
          ) : viewState === "delete" ? (
            <View style={styles.deleteContainer}>
              <Ionicons name="trash-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.alertTitle}>Delete Workout?</Text>
              <Text style={styles.alertMessage}>
                You're going to permanently delete your workout. Are you sure?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonRed} onPress={() => setViewState("plan")}>
                  <Text style={styles.buttonText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGreen} onPress={handleDelete}>
                  <Text style={styles.buttonText}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            workout ? (
              <View style={styles.planContainer}>
                <Header />
                <WorkoutsContainer
                  workouts={workouts}
                  onWorkoutPress={handleWorkoutPress}
                  onTrashPress={handleTrashPress}
                  onUpdateWorkout={handleUpdate} // Pass the onUpdateWorkout function here
                />
                <TouchableOpacity style={styles.buttonFeedback} onPress={() => setViewState("feedback")}>
                  <Text style={styles.buttonText}>Send Feedback</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("request")}>
                  <Text style={styles.buttonText}>Request New Workout</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <Header />
                <Text style={styles.subtitle2}>You have no existing workout plan.</Text>
                <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
                  <Text style={styles.buttonText}>Request Workout Plan</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

// Styles
const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.background,
    paddingVertical: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  alertTitle: {
    fontSize: 18,
    marginBottom: 5,
    textAlign: "center",
    fontFamily: Fonts.bold,
  },
  alertMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginBottom: 15,
    fontFamily: Fonts.regular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  buttonFeedback: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 5,
    alignSelf: "center",
    top: -5,
    width: "50%",
    height: 45,
  },
  buttonBlack: {
    padding: 12,
    borderRadius: 0,
    alignSelf: "center",
    marginTop: 20,
    width: "70%",
    backgroundColor: Colors.buttonBlack,
    paddingVertical: 10,
    paddingHorizontal: 30,
    marginHorizontal: 5,
  },
  buttonRed: {
    backgroundColor: Colors.buttonRed,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonGreen: {
    backgroundColor: Colors.buttonGreen,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    textAlign: "center",
    fontFamily: Fonts.semibold,
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  planContainer: {
    width: "100%",
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    alignSelf: "baseline",
    fontFamily: Fonts.bold,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: Fonts.medium,
  },
  subtitle2: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: Fonts.mediumItalic,
  },
  button: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
    fontFamily: Fonts.medium,
  },
  mealItem: {
    borderWidth: 1,       // Border thickness
    width: '100%',        // Full width
    borderColor: Colors.buttonBlack,  // Border color (light gray)
    borderRadius: 0,     // Rounded corners
    padding: 15,          // Padding inside the box
    marginVertical: 10,   // Spacing between containers
    backgroundColor: Colors.background, // Background color
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    backgroundColor: Colors.background,
    top: -28,
    marginBottom: -25,
    paddingLeft: 5,
    paddingRight: 5,  // Ensures the background fully wraps the text
    alignSelf: "flex-start", // Shrinks the background to fit the text
    fontFamily: Fonts.semibold,
  },  
  mealData: {
    fontSize: 16,
    marginBottom: 10,
    color: Colors.textPrimary,
    fontFamily: Fonts.semibold,
  },
  mealDescription: {
    fontSize: 16,
    marginBottom: 3,
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
  },
  deleteContainer: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    padding: 20,
    backgroundColor: Colors.background,
    borderRadius: 10,
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignSelf: "center",
  },  
  trashIcon: {
    alignSelf: 'flex-end',
    marginTop: 0,
    flexGrow: 0,
  },
});

export default WorkoutScreen;