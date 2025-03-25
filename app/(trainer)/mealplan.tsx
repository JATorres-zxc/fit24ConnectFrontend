import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import Header from '@/components/MealPlanHeader';
import MealPlanRequestHeader from '@/components/MealPlanRequestHeader';
import MealPlanForm from '@/components/TrainerMealPlanForm';
import EditMPHeader from '@/components/EditMPHeader';
import CreateMPHeader from '@/components/CreateMPHeader';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import AsyncStorage from "@react-native-async-storage/async-storage";
import MemberMealPlan from "@/components/MemberMealPlan";
import MealPlanRequest from "@/components/MealPlanRequest";
import TrainerMPHeader from "@/components/TrainerMPHeader";

interface Meal {
  id: string;
  mealplan: string;
  meal_name: string;
  description: string;
  meal_type: string;
  calories: number;
  protein: number;
  carbs: number;
}

interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

interface MealPlan {
  mealplan_id: number;
  meals: Meal[];
  member_id: string;
  trainer_id: string;
  mealplan_name: string;
  fitness_goal: string;
  calorie_intake: number;
  protein: number;
  carbs: number;
  weight_goal: number;
  allergens: string;
  instructions: string;
}

const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://127.0.0.1:8000' // Web uses localhost
    : 'http://172.16.6.198:8000'; // Mobile uses local network IP

let token: string | null = null;
let userID: string | null = null;
let mealPlan_id: number | null = null;

const MealPlanScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]); // State for multiple meal plans
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // State for singular meal plan
  const [updateMealPlan, setUpdateMealPlan] = useState<MealPlan | null>(null);
  const [trainer, setTrainer] = useState<string | number | undefined>('');
  const [trainers, setTrainers] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState<string | number | undefined>('');
  const [memberData, setMemberData] = useState({
    requesteeID: '2',
    requesteeName: 'John Daks',
    height: '170',
    weight: '65',
    age: '25',
    fitnessGoal: 'Gain Weight',
    weightGoal: '60',
    allergens: 'Peanuts, Dairy',
  });
  const [newMealPlan, setNewMealPlan] = useState<MealPlan | null>({
    mealplan_id: Date.now(),
    meals: [], // Ensures `meals` is always defined
    member_id: memberData.requesteeID,
    trainer_id: userID?.toString() || "",
    mealplan_name: "",
    fitness_goal: "",
    calorie_intake: 0,
    protein: 0,
    carbs: 0,
    weight_goal: 0,
    allergens: "",
    instructions: "",
  });
  

  // Fetching trainers from API

  // useEffect(() => {
  //   const fetchTrainers = async () => {
  //     try {
  //       token = await AsyncStorage.getItem('authToken');
  //       userID = await AsyncStorage.getItem('userID'); // Retrieve the logged-in user's ID

  //       const response = await fetch(`${API_BASE_URL}/api/mealplan/trainers`, {
  //         headers: {
  //           'Accept': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!response.ok) {
  //         throw new Error(`HTTP error! status: ${response.status}`);
  //       }

  //       const data = await response.json();
  //       setTrainers(data);
  //     } catch (error) {
  //       console.error('Error fetching trainers:', error);
  //     }
  //   };
  
  //   fetchTrainers();
  // }, []);

  // Fetch member data and request data from different APIs
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // Retrieve token and userID from AsyncStorage
  //       const token = await AsyncStorage.getItem('authToken');
  //       const userID = await AsyncStorage.getItem('userID'); // Logged-in user's ID

  //       // Fetch height, weight, and age from the first API
  //       const profileResponse = await fetch(`${API_BASE_URL}/api/profile`, {
  //         headers: {
  //           'Accept': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!profileResponse.ok) {
  //         throw new Error(`Profile API error! status: ${profileResponse.status}`);
  //       }

  //       const profileData = await profileResponse.json();
  //       const { height, weight, age, requesteeName } = profileData;

  //       // Fetch requests from a different API
  //       const requestResponse = await fetch(`${API_BASE_URL}/api/requests-feedback`, {
  //         method: 'GET',
  //         headers: {
  //           'Accept': 'application/json',
  //           'Authorization': `Bearer ${token}`,
  //         },
  //       });

  //       if (!requestResponse.ok) {
  //         throw new Error(`Requests API error! status: ${requestResponse.status}`);
  //       }

  //       const requestData = await requestResponse.json();
  //       const { fitnessGoal, weightGoal, allergens } = requestData;

  //       // Update state with both sets of data
  //       setMemberData({
  //         requesteeID,
  //         requesteeName,
  //         height,
  //         weight,
  //         age,
  //         fitnessGoal,
  //         weightGoal,
  //         allergens,
  //       });
  //     } catch (error) {
  //       console.error('Error fetching data:', error);
  //     }
  //   };

  //   fetchData();
  // }, []);

  // Fetching Meal Plan from API
  
  useEffect(() => {
    const fetchMealPlans = async () => {
      try {
        token = await AsyncStorage.getItem('authToken');
        userID = await AsyncStorage.getItem('userID'); // Retrieve the logged-in user's ID

        const response = await fetch(`${API_BASE_URL}/api/mealplan/mealplans`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const mealPlansData = await response.json();
        setMealPlans(mealPlansData); // Store all meal plans
      } catch (error) {
        console.error('Error fetching meal plans:', error);
      }
    };

    fetchMealPlans();
  }, []);

  const handlePublish = async (currentMealPlan?: MealPlan) => {
    const plan = currentMealPlan; // Use the current meal plan state
  
    if (!plan || !plan.meals || Array.from(plan.meals).some(meal => !meal.meal_name?.trim())) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before publishing the meal plan.',
        position: 'bottom',
      });
      return;
    }
  
    try {
      const token = await AsyncStorage.getItem('authToken');
      const trainerID = await AsyncStorage.getItem('userID'); // Logged-in trainer's ID
      const requesteeID = memberData?.requesteeID; // Member's ID from the state
  
      if (!requesteeID) {
        Toast.show({
          type: 'error',
          text1: 'Missing Member ID',
          text2: 'Please select a member before publishing the meal plan.',
          position: 'bottom',
        });
        return;
      }
  
      // Simulated responses for now
      const temp_response = {
        searchResponse: true,
        updateResponse: true,
        createResponse: true,
      };
  
      let mealPlanId: number;
  
      if (temp_response.searchResponse) { // REMOVE IF API AVAILABLE
        // const searchResponse = await fetch(`${API_BASE_URL}/api/mealplans?member_id=${requesteeID}`, {
        //   method: 'GET',
        //   headers: {
        //     'Accept': 'application/json',
        //     'Authorization': `Bearer ${token}`,
        //   },
        // });
        // if (!searchResponse.ok) {
        //   throw new Error(`Search API error! status: ${searchResponse.status}`);
        // }
        const existingMealPlans = [{ mealplan_id: 1 }]; // Placeholder for simulated response: await searchResponse.json();
        if (existingMealPlans.length > 0) {
          mealPlanId = existingMealPlans[0].mealplan_id;
  
          if (temp_response.updateResponse) { // REMOVE IF API AVAILABLE
            // const updateResponse = await fetch(`${API_BASE_URL}/api/mealplans/${mealPlanId}`, {
            //   method: 'PUT',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}`,
            //   },
            //   body: JSON.stringify({
            //     member_id: requesteeID,
            //     trainer_id: trainerID,
            //     meals: plan.meals.map(meal => ({
            //       id: meal.id,
            //       meal_name: meal.meal_name,
            //       description: meal.description,
            //       meal_type: meal.meal_type,
            //       calories: meal.calories,
            //       protein: meal.protein,
            //       carbs: meal.carbs,
            //       mealplan: mealPlanId,
            //     })),
            //     mealplan_name: plan.mealplan_name,
            //     fitness_goal: fitnessGoal,
            //     calorie_intake: plan.calorie_intake,
            //     protein: plan.protein,
            //     carbs: plan.carbs,
            //     weight_goal: weightGoal,
            //     instructions: plan.instructions,
            //   }),
            // });
            
            console.log("Meal plan updated successfully!");
          } else {
            throw new Error("Simulated update failed!");
          }
        } else {
          if (temp_response.createResponse) { // REMOVE IF API AVAILABLE
            // const createResponse = await fetch(`${API_BASE_URL}/api/mealplans`, {
            //   method: 'POST',
            //   headers: {
            //     'Content-Type': 'application/json',
            //     'Authorization': `Bearer ${token}`,
            //   },
            //   body: JSON.stringify({
            //     member_id: requesteeID,
            //     trainer_id: trainerID,
            //     meals: plan.meals.map(meal => ({
            //       meal_name: meal.meal_name,
            //       description: meal.description,
            //       meal_type: meal.meal_type,
            //       calories: meal.calories,
            //       protein: meal.protein,
            //       carbs: meal.carbs,
            //     })),
            //     mealplan_name: "New Meal Plan",
            //     fitness_goal: fitnessGoal,
            //     calorie_intake: plan.calorie_intake,
            //     protein: plan.protein,
            //     carbs: plan.carbs,
            //     weight_goal: weightGoal,
            //     instructions: plan.instructions,
            //   }),
            // });
            console.log("New meal plan created successfully!");
          } else {
            throw new Error("Simulated creation failed!");
          }
        }
      } else {
        throw new Error("Simulated search failed!");
      }
  
      // Update state after successful publish
      setMealPlans((prevMealPlans) =>
        prevMealPlans.map((p) =>
          p.mealplan_id === mealPlanId ? { ...plan, mealplan_id: mealPlanId } : p
        )
      );
      setMealPlan(null); // Clear view state
  
      Toast.show({
        type: 'info',
        text1: 'Meal Plan Published',
        text2: 'Your meal plan has been published successfully.',
        position: 'bottom',
      });
      setViewState('');
    } catch (error) {
      console.error("Error handling meal plan:", error);
      Toast.show({
        type: 'error',
        text1: "Publish Failed",
        text2: "An unexpected error occurred. Please try again later.",
        position: "bottom",
      });
    }
  };  
    

  const handleDelete = async () => {
    try {
      // // Replace with actual API call
      const response = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/${mealPlan_id}/`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // const temp_response = true;

      // response.ok

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Meal Plan Deleted',
          text2: 'Your meal plan has been deleted successfully.',
          position: 'bottom'
        });

        // TEMPORARY: DELETE SNIPPET WHEN API IS AVAILABLE.
        setMealPlan(null); // Clear the meal plan by resetting to initial structure

        setViewState("plan");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: 'There was an error deleting your meal plan.',
          position: 'bottom'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'There was an error deleting your meal plan.',
        position: 'bottom'
      });
    }
  };

  const handleMealPlanSelect = (selectedMealPlan: MealPlan) => {
    setMealPlan(selectedMealPlan); // Set the selected meal plan
    setViewState("editMP");
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
            <View style={styles.planContainer}>
              <MealPlanRequestHeader setViewState={setViewState} />
              <MealPlanRequest
                  setViewState={setViewState}
                  memberName={memberData.requesteeName || ''}
                  fitnessGoal={memberData.fitnessGoal || ''}
                  weightGoal={memberData.weightGoal || ''}
                  allergens={memberData.allergens || ''}
                  height={memberData.height || ''}
                  weight={memberData.weight || ''}
                  age={memberData.age || ''}
                  onEditPress={() => setViewState("createMP")}
              />
          </View>
            ) : viewState === "delete" ? (
            <View style={styles.deleteContainer}>
              <Ionicons name="trash-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.alertTitle}>Delete Meal Plan?</Text>
              <Text style={styles.alertMessage}>
                You're going to permanently delete this Meal Plan. Are you sure?
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
          ) : viewState === "createMP" ? (
            <>
              <CreateMPHeader setViewState={setViewState} setMealPlan={setNewMealPlan} />
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
                    id: Date.now().toString(),
                    mealplan: "0", // Placeholder, may need an updated value
                    meal_name: "",
                    meal_type: "",
                    calories: 0,
                    protein: 0,
                    carbs: 0,
                    description: "",
                  };

                  setNewMealPlan((prevMealPlan) => ({
                    ...prevMealPlan!,
                    meals: [...(prevMealPlan?.meals || []), newMeal],
                    trainer_id: userID?.toString() || "", // Assign trainer
                    member_id: memberData.requesteeID, // Assign member
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
                  <EditMPHeader setViewState={setViewState} setMealPlan={setMealPlan} />
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
                        id: Date.now().toString(),
                        mealplan: mealPlan?.mealplan_id?.toString() || "", // Use selected meal plan ID
                        meal_name: "",
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

                  {/* External Button for Publishing Meal Plan */}
                  <TouchableOpacity
                    style={styles.submitButton}
                    onPress={() => {
                      if (!mealPlan) return; // Prevent passing null
                      console.log("Meal Plan to publish:", mealPlan);
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
              <TouchableOpacity style={styles.submitButton} onPress={() => setViewState("requests")}>
              <Text style={styles.buttonText}>Meal Plan Requests</Text>
              </TouchableOpacity>
              {mealPlans.map((plan) => (
                <TouchableOpacity key={plan.mealplan_id} onPress={() => handleMealPlanSelect(plan)}>
                  <MemberMealPlan 
                    mealPlan={plan} 
                    requesteeName={memberData.requesteeName}  // Pass the prop here
                    onEditPress={() => handleMealPlanSelect(plan)} 
                  />
                </TouchableOpacity>
              ))}
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

export default MealPlanScreen;