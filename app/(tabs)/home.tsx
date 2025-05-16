import { Text, View, StyleSheet, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

import { Colors } from '@/constants/Colors';
import { Fonts } from "@/constants/Fonts";


// Define the interface for the announcement object
interface Announcement {
  id: string;
  title: string;
  content: string;
  updated_at: string;
}

export default function Home() {
  const params = useLocalSearchParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  // Load name from params or AsyncStorage
  useEffect(() => {
    const handleName = async () => {
      if (params.full_name && typeof params.full_name === "string") {
        // Store and set immediately
        await AsyncStorage.setItem("full_name", params.full_name);
        setFirstName(params.full_name.split(" ")[0]);
      } else {
        // Fallback to AsyncStorage
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

    // Fetch announcements when component mounts
    const fetchAnnouncements = async () => {
      try {
        const API_BASE_URL = 
          Platform.OS === 'web'
            ? 'http://127.0.0.1:8000' // Web uses localhost
            : 'http://192.168.1.5:8000'; // Mobile uses local network IP (adjust as needed)

        const token = await AsyncStorage.getItem('authToken');
        const response = await fetch(`${API_BASE_URL}/api/announcement/`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch announcements');
        }
        
        const data = await response.json();

        // Sort announcements by updated_at date (most recent first)
        const sortedAnnouncements: Announcement[] = [...data].sort((a, b) => {
          const dateA = new Date(a.updated_at).getTime();
          const dateB = new Date(b.updated_at).getTime();
          return dateB - dateA;
        });

        setAnnouncements(sortedAnnouncements);
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

  // Fetch announcements when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
    }, [])
  );

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
