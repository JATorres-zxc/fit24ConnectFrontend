import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, StyleSheet, TouchableOpacity, ScrollView, KeyboardAvoidingView, Platform, 
  TextInput,
  ImageSourcePropType
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Header from '@/components/WorkoutHeader';
import Toast from 'react-native-toast-message';
import ProgramHeader from '@/components/ProgramHeaderWO';
import { Ionicons } from '@expo/vector-icons';
import WorkoutsContainer from '@/components/WorkoutsContainer';
import ExerciseContainer from '@/components/ExerciseContainer';
import RequestWorkoutHeader from '@/components/RequestHeaderWO';
import SendFeedbackHeader from '@/components/SendFeedbackHeaderWO';
import PersonalWorkoutsHeader from '@/components/MemberPersonalWOHeader';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { API_BASE_URL } from '@/constants/ApiConfig';
import { getItem } from '@/utils/storageUtils';

// Import interfaces for workouts
import { Exercise, User, Feedback, Workout } from "@/types/interface";
import { Trainer2 as Trainer } from "@/types/interface";

let token: string | null = null;
let userID: string | null = null;
let workout_id: string | null = null;

const WorkoutScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]); // State to store trainers
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [intensityLevel, setIntensityLevel] = useState(""); // State to store intensity level
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState(""); // State to store rating
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [workout, setWorkout] = useState<Workout | null>(null);

  // Fetching trainers from API
  const fetchTrainers = async () => {
    try {
      const token = await getItem('authToken');
      const trainerResponse = await fetch(`${API_BASE_URL}/api/account/trainers/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!trainerResponse.ok) {
        throw new Error(`Trainer fetch error! Status: ${trainerResponse.status}`);
      }

      const trainerList = await trainerResponse.json();

      const resolvedTrainers = trainerList.map((trainer: Trainer) => ({
        id: trainer.id,
        user: {
          id: trainer.user?.id || null,
          email: trainer.user?.email || "No email",
          full_name: trainer.user?.full_name || null,
        },
        experience: trainer.experience?.trim() || "Not Specified",
        contact: trainer.contact?.trim() || "Not Available",
      }));

      setTrainers(resolvedTrainers);
    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'No Trainers Found!',
        text2: `${error}`,
        topOffset: 80,
      });
    }
  };

  // Fetching Workout from API
  const fetchWorkout = async () => {
    try {
      const token = await getItem('authToken');
      const userID = await getItem('userID'); // Retrieve the logged-in user's ID

      const response = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const programsData = await response.json();

      const filteredPrograms = programsData.filter((program: any) =>
        // program.status === "completed" &&
        (String(program.requestee) === String(userID) || program.requestee === null)
      );
      
      if (filteredPrograms.length === 0) {
        throw new Error('No workouts available for the user');
      }

      const formattedWorkouts: Workout[] = filteredPrograms.map((userProgram: any) => ({
        id: userProgram.id.toString(),
        title: userProgram.program_name,
        fitnessGoal: userProgram.fitness_goal,
        intensityLevel: userProgram.intensity_level,
        trainer: userProgram.trainer || "N/A",
        exercises: userProgram.workout_exercises.map((exercise: any) => ({
          id: exercise.id.toString(),
          image: exercise.image,
          name: exercise.name,
          description: exercise.description,
          muscle_group: exercise.muscle_group,
        })),
        visibleTo: userProgram.requestee || "everyone",
        status: userProgram.status,
        feedbacks: [],
      }));

      setWorkouts(formattedWorkouts);

    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'No Workouts Found!',
        text2: `${error}`,
        topOffset: 80,
      });

      if (error instanceof Error) {
        if (error.message.includes('NetworkError')) {
          console.error('Network error: Please check if the server is running and accessible.');
        } else if (error.message.includes('CORS')) {
          console.error('CORS error: Please ensure your server allows requests from your frontend.');
        }
      }
    }
  };

  // actual call to API
  useFocusEffect(
    useCallback(() => {
      fetchTrainers();
      fetchWorkout();
      const fetchUserIDandToken = async () => {
        userID = await getItem('userID');
        token = await getItem('authToken');
      };
      fetchUserIDandToken();
    }, [refreshTrigger])
  ); 

  const [workouts, setWorkouts] = useState<Workout[]>([
    // {
    //   id: "WO1",
    //   title: "Full Body Workout",
    //   fitnessGoal: "Strength and Conditioning",
    //   intensityLevel: "High",
    //   trainer: "Trainer A",
    //   exercises: [
    //     { id: "EX1", name: "Push-ups", description: "Perform push-ups to work on upper body strength.", image: require("@/assets/images/darkicon.png") },
    //     { id: "EX2", name: "Squats", description: "Perform squats to work on lower body strength.", image: require("@/assets/images/darkicon.png") },
    //   ],
    //   visibleTo: "everyone",
    //   feedbacks: [
    //     { id: "feedback1", feedback: "Great workout!", rating: 5, createdAt: new Date() },
    //   ],
    //   status: "completed",
    //   requestee: null,
    // },
    // {
    //   id: "WO2",
    //   title: "Cardio Blast",
    //   fitnessGoal: "Cardiovascular Health",
    //   intensityLevel: "Medium",
    //   trainer: "Trainer B",
    //   exercises: [
    //     { id: "EX3", name: "Jumping Jacks", description: "Perform jumping jacks to get your heart rate up.", image: require("@/assets/images/darkicon.png") },
    //     { id: "EX4", name: "Burpees", description: "Perform burpees to improve endurance.", image: require("@/assets/images/darkicon.png") },
    //   ],
    //   visibleTo: "1",
    //   feedbacks: [
    //     { id: "feedback2", feedback: "Intense but effective!", rating: 4, createdAt: new Date() },
    //   ],
    //   status: "completed",
    //   requestee: "1",
    // },
  ]);

  const handleDelete = async (workout: Workout) => {
    try {
      token = await getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/${workout.id}/`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Workout Deleted',
          text2: 'Your workout has been deleted successfully.',
          topOffset: 80,
        });

        setWorkouts((prevWorkouts) => prevWorkouts.filter(w => w.id !== workout.id)); // Remove the workout from the list
        if (workout.id === selectedWorkout?.id) {
          setSelectedWorkout(null); // Clear selected workout if it matches the deleted one
        }
        if (workout.id === workout?.id) {
          setWorkout(null); // Clear current workout if it matches the deleted one
        }
        setRefreshTrigger(prev => !prev);
        setViewState("plan");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: 'There was an error deleting your workout.',
          topOffset: 80,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'There was an error deleting your workout.',
        topOffset: 80,
      });
    }
  };

  const handleWorkoutPress = (selectedWorkout: Workout) => {
    setWorkout(selectedWorkout);
    workout_id = selectedWorkout.id; // Store the selected workout ID for feedback submission
    setViewState("exercises");
  };

  const handleTrashPress = (workout: Workout) => {
    setSelectedWorkout(workout);
    setWorkout(workout);
    setViewState("delete");
  };

  const handleFeedbackSubmit = async () => {
    if (!feedback || !rating) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before submitting feedback.',
        topOffset: 80,
      });
      return;
    }

    // This is in line with an agreed central feedback and request database.
    const token = await getItem('authToken');

    const response = await fetch(`${API_BASE_URL}/api/workouts/feedbacks/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        program: workout_id,
        comment: feedback,
        rating: rating,
      }),
    });

    try {
      if (response.ok) {
        Toast.show({
          type: 'info',
          text1: 'Feedback Sent',
          text2: 'Your feedback has been sent successfully.',
          topOffset: 80,
        });
        setRefreshTrigger(prev => !prev);
        setViewState("plan");
        setFeedback("");
        setRating("");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Feedback Failed',
          text2: 'There was an error submitting your feedback.',
          topOffset: 80,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Feedback Failed',
        text2: 'There was an error submitting your feedback.',
        topOffset: 80,
      });
    }
  };

  const handleRequestSubmit = async () => {
    if (!fitnessGoal || !intensityLevel || !trainer) {
        Toast.show({
            type: 'error',
            text1: 'Missing Fields',
            text2: 'Please fill out all fields before submitting.',
            topOffset: 80,
        });
        return;
    }

    try {
      const token = await getItem('authToken');  

        // Use the endpoint to request a new workout
        const requestResponse = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                trainer_id: trainer, // Trainer ID is required
                fitness_goal: fitnessGoal,
                intensity_level: intensityLevel,
                status: "pending",
                requestee: userID, // User ID is required
            }),
        });

        if (!requestResponse.ok) {
            throw new Error(`Workout Request API error! Status: ${requestResponse.status}`);
        }

        Toast.show({
            type: 'success',
            text1: 'Request Submitted',
            text2: 'Your workout request has been submitted successfully.',
            topOffset: 80,
        });

        setRefreshTrigger(prev => !prev);

        setTimeout(() => {
            setViewState('plan');
        }, 2000); // 2-second delay
    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: 'There was an error with your workout request. Please check if you already have a pending request.',
            topOffset: 80,
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
          { viewState === "request" ? (
            // Request Meal Plan View
            <View style={styles.formContainer}>
              <RequestWorkoutHeader setViewState={setViewState}/>
              
              <View style={styles.requestWOContainer}>
                {/* Trainer Picker */}
                <Text style={styles.requestHeaders}>Choose Trainer</Text>
                <View style={styles.pickerTrainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setTrainer(value)}
                    items={trainers.map((trainer) => ({
                      label: trainer.user.full_name || `Trainer ID: ${trainer.id}`,
                      value: trainer.user.id,
                    }))}
                    style={trainerpickerSelectStyles}
                    value={trainer}
                    placeholder={{ label: 'Select Trainer', value: null }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() =>
                      Platform.OS === "ios" ? (
                        <Ionicons name="chevron-down" size={20} color="gray" />
                      ) : null
                    }
                  />
                </View>

              <Text style={styles.requestHeaders}>Fitness Goal</Text>
              <TextInput
                placeholder="Enter Your Fitness Goal"
                placeholderTextColor={Colors.textSecondary}
                style={styles.input}
                value={fitnessGoal}
                onChangeText={(text) => setFitnessGoal(text)}
              />

              <Text style={styles.requestHeaders}>Intensity Level</Text>
              <TextInput
                placeholder="Enter Your Intensity Level"
                placeholderTextColor={Colors.textSecondary}
                style={styles.input}
                value={intensityLevel}
                onChangeText={(text) => setIntensityLevel(text)}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleRequestSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          </View>
          ) : viewState === "feedback" ? (
            <View style={styles.formContainer}>
              <SendFeedbackHeader setViewState={setViewState}/>

              <View style={styles.sendFBContainer}>
                <Text style={styles.feedbackHeaders}>Feedback</Text>
                <TextInput
                  placeholder="Enter your feedback here"
                  placeholderTextColor={Colors.textSecondary}
                  style={[styles.input, styles.feedbackInput]}
                  value={feedback}
                  onChangeText={setFeedback}
                  multiline
                  numberOfLines={4}
                />

                <Text style={styles.requestHeaders}>Overall Rating</Text>
                <View style={styles.pickerRating}>
                  <RNPickerSelect
                    onValueChange={(value) => setRating(value)}
                    items={[
                      { label: '1 - Poor', value: '1' },
                      { label: '2 - Fair', value: '2' },
                      { label: '3 - Good', value: '3' },
                      { label: '4 - Very Good', value: '4' },
                      { label: '5 - Excellent', value: '5' },
                    ]}
                    style={ratingpickerSelectStyles}
                    value={rating}
                    placeholder={{ label: 'Enter Your Rating', value: null }}
                    useNativeAndroidPickerStyle={false}
                    Icon={() =>
                      Platform.OS === "ios" ? (
                        <Ionicons name="chevron-down" size={20} color="gray" />
                      ) : null
                    }
                  />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
                  <Text style={styles.buttonText}>Submit Feedback</Text>
                </TouchableOpacity>
                
              </View>
            </View>
          ) : viewState === "exercises" ? (
            <View style={styles.planContainer}>
              <ProgramHeader setViewState={setViewState} title={workout?.title || "Workout Program"} />
              <ExerciseContainer exercises={workout!.exercises} />

              <TouchableOpacity style={styles.buttonFeedback} onPress={() => setViewState("feedback")}>
                <Text style={styles.buttonText}>Send Feedback</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("request")}>
                <Text style={styles.buttonText}>Request New Workout</Text>
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
                <TouchableOpacity style={styles.buttonGreen} onPress={() => selectedWorkout && handleDelete(selectedWorkout)}> 
                  {/* short-circuited potential null workout */}
                  <Text style={styles.buttonText}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : viewState === "personalWO" ? (
            <>
              <View style={styles.planContainer}>
                <PersonalWorkoutsHeader setViewState={setViewState} />
                {workouts.filter(w => String(w.visibleTo) === String(userID)).length > 0 ? (
                  <View>
                    <WorkoutsContainer
                      workouts={workouts.filter(w => String(w.visibleTo) === String(userID) && w.status === "completed")}
                      onWorkoutPress={handleWorkoutPress}
                      onTrashPress={handleTrashPress}
                    />
                    <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("request")}>
                      <Text style={styles.buttonText}>Request New Workout</Text>
                    </TouchableOpacity>
                  </View>
                ) : workouts.some(workout => workout.status === "pending") ? (
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>
                      You have a pending workout request. Please wait for your trainer to complete it. You cannot request a new workout at this time.
                    </Text>
                  </View>
                ) : (
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>
                      You have no personal workouts yet. Request a new workout plan to get started.
                    </Text>
                    <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
                      <Text style={styles.buttonText}>Request Workout Plan</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </>
          ) : (
            <>
              {workouts.filter(w => w.visibleTo === "everyone" && w.status === "completed").length > 0 ? (
                <View style={styles.planContainer}>
                  <Header />
                  <TouchableOpacity style={styles.button} onPress={() => setViewState("personalWO")}>
                    <Text style={styles.buttonText}>Personal Workout Programs</Text>
                  </TouchableOpacity>
                  <WorkoutsContainer
                    workouts={workouts.filter(w => w.visibleTo === "everyone")}
                    onWorkoutPress={handleWorkoutPress}
                    onTrashPress={handleTrashPress}
                  />
                </View>
              ) : (
                <View>
                  <Header />
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>No existing general workout plan.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setViewState("personalWO")}>
                      <Text style={styles.buttonText}>Personal Workout Programs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
                      <Text style={styles.buttonText}>Request Workout Plan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
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
    backgroundColor: Colors.bg,
    paddingLeft: 30,
    paddingRight: 30,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "flex-start",
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
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
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    top: -5,
    width: "70%",
  },
  buttonBlack: {
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
    width: "70%",
    backgroundColor: Colors.black,
    marginHorizontal: 5,
  },
  buttonRed: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonGreen: {
    backgroundColor: Colors.green,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  buttonText: {
    color: Colors.white,
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
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    fontFamily: Fonts.medium,
  },
  mealItem: {
    borderWidth: 1,       // Border thickness
    width: '100%',        // Full width
    borderColor: Colors.black,  // Border color (light gray)
    borderRadius: 0,     // Rounded corners
    padding: 15,          // Padding inside the box
    marginVertical: 10,   // Spacing between containers
    backgroundColor: Colors.bg, // Background color
    marginBottom: 10,
  },
  mealTitle: {
    fontSize: 18,
    backgroundColor: Colors.bg,
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
    backgroundColor: Colors.bg,
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
  requestHeaders: {
    fontSize: 16,
    marginBottom: 5,
    alignSelf: "flex-start",
    fontFamily: Fonts.semibold,
  },
  feedbackHeaders: {
    fontSize: 16,
    marginBottom: 15,
    alignSelf: "flex-start",
    fontFamily: Fonts.semibold,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.textSecondary,
    borderRadius: 10,
    marginBottom: 10,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  feedbackInput: {
    height: 200,
    textAlignVertical: 'top',
    fontFamily: Fonts.regular,
  },
  picker: { 
    width: '100%', 
    height: 50,
    backgroundColor: Colors.bg,
    fontFamily: Fonts.regular,
  },
  pickerContainer: {
    borderWidth: 1.5,
    borderColor: Colors.textSecondary,
    width: '100%', 
    borderRadius: 0,
    marginBottom: 10,
  },
  pickerBlack: {
    width: '100%',
    height: 50,
    backgroundColor: Colors.black,
    color: Colors.offishWhite,
    fontFamily: Fonts.regular,
  },
  submitButton: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    top: -5,
    width: "70%",
    height: 45,
    marginTop: 30,
    fontFamily: Fonts.medium,
  },
  sendFBContainer: {
    width: "100%",
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  pickerRating: {
    width: '100%', 
    backgroundColor: Colors.black,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
  requestWOContainer: {
    width: "100%",
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center',
  },
  pickerTrainer: {
    width: '100%',
    backgroundColor: Colors.bg,
    borderWidth: 1,
    borderRadius: 10,
    marginBottom: 10,
  },
});

const trainerpickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: Colors.textSecondary,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: Colors.textSecondary,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
};

const ratingpickerSelectStyles = {
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: Colors.white,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    paddingRight: 30, // to ensure the text is never behind the icon
    color: Colors.textSecondary,
  },
  iconContainer: {
    top: 10,
    right: 12,
  },
};

export default WorkoutScreen;
