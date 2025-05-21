import React from "react";
import { View, Text, StyleSheet, Image, ImageSourcePropType } from "react-native";
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

// Import interface
import { Exercise } from "@/types/interface";

interface ExerciseContainerProps {
    exercises: Exercise[];
}

const ExerciseContainer: React.FC<ExerciseContainerProps> = ({ exercises }) => {

    return (
        <View style={styles.container}>
            {exercises.map((exercise, index) => (
                <View key={exercise.id}>
                  <View key={index} style={[styles.exerciseItem, index % 2 === 0 ? styles.exerciseItemLeft : styles.exerciseItemRight]}>
                  <Image
                    source={exercise.image ? { uri: exercise.image } : require('@/assets/images/darkicon.png')}
                    style={styles.image}
                />
                      <View style={styles.textContainer}>
                          <Text style={styles.exerciseName}>{exercise.name}</Text>
                          <Text style={styles.exerciseDescription}>{exercise.description}</Text>
                      </View>
                  </View>
                  <View style={styles.horizontalLine} />
                </View>
            ))}
        </View>
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
      width: "100%",
      height: 1,
      backgroundColor: Colors.black,
      marginTop: 10,
      marginBottom: 35,
    },
    exerciseItem: {
        flexDirection: 'row',
        marginBottom: 16
    },
    exerciseItemLeft: {
        flexDirection: 'row-reverse'
    },
    exerciseItemRight: {
        flexDirection: 'row'
    },
    image: {
        width: 90,
        height: 90,
        marginRight: 15,
        borderWidth: 1,
        borderRadius: 12,
        borderColor: Colors.black,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center'
    },
    exerciseName: {
        fontSize: 18,
        fontFamily: Fonts.bold,
        color: Colors.gold
    },
    exerciseDescription: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.textSecondary
    }
});

export default ExerciseContainer;
