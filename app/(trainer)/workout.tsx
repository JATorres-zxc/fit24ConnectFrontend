import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, 
  ImageSourcePropType
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import Header from '@/components/WorkoutHeader';
import WorkoutRequestHeader from '@/components/WorkoutRequestHeader';
import WorkoutForm from '@/components/TrainerWorkoutForm';
import EditWOHeader from '@/components/EditWOHeader';
import CreateWOHeader from '@/components/CreateWOHeader';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MemberWorkout from "@/components/MemberWorkout";
import WorkoutRequest from "@/components/WorkoutRequest";
import TrainerWOHeader from "@/components/TrainerWOHeader";
import { nanoid } from 'nanoid';

interface Exercise {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType | null; // Image can be null if not set
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
  duration: number;
  fitnessGoal: string;
  intensityLevel: string;
  trainer: string;
  exercises: Exercise[];
  visibleTo: string;
  feedbacks: Feedback[];
  member_id?: string; // Added member_id property
}

interface SelectedMemberData {
  requesteeID: string;
  requesteeName: string;
  height: string;
  weight: string;
  age: string;
  fitnessGoal: string;
  weightGoal: string;
  allergens: string;
}

const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:8000' // Web uses localhost
    : 'http://172.16.6.198:8000'; // Mobile uses local network IP

let token: string | null = null;
let userID: string | null = null;
let requestee_id: string | null = null;

const WorkoutScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [intensityLevel, setIntensityLevel] = useState(""); // State to store intensity level
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState(""); // State to store rating
  const [selectedWorkout, setSelectedWorkout] = useState<Workout | null>(null);
  const [workout, setWorkout] = useState<Workout | null>(null);
  const [memberData, setMemberData] = useState<SelectedMemberData[]>([
      {
        requesteeID: '1',
        requesteeName: 'John Daks',
        height: '170',
        weight: '65',
        age: '25',
        fitnessGoal: 'Gain Weight',
        weightGoal: '60',
        allergens: 'Peanuts, Dairy',
      },
      {
        requesteeID: '3',
        requesteeName: 'Jane Smith',
        height: '165',
        weight: '55',
        age: '28',
        fitnessGoal: 'Lose Fat',
        weightGoal: '50',
        allergens: 'Shellfish',
      },
      // You can add more members in this list as needed
    ]);
    const [selectedMemberData, setSelectedMemberData] = useState<SelectedMemberData | null>(null); // Default to the first member in the list
    const [newWorkout, setNewWorkout] = useState<Workout | null>({
      id: nanoid(), // Generate a unique ID for the new workout
      title: "",
      duration: 30, // Default number of days
      fitnessGoal: "",
      intensityLevel: "",
      trainer: userID || "",
      exercises: [],
      visibleTo: "everyone",
      feedbacks: [],
      member_id: selectedMemberData?.requesteeID || '', // Added member_id property
    });

  // Add this useEffect to monitor changes to newWorkout and log the visibility
  useEffect(() => {
    console.log("Visibility of this workout plan:", newWorkout?.visibleTo || "Not Set");
  }, [newWorkout?.visibleTo]); // Only trigger when visibleTo changes

  // Fetch Workouts for Trainer
  
  useEffect(() => {
    const fetchWorkoutRequests = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        if (!token) throw new Error("Token not found");
  
        // Fetch all workout requests
        const requestsResponse = await fetch(`${API_BASE_URL}/api/workout/workouts/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!requestsResponse.ok) {
          throw new Error(`Requests API error! Status: ${requestsResponse.status}`);
        }
  
        const requestsData = await requestsResponse.json();

        // Filter meal plans with 'in_progress' status
        const inProgressRequests = requestsData.filter((request: any) => request.status === "pending");

        // Extract requestee IDs from in-progress meal plans
        const requesteeIDs = inProgressRequests.map((request: any) => request.requestee);

        // Fetch all members first
        const allMembersResponse = await fetch(`${API_BASE_URL}/api/account/members/`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!allMembersResponse.ok) {
          throw new Error(`Failed to fetch all members! Status: ${allMembersResponse.status}`);
        }
  
        const allMembers = await allMembersResponse.json();
  
        // Map to combine the requests and profiles
        const memberDataList = requesteeIDs.map((requesteeID: string) => {
          const profileData = allMembers.find((member: any) => String(member.id) === String(requesteeID));
  
          if (!profileData) {
            return null; // If no matching profile found, return null
          }
          
          // Find the matching request for this member
          const request = inProgressRequests.find((request: any) => {
            return request.requestee === profileData.id;
          });

          // Return combined profile and request data
          return {
            requesteeID: request?.requestee.toString() || "Unknown",
            requesteeName: profileData?.full_name || "Unknown",
            height: profileData?.height || "N/A",
            weight: profileData?.weight || "N/A",
            age: profileData?.age || "N/A",
            fitnessGoal: request?.fitness_goal || "Not Specified",
            weightGoal: request?.weight_goal || "Not Specified",
            allergens: request?.allergens || "None",
          };
        }).filter((data: any) => data !== null); // Filter out null values (if any member had no matching profile)
  
        // Append to previous data (assuming setMemberData updates the state)
        setMemberData((prev) => [...prev, ...memberDataList]);
        
      } catch (error) {
        console.error("Error fetching workout requests and profiles:", error);
      }
    };
  
    fetchWorkoutRequests();
  }, []);  
  
  // Fetching Workout from API
  
  useEffect(() => {
    const fetchWorkout = async () => {
      try {
        token = await AsyncStorage.getItem("authToken");
        userID = await AsyncStorage.getItem("userID"); // Ensure userID is a string
  
        const response = await fetch(`${API_BASE_URL}/api/workout/workouts/`, {
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const programsData = await response.json();
  
        // Get all completed programs where the user is the trainer OR it's a free program
        const userPrograms = programsData.filter(
          (program: any) =>
            // program.status === "completed" &&
            (String(program.trainer) === String(userID) || program.requestee === null)
        );
  
        if (!userPrograms.length) {
          console.warn("No programs found for the user");
          return;
        }

        // Convert each workout program into the required format
        const formattedWorkouts = userPrograms.map((userProgram: any) => ({
          id: userProgram.id.toString(),
          title: userProgram.program_name,
          fitnessGoal: userProgram.fitness_goal,
          intensityLevel: userProgram.intensity_level,
          trainer: userProgram.trainer ? userProgram.trainer.toString() : "N/A",
          exercises: userProgram.workout_exercises.map((exercise: any) => ({
            id: exercise.id.toString(),
            image: "", // Add image URL if available in the backend
            sets: exercise.sets,
            reps: exercise.reps,
            restTime: exercise.rest_time,
            durationPerSet: exercise.duration_per_set,
            notes: exercise.notes,
            exercise_details: exercise.exercise_details,
            name: exercise.exercise_details.name,
            description: exercise.exercise_details.description,
            muscle_group: exercise.exercise_details.muscle_group,
          })),
          duration: userProgram.duration, // in days
          status: userProgram.status,
          // requestee from backend is treated as the userID or "everyone" it is visible to.
          visibleTo: (String(userProgram.requestee) === 'null') 
            ? 'everyone' 
            : memberData.find((member) => member.requesteeID === String(userProgram.requestee))?.requesteeName || 'unknown',
          feedbacks: [], // Adjust if feedback data is available in the backend
        }));
  
        // Update the state with all matching workouts
        setWorkouts((prevWorkouts) => {
          const existingIds = new Set(formattedWorkouts.map((w: any) => w.id));
          const filteredPrev = prevWorkouts.filter((w) => !existingIds.has(w.id));
          return [...filteredPrev, ...formattedWorkouts];
        });        

        console.log("Formatted workouts:", workouts);
  
      } catch (error) {
        console.error("Error fetching workout:", error);
  
        if (error instanceof Error) {
          if (error.message.includes("NetworkError")) {
            console.error("Network error: Please check if the server is running and accessible.");
          } else if (error.message.includes("CORS")) {
            console.error("CORS error: Please ensure your server allows requests from your frontend.");
          }
        }
      }
    };
  
    fetchWorkout();
  }, []);  

  const [workouts, setWorkouts] = useState<Workout[]>([]); // State to store all workouts]);

  const handlePublish = async (currentWorkout?: Workout) => {
    const plan = currentWorkout; // Use the current workout state
  
    if (!plan || !plan.exercises || plan.exercises.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Workout',
        text2: 'You must have at least one exercise before publishing the workout.',
        position: 'bottom',
      });
      return;
    }
  
    const invalidExercises = plan.exercises.filter(exercise =>
      !exercise.name?.trim() ||
      !exercise.description?.trim()
    );
  
    if (invalidExercises.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `Please fill out all fields for ${invalidExercises.length} exercise(s).`,
        position: 'bottom',
      });
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const trainerID = await AsyncStorage.getItem('userID');
      const requesteeID = selectedMemberData?.requesteeID || null;
  
      // Check if the workout exists in the state
      const existingWorkout = workouts.find(workout => workout.id === plan.id);
  
      if (existingWorkout) {
        // Workout exists, so we'll update it
        const updateResponse = await fetch(`${API_BASE_URL}/api/workout/workouts/${plan.id}/`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: plan.id,
            program_name: plan.title,
            requestee: requesteeID,
            trainer_id: trainerID,
            workouts: plan.exercises.map(exercise => ({
              id: exercise.id.toString(),
              name: exercise.name,
              description: exercise.description,
              image: "", // Provide an image URL if available
            })),
            workout_name: plan.title,
            fitness_goal: "General Fitness", // Default value, adjust as needed
            duration: 30, // Default number of days, adjust as needed
            intensity_level: "Moderate Intensity", // Default value, adjust as needed
          }),
        });
  
        if (!updateResponse.ok) {
          throw new Error(`Workout Update API error! status: ${updateResponse.status}`);
        }
  
        console.log("Workout plan updated successfully!");
      } else {
        // Workout doesn't exist, so we'll create a new one
        const createResponse = await fetch(`${API_BASE_URL}/api/workout/workouts/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            program_name: plan.title,
            requestee: requesteeID,
            trainer_id: trainerID,
            workouts: plan.exercises.map(exercise => ({
              id: exercise.id.toString(),
              name: exercise.name,
              description: exercise.description,
              image: "", // Provide an image URL if available
            })),
            workout_name: plan.title,
            fitness_goal: "General Fitness", // Default value, adjust as needed
            duration: 30, // Default number of days, adjust as needed
            intensity_level: "Moderate Intensity", // Default value, adjust as needed
          }),
        });
  
        if (!createResponse.ok) {
          throw new Error(`Create API error! status: ${createResponse.status}`);
        }
  
        console.log("New workout created successfully!");
      }
  
      // Update the state with the new or updated workout
      setWorkouts(prevWorkouts =>
        prevWorkouts.map(p =>
          p.id === plan.id ? { ...plan } : p // Replace the workout in the state
        )
      );
  
      // Reset the form state
      setWorkout(null);
      setSelectedMemberData(null);
  
      Toast.show({
        type: 'info',
        text1: 'Workout Plan Published',
        text2: 'Your workout plan has been published successfully.',
        position: 'bottom',
      });
  
      setViewState('');
    } catch (error) {
      console.error("Error handling workout plan:", error);
      Toast.show({
        type: 'error',
        text1: "Publish Failed",
        text2: "An unexpected error occurred. Please try again later.",
        position: "bottom",
      });
    }
  };        

  const handleDelete = async (workout: Workout) => {
      try {
        token = await AsyncStorage.getItem('authToken');
  
        const response = await fetch(`${API_BASE_URL}/api/workout/workouts/${workout.id}/`, {
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
            text2: 'The workout has been deleted successfully.',
            position: 'bottom'
          });
  
          setWorkouts((prevWorkouts) => prevWorkouts.filter(w => w.id !== workout.id)); // Remove the workout from the list
          if (workout.id === selectedWorkout?.id) {
            setSelectedWorkout(null); // Clear selected workout if it matches the deleted one
          }
          if (workout.id === workout?.id) {
            setWorkout(null); // Clear current workout if it matches the deleted one
          }
  
          setViewState("");
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

  const handleWorkoutSelect = (selectedWorkout: Workout) => {
    setWorkout(selectedWorkout); // Set the selected workout plan
    setViewState("editWO");
  };

  const handleWorkoutDelete = (selectedWorkout: Workout) => {
    setWorkout(selectedWorkout); // Set the selected workout plan
    setViewState("delete");
  };

  const handleRequestSelect = (request: SelectedMemberData) => {
    // Update selectedMemberData to the request that was selected
    setSelectedMemberData(request);
    // Change view state to "createMP" to allow editing the selected request
    setViewState("createWO");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {viewState === "requests" ? (
            // Request Workout Plan View
            <View style={styles.planContainer}>
              <WorkoutRequestHeader setViewState={setViewState} />
              <Text style={{ ...styles.subtitle2, marginBottom: 10, lineHeight: 20 }}>
                <Text style={{ fontFamily: Fonts.semiboldItalic }}>Note:</Text> Creating a Workout Plan for 
                this Requestee will only set that workout to be visible to them.
                {"\n"}Please use the 'Create Workout' button in the main menu to
                create a workout plan visible to everyone.
              </Text>
              {/* Render Member Requests List */}
              {memberData.map((request) => (
                <TouchableOpacity key={request.requesteeID}>
                  <WorkoutRequest 
                    memberName={request.requesteeName}
                    fitnessGoal={request.fitnessGoal}
                    weightGoal={request.weightGoal}
                    allergens={request.allergens}
                    height={request.height}
                    weight={request.weight}
                    age={request.age}
                    onEditPress={() => handleRequestSelect(request)} // Trigger edit for the selected request
                  />
                </TouchableOpacity>
              ))}
          </View>
            ) : viewState === "createWO" ? (
            <>
              <CreateWOHeader setViewState={setViewState} setWorkout={setNewWorkout} setSelectedMemberData = {setSelectedMemberData} />
              <WorkoutForm
                workoutTitle={newWorkout?.title || ""}
                onChangeWorkoutTitle={(text) =>
                  setNewWorkout((prev) => ({ ...prev!, title: text }))
                }
                exercises={newWorkout?.exercises || []} // Use newWorkout for unconfirmed changes
                visibleTo={selectedMemberData?.requesteeID && selectedMemberData.requesteeID !== ''
                  ? selectedMemberData.requesteeName
                  : 'everyone' // Set initial visibleTo based on the member
                }
                onChangeExercise={(index: number, key: keyof Exercise, value: string | number) => {
                  setNewWorkout((prevWorkout) => {
                    if (!prevWorkout) return prevWorkout; // Prevent null reference

                    const updatedExercises = [...prevWorkout.exercises];
                    updatedExercises[index] = { ...updatedExercises[index], [key]: value }; // Safe update

                    return { ...prevWorkout, exercises: updatedExercises };
                  });
                }}
                onDeleteExercise={(index: number) => {
                  setNewWorkout((prevWorkout) => {
                    if (!prevWorkout) return prevWorkout; // Prevent null state

                    const updatedExercises = prevWorkout.exercises.filter((_, i) => i !== index);
                    return { ...prevWorkout, exercises: updatedExercises };
                  });
                }}
                onAction={() => {
                  const newExercise: Exercise = {
                    id: nanoid(), // Generate a unique ID for the new workout
                    name: `Exercise ${(newWorkout?.exercises?.length || 0) + 1}`, // Safely handle undefined
                    description: "",
                    image: null,
                  };

                  setNewWorkout((prevWorkout) => ({
                    ...prevWorkout!,
                    exercises: [...(prevWorkout?.exercises || []), newExercise],
                    trainer: userID || "", // Assign trainer
                    member_id: selectedMemberData ? selectedMemberData.requesteeID : '',
                  }));
                }}
                actionLabel="Add Exercise"
              />

              {/* External Button for Publishing Workout Plan */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  if (!newWorkout) return; // Prevent passing null
                  handlePublish(newWorkout);
                }}
              >
                <Text style={styles.buttonText}>Publish Workout</Text>
              </TouchableOpacity>
            </>
          ) : viewState === "editWO" ? (
            // Workout Plan View
            <>
              {workout && workout.exercises ? (
                <>
                  <EditWOHeader setViewState={setViewState} setWorkout={setWorkout} setSelectedMemberData = {setSelectedMemberData}/>
                  <WorkoutForm
                    exercises={workout?.exercises || []}
                    workoutTitle={workout?.title || ""}
                    onChangeWorkoutTitle={(text) => {
                      setWorkout((prev) => ({ ...prev!, title: text }));
                    }}
                    onChangeExercise={(index: number, key: keyof Exercise, value: string | number) => {
                      setWorkout((prevWorkout) => {
                        if (!prevWorkout) return prevWorkout;

                        const updatedExercises = [...prevWorkout.exercises];
                        updatedExercises[index] = { ...updatedExercises[index], [key]: value };

                        return { ...prevWorkout, exercises: updatedExercises };
                      });
                    }}
                    onDeleteExercise={(index: number) => {
                      setWorkout((prevWorkout) => {
                        if (!prevWorkout) return prevWorkout;

                        const updatedExercises = prevWorkout.exercises.filter((_, i) => i !== index);
                        return { ...prevWorkout, exercises: updatedExercises };
                      });
                    }}
                    onAction={() => {
                      const newExercise: Exercise = {
                        id: nanoid(), // Generate a unique ID for the new workout
                        name: `Exercise ${(workout?.exercises.length || 0) + 1}`,
                        description: "",
                        image: null,
                      };

                      setWorkout((prevWorkout) => ({
                        ...prevWorkout!,
                        exercises: [...(prevWorkout?.exercises || []), newExercise],
                      }));
                    }}
                    visibleTo={workout?.visibleTo || "everyone"} // Pass visibleTo prop
                    actionLabel="Add Exercise"
                  />

                  {/* External Button for Publishing Workout */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      if (!workout) return; // Prevent passing null
                      console.log("Exercise to publish:", workout);
                      handlePublish(workout);
                    }}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  <Header />
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>There are no workout plans yet.</Text>
                  </View>
                </View>
              )}
            </>
          ) : viewState === "delete" ? (
            <View style={styles.deleteContainer}>
              <Ionicons name="trash-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.alertTitle}>Delete Workout?</Text>
              <Text style={styles.alertMessage}>
                You're going to permanently delete your workout. Are you sure?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonRed} onPress={() => setViewState("")}>
                  <Text style={styles.buttonText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGreen} onPress={() => workout && handleDelete(workout)}> 
                  {/* short-circuited potential null workout */}
                  <Text style={styles.buttonText}>YES</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : ( 
            <View>
              <TrainerWOHeader />
              <TouchableOpacity style={styles.submitButton} onPress={() => setViewState("requests")}>
                <Text style={styles.buttonText}>Personal Workout Requests</Text>
              </TouchableOpacity>
              {workouts.map((plan) => (
                <TouchableOpacity key={plan.id} onPress={() => handleWorkoutSelect(plan)}>
                  <MemberWorkout 
                    workout={plan} 
                    requesteeName={selectedMemberData ? selectedMemberData.requesteeName : ''}  // Pass the prop here
                    onEditPress={() => handleWorkoutSelect(plan)}
                    onTrashPress={() => handleWorkoutDelete(plan)} 
                  />
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.submitButton} onPress={() => setViewState("createWO")}>
                <Text style={styles.buttonText}>Create New Program</Text>
              </TouchableOpacity>
            </View>
          )}
          
        </View>
      </ScrollView>
      <Toast />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  // Used for the ScrollView container
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-start",
    backgroundColor: Colors.bg,
    paddingVertical: 20,
    paddingLeft: 30,
    paddingRight: 30,
  },

  // General container for layouts
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 0,
    justifyContent: "flex-start",
    alignItems: "center",
  },

  // Center-aligned container (used in cases like "No workout plans available")
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },

  // Icon styles for delete confirmation
  icon: {
    marginBottom: 15,
    alignSelf: "center",
  },

  // Title for alert dialogs (e.g., delete confirmation)
  alertTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: Fonts.bold,
  },

  // Message for alert dialogs
  alertMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginBottom: 25,
    fontFamily: Fonts.regular,
  },

  // Button container for aligned buttons
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },

  // Red button for actions like "NO" in delete confirmation
  buttonRed: {
    backgroundColor: Colors.red,
    paddingVertical: 10,
    paddingHorizontal: 30,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 5,
  },

  // Green button for actions like "YES" in delete confirmation
  buttonGreen: {
    backgroundColor: Colors.green,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginHorizontal: 5,
  },

  // General button styling
  submitButton: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    top: -5,
    width: "100%",
    height: 45,
    marginTop: 30,
    fontFamily: Fonts.medium,
  },

  // Text styles for buttons
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    textAlign: "center",
    fontFamily: Fonts.semibold,
  },

  // Styles for the nutritional workout plan container
  planContainer: {
    width: "100%",
  },

  // Subtitle styles for the "No workout plan available" message
  subtitle2: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: Fonts.mediumItalic,
  },

  // Delete confirmation dialog container
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
  },
});

export default WorkoutScreen;