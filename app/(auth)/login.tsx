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

const screenHeight = Dimensions.get('window').height;

// Define a type for user routes
type UserRoute = 
    | '/(admin)/home' 
    | '/(tabs)/home' 
    | '/(trainer)/home';

// Predefined user credentials with typed routes
interface PredefinedUser {
    email: string;
    password: string;
    route: UserRoute;
}

const PREDEFINED_USERS: Record<string, PredefinedUser> = {
    admin: {
        email: 'admin@gym.com',
        password: 'admin123',
        route: '/(admin)/home'
    },
    member: {
        email: 'member@gym.com',
        password: 'member123',
        route: '/(tabs)/home'
    },
    trainer: {
        email: 'trainer@gym.com',
        password: 'trainer123',
        route: '/(trainer)/home'
    }
};

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
            // Check against predefined users
            const matchedUser = Object.values(PREDEFINED_USERS).find(
                user => user.email === sanitizedEmail && user.password === sanitizedPassword
            );

            if (matchedUser) {
                // Successful login - route to appropriate dashboard
                router.replace(matchedUser.route);
                
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: `Logged in as ${sanitizedEmail}`,
                    position: 'bottom'
                });
            } else {
                // If not a predefined user, route to member side
                router.replace('/(tabs)/home');
                
                Toast.show({
                    type: 'success',
                    text1: 'Login Successful',
                    text2: 'Logged in as Member',
                    position: 'bottom'
                });
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
            <View style={styles.logoContainer}>
                <Image source={require("./assets/images/icon.png")} style={styles.logo} />
            </View>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <View style={styles.formContainer}>
                    <TextInput
                        placeholder="Username/Email"
                        placeholderTextColor={Colors.textSecondary}
                        style={styles.input}
                        value={email}
                        onChangeText={setEmail}
                    />

                    <TextInput
                        placeholder="Password"
                        placeholderTextColor={Colors.textSecondary}
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

// ... styles remain the same as in the previous example

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
        flex: 1,
        backgroundColor: Colors.bg,
        borderTopLeftRadius: 35,
        borderTopRightRadius: 35,
        paddingTop: 50,
        paddingBottom: -50,
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