import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Toast from 'react-native-toast-message';
import Header from '@/components/MealPlanHeader';

const MealPlanScreen = () => {
  const [isRequestingMeal, setIsRequestingMeal] = useState(false); // Toggle state

  const handleSubmit = () => {
    // Placeholder for meal plan request success condition
    const isSuccess = true; // Replace with actual success condition
    if (isSuccess) {
      Toast.show({
        type: 'success',
        text1: 'Request Submitted',
        text2: 'Your meal plan request has been submitted successfully.'
      });
      setTimeout(() => {
        setIsRequestingMeal(false);
      }, 2000); // 2-second delay
    } else {
      Toast.show({
        type: 'error',
        text1: 'Request Failed',
        text2: 'There was an error with your meal plan request.'
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

          <Picker style={styles.input}>
            <Picker.Item label="Trainer" value="trainer" />
            <Picker.Item label="Trainer A" value="trainerA" />
            <Picker.Item label="Trainer B" value="trainerB" />
          </Picker>

          <TextInput placeholder="Enter Your Fitness Goal" style={styles.input} />
          <TextInput placeholder="Enter Your Weight Goal" style={styles.input} />
          <TextInput placeholder="Enter Your Allergen/s" style={styles.input} />

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
              <Text style={styles.buttonText}>Submit Request</Text>
          </TouchableOpacity>
        </View>
      ) : (
        // Nutritional Meal Plan View
        <View style={styles.planContainer}>
          <Text style={styles.subtitle}>You have no existing meal plan.</Text>

          <TouchableOpacity style={styles.button} onPress={() => setIsRequestingMeal(true)}>
            <Text style={styles.buttonText}>Request Meal Plan</Text>
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
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default MealPlanScreen;
