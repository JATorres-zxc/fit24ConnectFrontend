import { View, StyleSheet, Platform, } from "react-native";
import { useEffect, useCallback, useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/AdminHomeHeader';
import AdminAnnouncements from "@/components/AdminSideAnnouncementsContainer";

import { Colors } from "@/constants/Colors";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from '@/constants/ApiConfig';

// Import interface for the announcement object
import { Announcement } from "@/types/interface";

export default function AdminHome() {
  const params = useLocalSearchParams();
  // Use state to manage announcements instead of static import
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(false);

  // Show toast after login
  useEffect(() => {
    if (params.showToast === "true") {
      Toast.show({
        type: "success",
        text1: "Login Success!",
        text2: `Logged in as Admin`,
        visibilityTime: 1500
      });
    }
  }, [params.showToast]);

  // Function to fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/announcement/`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
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

  // Handle deletion
  const handleDelete = async (id: string) => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      const response = await fetch(`${API_BASE_URL}/api/announcement/${id}/`, {
        method: 'DELETE',
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete announcement');
      }
      
      // Update local state
      setAnnouncements(currentAnnouncements => 
        currentAnnouncements.filter(announcement => announcement.id !== id)
      );
      
      // Update AsyncStorage
      const updatedAnnouncements = announcements.filter(announcement => announcement.id !== id);
      await AsyncStorage.setItem('announcements', JSON.stringify(updatedAnnouncements));
    } catch (error) {
      console.error("Error deleting announcement:", error);
    }
  };

  return (
    <View style={styles.container}>
      <Header name='admin' />

      <View style={styles.buttonContainer}>
        <Button label="Create Announcement" theme="primary" />
      </View>

      <View style={styles.announcementsContainer}>
        <AdminAnnouncements 
          announcements={announcements} 
          onDelete={handleDelete}
          isLoading={loading}
         />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
  buttonContainer: {
    width: '85%',
    alignItems: 'center',
    marginBottom: 10,
  },
  announcementsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});