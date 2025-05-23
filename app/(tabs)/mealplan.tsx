import React, { useCallback, useState } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import { useFocusEffect } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import Header from '@/components/MealPlanHeader';
import RequestMealPlanHeaderMP from '@/components/RequestHeaderMP';
import SendFeedbackHeaderMP from '@/components/SendFeedbackHeaderMP';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { getItem } from '@/utils/storageUtils';
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interfaces for meals
import { Meal, User, Feedback, MealPlan } from "@/types/interface";
import { Trainer2 as Trainer } from "@/types/interface";

let token: string | null = null;
let userID: string | null = null;
let mealPlan_id: number | null = null;

const MealPlanScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // State to store meal plan
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [trainers, setTrainers] = useState<Trainer[]>([]); // State to store trainers
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergies, setAllergies] = useState(""); // State to store allergies
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const [rating, setRating] = useState<string | number | undefined>('');

  // Fetch trainers
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
          full_name: trainer.user?.full_name || "Unknown Trainer",
        },
        experience: trainer.experience?.trim() || "Not Specified",
        contact: trainer.contact?.trim() || "Not Available",
      }));

      setTrainers(resolvedTrainers);
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'No Trainers Found!',
        text2: `${error}`,
        topOffset: 80,
      });
    }
  };

  // Fetch meal plan
  const fetchMealPlan = async () => {
    try {
      const token = await getItem('authToken');
      const userID = await getItem('userID');

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

      const completedMealPlans = mealPlansData;

      if (completedMealPlans.length === 0) {
        throw new Error('No completed meal plan found for the user');
      }

      const userMealPlan = completedMealPlans.find(
        (plan: MealPlan) => plan.member_id.toString() === userID
      );

      if (!userMealPlan) {
        throw new Error('No completed meal plan found for the user');
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
      Toast.show({
        type: 'error',
        text1: 'No Meal Plans Found!',
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
      fetchMealPlan();
      const fetchUserIDandToken = async () => {
        userID = await getItem('userID');
        token = await getItem('authToken');
      };
      fetchUserIDandToken();
    }, [refreshTrigger])
  );
  
  const handleSubmit = async () => {
    if (!trainer || !fitnessGoal || !weightGoal || !allergies) {
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
      
      // Fetch member data from the profile API
      // const profileResponse = await fetch(`${API_BASE_URL}/api/profilee/profile/`, {
      //   headers: {
      //     'Accept': 'application/json',
      //     'Authorization': `Bearer ${token}`,
      //   },
      // });
    
      // if (!profileResponse.ok) {
      //   throw new Error(`Profile API error! status: ${profileResponse.status}`);
      // }
    
      // const profileData = await profileResponse.json();
      // Placeholder profile data since API is currently disabled
        const profileData = {
            height: 0,
            weight: 0,
            age: 0
        };

        const {
            height = 0,
            weight = 0,
            age = 0
        } = profileData;

        // Use the request_plan endpoint to request a new meal plan
        const requestResponse = await fetch(`${API_BASE_URL}/api/mealplan/mealplans/request_plan/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                trainer_id: trainer, // Trainer ID is required
                fitness_goal: fitnessGoal,
                weight_goal: weightGoal,
                user_allergies: allergies,
                // height: profileData.height,
                // weight: profileData.weight,
                // age: profileData.age,
            }),
        });

        if (!requestResponse.ok) {
            throw new Error(`Meal Plan API error! status: ${requestResponse.status}`);
        }

        Toast.show({
            type: 'success',
            text1: 'Request Submitted',
            text2: 'Your meal plan request has been submitted successfully.',
            topOffset: 80,
        });

        setRefreshTrigger(prev => !prev);

        setTimeout(() => {
            setViewState("plan");
        }, 2000);

    } catch (error) {
        Toast.show({
            type: 'error',
            text1: 'Request Failed',
            text2: 'There was an error with your meal plan request. Please check if you already have a pending request.',
            topOffset: 80,
        });
      }
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

    try {
      // This is in line with an agreed central feedback and request database.
      const token = await getItem('authToken');

      const response = await fetch(`${API_BASE_URL}/api/mealplan/feedbacks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          mealplan: mealPlan_id,
          comment: feedback,
          rating: rating,
        }),
      });

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

  const handleDelete = async () => {
    try {
      const token = await getItem('authToken');

      // Replace with actual API call
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
          topOffset: 80,
        });

        // TEMPORARY: DELETE SNIPPET WHEN API IS AVAILABLE.
        setMealPlan(null); // Clear the meal plan by resetting to initial structure
        setRefreshTrigger(prev => !prev);
        setViewState("plan");
      } else {
        Toast.show({
          type: 'error',
          text1: 'Delete Failed',
          text2: 'There was an error deleting your meal plan.',
          topOffset: 80,
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Delete Failed',
        text2: 'There was an error deleting your meal plan.',
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
          {viewState === "request" ? (
            // Request Meal Plan View
            <View style={styles.formContainer}>
              <RequestMealPlanHeaderMP setViewState={setViewState}/>
              
              <View style={styles.requestMPContainer}>
                {/* Trainer Picker */}
                <Text style={styles.requestHeaders}>Choose Trainer</Text>
                <View style={styles.pickerTrainer}>
                  <RNPickerSelect
                    onValueChange={(value) => setTrainer(value)}
                    items={trainers.map((trainer) => ({
                      label: trainer.user.full_name,
                      value: trainer.id,
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

                <Text style={styles.requestHeaders}>Weight Goal</Text>
                <TextInput
                  placeholder="Enter Your Weight Goal"
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.input}
                  value={weightGoal}
                  onChangeText={(number) => setWeightGoal(number.replace(/[^0-9]/g, ""))}
                  keyboardType="numeric"
                />

                <Text style={styles.requestHeaders}>Allergies</Text>
                <TextInput
                  placeholder="Enter Your Allergies"
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.input}
                  value={allergies}
                  onChangeText={setAllergies}
                />

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Submit Request</Text>
                </TouchableOpacity>
              </View>
            </View>
          ) : viewState === "feedback" ? (
            <View style={styles.formContainer}>
              <SendFeedbackHeaderMP setViewState={setViewState}/>

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
          ) : viewState === "delete" ? (
            <View style={styles.deleteContainer}>
              <Ionicons name="trash-outline" size={24} color="black" style={styles.icon} />
              <Text style={styles.alertTitle}>Delete Meal Plan?</Text>
              <Text style={styles.alertMessage}>
                You're going to permanently delete your Meal Plan. Are you sure?
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
            // Nutritional Meal Plan View
            <>
              {mealPlan ? (
                  mealPlan.status === "completed" && mealPlan.meals.length > 0 ? (
                  <View style={styles.planContainer}>
                    <Header />
                    {mealPlan.meals.map((meal, index) => (
                      <View key={index} style={styles.mealItem}>
                        <Text style={styles.mealTitle}>{meal.meal_name}</Text>
                        <Text style={styles.mealDescription}>Type of Food:</Text>
                        <Text style={styles.mealData}>{meal.meal_type}</Text>
                        <Text style={styles.mealDescription}>Calories:</Text>
                        <Text style={styles.mealData}>{meal.calories} kcal</Text>
                        <Text style={styles.mealDescription}>Protein:</Text>
                        <Text style={styles.mealData}>{meal.protein} g</Text>
                        <Text style={styles.mealDescription}>Carbs:</Text>
                        <Text style={styles.mealData}>{meal.carbs} g</Text>
                        <Text style={styles.mealDescription}>Description:</Text>
                        <Text style={styles.mealData}>{meal.description}</Text>
                      </View>
                    ))}
                    <TouchableOpacity style={styles.trashIcon} onPress={() => setViewState("delete")}>
                      <FontAwesome name="trash" size={24} color={Colors.black} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonFeedback} onPress={() => setViewState("feedback")}>
                      <Text style={styles.buttonText}>Send Feedback</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("request")}>
                      <Text style={styles.buttonText}>Request New Meal Plan</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View>
                    <Header />
                    <View style={styles.centerContainer}>
                      <Text style={styles.subtitle2}>Your meal plan is under review and will be available once your trainer completes it.</Text>
                    </View>
                  </View>
                )
              ) : (
                <View>
                  <Header />
                  <View style={styles.centerContainer}>
                    <Text style={styles.subtitle2}>You have no existing meal plan.</Text>
                    <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
                      <Text style={styles.buttonText}>Request Meal Plan</Text>
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
    width: "50%",
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

export default MealPlanScreen;