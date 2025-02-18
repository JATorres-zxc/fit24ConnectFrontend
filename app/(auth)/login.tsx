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
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import { Fonts } from '@/constants/Fonts';

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const sanitizeInput = (input: string) => {
        return input.replace(/[^a-zA-Z0-9@.]/g, '');
    };

    const handleLogin = () => {
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);

        // Validate input fields
        if (!sanitizedEmail) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Email is required',
                position: 'bottom'
            });
            return;
        }
        if (!sanitizedPassword) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Password is required',
                position: 'bottom'
            });
            return;
        }

        // Placeholder for API login logic
        // TODO: Replace with actual backend call
        const isSuccess = true; // Replace with actual login success condition

        if (isSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Login Successful',
                text2: 'You have successfully logged in.',
                position: 'bottom'
            });
            setTimeout(() => {
                router.push('/(tabs)/home');
            }, 2000); // 2-second delay
        } else {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'Invalid username or password.',
                position: 'bottom'
            });
            setError('Invalid username or password.');
        }
    };

    return (
        <View style={styles.container}>
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
                    onPress={handleLogin}
                >
                    <Text style={styles.buttonText}>
                        Log In
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

            {/* Top Section (Black Background) */}
            <Text style={styles.headerText}>LOGIN</Text>

            <View style={styles.logoContainer}>
                {/* Replace with your Fit24 logo */}
                <Image source={require("./assets/images/icon.png")} style={styles.logo} />
            </View>

            <Toast />
        </View>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000", // Black background
        alignItems: "center",
        paddingTop: 60,
        // We won't use justifyContent: center here,
        // because we want space at the top for the title & logo.
    },
    headerText: {
        color: "#fff",
        fontSize: 24,
        fontFamily: Fonts.semibold,
        marginTop: 60,
    },
    logoContainer: {
        marginTop: 20,
        backgroundColor: "transparent",
        width: 150,
        height: 150,
        borderRadius: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
    formContainer: {
        // Position absolutely at the bottom
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,

        // White background with curved top corners
        backgroundColor: "#f9f9f9",
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,

        // Provide enough vertical space for form fields
        height: 450, // Adjust to taste
        paddingTop: 50,

        // Align items to center if you want narrower inputs
        alignItems: "center",
    },
    input: {
        width: "80%", 
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 5,
        fontFamily: Fonts.regular,
    },
    button: {
        width: "30%",
        backgroundColor: "#d7be69", 
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 50,
    },
    buttonText: {
        fontFamily: Fonts.semibold,
        color: "#fffefe"
    },
    orText: {
        textAlign: "center",
        marginVertical: 10,
        fontFamily: Fonts.semibold,
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
        color: "#8f8f8f",
        fontFamily: Fonts.italic,
        fontSize: 12,
    },
    linkText: {
        color: "#8f8f8f",
        fontFamily: Fonts.semiboldItalic,
    },
});