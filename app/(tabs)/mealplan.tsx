import React, { useState, useEffect } from "react";
import { 
  View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform 
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import Header from '@/components/MealPlanHeader';
import { Ionicons, FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Meal {
  meal: string;
  type: string;
  calories: number;
  description: string;
}

interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

interface MealPlan {
  trainer: string;
  fitnessGoal: string;
  weightGoal: string;
  allergens: string;
  meals: Meal[];
  feedbacks: Feedback[];
}

const MealPlanScreen = () => {
  const [viewState, setViewState] = useState("plan"); // "plan", "request", "feedback", "delete"
  const [mealPlan, setMealPlan] = useState<MealPlan | null>({
    trainer: "Trainer A",
    fitnessGoal: "Lose Weight",
    weightGoal: "70",
    allergens: "Peanuts, Dairy",
    meals: [
      { meal: "Breakfast", description: "Oatmeal with fruits", type: "Food", calories: 330 },
      { meal: "Lunch", description: "Chicken Salad", type: "Food", calories: 440 },
      { meal: "Dinner", description: "Siya <3", type: "Unknown", calories: 550 },
    ],
    feedbacks: [],
  }); // State to store meal plan
  const [trainer, setTrainer] = useState(""); // State to store selected trainer
  const [trainers, setTrainers] = useState([]);
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [rating, setRating] = useState(""); // State to store rating

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
  
  // useEffect(() => {
  //   const fetchMealPlan = async () => {
  //     try {
  //       const response = await fetch('YOUR_MEAL_PLAN_API_ENDPOINT_HERE');
  //       const data = await response.json();
  //       setMealPlan(data);
  //     } catch (error) {
  //       console.error('Error fetching meal plan:', error);
  //     }
  //   };
  
  //   fetchMealPlan();
  // }, []);

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
      
      // Temporary Success Placeholder
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

    if (mealPlan) {
      const newFeedback = {
        id: `${mealPlan.meals[0].meal}-${Date.now()}`,
        feedback,
        rating: parseInt(rating),
        createdAt: new Date(),
      };

      const updatedMealPlan = {
        ...mealPlan,
        feedbacks: [...mealPlan.feedbacks, newFeedback],
      };

      setMealPlan(updatedMealPlan);
    } else {
      // Handle the case where mealPlan is null
      console.error("No meal plan available to add feedback.");
    }

    try {
      // Uncomment and replace with actual API call
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
      // response.ok
      if (temp_response) {
        Toast.show({
          type: 'info',
          text1: 'Feedback Sent',
          text2: 'Your feedback has been sent successfully. Please wait a few days for your new meal plan!',
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
          <Header />

          {viewState === "request" ? (
            // Request Meal Plan View
            <View style={styles.formContainer}>
              <TouchableOpacity onPress={() => setViewState("plan")}>
                <Text style={styles.backText}>←    Request Meal Plan</Text>
              </TouchableOpacity>

              <Text style={styles.requestHeaders}>Choose Trainer</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={trainer}
                  onValueChange={(itemValue) => setTrainer(itemValue)}
                  style={styles.picker}
                  itemStyle = {{ color: Colors.buttonText }}
                  prompt="Select trainer"
                  dropdownIconColor={Colors.buttonBlack}
                  dropdownIconRippleColor={Colors.buttonBlack}
                  mode="dropdown" // Optional for Android
                >
                  <Picker.Item label="Select Trainer" value="" style={styles.input}/>
                  <Picker.Item label="Trainer A" value="trainerA" />
                  <Picker.Item label="Trainer B" value="trainerB" />
                  <Picker.Item label="Trainer C" value="trainerC" />

                  {/* Dynamic Picker Item from API */}

                  {/* <Picker.Item label="Select Trainer" value="" />
                  {trainers.map((trainer) => (
                    <Picker.Item key={trainer.id} label={trainer.name} value={trainer.id} />
                  ))} */}
                  
                </Picker>
              </View>

              <Text style={styles.requestHeaders}>Fitness Goal</Text>
              <TextInput
                placeholder="Enter Your Fitness Goal"
                style={styles.input}
                value={fitnessGoal}
                onChangeText={(text) => setFitnessGoal(text)}
              />

              <Text style={styles.requestHeaders}>Weight Goal</Text>
              <TextInput
                placeholder="Enter Your Weight Goal"
                style={styles.input}
                value={weightGoal}
                onChangeText={(number) => setWeightGoal(number.replace(/[^0-9]/g, ""))}
                keyboardType="numeric"
              />

              <Text style={styles.requestHeaders}>Allergen/s</Text>
              <TextInput
                placeholder="Enter Your Allergen/s"
                style={styles.input}
                value={allergens}
                onChangeText={setAllergens}
              />

              <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit Request</Text>
              </TouchableOpacity>
            </View>
          ) : viewState === "feedback" ? (
            <View style={styles.formContainer}>
              <TouchableOpacity onPress={() => setViewState("plan")}>
                <Text style={styles.backText}>←   Send Feedback</Text>
              </TouchableOpacity>

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
                  mode="dropdown" // Optional for Android
                  dropdownIconColor={Colors.buttonText}
                  dropdownIconRippleColor={Colors.buttonText}
                  prompt={"Select a Rating:"} // Android only
                >
                  <Picker.Item label="Enter Your Rating" value="" />
                  <Picker.Item label="1 - Poor" value="1" />
                  <Picker.Item label="2 - Fair" value="2" />
                  <Picker.Item label="3 - Good" value="3" />
                  <Picker.Item label="4 - Very Good" value="4" />
                  <Picker.Item label="5 - Excellent" value="5" />

                </Picker>
              </View>

              <TouchableOpacity style={styles.submitButton} onPress={handleFeedbackSubmit}>
                <Text style={styles.buttonText}>Submit Feedback</Text>
              </TouchableOpacity>
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
                  {mealPlan.meals.map((meal, index) => (
                    <View key={index} style={styles.mealItem}>
                      <Text style={styles.mealTitle}>{meal.meal}</Text>
                      <Text style={styles.mealDescription}>Type of Food:</Text>
                      <Text style={styles.mealData}>{meal.type}</Text>
                      <Text style={styles.mealDescription}>Calories:</Text>
                      <Text style={styles.mealData}>{meal.calories} kcal</Text>
                      <Text style={styles.mealDescription}>Description:</Text>
                      <Text style={styles.mealData}>{meal.description}</Text>
                    </View>
                  ))}
                  <TouchableOpacity style={styles.trashIcon} onPress={() => setViewState("delete")}>
                    <FontAwesome name="trash" size={24} color={Colors.buttonBlack} />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonFeedback} onPress={() => setViewState("feedback")}>
                    <Text style={styles.buttonText}>Send Feedback</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.buttonBlack} onPress={() => setViewState("request")}>
                    <Text style={styles.buttonText}>Request New Meal Plan</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.centerContainer}>
                  <Text style={styles.subtitle2}>You have no existing meal plan.</Text>
                  <TouchableOpacity style={styles.button} onPress={() => setViewState("request")}>
                    <Text style={styles.buttonText}>Request Meal Plan</Text>
                  </TouchableOpacity>
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
    fontWeight: "bold",
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
    fontWeight: "bold",
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
    marginTop: 20,
    width: "100%",
  },
  formContainer: {
    width: "100%",
    marginTop: 30,
    alignItems: "flex-start",
    verticalAlign: 'middle',
  },
  backText: {
    alignSelf: "flex-start",
    fontSize: 20,
    fontWeight: "bold",
    color: Colors.textPrimary,
    marginBottom: 30,
    fontFamily: Fonts.bold,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
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
    fontSize: 18,
    marginBottom: 5,
    alignSelf: "flex-start",
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
    fontWeight: "bold",
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
  },
  pickerBlack: {
    width: '100%', 
    backgroundColor: Colors.buttonBlack,
    color: Colors.offishWhite,
    fontFamily: Fonts.regular,
  },
  trashIcon: {
    alignSelf: 'flex-end',
    marginTop: 0,
    flexGrow: 0,
  },
});

export default MealPlanScreen;
