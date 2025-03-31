import { Link, useRouter } from 'expo-router';
import React, { useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Image,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { Dimensions } from 'react-native'

const screenHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmationPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [is_trainer, setIsTrainer] = useState(false); // Add state for is_trainer

    const sanitizeInput = (input: string) => {
        return input.replace(/[^a-zA-Z0-9@.]/g, '');
    };

    const handleRegister = async () => {
        // Sanitize inputs
        const sanitizedEmail = sanitizeInput(email);
        const sanitizedPassword = sanitizeInput(password);
        const sanitizedConfirmPassword = sanitizeInput(confirmPassword);

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
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Invalid email format',
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
        if (sanitizedPassword.length < 6) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Password must be at least 6 characters',
                position: 'bottom'
            });
            return;
        }
        if (sanitizedPassword !== sanitizedConfirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Passwords do not match',
                position: 'bottom'
            });
            return;
        }

        try {
            // Perform the API login call
            const API_BASE_URL =
                Platform.OS === 'web'
                ? 'http://127.0.0.1:8000' // Web uses localhost
                : 'http://172.16.6.198:8000'; // Mobile uses local network IP

            // Commented out API call for testing
            const response = await fetch(`${API_BASE_URL}/api/account/register/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: sanitizedEmail,
                    password: sanitizedPassword,
                    confirm_password: sanitizedConfirmPassword,
                    is_trainer: is_trainer,
                }),
            });

            const result = await response.json();

            // Temporary Success Placeholder
            // const temp_response = true;

            if (result.success) {
                Toast.show({
                    type: 'success',
                    text1: 'Registration Successful',
                    text2: 'You have successfully registered.',
                    position: 'bottom'
                });
                setTimeout(() => {
                    router.push('/(auth)/login');
                }, 2000); // 2-second delay
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: 'There was an error with your registration.',
                    position: 'bottom'
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: 'An error occurred. Please try again.',
                position: 'bottom'
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.logoContainer}>
                <Image source={require("./assets/images/icon.png")} style={styles.logo} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
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

                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                        <TouchableOpacity
                            onPress={() => setIsTrainer(!is_trainer)}
                            style={{
                                width: 20,
                                height: 20,
                                borderRadius: 4,
                                borderWidth: 1,
                                borderColor: Colors.border,
                                backgroundColor: is_trainer ? Colors.gold : "transparent",
                                marginRight: 10,
                            }}
                        />
                        <Text style={{ fontFamily: Fonts.regular, color: Colors.linkText }}>
                            Register as Trainer
                        </Text>
                    </View>

                    <TouchableOpacity style={styles.button} onPress={handleRegister}>
                        <Text style={styles.buttonText}>
                            Register
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
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.black, // Black background
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: screenHeight * 0.1,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        marginTop: 150,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 200,
        height: 200,
        resizeMode: "contain",
    },
    formContainer: {
        width: "100%",
        flexGrow: 1,
        backgroundColor: Colors.bg,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingTop: 50,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    input: {
        width: "85%",
        marginBottom: 10,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 5,
        fontFamily: Fonts.regular,
    },
    button: {
        width: "30%",
        backgroundColor: Colors.gold,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        fontFamily: Fonts.semibold,
        color: Colors.offishWhite,
    },
    errorText: {
        color: "red",
        marginTop: 10,
    },
    bottomText: {
        textAlign: "center",
        marginTop: 10,
        color: Colors.linkText,
        fontFamily: Fonts.italic,
        fontSize: 12,
    },
    linkText: {
        color: Colors.linkText,
        fontFamily: Fonts.semiboldItalic,
    },
});
