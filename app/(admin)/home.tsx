import { View, StyleSheet, Platform, } from "react-native";
import { useCallback, useState } from "react";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/HomeHeader';
import AdminAnnouncements from "@/components/AdminSideAnnouncementsContainer";

import { Colors } from "@/constants/Colors";
import { announcements as initialAnnouncements } from "@/context/announcements";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  // Use state to manage announcements instead of static import
  const [announcements, setAnnouncements] = useState(initialAnnouncements);
  const [loading, setLoading] = useState(false);

  // Function to fetch announcements from API
  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const API_BASE_URL = 
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://172.16.15.51:8000';
      
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
      setAnnouncements(data);
      
      // Optionally, also update AsyncStorage
      await AsyncStorage.setItem('announcements', JSON.stringify(data));
    } catch (error) {
      console.error("Error fetching announcements:", error);
      // Fallback to cached data if API call fails
      try {
        const storedAnnouncements = await AsyncStorage.getItem('announcements');
        if (storedAnnouncements) {
          setAnnouncements(JSON.parse(storedAnnouncements));
        }
      } catch (storageError) {
        console.error("Error fetching from storage:", storageError);
      }
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
      const API_BASE_URL = 
        Platform.OS === 'web'
          ? 'http://127.0.0.1:8000'
          : 'http://172.16.15.51:8000';
      
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