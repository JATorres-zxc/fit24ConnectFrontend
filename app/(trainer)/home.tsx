import { Text, View, StyleSheet, Platform } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { saveItem, getItem } from '@/utils/storageUtils';

import Header from "@/components/TrainerHomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

import { Colors } from '@/constants/Colors';
import { Fonts } from "@/constants/Fonts";
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the announcement object
import { Announcement } from "@/types/interface";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState("");

  // Load name from params
  useEffect(() => {
    const handleName = async () => {
      if (params.full_name && typeof params.full_name === "string") {
        // Store and set immediately
        await saveItem("full_name", params.full_name);
        setFirstName(params.full_name.split(" ")[0]);
      } else {
        // Fallback
        const storedName = await getItem("full_name");
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
        const profileData = await getItem("profile");
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
          }, 5000); // 5-second delay
        }
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
    }
  };

    checkProfileCompletion();
  }, []);

  // Fetch announcements function
  const fetchAnnouncements = async () => {
    try {
      const token = await getItem("authToken");
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

      // Set sorted announcements to state
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
      <Header name={`Trainer ${firstName}`} />

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
