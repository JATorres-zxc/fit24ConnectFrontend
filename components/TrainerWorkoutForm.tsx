import React from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the trash icon

interface Exercise {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface TrainerWorkoutFormProps {
  exercises: Exercise[];
  onChangeExercise: (index: number, key: keyof Exercise, value: string | number) => void;
  onDeleteExercise: (index: number) => void;  // Ensure this is included
  onAction: () => void;
  actionLabel: string;
}


const TrainerMealPlanForm: React.FC<TrainerWorkoutFormProps> = ({
  exercises,
  onChangeExercise,
  onDeleteExercise, // Accept delete function
  onAction,
  actionLabel,
}) => {
  const [inputWidths, setInputWidths] = React.useState<{ [key: number]: number }>({});

  return (
    <>
      {exercises.map((exercise, index) => (
        <View key={exercise.id || index} style={styles.exerciseItem}>
          {/* Title with Delete Icon */}
          <View style={styles.exerciseHeader}>
            <TextInput
              style={[styles.exerciseTitleInput, { width: inputWidths[index] || 50 }]} // Dynamic width
              defaultValue={exercise.name || `Exercise ${index + 1}`}
              onChangeText={(text) => onChangeExercise(index, 'name', text)}
              onContentSizeChange={(e) => {
                const newWidth = e.nativeEvent.contentSize.width + 10; // Extra padding for better fit
                setInputWidths((prev) => ({ ...prev, [index]: newWidth }));
              }}
            />
          </View>
          
          <TouchableOpacity onPress={() => onDeleteExercise(index)} style={styles.trashIcon}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
          
          <Text style={styles.exerciseDescription}>Name of Exercise:</Text>
          <TextInput
            style={styles.exerciseData}
            defaultValue={exercise.name}
            onChangeText={(text) => onChangeExercise(index, 'name', text)}
          />

          <Text style={styles.exerciseDescription}>Description:</Text>
          <TextInput
            style={styles.exerciseData}
            defaultValue={exercise.description}
            onChangeText={(text) => onChangeExercise(index, 'description', text)}
          />

          <Text style={styles.exerciseDescription}>Image:</Text>
          <TextInput
            style={styles.exerciseData}
            defaultValue={exercise.image}
            onChangeText={(text) => onChangeExercise(index, 'image', text)}
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
  exerciseItem: {
      borderWidth: 1,
      width: '100%',
      borderColor: Colors.black,
      borderRadius: 0,
      padding: 15,
      marginVertical: 10,
      backgroundColor: Colors.bg,
      marginBottom: 10,
  },
  exerciseHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 10,
  },
  exerciseTitleInput: {
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
  exerciseDescription: {
      fontSize: 16,
      marginBottom: 3,
      color: Colors.textSecondary,
      fontFamily: Fonts.regular,
  },
  exerciseData: {
      fontSize: 16,
      color: Colors.textPrimary,
      fontFamily: Fonts.bold,
      marginBottom: 10,
      paddingLeft: 5,
      paddingRight: 5,
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
