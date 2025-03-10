import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import RNPickerSelect from 'react-native-picker-select';
import Toast from 'react-native-toast-message';

import Header from '@/components/MealPlanHeader';
import RequestMealPlanHeaderMP from '@/components/RequestHeaderMP';
import SendFeedbackHeaderMP from '@/components/SendFeedbackHeaderMP';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

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
  mealplan_id: string;
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

const MealPlanScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [mealPlan, setMealPlan] = useState<MealPlan | null>({
    mealplan_id: "X",
    member_id: "Member A",
    mealplan_name: "Meal Plan A",
    trainer_id: "Trainer A",
    fitness_goal: "Lose Weight",
    weight_goal: 70,
    calorie_intake: 430,
    protein: 100,
    carbs: 30,
    allergens: "Peanuts, Dairy",
    meals: [
      { id: "a", mealplan: "X", meal_name: "Breakfast", description: "Oatmeal with fruits", meal_type: "Breakfast", calories: 330, protein: 100, carbs: 30},
      { id: "b", mealplan: "X", meal_name: "Lunch", description: "Chicken Salad", meal_type: "Lunch", calories: 440, protein: 50, carbs: 80},
      { id: "c", mealplan: "X", meal_name: "Dinner", description: "Siya <3", meal_type: "Dinner", calories: 550, protein: 9999, carbs: 0},
    ],
    instructions: "Hatdog.",
  }); // State to store meal plan
  const [trainer, setTrainer] = useState<string | number | undefined>('');
  const [trainers, setTrainers] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState<string | number | undefined>('');

  // Fetching trainers from API

  // useEffect(() => {
  //   const fetchTrainers = async () => {
  //     try {
  //       const response = await fetch('YOUR_API_ENDPOINT_HERE');
  //       const data = await response.json();
  //       setTrainers(data);
  //     } catch (error) {
  //       console.error('Error fetching trainers:', error);
  //     }
  //   };
  
  //   fetchTrainers();
  // }, []);

  // Fetching Meal Plan from API
  
  useEffect(() => {
    const fetchMealPlan = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/mealplan/');
        const data = await response.json();
        setMealPlan(data);
      } catch (error) {
        console.error('Error fetching meal plan:', error);
      }
    };
  
    fetchMealPlan();
  }, []);

  const handleSubmit = async () => {
    if (!trainer || !fitnessGoal || !weightGoal || !allergens) {
      Toast.show({
        type: 'error',
        text1: 'Missing Fields',
        text2: 'Please fill out all fields before submitting.',
        position: 'bottom'
      });
      return;
    }
    
    try {
      // // Replace with actual API call
      // To central feedback and request database

      // const response = await fetch('https://api.example.com/submitMealPlan', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     trainer,
      //     fitnessGoal,
      //     weightGoal,
      //     allergens,
      //     feedback,
      //     rating,
      //   }),
      // });

      // const result = await response.json();
      
      // // Temporary Success Placeholder
      const temp_response = true;

      if (temp_response) {
        Toast.show({
          type: 'success',
          text1: 'Request Submitted',
          text2: 'Your meal plan request has been submitted successfully.',
          position: 'bottom'
        });
        setTimeout(() => {
          setViewState("plan");
          // setMealPlan("result"); // Update meal plan with the new data
        }, 2000); // 2-second delay
      } else {
        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: 'There was an error with your meal plan request.',
          position: 'bottom'
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: 'There was an error with your meal plan request.',
        position: 'bottom'
      });
    }
  };

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

    try {
      // Uncomment and replace with actual API call,
      // This is in line with an agreed central feedback and request database.

      // const response = await fetch('https://api.example.com/submitFeedback', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     feedback,
      //     rating,
      //   }),
      // });

      const temp_response = true;
      // // response.ok
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
                    items={[
                      { label: 'Trainer A', value: 'trainerA' },
                      { label: 'Trainer B', value: 'trainerB' },
                      { label: 'Trainer C', value: 'trainerC' },
                    ]}
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

                <Text style={styles.requestHeaders}>Allergen/s</Text>
                <TextInput
                  placeholder="Enter Your Allergen/s"
                  placeholderTextColor={Colors.textSecondary}
                  style={styles.input}
                  value={allergens}
                  onChangeText={setAllergens}
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