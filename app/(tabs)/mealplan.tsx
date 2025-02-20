import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import Header from '@/components/MealPlanHeader';

const MealPlanScreen = () => {
  const [isRequestingMeal, setIsRequestingMeal] = useState(false); // Toggle state
  const [mealPlan, setMealPlan] = useState<MealPlan | null>(null); // State to store meal plan
  const [trainer, setTrainer] = useState(""); // State to store selected trainer
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens
  const [feedback, setFeedback] = useState(""); // State to store feedback
  const [isFeedbackFormVisible, setIsFeedbackFormVisible] = useState(false); // Toggle feedback form visibility
  const [isDeleteAlertVisible, setIsDeleteAlertVisible] = useState(false); // Toggle delete visibility
  const [rating, setRating] = useState(""); // State to store rating

  interface Feedback {
    id: string;
    feedback: string;
    rating: number;
    createdAt: Date;
  }
  
  interface Meal {
    meal: string;
    type: string;
    calories: number;
    description: string;
  }
  
  interface MealPlan {
    meals: Meal[];
    feedbacks: Feedback[];
  }

  useEffect(() => {
    // DELETE if API AVAILABLE.
    // Example meal plan for viewing
    const exampleMealPlan: MealPlan = {
      meals: [
        {
          meal: "Breakfast",
          type: "Oatmeal",
          calories: 300,
          description: "A bowl of oatmeal with fruits and nuts.",
        },
        {
          meal: "Lunch",
          type: "Grilled Chicken Salad",
          calories: 450,
          description: "Grilled chicken breast with mixed greens and vinaigrette.",
        },
        {
          meal: "Dinner",
          type: "Salmon and Quinoa",
          calories: 500,
          description: "Baked salmon with quinoa and steamed vegetables.",
        },
      ],
      feedbacks: [{ id: '1-1', feedback: 'Lami ang hotdog!', rating: 5, createdAt: new Date() }],
    };

    setMealPlan(exampleMealPlan);
  }, []);
  // Sample until here

  // Uncomment meal plan fetch if API is available.

  // useEffect(() => {
  //   // Fetch meal plan from the database if it exists
  //   const fetchMealPlan = async () => {
  //     try {
  //       const response = await fetch('https://api.example.com/getMealPlan');
  //       const data = await response.json();
  //       if (response.ok) {
  //         setMealPlan(data);
  //       } else {
  //         setMealPlan(null);
  //       }
  //     } catch (error) {
  //       console.error('Error fetching meal plan:', error);
  //       setMealPlan(null);
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
      // const response = await fetch('https://api.example.com/submitMealPlanRequest', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     trainer,
      //     fitnessGoal,
      //     weightGoal,
      //     allergens,
      //   }),
      // });

      const temp_response = true;
      // response.ok
      if (temp_response) {
        Toast.show({
          type: 'success',
          text1: 'Request Submitted',
          text2: 'Your meal plan request has been submitted successfully.',
          position: 'bottom'
        });
        setTimeout(() => {
          setIsRequestingMeal(false);
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

    const newFeedback: Feedback = {
      id: `${mealPlan?.meals[0].meal}-${Date.now()}`,
      feedback,
      rating: parseInt(rating),
      createdAt: new Date(),
    };

    const updatedMealPlan: MealPlan = {
      meals: mealPlan?.meals || [],
      feedbacks: [...(mealPlan?.feedbacks || []), newFeedback],
    };

    setMealPlan(updatedMealPlan);

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
        setIsFeedbackFormVisible(false);
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
        setIsDeleteAlertVisible(false)
        // setMealPlan(null); // Clear the meal plan
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
    <View style={styles.container}>
      <Header />

      {isRequestingMeal ? (
      // Request Meal Plan View
      <View style={styles.formContainer}>
        <TouchableOpacity onPress={() => setIsRequestingMeal(false)}>
        <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Request Meal Plan</Text>

        <Picker
        selectedValue={trainer}
        onValueChange={(itemValue) => setTrainer(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Select Trainer" value="" />
        <Picker.Item label="Trainer A" value="trainerA" />
        <Picker.Item label="Trainer B" value="trainerB" />
        <Picker.Item label="Trainer C" value="trainerC" />
        </Picker>

        <Picker
        selectedValue={fitnessGoal}
        onValueChange={(itemValue) => setFitnessGoal(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Select Fitness Goal" value="" />
        <Picker.Item label="Lose Weight" value="loseWeight" />
        <Picker.Item label="Build Muscle" value="buildMuscle" />
        <Picker.Item label="Maintain Weight" value="maintainWeight" />
        </Picker>

        <TextInput
        placeholder="Enter Your Weight Goal (e.g., 70)"
        style={styles.input}
        value={weightGoal}
        onChangeText={(text) => setWeightGoal(text.replace(/[^0-9]/g, ''))}
        keyboardType="numeric"
        />

        <TextInput
        placeholder="Enter Your Allergen/s (comma separated)"
        style={styles.input}
        value={allergens}
        onChangeText={setAllergens}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit Request</Text>
        </TouchableOpacity>
      </View>
      ) : (
      // Nutritional Meal Plan View
      <View style={styles.planContainer}>
        {mealPlan ? (
        <>
          <Text style={styles.subtitle}>Your Meal Plan:</Text>
          {mealPlan.meals.map((meal, index) => (
          <View key={index} style={styles.mealContainer}>
            <View style={styles.mealContent}>
            <Text style={styles.mealTitle}>{meal.meal}</Text>
            <Text>Type of Food: {meal.type}</Text>
            <Text>Calories: {meal.calories}</Text>
            <Text>Description: {meal.description}</Text>
            </View>
          </View>
          ))}
          <TouchableOpacity style={styles.button} onPress={() => setIsRequestingMeal(true)}>
          <Text style={styles.buttonText}>Request New Meal Plan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => setIsFeedbackFormVisible(true)}>
          <Text style={styles.buttonText}>Send Feedback</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.deleteButton]} onPress={() => setIsDeleteAlertVisible(true)}>
          <Text style={styles.buttonText}>Delete Meal Plan</Text>
          </TouchableOpacity>
        </>
        ) : (
        <>
          <Text style={styles.subtitle}>You have no existing meal plan.</Text>
          <TouchableOpacity style={styles.button} onPress={() => setIsRequestingMeal(true)}>
          <Text style={styles.buttonText}>Request Meal Plan</Text>
          </TouchableOpacity>
        </>
        )}
      </View>
      )}

      {isFeedbackFormVisible && (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Submit Feedback</Text>
        <TextInput
        placeholder="Enter your feedback"
        style={styles.input}
        value={feedback}
        onChangeText={setFeedback}
        />
        <Picker
        selectedValue={rating}
        onValueChange={(itemValue) => setRating(itemValue)}
        style={styles.input}
        >
        <Picker.Item label="Select Rating" value="" />
        <Picker.Item label="1 - Poor" value="1" />
        <Picker.Item label="2 - Fair" value="2" />
        <Picker.Item label="3 - Good" value="3" />
        <Picker.Item label="4 - Very Good" value="4" />
        <Picker.Item label="5 - Excellent" value="5" />
        </Picker>
        <TouchableOpacity style={styles.button} onPress={handleFeedbackSubmit}>
        <Text style={styles.buttonText}>Submit Feedback</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsFeedbackFormVisible(false)}>
        <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      )}

      {isDeleteAlertVisible && (
      <View style={styles.feedbackContainer}>
        <Text style={styles.feedbackTitle}>Are you sure you want to delete this meal plan?</Text>
        <TouchableOpacity style={styles.buttonRed} onPress={handleDelete}>
          <Text style={styles.buttonText}>Confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsDeleteAlertVisible(false)}>
          <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
      )}

      <Toast />
    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  logo: {
    width: 100,
    height: 100,
    resizeMode: "contain",
    marginBottom: 20,
  },
  planContainer: {
    alignItems: "center",
  },
  formContainer: {
    width: "100%",
    alignItems: "flex-start",
  },
  backText: {
    alignSelf: "flex-start",
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    alignSelf: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#D4AF37",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonRed: {
    backgroundColor: "#FF6347",
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  mealContainer: {
    marginBottom: 20,
    alignItems: "flex-start",
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    width: "100%",
  },
  mealContent: {
    backgroundColor: "#fff",
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  deleteButton: {
    backgroundColor: "#FF6347", // Red color for delete button
  },
  feedbackContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -100 }],
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
  },
  feedbackTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default MealPlanScreen;