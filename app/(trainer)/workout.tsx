import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform, 
  ImageSourcePropType
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';
import Header from '@/components/WorkoutHeader';
import WorkoutRequestHeader from '@/components/WorkoutRequestHeader';
import WorkoutFeedbackList from '@/components/WorkoutFeedbackList';
import WorkoutForm from '@/components/TrainerWorkoutForm';
import EditWOHeader from '@/components/EditWOHeader';
import CreateWOHeader from '@/components/CreateWOHeader';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { getItem } from '@/utils/storageUtils';
import MemberWorkout from "@/components/MemberWorkout";
import WorkoutRequest from "@/components/WorkoutRequest";
import TrainerWOHeader from "@/components/TrainerWOHeader";
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interfaces for workouts
import { Exercise2 as Exercise, Feedback, Workout2 as Workout, SelectedMemberData2 as SelectedMemberData } from "@/types/interface";

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
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [memberData, setMemberData] = useState<SelectedMemberData[]>([
      // {
      //   requesteeID: '1',
      //   requesteeName: 'John Daks',
      //   height: '170',
      //   weight: '65',
      //   age: '25',
      //   fitnessGoal: 'Gain Weight',
      //   intensityLevel: 'Strong',
      //   status: 'pending',
      // },
      // {
      //   requesteeID: '5',
      //   requesteeName: 'Jane Smith',
      //   height: '165',
      //   weight: '55',
      //   age: '28',
      //   fitnessGoal: 'Lose Fat',
      //   intensityLevel: 'Weak',
      //   status: 'pending',
      // },
      // You can add more members in this list as needed
    ]);
    const [selectedMemberData, setSelectedMemberData] = useState<SelectedMemberData | null>(null); // Default to the first member in the list
    const [newWorkout, setNewWorkout] = useState<Workout | null>({
      id: null, // Set to null initially
      title: "",
      duration: 30, // Default number of days
      fitnessGoal: "",
      intensityLevel: "",
      trainer: userID || "",
      exercises: [],
      visibleTo: "everyone",
      feedbacks: [],
      requestee: selectedMemberData?.requesteeID || '', // Added member_id property
      status: "pending",
    });

  // Fetch Workouts for Trainer
  const fetchWorkoutRequests = async () => {
    try {
      const token = await getItem("authToken");
      if (!token) throw new Error("Token not found");

      // Fetch all workout requests
      const requestsResponse = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
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

      // Filter workout plans with 'pending' or status
      const pendingRequests = requestsData.filter((request: any) => request.status === "pending");
      
      // Filter trainer-owned requests only
      const trainerRequests = pendingRequests.filter(
        (request: any) =>
          (String(request.trainer_id) === String(userID) || request.requestee === null)
      );

      // Extract requestee IDs from pending workout plans
      const requesteeIDs = trainerRequests.map((request: any) => request.requestee);

      // Fetch all members
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

      // Combine member and request data
      const memberDataList = requesteeIDs.map((requesteeID: string) => {
        const profileData = allMembers.find((member: any) => String(member.id) === String(requesteeID));
        if (!profileData) return null;

        const request = trainerRequests.find((req: any) => req.requestee === profileData.id);

        return {
          requesteeID: request?.requestee.toString() || "Unknown",
          requesteeName: profileData?.full_name || "User Name Not Set",
          height: profileData?.height || "N/A",
          weight: profileData?.weight || "N/A",
          age: profileData?.age || "N/A",
          fitnessGoal: request?.fitness_goal || "Not Specified",
          intensityLevel: request?.intensity_level || "Not Specified",
          status: request?.status || "Unknown Status", // Add status here for later filtering
        };
      }).filter((data: any) => data !== null);

      // Avoid duplicates by checking if requesteeID already exists
      setMemberData((prev) => {
        const existingIDs = prev.map((member) => member.requesteeID);
        const filteredNewData = memberDataList.filter(
          (newMember: any) => !existingIDs.includes(newMember.requesteeID)
        );
        return [...prev, ...filteredNewData];
      });

    } catch (error) {
      Toast.show({
        type: 'info',
        text1: 'No Workout Requests Found!',
        text2: `${error}`,
        topOffset: 80,
      });
    }
  };

  // // Fetching Member Data

  // const fetchMembersAndWorkouts = async () => {
  //   try {
  //     const token = await getItem("authToken");
  //     if (!token) throw new Error("Token not found");

  //     // Fetch all workout requests
  //     const workoutResponse = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!workoutResponse.ok) {
  //       throw new Error(`Failed to fetch workouts! Status: ${workoutResponse.status}`);
  //     }

  //     const workoutData = await workoutResponse.json();

  //     // Filter workouts with 'pending' status
  //     const filteredWorkouts = workoutData.filter(
  //       (workout: any) => workout.status === "pending"
  //     );

  //     // Extract requestee IDs
  //     const requesteeIDs = filteredWorkouts.map((workout: any) => workout.requestee).filter(Boolean);

  //     // Fetch all members
  //     const membersResponse = await fetch(`${API_BASE_URL}/api/account/members/`, {
  //       method: "GET",
  //       headers: {
  //         Accept: "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!membersResponse.ok) {
  //       throw new Error(`Failed to fetch members! Status: ${membersResponse.status}`);
  //     }

  //     const membersData = await membersResponse.json();

  //     // Match members with workout requests
  //     const matchedMembers = membersData
  //       .filter((member: any) => requesteeIDs.includes(member.id))
  //       .map((member: any) => {
  //         const workout = filteredWorkouts.find((workout: any) => workout.requestee === member.id);
  //         return {
  //           requesteeID: member.id.toString(),
  //           requesteeName: member.full_name || "User Name Not Set",
  //           height: member.height || "N/A",
  //           weight: member.weight || "N/A",
  //           age: member.age || "N/A",
  //           fitnessGoal: workout?.fitness_goal || "Not Specified",
  //           intensityLevel: workout?.intensity_level || "Not Specified",
  //           status: workout?.status || "Unknown Status",
  //         };
  //       });

  //     // Append matched members to memberData without duplicates
  //     setMemberData((prev) => {
  //       const existingIDs = prev.map((member) => member.requesteeID);
  //       const newData = matchedMembers.filter((newMember: any) => !existingIDs.includes(newMember.requesteeID));
  //       return [...prev, ...newData];
  //     });

  //   } catch (error) {
  //     Toast.show({
  //       type: 'info',
  //       text1: 'No Member Data Found!',
  //       text2: `${error}`,
  //       topOffset: 80,
  //     });
  //   }
  // };
  
  // Fetching Workout from API
  
  const fetchWorkout = async () => {
    try {
      const token = await getItem("authToken");
      const userID = await getItem("userID");

      // Fetch all workout programs
      const response = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const programsData = await response.json();

      // Filter only completed programs where the user is the trainer or it's public (no requestee)
      const pendingPrograms = programsData.filter(
        (program: any) =>
          program.status !== "completed" &&
          (String(program.trainer_id) === String(userID) || program.requestee === null)
      );
      
      // Filter only completed programs where the user is the trainer or it's public (no requestee)
      const userPrograms = programsData.filter(
        (program: any) =>
          program.status === "completed" &&
          (String(program.trainer_id) === String(userID) || program.requestee === null)
      );

      if (!userPrograms.length) {
        console.warn("No completed programs found for the user");
      }

      // Fetch all members to match requestee info
      const allMembersResponse = await fetch(`${API_BASE_URL}/api/account/members/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!allMembersResponse.ok)
        throw new Error(`Failed to fetch members. Status: ${allMembersResponse.status}`);

      const allMembers = await allMembersResponse.json();

      // Collect all member data for relevant programs
      const completedMemberData = userPrograms
        .map((program: any) => {
          if (program.requestee === null) return null;
          const member = allMembers.find((m: any) => m.id === program.requestee);
          if (!member) return null;

          return {
            requesteeID: program.requestee.toString(),
            requesteeName: member.full_name || "User Name Not Set",
            height: member.height,
            weight: member.weight,
            age: member.age,
            fitnessGoal: program.fitness_goal,
            intensityLevel: program.intensity_level,
            status: program.status,
          };
        })
        .filter(Boolean);

      // Update memberData list (avoid duplicates)
      setMemberData((prev) => {
        const existingIDs = prev.map((member) => member.requesteeID);
        const newMembers = completedMemberData.filter(
          (m: any) => !existingIDs.includes(m.requesteeID)
        );
        return [...prev, ...newMembers];
      });

      // Map each workout program to formatted structure
      const formattedWorkouts = userPrograms.map((program: any) => {
        const visibleTo =
          program.requestee === null
            ? "everyone"
            : (() => {
                const match = allMembers.find(
                  (member: any) => String(member.id) === String(program.requestee)
                );
                return match?.full_name || `User ID ${program.requestee}`;
              })();

        return {
          id: program.id.toString(),
          title: program.program_name,
          fitnessGoal: program.fitness_goal,
          intensityLevel: program.intensity_level,
          trainer: program.trainer_id?.toString() || "N/A",
          duration: program.duration,
          status: program.status,
          requestee: program.requestee?.toString() || null,
          visibleTo,
          feedbacks: program.feedbacks,
          exercises: program.workout_exercises?.map((exercise: any) => ({
            id: exercise.id.toString(),
            image: exercise.image,
            name: exercise.name,
            description: exercise.description,
            muscle_group: exercise.muscle_group,
          })) || [],
        };
      });

      // Map each workout program to formatted structure
      const formattedPendingWorkouts = pendingPrograms.map((program: any) => {
        const visibleTo =
          program.requestee === null
            ? "everyone"
            : (() => {
                const match = allMembers.find(
                  (member: any) => String(member.id) === String(program.requestee)
                );
                return match?.full_name || `User ID ${program.requestee}`;
              })();

        return {
          id: program.id.toString(),
          title: program.program_name,
          fitnessGoal: program.fitness_goal,
          intensityLevel: program.intensity_level,
          trainer: program.trainer_id?.toString() || "N/A",
          duration: program.duration,
          status: program.status,
          requestee: program.requestee?.toString() || null,
          visibleTo,
          feedbacks: program.feedbacks,
          exercises: program.workout_exercises?.map((exercise: any) => ({
            id: exercise.id.toString(),
            image: exercise.image,
            name: exercise.name,
            description: exercise.description,
            muscle_group: exercise.muscle_group,
          })) || [],
        };
      });

      // Update workouts list
      setPendingWorkouts((prevWorkouts) => {
        const existingIds = new Set(prevWorkouts.map((w: any) => w.id));
        const newWorkouts = formattedPendingWorkouts.filter((w: any) => !existingIds.has(w.id));
        return [...prevWorkouts, ...newWorkouts];
      });
      
      setWorkouts((prevWorkouts) => {
        const existingIds = new Set(prevWorkouts.map((w: any) => w.id));
        const newWorkouts = formattedWorkouts.filter((w: any) => !existingIds.has(w.id));
        return [...prevWorkouts, ...newWorkouts];
      });
      
  } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No Workouts Found!',
        text2: `${error}`,
        topOffset: 80,
      });

      if (error instanceof Error) {
        if (error.message.includes("NetworkError")) {
          console.error("Network error: Please check if the server is running and accessible.");
        } else if (error.message.includes("CORS")) {
          console.error("CORS error: Please ensure your server allows requests from your frontend.");
        }
      }
    }
  };

  // actual call to API
  useFocusEffect(
    useCallback(() => {
      fetchWorkoutRequests();
      // fetchMembersAndWorkouts();
      fetchWorkout();
      const fetchUserIDandToken = async () => {
        userID = await getItem('userID');
        token = await getItem('authToken');
      };
      fetchUserIDandToken();
    }, [refreshTrigger])
  );

  const [workouts, setWorkouts] = useState<Workout[]>([]); // State to store all workouts]);
  const [pendingWorkouts, setPendingWorkouts] = useState<Workout[]>([]);

  const handlePublish = async (currentWorkout?: Workout) => {
    const plan = currentWorkout; // Use the current workout state
  
    if (!plan || !plan.exercises || plan.exercises.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'Empty Workout',
        text2: 'You must have at least one exercise before publishing the workout.',
        topOffset: 80,
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
        topOffset: 80,
      });
      return;
    }
    
  
    try {
      const token = await getItem('authToken');
      const trainerID = await getItem('userID');
      const requesteeID = selectedMemberData?.requesteeID || null; 

      if (String(workout?.id) === String(plan.id)) {
        // Workout exists, so we'll update it, for personal member
        const updateResponse = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/${plan.id}/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: plan.id,
            program_name: plan.title,
            trainer_id: trainerID,
            workout_exercises: plan.exercises.map(exercise => ({
              // id: exercise.id?.toString(),
              name: exercise.name,
              description: exercise.description,
              muscle_group: "",
              image: "", // Provide an image URL if available
            })),
            status: "completed", // Set status to completed
            duration: 30, // Default number of days, adjust as needed
          }),
        });

        if (!updateResponse.ok) {
          throw new Error(`Workout Update API error! status: ${updateResponse.status}`);
        }
  
      } else {
        // Workout doesn't exist, so we'll create a new one
        const createResponse = await fetch(`${API_BASE_URL}/api/workouts/workout-programs/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            program_name: plan.title,
            requestee: null, // Set to null for all members to see
            trainer_id: trainerID,
            workout_exercises: plan.exercises.map(exercise => ({
              // id: exercise.id?.toString(),
              name: exercise.name,
              description: exercise.description,
              muscle_group: "",
              image: "", // Provide an image URL if available
            })),
            status: "completed", // Set status to completed
            fitness_goal: "General Fitness", // Default value, adjust as needed
            duration: 30, // Default number of days, adjust as needed
            intensity_level: "Moderate Intensity", // Default value, adjust as needed
          }),
        });
  
        if (!createResponse.ok) {
          throw new Error(`Create API error! status: ${createResponse.status}`);
        }
      }
      
      // Update memberData with the matched workout ID and set status to "completed"
      setMemberData((prevMemberData) =>
        prevMemberData.map((member) =>
          String(member.requesteeID) === String(requesteeID)
            ? { ...member, status: "completed", workout_id: currentWorkout.id }
            : member
        )
      );

      // Update the state with the new or updated workout
      setWorkouts(prevWorkouts =>
        prevWorkouts.map(p =>
          String(p.id) === String(plan.id) ? { ...plan } : p // Replace the workout in the state
        )
      );

      setPendingWorkouts(prevWorkouts =>
        prevWorkouts.map(p =>
          String(p.id) === String(plan.id) ? { ...plan } : p // Replace the workout in the state
        )
      );
  
      // Reset the form state
      setWorkout(null);
      setSelectedMemberData(null);
  
      Toast.show({
        type: 'info',
        text1: 'Workout Plan Published',
        text2: 'Your workout plan has been published successfully.',
        topOffset: 80,
      });

      setRefreshTrigger(prev => !prev);

      setViewState('');

    } catch (error) {
      console.error("Error handling workout plan:", error);
      Toast.show({
        type: 'error',
        text1: "Publish Failed",
        text2: "An unexpected error occurred. Please try again later.",
        topOffset: 80,
      });
    }
  };        

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
            text2: 'The workout has been deleted successfully.',
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

          setViewState("");
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
              {memberData
              .filter((request) => request.status === "pending")
              .map((request) => (
                <TouchableOpacity key={request.requesteeID}>
                  <WorkoutRequest 
                    memberName={request.requesteeName ?? "Unknown"} // Default to "Unknown"
                    fitnessGoal={request.fitnessGoal ?? "Not Provided"}
                    intensityLevel={request.intensityLevel ?? "Moderate"}
                    height={request.height ?? 0} // Default to 0 if missing
                    weight={request.weight ?? 0}
                    age={request.age ?? "N/A"} // Default to "N/A"
                    onEditPress={() => {
                      const matchingWorkout = pendingWorkouts.find(
                        (workout) => String(workout.requestee) === String(request.requesteeID)
                      );
                      if (matchingWorkout) {
                        handleRequestSelect(request);
                        handleWorkoutSelect(matchingWorkout);
                      }
                    }}
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
                    id: null, // Set initial value to null
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
                        id: null, // Set initial value to null
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
                  
                  <WorkoutFeedbackList feedbacks={workout?.feedbacks || []} />

                  {/* External Button for Publishing Workout */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      if (!workout) return; // Prevent passing null
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
              <TouchableOpacity style={[styles.requestsButton, {marginBottom: 15}]} onPress={() => setViewState("requests")}>
                <Text style={styles.buttonText}>Personal Workout Requests</Text>
              </TouchableOpacity>
                {workouts
                .filter((plan) => plan.status === "completed") // Filter workouts with status "completed"
                .map((plan) => (
                  <TouchableOpacity key={plan.id} onPress={() => handleWorkoutSelect(plan)}>
                  <MemberWorkout 
                    workout={plan} 
                    requesteeName={selectedMemberData ? selectedMemberData.requesteeName : ''}  // Pass the prop here
                    onEditPress={() => handleWorkoutSelect(plan)}
                    onTrashPress={() => handleWorkoutDelete(plan)} 
                  />
                  </TouchableOpacity>
                ))}
              <TouchableOpacity style={styles.createButton} onPress={() => setViewState("createWO")}>
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

  requestsButton: {
    backgroundColor: Colors.gold,
    fontFamily: Fonts.medium,
    borderRadius: 10,
    padding: 12,
  },
  createButton: {
    backgroundColor: Colors.gold,
    fontFamily: Fonts.medium,
    borderRadius: 10,
    padding: 12,
    paddingHorizontal: 48,
    alignSelf: 'center',
  }
});

export default WorkoutScreen;