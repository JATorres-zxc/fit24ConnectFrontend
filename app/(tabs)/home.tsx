import { Text, View, StyleSheet } from "react-native";
import { useCallback, useEffect, useState } from "react";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";

import Toast from "react-native-toast-message";
import { saveItem, getItem } from '@/utils/storageUtils';

import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";
import { API_BASE_URL } from '@/constants/ApiConfig';
import { Colors } from '@/constants/Colors';
import { Fonts } from "@/constants/Fonts";

// Import interface for the announcement object
import { Announcement } from "@/types/interface";

export default function Home() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [firstName, setFirstName] = useState('');

  // Show toast after login
  useEffect(() => {
    if (params.showToast === "true" && params.full_name) {
      Toast.show({
        type: "success",
        text1: "Login Success!",
        text2: `Logged in as ${params.full_name}`,
        topOffset: 80,
        visibilityTime: 1500
      });
    }
  }, [params.showToast, params.full_name]);

  const getUserFirstName = async () => {
    try {
      // Fetch latest profile data from API
      const token = await getItem("authToken");
      const response = await fetch(`${API_BASE_URL}/api/profilee/profile/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch profile data');
      }

      const data = await response.json();

      await saveItem("profile", JSON.stringify(data));

      if (data.full_name) {
        // Extract the first name from the full name
        const firstName = data.full_name.split(" ")[0];
        setFirstName(firstName);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);

       // Fallback to local storage if API call fails
      try {
        // Try to get userData from storage
        const userData = await getItem("userData");
        if (userData) {
          const user = JSON.parse(userData);
          if (user.full_name) {
            // Extract first name (text before first space)
            const firstNameOnly = user.full_name.split(' ')[0];
            setFirstName(firstNameOnly);
            return;
          }
        }
        
        // If we couldn't get from userData, try profile
        const profileData = await getItem("profile");
        if (profileData) {
          const profile = JSON.parse(profileData);
          if (profile.full_name) {
            const firstNameOnly = profile.full_name.split(' ')[0];
            setFirstName(firstNameOnly);
          }
        }
      } catch (fallbackError) {
        console.error("Error in fallback method for getting user's name:", fallbackError);
      }
    }
  };

  // Profile verification
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
          ];

          console.log("Found fields:", requiredFields);
          console.log("Profile data:", profile);

          const missingFields = requiredFields.filter((field) => {
            const value = profile[field];
            if (value === null || value === undefined) return true;
            if (typeof value === "string" && value.trim() === "") return true;
            return false;
          });

          console.log("Missing fields:", missingFields);

          if (missingFields.length > 0) {
          Toast.show({
            type: "error",
            text1: "Profile Incomplete",
            text2: "Please complete all profile details before proceeding.",
            topOffset: 80,
            visibilityTime: 2000, // Show the toast for 2 seconds
          });

          // Delay the redirection by 2 seconds
          setTimeout(() => {
            router.push({
              pathname: '/(tabs)/profile',
              params: { showToast: 'true' },
            });
          }, 2000); // 2-second delay
        }
      }
    } catch (error) {
      console.error("Error checking profile completeness:", error);
    }
  };

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
        topOffset: 80,
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch announcements and check profile completion when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchAnnouncements();
      getUserFirstName();
      checkProfileCompletion();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Header userType='member' name={firstName} />

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
