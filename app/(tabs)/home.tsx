import { Text, View, StyleSheet, Platform } from "react-native";
import { useEffect, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

import { announcements } from "@/context/announcements";
import { Colors } from '@/constants/Colors';
import { Fonts } from "@/constants/Fonts";

export default function Home() {
  const params = useLocalSearchParams();
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch announcements when component mounts
    const fetchAnnouncements = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000' // Web uses localhost
            : 'http://172.16.15.51:8000'; // Mobile uses local network IP (adjust as needed)

        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/announcement/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
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

  useEffect(() => {
    if (params.showToast === "true") {
      Toast.show({
        type: "success",
        text1: "Login Successful",
        text2: "Welcome to the Home Page!",
        visibilityTime: 1500
      });
    }
  }, [params.showToast]);

  return (
    <View style={styles.container}>
      <Header name="Jilliane" />

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
