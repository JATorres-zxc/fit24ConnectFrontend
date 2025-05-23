import React, { useState, useCallback } from "react";
import { useFocusEffect } from '@react-navigation/native';
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import Toast from 'react-native-toast-message';

import Header from '@/components/MealPlanHeader';
import MealPlanRequestHeader from '@/components/MealPlanRequestHeader';
import MealPlanFeedbackList from '@/components/MealPlanFeedbackList';
import MealPlanForm from '@/components/TrainerMealPlanForm';
import EditMPHeader from '@/components/EditMPHeader';
import CreateMPHeader from '@/components/CreateMPHeader';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { getItem } from '@/utils/storageUtils';
import MemberMealPlan from "@/components/MemberMealPlan";
import MealPlanRequest from "@/components/MealPlanRequest";
import TrainerMPHeader from "@/components/TrainerMPHeader";
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interfaces for meals
import { Meal2 as Meal, Feedback, MealPlan2 as MealPlan, SelectedMemberData } from "@/types/interface";

let token: string | null = null;
let userID: string | null = null;
let trainerID: string | null = null;
let requesteeID: string | null = null;
let mealPlan_id: number | null = null;

const MealPlanScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]); // State for multiple meal plans
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // State for singular meal plan
  const [updateMealPlan, setUpdateMealPlan] = useState<MealPlan | null>(null);
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergies, setallergies] = useState(""); // State to store allergies
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState<string | number | undefined>('');
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [memberData, setMemberData] = useState<SelectedMemberData[]>([
    // {
    //   requesteeID: '1',
    //   requesteeName: 'John Daks',
    //   height: '170',
    //   weight: '65',
    //   age: '25',
    //   fitnessGoal: 'Gain Weight',
    //   weightGoal: '60',
    //   allergies: 'Peanuts, Dairy',
    //   status: 'in_progress',
    // },
    // {
    //   requesteeID: '3',
    //   requesteeName: 'Jane Smith',
    //   height: '165',
    //   weight: '55',
    //   age: '28',
    //   fitnessGoal: 'Lose Fat',
    //   weightGoal: '50',
    //   allergies: 'Shellfish',
    //   status: 'in_progress',
    // },
    // You can add more members in this list as needed
  ]);
  const [selectedMemberData, setSelectedMemberData] = useState<SelectedMemberData | null>(null); // Default to the first member in the list
  
  const [newMealPlan, setNewMealPlan] = useState<MealPlan | null>({
    mealplan_id: null,
    meals: [], // Ensures `meals` is always defined
    member_id: selectedMemberData?.requesteeID || '',
    trainer_id: userID || "",
    mealplan_name: "",
    fitness_goal: "",
    calorie_intake: 0,
    protein: 0,
    carbs: 0,
    weight_goal: "",
    allergies: "",
    instructions: "",
    requestee_id: selectedMemberData?.requesteeID || '', // Default to the first member's ID
    requestee: selectedMemberData?.requesteeID || '', // Default to the first member's ID
    status: "in_progress", // Default status
    feedbacks: [],
  });

  // Fetch only mealplan requests and retrieve corresponding member profiles
  const fetchMealplanRequests = async () => {
    try {
      const token = await getItem("authToken");
      const userID = await getItem("userID");
      if (!token || !userID) throw new Error("Token or UserID not found");

      const requestsResponse = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/`, {
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

      const inProgressRequests = requestsData.filter(
        (request: any) =>
          (request.status === "in_progress" || request.status === "not_created") &&
          request.trainer_id?.toString() === userID
      );

      const requesteeIDs = inProgressRequests.map((request: any) => request.requestee);

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

      const memberDataList = requesteeIDs.map((requesteeID: string) => {
        const profileData = allMembers.find((member: any) => String(member.id) === String(requesteeID));

        if (!profileData) return null;

        const request = inProgressRequests.find(
          (req: any) => String(req.requestee) === String(profileData.id)
        );

        return {
          requesteeID: request?.requestee.toString() || "Unknown",
          requesteeName: profileData?.full_name || "User Name Not Set",
          height: profileData?.height || "N/A",
          weight: profileData?.weight || "N/A",
          age: profileData?.age || "N/A",
          fitnessGoal: request?.fitness_goal || "Not Specified",
          weightGoal: request?.weight_goal || "Not Specified",
          allergies: request?.user_allergies || "None",
          status: request?.status || "Unknown Status",
        };
      }).filter(Boolean);

      setMemberData((prev) => {
        const existingIDs = prev.map((member) => member.requesteeID);
        const filteredNewData = memberDataList.filter(
          (newMember: any) => !existingIDs.includes(newMember.requesteeID)
        );
        return [...prev, ...filteredNewData];
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No Meal Plan Requests Found!',
        text2: `${error}`,
        topOffset: 80,
      });
    }
  };

  // Fetching Meal Plan from API
  const fetchMealPlans = async () => {
    try {
      const token = await getItem('authToken');
      const userID = await getItem('userID');

      const response = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const mealPlansData = await response.json();

      const completedPlans = mealPlansData.filter(
        (plan: any) =>
          plan.trainer_id.toString() === userID?.toString() &&
          plan.status === "completed"
      );

      setMealPlans(completedPlans);

      const allMembersResponse = await fetch(`${API_BASE_URL}/api/account/members/`, {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!allMembersResponse.ok) {
        throw new Error(`Failed to fetch members. Status: ${allMembersResponse.status}`);
      }

      const allMembers = await allMembersResponse.json();

      const completedMemberData = completedPlans.map((plan: any) => {
        const member = allMembers.find((m: any) => m.id === plan.requestee);
        if (!member) return null;

        return {
          requesteeID: plan.requestee.toString(),
          requesteeName: member.full_name || "User Name Not Set",
          height: member.height,
          weight: member.weight,
          age: member.age,
          fitnessGoal: plan.fitness_goal,
          weightGoal: plan.weight_goal,
          allergies: plan.allergies,
          status: plan.status,
        };
      }).filter(Boolean);

      setMemberData((prev) => {
        const existingIDs = prev.map((member) => member.requesteeID);
        const filteredNewData = completedMemberData.filter(
          (newMember: any) => !existingIDs.includes(newMember.requesteeID)
        );
        return [...prev, ...filteredNewData];
      });

    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No Meal Plans Found!',
        text2: `${error}`,
        topOffset: 80,
      });
    }
  };

  // actual call to API
  useFocusEffect(
    useCallback(() => {
      fetchMealplanRequests();
      fetchMealPlans();
      const fetchUserIDandToken = async () => {
        userID = await getItem('userID');
        token = await getItem('authToken');
      };
      fetchUserIDandToken();
    }, [refreshTrigger])
  );

  const handlePublish = async (currentMealPlan?: MealPlan) => {
    if (!currentMealPlan || !currentMealPlan.meals || currentMealPlan.meals.length === 0) {
        Toast.show({
            type: 'error',
            text1: 'Empty Meal Plan',
            text2: 'You must add at least one meal before publishing the meal plan.',
            topOffset: 80,
        });
        return;
    }

    const invalidMeals = currentMealPlan.meals.filter(meal => 
      !meal.meal_name?.trim() || 
      !meal.meal_type?.trim() || 
      !meal.description?.trim() || 
      !meal.calories || 
      !meal.protein || 
      !meal.carbs
    );

    if (invalidMeals.length > 0) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: `Please fill out all fields for ${invalidMeals.length} meal(s).`,
        topOffset: 80,
      });
      return;
    }

    try {
      token = await getItem('authToken');
      trainerID = await getItem('userID'); // Logged-in trainer's ID
      requesteeID = selectedMemberData?.requesteeID || ''; // Get member ID safely

      if (!requesteeID) {
        Toast.show({
          type: 'error',
          text1: 'Missing Member ID',
          text2: 'Please select a member before publishing the meal plan.',
          topOffset: 80,
        });
        return;
      }

      // Fetch all meal plans (you may paginate this later if needed)
      const searchResponse = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!searchResponse.ok) {
        throw new Error(`Search API error! status: ${searchResponse.status}`);
      }

      const allMealPlans = await searchResponse.json();

      // Find the meal plan where the requestee matches
      const matchedMealPlan = allMealPlans.find(
        (plan: any) => String(plan.requestee) === String(requesteeID)
      );

      // Extract the mealPlanId
      let mealPlanId = matchedMealPlan?.mealplan_id;

      if (!mealPlanId) {
        throw new Error("No existing meal plan found for this member.");
      }

      // Update the existing meal plan
      const updateResponse = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/${mealPlanId}/update_meal_plan/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          member_id: requesteeID,
          trainer_id: trainerID,
          meals: currentMealPlan.meals.map(meal => ({
            // id: meal.id, // Include meal ID if applicable
            // mealplan: mealPlanId,
            meal_name: meal.meal_name,
            description: meal.description,
            meal_type: meal.meal_type,
            calories: meal.calories,
            protein: meal.protein,
            carbs: meal.carbs,
          })),
          plan_type: "personal", // Fixed for now, can be changed to general
          mealplan_name: currentMealPlan.mealplan_name,
          fitness_goal: currentMealPlan.fitness_goal,
          calorie_intake: currentMealPlan.calorie_intake,
          protein: currentMealPlan.protein,
          carbs: currentMealPlan.carbs,
          weight_goal: currentMealPlan.weight_goal,
          instructions: currentMealPlan.instructions,
          status: "completed", // Mark as completed
        }),
      });

      // Update memberData with the matched meal plan ID and set status to "completed"
      setMemberData((prevMemberData) =>
        prevMemberData.map((member) =>
          member.requesteeID === requesteeID
            ? { ...member, status: "completed", mealplan_id: mealPlanId }
            : member
        )
      );
  
      // Update state after successful publish
      setMealPlans((prevMealPlans) =>
        prevMealPlans.map((p) =>
          p.mealplan_id === mealPlanId ? { ...currentMealPlan, mealplan_id: mealPlanId } : p
        )
      );
      setMealPlan(null); // Clear view state
      setSelectedMemberData(null); // Clear selected member data
      
      if (!updateResponse.ok) {
        throw new Error(`Meal Plan API error! status: ${updateResponse.status}`);
      }

      Toast.show({
        type: 'info',
        text1: 'Meal Plan Published',
        text2: 'Your meal plan has been published successfully.',
        topOffset: 80,
      });

      setRefreshTrigger(prev => !prev);

      setViewState('');

    } catch (error) {
      console.error("Error handling meal plan:", error);
      Toast.show({
        type: 'error',
        text1: "Publish Failed",
        text2: "An unexpected error occurred. Please try again later.",
        topOffset: 80,
      });
    }
  };

  const handleMealPlanSelect = (selectedMealPlan: MealPlan) => {
    setMealPlan(selectedMealPlan); // Set the selected meal plan
  
    // Find corresponding member based on meal plan's member_id
    const member = memberData.find(
      (data) => data.requesteeID.toString() === selectedMealPlan.member_id.toString()
    );

    // Set selected member data for this meal plan
    if (member) {
      setSelectedMemberData(member);
    } else {
      console.warn("Member data not found for selected meal plan.");
      setSelectedMemberData(null); // or a fallback value
    }
  
    setViewState("editMP");
  };  

  const handleRequestSelect = (request: SelectedMemberData) => {
    // Update selectedMemberData to the request that was selected
    setSelectedMemberData(request);
    // Change view state to "createMP" to allow editing the selected request
    setViewState("createMP");
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          {viewState === "requests" ? (
            // Request Meal Plan View
            <View>
              <MealPlanRequestHeader setViewState={setViewState} />
              <Text style={{ ...styles.subtitle2, marginBottom: 10, lineHeight: 20 }}>
                <Text style={{ fontFamily: Fonts.semiboldItalic }}>Note:</Text> Creating a Meal Plan for 
                these Requestees will only set that meal plan to be visible to them.
              </Text>
              {/* Render Member Requests List */}
              {memberData
                .filter((request) => (request.status === "in_progress" || request.status === "not_created")) // only show in_progress and not_created
                .map((request) => (
                  <TouchableOpacity key={request.requesteeID}>
                    <MealPlanRequest 
                      memberName={request.requesteeName}
                      fitnessGoal={request.fitnessGoal}
                      weightGoal={request.weightGoal}
                      allergies={request.allergies}
                      height={request.height}
                      weight={request.weight}
                      age={request.age}
                      onEditPress={() => handleRequestSelect(request)}
                    />
                  </TouchableOpacity>
              ))}
            </View>
            ) : viewState === "createMP" ? (
            <>
              <CreateMPHeader setViewState={setViewState} setMealPlan={setNewMealPlan} setSelectedMemberData = {setSelectedMemberData}/>
              <View>
              <Text style={styles.infoTitle}>Fitness Goal:</Text>
              <Text style={styles.infoText}>{selectedMemberData?.fitnessGoal || 'No fitness goal'}</Text>
              <Text style={styles.infoTitle}>Weight Goal:</Text>
              <Text style={styles.infoText}>{selectedMemberData?.weightGoal || 'No weight goal'}</Text>
              <Text style={styles.infoTitle}>Allergies:</Text>
              <Text style={styles.infoText}>{selectedMemberData?.allergies || 'No allergies'}</Text>

              </View>
              <MealPlanForm
                meals={newMealPlan?.meals || []} // Use newMealPlan for unconfirmed changes
                onChangeMeal={(index: number, key: keyof Meal, value: string | number) => {
                  setNewMealPlan((prevMealPlan) => {
                    if (!prevMealPlan) return prevMealPlan; // Prevent null reference

                    const updatedMeals = [...prevMealPlan.meals];
                    updatedMeals[index] = { ...updatedMeals[index], [key]: value }; // Safe update

                    return { ...prevMealPlan, meals: updatedMeals };
                  });
                }}
                onDeleteMeal={(index: number) => {
                  setNewMealPlan((prevMealPlan) => {
                    if (!prevMealPlan) return prevMealPlan; // Prevent null state

                    const updatedMeals = prevMealPlan.meals.filter((_, i) => i !== index);
                    return { ...prevMealPlan, meals: updatedMeals };
                  });
                }}
                onAction={() => {
                  const newMeal: Meal = {
                    id: null, 
                    mealplan: "0", // Placeholder, may need an updated value
                    meal_name: `Meal ${(newMealPlan?.meals?.length || 0) + 1}`, // Safely handle undefined
                    meal_type: "",
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    description: "",
                  };

                  setNewMealPlan((prevMealPlan) => ({
                    ...prevMealPlan!,
                    meals: [...(prevMealPlan?.meals || []), newMeal],
                    trainer_id: userID || "", // Assign trainer
                    member_id: selectedMemberData ? selectedMemberData.requesteeID : '', // Assign member ID safely
                  }));
                }}
                actionLabel="Add Meal"
              />

              {/* External Button for Publishing Meal Plan */}
              <TouchableOpacity
                style={styles.submitButton}
                onPress={() => {
                  if (!newMealPlan) return; // Prevent passing null
                  handlePublish(newMealPlan);
                }}
              >
                <Text style={styles.buttonText}>Publish Meal Plan</Text>
              </TouchableOpacity>
            </>
          ) : viewState === "editMP" ? (
            // Nutritional Meal Plan View
            <>
              {mealPlan && mealPlan.meals ? (
                <>
                  <EditMPHeader setViewState={setViewState} setMealPlan={setMealPlan} setSelectedMemberData = {setSelectedMemberData}/>
                  <MealPlanForm
                    meals={mealPlan?.meals || []}
                    onChangeMeal={(index: number, key: keyof Meal, value: string | number) => {
                      setMealPlan((prevMealPlan) => {
                        if (!prevMealPlan) return prevMealPlan; // Prevent null state

                        const updatedMeals = [...prevMealPlan.meals]; // Copy the meals array
                        updatedMeals[index] = { ...updatedMeals[index], [key]: value }; // Safely update field

                        return { ...prevMealPlan, meals: updatedMeals };
                      });
                    }}
                    onDeleteMeal={(index: number) => {
                      setMealPlan((prevMealPlan) => {
                        if (!prevMealPlan) return prevMealPlan; // Prevent null state

                        const updatedMeals = prevMealPlan.meals.filter((_, i) => i !== index);
                        return { ...prevMealPlan, meals: updatedMeals };
                      });
                    }}
                    onAction={() => {
                      const newMeal: Meal = {
                        id: null,
                        mealplan: mealPlan?.mealplan_id?.toString() || "", // Use selected meal plan ID
                        meal_name: `Meal ${mealPlan?.meals.length + 1}`, // Dynamically set meal name
                        meal_type: "",
                        calories: 0,
                        protein: 0,
                        carbs: 0,
                        description: "",
                      };
                      setMealPlan((prevMealPlan) => ({
                        ...prevMealPlan!,
                        meals: [...(prevMealPlan?.meals || []), newMeal],
                      }));
                    }}
                    actionLabel="Add Meal"
                  />

                  <MealPlanFeedbackList feedbacks={mealPlan?.feedbacks || []} />

                  {/* External Button for Publishing Meal Plan */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      if (!mealPlan) return; // Prevent passing null
                      handlePublish(mealPlan);
                    }}
                  >
                    <Text style={styles.buttonText}>Save</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  <Header />
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>There are no meal plans yet.</Text>
                  </View>
                </View>
              )}
            </>
          ) : ( 
            <View>
              <TrainerMPHeader />
              <TouchableOpacity style={[styles.submitButton, {marginBottom: 15}]} onPress={() => setViewState("requests")}>
              <Text style={styles.buttonText}>Meal Plan Requests</Text>
              </TouchableOpacity>
              {mealPlans.map((plan) => {
                // Find the corresponding member data based on the member_id
                const member = memberData.find((data) => data.requesteeID === plan.member_id.toString()); // Assuming member_id is a number or string

                return (
                  <TouchableOpacity key={plan.mealplan_id} onPress={() => handleMealPlanSelect(plan)}>
                    <MemberMealPlan 
                      mealPlan={plan} 
                      requesteeName={member ? member.requesteeName : 'User Name Not Set'}  // Use the matched requesteeName
                      onEditPress={() => handleMealPlanSelect(plan)} 
                    />
                  </TouchableOpacity>
                );
              })}
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

  // Center-aligned container (used in cases like "No meal plans available")
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

  // Styles for the nutritional meal plan container
  planContainer: {
    width: "100%",
  },

  // Subtitle styles for the "No meal plan available" message
  subtitle2: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: "center",
    fontFamily: Fonts.mediumItalic,
  },

  // For Meal Plan Form member info styles
  infoTitle: {
      fontSize: 14,
      fontFamily: Fonts.italic,
      color: Colors.textSecondary,
      marginBottom: 5,
  },
  infoText: {
      fontSize: 14,
      fontFamily: Fonts.semibold,
      color: Colors.black,
      marginBottom: 15,
  },
});

export default MealPlanScreen;