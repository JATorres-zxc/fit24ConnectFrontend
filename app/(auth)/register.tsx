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

const RegisterScreen = ({ navigation }: { navigation: NavigationProp<any> }) => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [referralCode, setReferralCode] = useState("");

    const handleRegister = () => {
        // Add your registration logic here, e.g., API call to Django backend
        console.log("Registering with:", { email, password, referralCode });
        // Navigate to another screen after successful registration
        navigation.navigate("index.tsx");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.headerText}>REGISTER</Text>

            <View style={styles.logoContainer}>
                <Image
                    source={{ uri: "assets/images/icon.png" }}
                    style={styles.logo}
                />
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
                    placeholder="Referral Code"
                    style={styles.input}
                    value={referralCode}
                    onChangeText={setReferralCode}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>
                        Register (Connect to Django Backend)
                    </Text>
                </TouchableOpacity>

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
    },
    logoContainer: {
        marginTop: 20,
        backgroundColor: "#fff",
        width: 120,
        height: 120,
        borderRadius: 60,
        justifyContent: "center",
        alignItems: "center",
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