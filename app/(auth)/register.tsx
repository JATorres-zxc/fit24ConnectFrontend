import { useRouter } from 'expo-router';
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
import { API_BASE_URL } from '@/constants/ApiConfig';
import { FontAwesome } from '@expo/vector-icons';

const screenHeight = Dimensions.get('window').height;

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmationPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    // State to toggle visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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
                topOffset: 80,
            });
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(sanitizedEmail)) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Invalid email format',
                topOffset: 80,
            });
            return;
        }
        if (!sanitizedPassword) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Password is required',
                topOffset: 80,
            });
            return;
        }
        if (sanitizedPassword.length < 8) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Password must be at least 8 characters',
                topOffset: 80,
            });
            return;
        }
        if (sanitizedPassword !== sanitizedConfirmPassword) {
            Toast.show({
                type: 'error',
                text1: 'Validation Error',
                text2: 'Passwords do not match',
                topOffset: 80,
            });
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/account/register/`, {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: sanitizedEmail,
                    password: sanitizedPassword,
                    confirm_password: sanitizedConfirmPassword,
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
                    topOffset: 80,
                });
                setTimeout(() => {
                    router.push('/(auth)/login');
                }, 2000); // 2-second delay
            } else {
                Toast.show({
                    type: 'error',
                    text1: 'Registration Failed',
                    text2: 'There was an error with your registration.',
                    topOffset: 80,
                });
            }
        } catch (error) {
            Toast.show({
                type: 'error',
                text1: 'Registration Failed',
                text2: 'An error occurred. Please try again.',
                topOffset: 80,
            });
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.logoContainer}>
                <Image source={require("@/assets/images/icon.png")} style={styles.logo} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Email"
                        placeholderTextColor={Colors.textSecondary}
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={Colors.textSecondary}
                            style={styles.passwordInput}
                            secureTextEntry={!showPassword}
                            value={password}
                            onChangeText={setPassword}
                        />
                    
                        <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.icon}>
                            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color={Colors.eyeIcon} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            placeholder="Password"
                            placeholderTextColor={Colors.textSecondary}
                            style={styles.passwordInput}
                            secureTextEntry={!showConfirmPassword}
                            value={confirmPassword}
                            onChangeText={setConfirmationPassword}
                        />
                    
                        <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.icon}>
                            <FontAwesome name={showPassword ? "eye" : "eye-slash"} size={20} color={Colors.eyeIcon} />
                        </TouchableOpacity>
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
        marginTop: 100,
        justifyContent: "center",
        alignItems: "center",
    },
    logo: {
        width: 250,
        height: 250,
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
    passwordContainer: {
        width: "85%",
        flexDirection: 'row',
        alignItems: 'center',
    },
    passwordInput: {
        width: "100%",
        marginBottom: 10,
        borderColor: Colors.border,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 12,
        paddingVertical: 10,
        marginVertical: 5,
        fontFamily: Fonts.regular,
    },
    icon: {
        position: 'absolute',
        right: 5,
        padding: 10,
        paddingTop: 5,
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
        marginTop: 20,
        color: Colors.linkText,
        fontFamily: Fonts.italic,
        fontSize: 12,
    },
    linkText: {
        color: Colors.linkText,
        fontFamily: Fonts.semiboldItalic,
    },
});
