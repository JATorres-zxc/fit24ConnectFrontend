import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import RequestWorkoutHeader from '@/components/RequestHeaderWO';
import SendFeedbackHeader from '@/components/SendFeedbackHeaderWO';
import { FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Exercise {
  name: string;
  description: string;
  image: string;
}

interface ExerciseContainerProps {
  exercises: Exercise[];
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
interface WorkoutsContainerProps {
  workouts: Workout[];
  onWorkoutPress: (workout: Workout) => void;
  onTrashPress: () => void;
  onUpdateWorkout: (updatedWorkout: Workout) => void; // New prop for updating workout
}

const WorkoutsContainer: React.FC<WorkoutsContainerProps> = ({ workouts, onWorkoutPress, onTrashPress, onUpdateWorkout }) => {
      const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
      const [trainer, setTrainer] = useState(""); // State to store selected trainer
      const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null); // State to store selected workout
      const [trainers, setTrainers] = useState([]);
      const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
      const [intensityLevel, setIntensityLevel] = useState(""); // State to store intensity level
      const [feedback, setFeedback] = useState(""); // State to store feedback
      const [rating, setRating] = useState(""); // State to store rating
      
      const handleFeedbackSubmit = async () => {
          if (!feedback || !rating) {
            Toast.show({
              type: 'error',
              text1: 'Missing Fields',
              text2: 'Please fill out all fields before submitting feedback.',
              position: 'bottom'
            });
            return;
          }
      
          if (selectedWorkout) {
            const newFeedback: Feedback = {
              id: `${selectedWorkout.fitnessGoal}-${Date.now()}`,
              feedback,
              rating: parseInt(rating),
              createdAt: new Date(),
            };
      
            const updatedWorkout: Workout = {
              ...selectedWorkout,
              feedbacks: [...selectedWorkout.feedbacks, newFeedback],
            };
      
            setSelectedWorkout(updatedWorkout);
            onUpdateWorkout(updatedWorkout); // Call the function to update the workout in the parent component
          } else {
            console.error("No workout available to add feedback.");
          }
      
          try {
            const temp_response = true;
      
            if (temp_response) {
              Toast.show({
                type: 'info',
                text1: 'Feedback Sent',
                text2: 'Your feedback has been sent successfully.',
                position: 'bottom'
              });
              setViewState("plan");
              setFeedback("");
              setRating("");
            } else {
              Toast.show({
                type: 'error',
                text1: 'Feedback Failed',
                text2: 'There was an error submitting your feedback.',
                position: 'bottom'
              });
            }
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Feedback Failed',
              text2: 'There was an error submitting your feedback.',
              position: 'bottom'
            });
          }
        };

  return (
    <ScrollView>
      <View style={styles.container}>
          { viewState === "request" ? (
            <View style={styles.formContainer}>
              <RequestWorkoutHeader setViewState={setViewState}/>
              <Text style={styles.requestHeaders}>Choose Trainer</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={trainer}
                  onValueChange={(itemValue) => setTrainer(itemValue)}
                  style={styles.picker}
                  itemStyle={{ color: Colors.buttonText }}
                  prompt="Select trainer"
                  dropdownIconColor={Colors.buttonBlack}
                  dropdownIconRippleColor={Colors.buttonBlack}
                  mode="dropdown"
                >
                  <Picker.Item label="Select Trainer" value="" style={styles.input}/>
                  <Picker.Item label="Trainer A" value="trainerA" />
                  <Picker.Item label="Trainer B" value="trainerB" />
                  <Picker.Item label="Trainer C" value="trainerC" />
                </Picker>
              </View>

              <Text style={styles.requestHeaders}>Fitness Goal</Text>
              <TextInput
                placeholder="Enter Your Fitness Goal"
                style={styles.input}
                value={fitnessGoal}
                onChangeText={(text) => setFitnessGoal(text)}
              />

              <Text style={styles.requestHeaders}>Intensity Level</Text>
              <TextInput
                placeholder="Enter Your Intensity Level"
                style={styles.input}
                value={intensityLevel}
                onChangeText={(text) => setIntensityLevel(text)}
              />

              <TouchableOpacity style={styles.submitButton} onPress={() => setViewState("plan")}>
                <Text style={styles.buttonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          ) : viewState === "feedback" ? (
            <View style={styles.formContainer}>
              <SendFeedbackHeader setViewState={setViewState}/>
              <Text style={styles.feedbackHeaders}>Feedback</Text>
              <TextInput
                placeholder="Enter your feedback here"
                style={[styles.input, styles.feedbackInput]}
                value={feedback}
                onChangeText={setFeedback}
                multiline
                numberOfLines={4}
              />
              <Text style={styles.requestHeaders}>Overall Rating</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={rating}
                  onValueChange={(itemValue) => setRating(itemValue)}
                  style={styles.pickerBlack}
                  itemStyle={{ color: Colors.buttonText }}
                  mode="dropdown"
                  dropdownIconColor={Colors.buttonText}
                  dropdownIconRippleColor={Colors.buttonText}
                  prompt="Select a Rating:"
                >
                  <Picker.Item label="Enter Your Rating" value="" fontFamily="Fonts.regular"/>
                  <Picker.Item label="1 - Poor" value="1" fontFamily="Fonts.regular"/>
                  <Picker.Item label="2 - Fair" value="2" fontFamily="Fonts.regular"/>
                  <Picker.Item label="3 - Good" value="3" fontFamily="Fonts.regular"/>
                  <Picker.Item label="4 - Very Good" value="4" fontFamily="Fonts.regular"/>
                  <Picker.Item label="5 - Excellent" value="5" fontFamily="Fonts.regular"/>
                </Picker>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
                <Text style={styles.buttonText}>Submit Feedback</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.planContainer}>
              {workouts.map((workout, index) => (
                <View>
                  <TouchableOpacity key={index} style={styles.workoutItem} onPress={() => onWorkoutPress(workout)}>
                    <Image source={{ uri: workout.exercises[0].image }} style={styles.workoutImage} />
                    <View style={styles.textContainer}>
                      <Text style={styles.workoutTitle}>{workout.title}</Text>
                      <Text style={styles.fitnessGoal}>Fitness Goal:</Text>
                      <Text style={{fontFamily: Fonts.semiboldItalic, marginBottom: 15}}>{workout.fitnessGoal}</Text>
                      <Text style={styles.intensityLevel}>Intensity Level:</Text>
                      <Text style={{fontFamily: Fonts.semiboldItalic}}>{workout.intensityLevel}</Text>
                    </View>
                    <TouchableOpacity style={styles.trashIcon} onPress={onTrashPress}>
                      <FontAwesome name="trash" size={24} color={Colors.buttonBlack} />
                    </TouchableOpacity>
                  </TouchableOpacity>
                  <View style={styles.container}>
                    <View style={styles.horizontalLine} />
                  </View>
                </View>
              ))}
            </View> )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 0,
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
    alignItems: "flex-start",
    verticalAlign: 'middle',
  },
  horizontalLine: {
    width: "100%", // This makes the line span the entire width
    height: 1, // Adjust the height as needed
    backgroundColor: Colors.buttonBlack, // Adjust the color as needed
    marginBottom: 45,
  },
  planContainer: {
    width: "100%",
  },
  workoutItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  workoutImage: {
    width: 90,
    height: 90,
    marginRight: 5,
    borderWidth: 1,
    borderColor: Colors.buttonBlack,
  },
  workoutTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.buttonBlack,
    marginBottom: 10,
  },
  fitnessGoal: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: Colors.textSecondary
  },
  intensityLevel: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: Colors.textSecondary
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
  trashIcon: {
    alignSelf: 'flex-start',
    paddingTop: 5,
    flexGrow: 0,
  },
  requestHeaders: {
    fontSize: 18,
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: Fonts.semibold,
  },
  feedbackHeaders: {
    fontSize: 18,
    marginBottom: 15,
    alignSelf: "flex-start",
    fontFamily: Fonts.semibold,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    borderRadius: 0,
    marginBottom: 10,
    fontFamily: Fonts.regular,
  },
  feedbackInput: {
    height: 200,
    textAlignVertical: 'top',
    fontFamily: Fonts.regular,
  },
  picker: { 
    width: '100%', 
    backgroundColor: Colors.background,
    fontFamily: Fonts.regular,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    width: '100%', 
    borderRadius: 0,
    marginBottom: 10,
    fontFamily: Fonts.regular,
  },
  pickerBlack: {
    width: '100%', 
    backgroundColor: Colors.buttonBlack,
    color: Colors.offishWhite,
    fontFamily: Fonts.regular,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 5,
    alignSelf: "center",
    top: -5,
    width: "50%",
    height: 45,
    marginTop: 10,
    fontFamily: Fonts.medium,
  },
  buttonText: {
    color: Colors.buttonText,
    fontSize: 16,
    textAlign: "center",
    fontFamily: Fonts.semibold,
  },
});

export default WorkoutsContainer;
