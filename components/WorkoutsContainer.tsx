import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, ImageSourcePropType } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import * as ImagePicker from "expo-image-picker";

interface Exercise {
  id: string;
  name: string;
  description: string;
  image: ImageSourcePropType | null;
}

interface Feedback {
  id: string;
  feedback: string;
  rating: number;
  createdAt: Date;
}

interface Workout {
  id: string;
  title: string;
  fitnessGoal: string;
  intensityLevel: string;
  trainer: string;
  exercises: Exercise[];
  visibleTo: string;
  feedbacks: Feedback[];
}
interface WorkoutsContainerProps {
  workouts: Workout[];
  onWorkoutPress: (workout: Workout) => void;
  onTrashPress: (workout: Workout) => void;
}


const WorkoutsContainer: React.FC<WorkoutsContainerProps> = ({ workouts, onWorkoutPress, onTrashPress}) => {
  
  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.planContainer}>
          {workouts.map((workout) => (
            <View key={workout.id}>
              <TouchableOpacity style={styles.workoutItem} onPress={() => onWorkoutPress(workout)}>
              <Image
                source={workout.exercises[0].image ? { uri: workout.exercises[0].image } : require("@/assets/images/icon.png")}
                style={styles.workoutImage}
              />
                <View style={styles.textContainer}>
                  <Text style={styles.workoutTitle}>{workout.title}</Text>
                  <Text style={styles.fitnessGoal}>Fitness Goal:</Text>
                  <Text style={{fontFamily: Fonts.semiboldItalic, marginBottom: 15}}>{workout.fitnessGoal}</Text>
                  <Text style={styles.intensityLevel}>Intensity Level:</Text>
                  <Text style={{fontFamily: Fonts.semiboldItalic}}>{workout.intensityLevel}</Text>
                </View>
                <TouchableOpacity style={styles.trashIcon} onPress={() => onTrashPress(workout)}>
                  <FontAwesome name="trash" size={24} color={Colors.black} />
                </TouchableOpacity>
              </TouchableOpacity>
              <View style={styles.horizontalLine} />
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    padding: 0,
    marginTop: 10,
  },
  horizontalLine: {
    width: "100%", // This makes the line span the entire width
    height: 1, // Adjust the height as needed
    backgroundColor: Colors.black, // Adjust the color as needed
    marginTop: 10,
    marginBottom: 20,
  },
  planContainer: {
    width: "100%",
  },
  workoutItem: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "space-between",
  },
  textContainer: {
    flex: 1,
    marginLeft: 16,
  },
  workoutImage: {
    width: 90,
    height: 90,
    marginRight: 5,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: Colors.black,
  },
  workoutTitle: {
    fontSize: 18,
    fontFamily: Fonts.semibold,
    color: Colors.black,
    marginBottom: 10,
  },
  fitnessGoal: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: Colors.textSecondary
  },
  intensityLevel: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: Colors.textSecondary
  },
  icon: {
    marginBottom: 10,
    alignSelf: "center",
  },
  alertTitle: {
    fontSize: 18,
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
  trashIcon: {
    alignSelf: 'flex-start',
    paddingTop: 5,
    flexGrow: 0,
  },
});

export default WorkoutsContainer;
