import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import Header from '@/components/MealPlanHeader';
import MealPlanRequestHeader from '@/components/MealPlanRequestHeader';
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
  fitnessGoal: string;
  calorie_intake: number;
  protein: number;
  carbs: number;
  weightGoal: number;
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
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // State to store meal plan
  const [trainer, setTrainer] = useState<string | number | undefined>('');
  const [trainers, setTrainers] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState<string | number | undefined>('');
  const [memberData, setMemberData] = useState({
    requesteeID: '',
    height: '170',
    weight: '65',
    age: '25',
    fitnessGoal: 'Gain Weight',
    weightGoal: '60',
    allergens: 'Peanuts, Dairy',
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
  //       const { height, weight, age } = profileData;

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
    const fetchMealPlan = async () => {
      try {
        token = await AsyncStorage.getItem('authToken');
        userID = await AsyncStorage.getItem('userID'); // Retrieve the logged-in user's ID

        const mealPlansResponse = await fetch(`${API_BASE_URL}/api/mealplan/mealplans`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!mealPlansResponse.ok) {
          throw new Error(`HTTP error! status: ${mealPlansResponse.status}`);
        }

        const mealPlansData = await mealPlansResponse.json();
        const memberIds = mealPlansData.map((plan: MealPlan) => plan.member_id.toString());
        console.log('member_ids:', memberIds);
        console.log('userID:', userID);
        const userMealPlan = mealPlansData.find((plan: MealPlan) => memberIds.includes(plan.member_id.toString()));
        console.log('User Meal Plan:', userMealPlan);

        if (!userMealPlan) {
          throw new Error('No meal plan found for the user');
        }

        mealPlan_id = userMealPlan.mealplan_id;

        if (!token) {
          throw new Error('No token found');
        }

        const response = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/${mealPlan_id}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        if (response.status === 404) {
          setMealPlan(null);
        } else {
          const data = await response.json();
          setMealPlan(data);
        }
      } catch (error) {
        console.error('Error fetching meal plan:', error);

        if (error instanceof Error) {
          if (error.message.includes('NetworkError')) {
            console.error('Network error: Please check if the server is running and accessible.');
          } else if (error.message.includes('CORS')) {
            console.error('CORS error: Please ensure your server allows requests from your frontend.');
          }
        }
      }
    };

    fetchMealPlan();
  }, []);  

  const handlePublish = async () => {
    if (!mealPlan || !mealPlan.meals) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before publishing the meal plan.',
        position: 'bottom',
      });
      return;
    }
  
    try {
      // Temporary placeholder for responses
      const temp_response = {
        searchResponse: true, // Simulating a response indicating existing meal plans
        updateResponse: true, // Simulating a successful update
        createResponse: true, // Simulating a successful creation
      };
  
      // Retrieve token and trainer's user ID from AsyncStorage
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
  
      // Check for an existing meal plan with the same member_id
      // const searchResponse = await fetch(`${API_BASE_URL}/api/mealplans?member_id=${requesteeID}`, {
      //   method: 'GET',
      //   headers: {
      //     'Accept': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
  
      let mealPlanId;
  
      if (temp_response.searchResponse) {
        // Simulating existing meal plans
        const existingMealPlans = [{ mealplan_id: 1 }]; // Example: An existing meal plan
        if (existingMealPlans.length > 0) {
          mealPlanId = existingMealPlans[0].mealplan_id;
  
          // Update existing meal plan
          // const updateResponse = await fetch(`${API_BASE_URL}/api/mealplans/${mealPlanId}`, {
          //   method: 'PUT',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${token}`,
          //   },
          //   body: JSON.stringify({
          //     member_id: requesteeID,
          //     trainer_id: trainerID,
          //     meals: mealPlan.meals.map(meal => ({
          //       name: meal.meal_name,
          //       type: meal.meal_type,
          //       calories: meal.calories,
          //       protein: meal.protein,
          //       carbs: meal.carbs,
          //       description: meal.description,
          //     })),
          //     fitness_goal: fitnessGoal,
          //     calorie_intake: mealPlan.calorie_intake,
          //     protein: mealPlan.protein,
          //     carbs: mealPlan.carbs,
          //     weight_goal: weightGoal,
          //     allergens: allergens,
          //     instructions: mealPlan.instructions,
          //   }),
          // });
  
          if (temp_response.updateResponse) {
            console.log("Meal plan updated successfully!");
          } else {
            throw new Error("Simulated update failed!");
          }
        } else {
          // Create a new meal plan
          // const createResponse = await fetch(`${API_BASE_URL}/api/mealplans`, {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json',
          //     'Authorization': `Bearer ${token}`,
          //   },
          //   body: JSON.stringify({
          //     member_id: requesteeID,
          //     trainer_id: trainerID,
          //     meals: mealPlan.meals.map(meal => ({
          //       name: meal.meal_name,
          //       type: meal.meal_type,
          //       calories: meal.calories,
          //       protein: meal.protein,
          //       carbs: meal.carbs,
          //       description: meal.description,
          //     })),
          //     mealplan_name: "New Meal Plan",
          //     fitness_goal: fitnessGoal,
          //     calorie_intake: mealPlan.calorie_intake,
          //     protein: mealPlan.protein,
          //     carbs: mealPlan.carbs,
          //     weight_goal: weightGoal,
          //     allergens: allergens,
          //     instructions: mealPlan.instructions,
          //   }),
          // });
  
          if (temp_response.createResponse) {
            console.log("New meal plan created successfully!");
          } else {
            throw new Error("Simulated creation failed!");
          }
        }
      } else {
        throw new Error("Simulated search failed!");
      }
  
      // Finalizing the publishing process
      Toast.show({
        type: 'info',
        text1: 'Meal Plan Published',
        text2: 'Your meal plan has been published successfully.',
        position: 'bottom',
      });
      setViewState("");
    } catch (error) {
      console.error("Error handling meal plan:", error);
      Toast.show({
        type: 'error',
        text1: 'Publish Failed',
        text2: 'An unexpected error occurred. Please try again later.',
        position: 'bottom',
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
                  memberName={userID || ''}
                  fitnessGoal={memberData.fitnessGoal || ''}
                  weightGoal={memberData.weightGoal || ''}
                  allergens={memberData.allergens || ''}
                  height={memberData.height || ''}
                  weight={memberData.weight || ''}
                  age={memberData.age || ''}
                  onEditPress={() => setViewState("createMP")}
              />
          </View>
            ) : viewState === "sendMP" ? (
            <View style={styles.deleteContainer}>
              <Ionicons name="create-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.alertTitle}>Publish Meal Plan?</Text>
              <Text style={styles.alertMessage}>
              Are you sure you want to publish this Meal Plan?
              </Text>
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonRed} onPress={() => setViewState("plan")}>
                  <Text style={styles.buttonText}>NO</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonGreen} onPress={handlePublish}>
                  <Text style={styles.buttonText}>YES</Text>
                </TouchableOpacity>
              </View>
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
            // Nutritional Meal Plan View
            <>
              {mealPlan && mealPlan.meals ? (
                <View style={styles.planContainer}>
                  <CreateMPHeader setViewState={setViewState} />
                  {mealPlan.meals.map((meal, index) => (
                    <View key={index} style={styles.mealItem}>
                      <Text style={styles.mealTitle}>{meal.meal_name}</Text>
                      <Text style={styles.mealDescription}>Type of Food:</Text>
                      <TextInput
                        style={styles.mealData}
                        value={""}
                        onChangeText={(text) => {
                          const updatedMeals = [...mealPlan.meals];
                          updatedMeals[index].meal_type = text;
                          setMealPlan({ ...mealPlan, meals: updatedMeals });
                        }}
                      />
                      <Text style={styles.mealDescription}>Calories:</Text>
                      <TextInput
                        style={styles.mealData}
                        value={""}
                        onChangeText={(text) => {
                          const updatedMeals = [...mealPlan.meals];
                          updatedMeals[index].calories = parseInt(text) || 0;
                          setMealPlan({ ...mealPlan, meals: updatedMeals });
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.mealDescription}>Protein:</Text>
                      <TextInput
                        style={styles.mealData}
                        value={""}
                        onChangeText={(text) => {
                          const updatedMeals = [...mealPlan.meals];
                          updatedMeals[index].protein = parseInt(text) || 0;
                          setMealPlan({ ...mealPlan, meals: updatedMeals });
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.mealDescription}>Carbs:</Text>
                      <TextInput
                        style={styles.mealData}
                        value={""}
                        onChangeText={(text) => {
                          const updatedMeals = [...mealPlan.meals];
                          updatedMeals[index].carbs = parseInt(text) || 0;
                          setMealPlan({ ...mealPlan, meals: updatedMeals });
                        }}
                        keyboardType="numeric"
                      />
                      <Text style={styles.mealDescription}>Description:</Text>
                      <TextInput
                        style={styles.mealData}
                        value={""}
                        onChangeText={(text) => {
                          const updatedMeals = [...mealPlan.meals];
                          updatedMeals[index].description = text;
                          setMealPlan({ ...mealPlan, meals: updatedMeals });
                        }}
                      />
                    </View>
                  ))}
                  <TouchableOpacity style={styles.buttonFeedback} onPress={() => setViewState("sendMP")}>
                    <Text style={styles.buttonText}>Send Meal Plan</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View>
                  <Header />
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>There are no meal plans yet.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setViewState("createMP")}>
                      <Text style={styles.buttonText}>Create Meal Plan</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </>
          ) : viewState === "editMP" ? (
            // Nutritional Meal Plan View
            <>
              {mealPlan && mealPlan.meals ? (
              <View style={styles.planContainer}>
                <EditMPHeader setViewState={setViewState} />
                {mealPlan.meals.map((meal, index) => (
                <View key={index} style={styles.mealItem}>
                  <Text style={styles.mealTitle}>{meal.meal_name}</Text>
                  <Text style={styles.mealDescription}>Type of Food:</Text>
                  <TextInput
                  style={styles.mealData}
                  defaultValue={meal.meal_type}
                  onChangeText={(text) => {
                    const updatedMeals = [...mealPlan.meals];
                    updatedMeals[index].meal_type = text;
                    setMealPlan({ ...mealPlan, meals: updatedMeals });
                  }}
                  />
                  <Text style={styles.mealDescription}>Calories:</Text>
                  <TextInput
                  style={styles.mealData}
                  defaultValue={meal.calories.toString()}
                  onChangeText={(text) => {
                    const updatedMeals = [...mealPlan.meals];
                    updatedMeals[index].calories = parseInt(text) || 0;
                    setMealPlan({ ...mealPlan, meals: updatedMeals });
                  }}
                  keyboardType="numeric"
                  />
                  <Text style={styles.mealDescription}>Protein:</Text>
                  <TextInput
                  style={styles.mealData}
                  defaultValue={meal.protein.toString()}
                  onChangeText={(text) => {
                    const updatedMeals = [...mealPlan.meals];
                    updatedMeals[index].protein = parseInt(text) || 0;
                    setMealPlan({ ...mealPlan, meals: updatedMeals });
                  }}
                  keyboardType="numeric"
                  />
                  <Text style={styles.mealDescription}>Carbs:</Text>
                  <TextInput
                  style={styles.mealData}
                  defaultValue={meal.carbs.toString()}
                  onChangeText={(text) => {
                    const updatedMeals = [...mealPlan.meals];
                    updatedMeals[index].carbs = parseInt(text) || 0;
                    setMealPlan({ ...mealPlan, meals: updatedMeals });
                  }}
                  keyboardType="numeric"
                  />
                  <Text style={styles.mealDescription}>Description:</Text>
                  <TextInput
                  style={styles.mealData}
                  defaultValue={meal.description}
                  onChangeText={(text) => {
                    const updatedMeals = [...mealPlan.meals];
                    updatedMeals[index].description = text;
                    setMealPlan({ ...mealPlan, meals: updatedMeals });
                  }}
                  />
                </View>
                ))}
                <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.buttonRed} onPress={() => setViewState("plan")}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonSave} onPress={() => setViewState("sendMP")}>
                  <Text style={styles.buttonText}>Save</Text>
                </TouchableOpacity>
                </View>
              </View>
              ) : (
              <View>
                <Header />
                <View style={styles.centerContainer}>
                <Text style={styles.subtitle2}>There are no meal plans yet.</Text>
                <TouchableOpacity style={styles.button} onPress={() => setViewState("createMP")}>
                  <Text style={styles.buttonText}>Create Meal Plan</Text>
                </TouchableOpacity>
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
              {mealPlan ? (
              <View style={styles.planContainer}>
                {/* Render the MemberMealPlan component here */}
                <MemberMealPlan mealPlan={mealPlan} onEditPress={() => setViewState("editMP")} />
              </View>
              ) : (
              <View style={styles.centerContainer}>
                <Text style={styles.subtitle2}>You have no existing meal plan.</Text>
                <TouchableOpacity style={styles.submitButton} onPress={() => setViewState("createMP")}>
                <Text style={styles.buttonText}>Create Meal Plan</Text>
                </TouchableOpacity>
              </View>
              )}
            </View>
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
    paddingVertical: 20,
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
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  icon: {
    marginBottom: 15,
    alignSelf: "center",
  },
  alertTitle: {
    fontSize: 20,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: Fonts.bold,
  },
  alertMessage: {
    textAlign: "center",
    fontSize: 14,
    color: "gray",
    marginBottom: 25,
    fontFamily: Fonts.regular,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonFeedback: {
    backgroundColor: Colors.gold,
    padding: 12,
    borderRadius: 10,
    alignSelf: "center",
    top: -5,
    width: "70%",
  },
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
  buttonSave: {
    backgroundColor: Colors.gold,
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
    fontSize: 15,
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
  formContainer: {
    width: "100%",
    alignItems: "flex-start",
    flex: 1,
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
    fontSize: 14,
  },
  button: {
    backgroundColor: Colors.gold,
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
  requestMPContainer: {
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
  selectTrainerHeader: {
    color: Colors.textSecondary,
    fontFamily: Fonts.regular,
    fontSize: 14,
    padding: 12,
  },
  trainerPicker: {
    backgroundColor: Colors.bg,
    color: Colors.black,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
  pickerBlack: {
    width: '100%', 
    backgroundColor: Colors.black,
    borderRadius: 10,
  },
  trashIcon: {
    alignSelf: 'flex-end',
    marginTop: 0,
    flexGrow: 0,
  },
  ratingHeader: {
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 14,
    padding: 12,
  },
  ratingPicker: {
    backgroundColor: Colors.black,
    color: Colors.white,
    fontFamily: Fonts.regular,
    fontSize: 14,
  },
});

export default MealPlanScreen;