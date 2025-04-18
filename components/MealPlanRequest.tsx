import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';

interface MealPlanRequestProps {
    memberName: string;
    fitnessGoal: string;
    weightGoal: string;
    allergens: string;
    height: string;
    weight: string;
    age: string;
    onEditPress: () => void;
    setViewState: (viewState: string) => void;
}

const MealPlanRequest: React.FC<MealPlanRequestProps> = ({ memberName, fitnessGoal, weightGoal, allergens, height, weight, age, onEditPress, setViewState }) => {
    return (
        <ScrollView>
            <View style={styles.container}>
                <View style={styles.requestContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.title}>Requested by: {memberName}</Text>
                        <TouchableOpacity onPress={onEditPress}>
                            <FontAwesome name="edit" size={24} color={Colors.black} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.infoContainer}>
                        <View style={styles.column}>
                            <Text style={styles.infoTitle}>Fitness Goal:</Text>
                            <Text style={styles.infoText}>{fitnessGoal}</Text>
                            <Text style={styles.infoTitle}>Weight Goal:</Text>
                            <Text style={styles.infoText}>{weightGoal}</Text>
                            <Text style={styles.infoTitle}>Allergen/s:</Text>
                            <Text style={styles.infoText}>{allergens}</Text>
                        </View>
                        <View style={styles.column}>
                            <Text style={styles.infoTitle}>Height:</Text>
                            <Text style={styles.infoText}>{height}</Text>
                            <Text style={styles.infoTitle}>Weight:</Text>
                            <Text style={styles.infoText}>{weight}</Text>
                            <Text style={styles.infoTitle}>Age:</Text>
                            <Text style={styles.infoText}>{age}</Text>
                        </View>
                    </View>
                    <View style={styles.horizontalLine} />
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
    requestContainer: {
        width: "100%",
        padding: 16,
        backgroundColor: Colors.bg,
    },
    headerContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 10,
    },
    title: {
        fontSize: 18,
        fontFamily: Fonts.semibold,
        color: Colors.black,
    },
    infoContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    column: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontFamily: Fonts.italic,
        color: Colors.textSecondary,
        marginBottom: 5,
    },
    infoText: {
        fontSize: 14,
        fontFamily: Fonts.regular,
        color: Colors.black,
        marginBottom: 15,
    },
    horizontalLine: {
        width: "100%",
        height: 1,
        backgroundColor: Colors.black,
        marginTop: 10,
        marginBottom: 20,
    },
});

export default MealPlanRequest;