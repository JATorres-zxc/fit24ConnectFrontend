import React from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import MealPlanScreen from "./mealplan"; // Import your screen

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <MealPlanScreen />
      <Toast /> {/* Global Toast Component */}
    </View>
  );
}
