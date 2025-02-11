import { Link, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    Platform,
} from "react-native";

import { NavigationProp } from '@react-navigation/native';

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            {/* Top Section (Black Background) */}
            <Text style={styles.headerText}>LOGIN</Text>

            <View style={styles.logoContainer}>
                {/* Replace with your Fit24 logo */}
                <Image
                    source={{ uri: "assets/images/icon.png" }}
                    style={styles.logo}
                />
            </View>

            {/* White Card at the Bottom with Curved Top Corners */}
            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Username/Email"
                    style={styles.input}
                    value={email}
                    onChangeText={setEmail}
                />

                <TextInput
                    placeholder="Password"
                    style={styles.input}
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                <TouchableOpacity
                    style={styles.button}
                    onPress={() => {
                        // Placeholder for API login logic
                        // TODO: Identify user type (customer, trainer, admin)
                        
                        router.push('/(tabs)/home');

                        // IF member:
                        // router.push(isMember ? '/(tabs)/home' : isTrainer ? '/(trainer)/home' : '/(admin)/home');
                        // IF trainer:
                        // router.push('/(trainer)/home');
                        // IF admin:
                        // router.push('/(admin)/home');
                    }}
                >
                    <Text style={styles.buttonText}>
                        Log In (Connect to Django Backend)
                    </Text>
                </TouchableOpacity>
                {error && <Text style={styles.errorText}>{error}</Text>}

                <Text style={styles.orText}>OR</Text>

                <Text style={styles.bottomText}>
                    Don&apos;t have an account?{" "}
                    <Text
                        style={styles.linkText}
                        onPress={() => router.push('/(auth)/register')}
                    >
                        Sign Up
                    </Text>
                </Text>
            </View>
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Black background
        alignItems: "center",
        // We won't use justifyContent: center here,
        // because we want space at the top for the title & logo.
    },
    headerText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 60,
    },
    logoContainer: {
        marginTop: 20,
        backgroundColor: "#fff",
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
        // You can add a shadow for iOS / elevation for Android if desired
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
            },
            android: {
                elevation: 5,
            },
        }),
    },
    logo: {
        width: 80,
        height: 80,
        resizeMode: "contain",
    },
    formContainer: {
        // Position absolutely at the bottom
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        // White background with curved top corners
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,

        // Provide enough vertical space for form fields
        minHeight: "55%", // Adjust to taste
        padding: 20,

        // Align items to center if you want narrower inputs
        alignItems: "center",
    },
    input: {
        width: "90%", // Make the input take up most of the card width
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    button: {
        width: "90%",
        backgroundColor: "#FFD700", // Gold
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontWeight: "bold",
    },
    orText: {
        textAlign: "center",
        marginVertical: 10,
        color: "#666",
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
    socialContainer: {
        flexDirection: "row",
        justifyContent: "center",
    },
    iconButton: {
        marginHorizontal: 10,
    },
    socialIcon: {
        width: 40,
        height: 40,
    },
    bottomText: {
        textAlign: "center",
        marginTop: 10,
        color: "#666",
    },
    linkText: {
        color: "#1E90FF",
        fontWeight: "600",
    },
});