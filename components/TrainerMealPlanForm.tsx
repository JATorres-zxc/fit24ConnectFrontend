import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the trash icon

// Import interface
import { Meal } from "@/types/interface";

interface TrainerMealPlanFormProps {
  meals: Meal[];
  onChangeMeal: (index: number, key: keyof Meal, value: string | number) => void;
  onDeleteMeal: (index: number) => void;  // Ensure this is included
  onAction: () => void;
  actionLabel: string;
}


const TrainerMealPlanForm: React.FC<TrainerMealPlanFormProps> = ({
  meals,
  onChangeMeal,
  onDeleteMeal, // Accept delete function
  onAction,
  actionLabel,
}) => {
  const [inputWidths, setInputWidths] = React.useState<{ [key: number]: number }>({});

  return (
    <>
      {meals.map((meal, index) => (
        <View key={meal.id || index} style={styles.mealItem}>
          {/* Title with Delete Icon */}
          <View style={styles.mealHeader}>
            <TextInput
              style={[styles.mealTitleInput, { width: inputWidths[index] || 50 }]} // Dynamic width
              defaultValue={meal.meal_name || `Meal ${index + 1}`}
              onChangeText={(text) => onChangeMeal(index, 'meal_name', text)}
              onContentSizeChange={(e) => {
                const newWidth = e.nativeEvent.contentSize.width + 10; // Extra padding for better fit
                setInputWidths((prev) => ({ ...prev, [index]: newWidth }));
              }}
            />
          </View>
          
          <TouchableOpacity onPress={() => onDeleteMeal(index)} style={styles.trashIcon}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
          
          <Text style={styles.mealDescription}>Type of Food:</Text>
          <TextInput
            style={styles.mealData}
            defaultValue={meal.meal_type}
            onChangeText={(text) => onChangeMeal(index, 'meal_type', text)}
          />

          <Text style={styles.mealDescription}>Calories:</Text>
          <TextInput
            style={styles.mealData}
            defaultValue={meal.calories?.toString()}
            onChangeText={(text) => onChangeMeal(index, 'calories', parseInt(text) || 0)}
            keyboardType="numeric"
          />

          <Text style={styles.mealDescription}>Protein:</Text>
          <TextInput
            style={styles.mealData}
            defaultValue={meal.protein?.toString()}
            onChangeText={(text) => onChangeMeal(index, 'protein', parseInt(text) || 0)}
            keyboardType="numeric"
          />

          <Text style={styles.mealDescription}>Carbs:</Text>
          <TextInput
            style={styles.mealData}
            defaultValue={meal.carbs?.toString()}
            onChangeText={(text) => onChangeMeal(index, 'carbs', parseInt(text) || 0)}
            keyboardType="numeric"
          />

          <Text style={styles.mealDescription}>Description:</Text>
          <TextInput
            style={styles.mealData}
            defaultValue={meal.description}
            onChangeText={(text) => onChangeMeal(index, 'description', text)}
          />
        </View>
      ))}

      <TouchableOpacity style={styles.buttonAction} onPress={onAction}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </>
  );
};

// Styles
const styles = StyleSheet.create({
  mealItem: {
      borderWidth: 1,
      width: '100%',
      borderColor: Colors.black,
      borderRadius: 0,
      padding: 15,
      marginVertical: 10,
      backgroundColor: Colors.bg,
      marginBottom: 10,
  },
  mealHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  mealTitleInput: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    backgroundColor: Colors.bg,
    paddingLeft: 8,
    paddingRight: 8,
    paddingVertical: 2,
    top: -28,
    position: 'absolute',
    minWidth: 111,
    maxWidth: '90%',
    flexWrap: 'wrap', // Allow text to wrap
    textAlignVertical: 'top', // Align text properly
  },
  mealDescription: {
      fontSize: 16,
      marginBottom: 3,
      color: Colors.textSecondary,
      fontFamily: Fonts.regular,
  },
  mealData: {
      fontSize: 16,
      color: Colors.textPrimary,
      fontFamily: Fonts.bold,
      marginBottom: 10,
      marginTop: 3,
      padding: 5,
      borderWidth: 0.5,
      borderColor: Colors.border,
      borderRadius: 8,
  },
  buttonAction: {
      backgroundColor: Colors.gold,
      paddingVertical: 12,
      paddingHorizontal: 20,
      borderRadius: 10,
      alignItems: "center",
      marginTop: 20,
      width: "70%",
      alignSelf: "center",
  },
  buttonText: {
      color: Colors.white,
      fontSize: 15,
      textAlign: "center",
      fontFamily: Fonts.semibold,
  },
  trashIcon: {
    alignSelf: 'flex-end', // Aligns the trash icon to the right
    marginLeft: 'auto', // Ensures it pushes to the end
  },
});

export default TrainerMealPlanForm;
