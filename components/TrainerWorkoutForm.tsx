import React from "react";
import { 
  Image, View, Text, TextInput, TouchableOpacity, StyleSheet, ImageSourcePropType 
} from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from "expo-image-picker";

interface Exercise {
  id: string | null;
  name: string;
  description: string;
  image: ImageSourcePropType | null; 
}

interface TrainerWorkoutFormProps {
  exercises: Exercise[];
  workoutTitle: string;
  visibleTo: string;
  onChangeWorkoutTitle: (text: string) => void;
  onChangeExercise: (index: number, key: keyof Exercise, value: string | number) => void;
  onDeleteExercise: (index: number) => void;
  onAction: () => void;
  actionLabel: string;
}

const TrainerWorkoutForm: React.FC<TrainerWorkoutFormProps> = ({
  exercises,
  workoutTitle,
  visibleTo,
  onChangeWorkoutTitle,
  onChangeExercise,
  onDeleteExercise,
  onAction,
  actionLabel,
}) => {
  const handlePickImage = async (index: number) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled) {
      onChangeExercise(index, "image", result.assets[0].uri);
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <Text style={styles.headerTitle}>Design Workout Program</Text>
      <Text style={styles.headerSubtitle}>
        Create structured routines to guide your members effectively.
      </Text>
      <Text style={styles.headerSubtitle}>
        Visible to: <Text style={{ fontFamily: Fonts.semiboldItalic }}>{visibleTo}</Text>
      </Text>

      {/* Program Title */}
      <Text style={styles.label}>Program Title</Text>
      <TextInput 
        style={styles.input}
        placeholder="Enter Title for Program"
        placeholderTextColor={Colors.textSecondary}
        value={workoutTitle}
        onChangeText={onChangeWorkoutTitle}
      />
      
      {exercises.map((exercise, index) => (
        <View key={exercise.id || index} style={styles.exerciseItem}>
          <View style={styles.imageContainer}>
            {exercise.image ? (
              <Image source={exercise.image} style={styles.imagePreview} />
            ) : (
              <TouchableOpacity onPress={() => handlePickImage(index)}>
                <Ionicons name="image" size={50} color={Colors.textPrimary} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.exerciseDetails}>
            <TextInput
              style={styles.exerciseTitleInput}
              placeholder={`Exercise ${index + 1}`}
              defaultValue={exercise.name}
              onChangeText={(text) => onChangeExercise(index, 'name', text)}
            />
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.input}
              placeholder={"Enter Description for Exercise"}
              placeholderTextColor={Colors.textSecondary}
              defaultValue={exercise.description}
              onChangeText={(text) => onChangeExercise(index, 'description', text)}
            />
            <TouchableOpacity onPress={() => onDeleteExercise(index)} style={styles.trashIcon}>
              <Ionicons name="trash-outline" size={24} color="red" />
            </TouchableOpacity>
          </View>
        </View>
      ))}
      
      {/* Action Button */}
      <TouchableOpacity style={styles.buttonAction} onPress={onAction}>
        <Text style={styles.buttonText}>{actionLabel}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: Fonts.bold,
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: Fonts.regular,
    marginBottom: 15,
    color: Colors.textSecondary,
  },
  label: {
    fontSize: 16,
    fontFamily: Fonts.semibold,
    marginTop: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10,
  },
  exerciseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 0,
    borderColor: Colors.black,
    borderRadius: 5,
    padding: 15,
    marginVertical: 10,
    backgroundColor: Colors.bg,
  },
  imageContainer: {
    width: 100,
    height: 100,
    backgroundColor: Colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    marginRight: 15,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  exerciseDetails: {
    flex: 1,
  },
  exerciseTitleInput: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    marginBottom: 5,
  },
  trashIcon: {
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  buttonAction: {
    backgroundColor: Colors.offishBlack,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    color: Colors.white,
    fontSize: 15,
    fontFamily: Fonts.semibold,
  },
  horizontalLine: {
    width: "100%", // This makes the line span the entire width
    height: 1, // Adjust the height as needed
    backgroundColor: Colors.black, // Adjust the color as needed
    marginTop: 10,
    marginBottom: 20,
  },
});

export default TrainerWorkoutForm;