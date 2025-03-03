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

const LoginScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    const sanitizeInput = (input: string) => {
        return input.replace(/[^a-zA-Z0-9@.]/g, '');
    };

    const handleLogin = async () => {
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

        try {
            // Commented out API call for testing
            // const response = await fetch('http://127.0.0.1:8000/api/account/login/', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify({
            //         email: sanitizedEmail,
            //         password: sanitizedPassword,
            //     }),
            // });

            // const result = await response.json();

            // Temporary Success Placeholder
            const temp_response = true;

            if (temp_response) {
                router.push({
                    pathname: '/(tabs)/home',
                    params: { showToast: 'true' }  // Pass parameter to home screen
                });
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Login Failed',
                    text2: 'Invalid username or password.',
                    visibilityTime: 1500,
                    position: 'bottom'
                });
                setError('Invalid username or password.');
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Login Failed',
                text2: 'An error occurred. Please try again.',
                position: 'bottom'
            });
            setError('An error occurred. Please try again.');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.logoContainer}>
                    <Image source={require("./assets/images/icon.png")} style={styles.logo} />
                </View>

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
            </ScrollView>
            <Toast />
        </KeyboardAvoidingView>
    );
};

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.buttonBlack, // Black background
    },
    scrollContainer: {
        flexGrow: 1,
        paddingTop: screenHeight * 0.1 + 50,
        justifyContent: "center",
        alignItems: "center",
    },
    logoContainer: {
        marginBottom: 20,
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
        flex: 1,
        backgroundColor: Colors.background,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingTop: 50,
        paddingBottom: -50,
        paddingHorizontal: 20,
        alignItems: "center",
    },
    input: {
        width: "100%",
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
        backgroundColor: Colors.background2,
        padding: 12,
        borderRadius: 8,
        alignItems: "center",
        marginTop: 20,
    },
    buttonText: {
        fontFamily: Fonts.semibold,
        color: Colors.offishWhite,
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
