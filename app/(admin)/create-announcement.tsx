import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";

import Header from "@/components/NavigateBackHeader";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";
import Toast from "react-native-toast-message";

export default function CreateAnnouncement() {
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementContent, setAnnouncementContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      setAnnouncementTitle("");
      setAnnouncementContent("");
    }, [])
  );

  const handleTitleChange = (text: string) => {
    if (text.length <= 30) {
      setAnnouncementTitle(text);
    }
  };

  const handleCreateAnnouncement = async () => {
    // Validate input
    if (!announcementTitle.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a title for the announcement',
        position: 'top',
        topOffset: 100,
      });
      return;
    }

    if (!announcementContent.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter message content for the announcement',
        position: 'top',
        topOffset: 100,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a new announcement object
      const newAnnouncement = {
        id: Date.now().toString(), // Generate a unique ID
        title: announcementTitle,
        content: announcementContent,
        date: new Date().toLocaleDateString(),
        admin: "Admin" // Replace with actual admin name or get from context
      };
      
      // For a real implementation, make an API call to your backend
      // Example:
      // const response = await fetch('your-api-endpoint/announcements', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newAnnouncement),
      // });
      // 
      // if (!response.ok) {
      //   throw new Error('Failed to create announcement');
      // }
      
      // For local storage implementation:
      try {
        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
        
        // Get existing announcements
        const existingData = await AsyncStorage.getItem('announcements');
        let announcements = existingData ? JSON.parse(existingData) : [];
        
        // Add new announcement
        announcements.unshift(newAnnouncement); // Add to beginning of array
        
        // Save updated announcements
        await AsyncStorage.setItem('announcements', JSON.stringify(announcements));
        
      } catch (storageError) {
        console.error("Storage error:", storageError);
        throw new Error('Failed to save announcement to storage');
      }
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Announcement created successfully',
        position: 'top',
        topOffset: 100,
        visibilityTime: 2000,
        autoHide: true,
        onHide: () => router.push('/(admin)/home') // Navigate back after toast disappears
      });
      
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create announcement. Please try again.',
        position: 'top',
        topOffset: 100,
      });
      console.error("Create error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header screen='Create Announcement' prevScreen='/(admin)/home' />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Send out news and updates</Text>
        <Text style={styles.description}>
            Your message will appear on the announcement feed.
        </Text>
      </View>
    
      <ScrollView style={styles.scroll}>
      <View style={styles.form}>
        <View style={styles.annTitle}>
          <Text style={styles.header}> Announcement Title </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title for Announcement"
            value={announcementTitle}
            onChangeText={handleTitleChange}
          />
          <Text style={styles.charCount}>{announcementTitle.length}/30</Text>
        </View>
        <View style={styles.annMessage}>
          <Text style={styles.header}> Message </Text>
          <TextInput
            style={[styles.input, styles.contentArea]}
            placeholder="Enter Details of Announcement"
            placeholderTextColor={Colors.textSecondary}
            multiline={true}
            value={announcementContent}
            onChangeText={setAnnouncementContent}
          />
        </View>

        <View style={styles.button}>
          <TouchableOpacity 
            style={[styles.post, isLoading && styles.disabledButton]}
            onPress={handleCreateAnnouncement}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Creating..." : "Post Announcement"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems:'center',
  },
  textContainer: {
    width: '85%',
    marginBottom: 50,
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: 20,
    marginBottom: 20,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 16,
  },
  scroll: {
    width: '85%',
  },
  form: {
  },
  annTitle: {
  },
  header: {
    marginBottom: 10,
    fontFamily: Fonts.semibold,
    fontSize: 16,
  },
  annMessage: {
  },
  input: {
    width: '100%',
    marginBottom: 30,
    borderColor: Colors.border,
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: Colors.white,
    padding: 12,
    fontSize: 14,
    fontFamily: Fonts.regular,
    color: Colors.textSecondary,
  },
  charCount: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: "right",
    marginTop: -25,
    marginBottom: 20,
  },
  contentArea: {
    height: 150,
  },
  button: {
    marginTop: 10,
    alignSelf: 'center',
  },
  post: {
    backgroundColor: Colors.gold,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
});