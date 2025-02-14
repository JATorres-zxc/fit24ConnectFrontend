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

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmationPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const sanitizeInput = (input: string) => {
        return input.replace(/[^a-zA-Z0-9@.]/g, '');
    };

    const handleRegister = () => {
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);
        const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

        // Validate input fields
        if (!sanitizedEmail) {
            Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Email is required'
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Invalid email format'
            });
            return;
        }
        if (!sanitizedPassword) {
            Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Password is required'
            });
            return;
        }
        if (sanitizedPassword.length < 6) {
            Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Password must be at least 6 characters'
            });
            return;
        }
        if (sanitizedPassword !== sanitizedConfirmPassword) {
            Toast.show({
            type: 'error',
            text1: 'Validation Error',
            text2: 'Passwords do not match'
            });
            return;
        }

        // Placeholder for registration success condition
        const isSuccess = true; // Replace with actual registration success condition

        if (isSuccess) {
            Toast.show({
                type: 'success',
                text1: 'Registration Successful',
                text2: 'You have successfully registered.'
            });
            setTimeout(() => {
                router.push('/(auth)/login');
            }, 2000); // 2-second delay
        } else {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: 'There was an error with your registration.'
            });
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>REGISTER</Text>

            <View style={styles.logoContainer}>
                <Image source={require("./assets/images/icon.png")} style={styles.logo} />
            </View>

            <View style={styles.formContainer}>
                <TextInput
                    placeholder="Email"
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
                <TextInput
                    placeholder="Confirm Password"
                    style={styles.input}
                    secureTextEntry
                    value={confirmPassword}
                    onChangeText={setConfirmationPassword}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>
                        Register (Connect to Django Backend)
                    </Text>
                </TouchableOpacity>
                {error && <Text style={styles.errorText}>{error}</Text>}

                <Text style={styles.bottomText}>
                    Already have an account?{" "}
                    <Text
                        style={styles.linkText}
                        onPress={() => router.push('/(auth)/login')}
                    >
                        Log In
                    </Text>
                </Text>
            </View>
            <Toast />
        </View>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000",
        alignItems: "center",
        paddingTop: 60,
    },
    headerText: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginTop: 60,
    },
    logoContainer: {
        flex: 1,
        backgroundColor: "#000", // Black background
        alignItems: "center",
        paddingTop: 15
    },
    logo: {
        width: 180,
        height: 180,
        resizeMode: "contain",
    },
    formContainer: {
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#fff",
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        minHeight: "55%",
        padding: 20,
        alignItems: "center",
    },
    input: {
        width: "90%",
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginBottom: 12,
    },
    button: {
        width: "90%",
        backgroundColor: "#FFD700",
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 10,
    },
    buttonText: {
        fontWeight: "bold",
    },
    errorText: {
        color: "red",
        marginTop: 10,
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