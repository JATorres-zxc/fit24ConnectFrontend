import React from "react";
import { View, Text, StyleSheet, Image, TextInput, TouchableOpacity } from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Exercise {
    name: string;
    description: string;
    image: string;
}

interface ExerciseContainerProps {
    exercises: Exercise[];
}

const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ exercises }) => {

    return (
    <View style={styles.container}>
        {exercises.map((exercise, index) => (
            <View key={index} style={styles.exerciseItem}>
            <Image source={{ uri: exercise.image }} style={styles.image} />
            <View style={styles.textContainer}>
                <Text style={styles.exerciseName}>{exercise.name}</Text>
                <Text style={styles.exerciseDescription}>{exercise.description}</Text>
            </View>
            </View>
        ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    padding: 16
  },
  exerciseItem: {
    flexDirection: 'row',
    marginBottom: 16
  },
  image: {
    width: 90,
    height: 90,
    marginRight: 5,
    borderWidth: 1,
    borderColor: Colors.buttonBlack,
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  exerciseName: {
    fontSize: 18,
    fontFamily: Fonts.bold,
    color: Colors.primary
  },
  exerciseDescription: {
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary
  }
});

export default ExerciseContainer;
