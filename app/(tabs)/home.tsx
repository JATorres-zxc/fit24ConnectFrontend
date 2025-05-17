import { Text, View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

import { Colors } from '@/constants/Colors';
import { Fonts } from "@/constants/Fonts";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  // Load name from params or AsyncStorage
  useEffect(() => {
    const handleName = async () => {
      if (params.full_name && typeof params.full_name === "string") {
        await AsyncStorage.setItem("full_name", params.full_name);
        setFirstName(params.full_name.split(" ")[0]);
      } else {
        const storedName = await AsyncStorage.getItem("full_name");
        if (storedName) {
          setFirstName(storedName.split(" ")[0]);
        }
      }
    };

    handleName();
  }, [params.full_name]);

  // Show toast after login
  useEffect(() => {
    if (params.showToast === "true" && params.full_name) {
      Toast.show({
        type: "success",
        text1: "Login Success!",
        text2: `Logged in as ${params.full_name}`,
        visibilityTime: 1500
      });
    }
  }, [params.showToast, params.full_name]);

  // Profile verification
  useEffect(() => {
    const checkProfileCompletion = async () => {
      try {
        const profileData = await AsyncStorage.getItem("profile");
        if (profileData) {
          const profile = JSON.parse(profileData);

          // Fields that must not be null or empty (excluding some fields)
          const requiredFields = [
            "email",
            "full_name",
            "contact_number",
            "complete_address",
            "height",
            "weight",
            "age",
            "type_of_membership",
            "membership_status",
          ];

          const missingFields = requiredFields.filter(
            (field) => !profile[field] || profile[field] === ""
          );

          if (missingFields.length > 0) {
          Toast.show({
            type: "error",
            text1: "Profile Incomplete",
            text2: "Please complete all profile details before proceeding.",
            position: "bottom",
            visibilityTime: 5000, // Show the toast for 5 seconds
          });

          // Delay the redirection by 5 seconds
          setTimeout(() => {
            router.push({
              pathname: '/profile',
              params: { showToast: 'true' },
            });
          }, 2500); // 2.5-second delay
        }
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
    }
  };

    checkProfileCompletion();
  }, []);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const API_BASE_URL =
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000'
            : 'http://192.168.1.5:8000';

        const token = await AsyncStorage.getItem("authToken");
        const response = await fetch(`${API_BASE_URL}/api/announcement/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        Toast.show({
          type: "error",
          text1: "Failed to load announcements",
          text2: "Please try again later",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  return (
    <View style={styles.container}>
      <Header name={firstName} />

      <View style={styles.announcementsContainer}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading announcements...</Text>
          </View>
        ) : (
          <AnnouncementsContainer announcements={announcements} />
        )}
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
  },
  announcementsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontFamily: Fonts.regular,
  },
});
