import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface Meal {
    id: string;
    mealplan: string;
    meal_name: string;
    description: string;
    meal_type: string;
    calories: number;
    protein: number;
    carbs: number;
}

interface MealPlan {
    mealplan_id: string;
    meals: Meal[];
    member_id: string;
    trainer_id: string;
    mealplan_name: string;
    fitness_goal: string;
    calorie_intake: number;
    protein: number;
    carbs: number;
    weight_goal: number;
    allergens: string;
    instructions: string;
}

interface MemberMealPlanProps {
    mealPlan: MealPlan;
    requesteeName: string;  // Add this prop
    onEditPress: () => void;
}

const MemberMealPlan: React.FC<MemberMealPlanProps> = ({ mealPlan, requesteeName, onEditPress }) => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Image source={require('@/assets/images/icon.png')} style={styles.image} />
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
        flex: 1,
        backgroundColor: Colors.bg,
        padding: 16,
        marginTop: 15,
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