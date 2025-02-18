import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import Header from '@/components/MealPlanHeader';

const MealPlanScreen = () => {
  const [isRequestingMeal, setIsRequestingMeal] = useState(false); // Toggle state
  const [mealPlan, setMealPlan] = useState(null); // State to store meal plan
  const [trainer, setTrainer] = useState(""); // State to store selected trainer
  const [fitnessGoal, setFitnessGoal] = useState(""); // State to store fitness goal
  const [weightGoal, setWeightGoal] = useState(""); // State to store weight goal
  const [allergens, setAllergens] = useState(""); // State to store allergens

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
      // Replace with actual API call
      const response = await fetch('https://api.example.com/submitMealPlan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          trainer,
          fitnessGoal,
          weightGoal,
          allergens,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Toast.show({
          type: 'success',
          text1: 'Request Submitted',
          text2: 'Your meal plan request has been submitted successfully.',
          position: 'bottom' // Add this line to show toast at the top
        });
        setTimeout(() => {
          setIsRequestingMeal(false);
          setMealPlan(result); // Update meal plan with the new data
        }, 2000); // 2-second delay
      } else {
        Toast.show({
          type: 'error',
          text1: 'Request Failed',
          text2: 'There was an error with your meal plan request.',
          position: 'bottom' // Add this line to show toast at the top
        });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: 'There was an error with your meal plan request.',
        position: 'bottom' // Add this line to show toast at the top
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
              <Text>{"Member Details HERE."}</Text>
              <TouchableOpacity style={styles.button} onPress={() => setIsRequestingMeal(true)}>
                <Text style={styles.buttonText}>Request New Meal Plan</Text>
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MealPlanScreen;
