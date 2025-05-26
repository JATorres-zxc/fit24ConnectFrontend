import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

// Import interfaces
import { Meal2 as Meal, MealPlan2 as MealPlan } from "@/types/interface";

interface MemberMealPlanProps {
    mealPlan: MealPlan;
    requesteeName: string;  // Add this prop
    onEditPress: () => void;
}

const MemberMealPlan: React.FC<MemberMealPlanProps> = ({ mealPlan, requesteeName, onEditPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('@/assets/images/darkicon.png')} style={styles.image} />
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{requesteeName}'s Meal Plan</Text>
                    <Text style={styles.subtitle}>Working on:</Text>
                    <Text style={styles.fitnessGoal}>{mealPlan.fitness_goal}</Text>
                </View>
                <TouchableOpacity style={styles.editIcon} onPress={onEditPress}>
                    <FontAwesome name="pencil" size={24} color={Colors.black} />
                </TouchableOpacity>
            </View>
            <View style={styles.horizontalLine} />
            {/* <View style={styles.mealContainer}>
                {mealPlan.meals.map((meal) => (
                    <View key={meal.id} style={styles.mealItem}>
                        <Text style={styles.mealName}>{meal.meal_name}</Text>
                        <Text style={styles.mealDescription}>{meal.description}</Text>
                    </View>
                ))}
            </View> */}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: Colors.bg,
        padding: 10,
        marginTop: 5,
    },
    editIcon: {
        alignSelf: 'flex-start',
        justifyContent: 'flex-end',
        marginTop: 5,
        marginLeft: 20,
        marginBottom: 10,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    horizontalLine: {
        width: "100%", // This makes the line span the entire width
        height: 1, // Adjust the height as needed
        backgroundColor: Colors.black, // Adjust the color as needed
        marginTop: 10,
        marginBottom: 20,
    },
    image: {
        width: 90,
        height: 90,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: Colors.border,
        marginRight: 16,
    },
    textContainer: {
        flex: 1,
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.semibold,
        color: Colors.black,
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        fontFamily: Fonts.italic,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    fitnessGoal: {
        fontSize: 14,
        fontFamily: Fonts.semiboldItalic,
        color: Colors.black,
    },
    mealContainer: {
        marginTop: 20,
    },
    mealItem: {
        padding: 16,
        backgroundColor: Colors.bg,
        borderWidth: 1,
        borderColor: Colors.black,
        borderRadius: 10,
        marginBottom: 10,
    },
    mealName: {
        fontSize: 16,
        fontFamily: Fonts.semibold,
        color: Colors.black,
        marginBottom: 5,
    },
    mealDescription: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.textSecondary,
    },
});

export default MemberMealPlan;