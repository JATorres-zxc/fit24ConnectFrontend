import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import Toast from "react-native-toast-message";

import Header from "@/components/NavigateBackHeader";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

export default function CreateAnnouncement() {
  const { id, title, content } = useLocalSearchParams();
  const [announcementTitle, setAnnouncementTitle] = useState(title as string || '');
  const [announcementContent, setAnnouncementContent] = useState(content as string || '');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
    
  useEffect(() => {
    setAnnouncementTitle(title as string || '');
    setAnnouncementContent(content as string || '');
  }, [title, content]);

  const handleUpdateAnnouncement = async () => {
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
        text2: 'Please enter message content of the announcement',
        position: 'top',
        topOffset: 100,
      });
      return;
    }

    try {
      setIsLoading(true);
      
      // Replace with your actual API call
      // Example:
      // const response = await fetch('your-api-endpoint/announcements/' + id, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     title: announcementTitle,
      //     content: announcementContent,
      //   }),
      // });
      
      // if (!response.ok) {
      //   throw new Error('Failed to update announcement');
      // }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success toast
      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Announcement updated successfully',
        position: 'top',
        topOffset: 100,
        visibilityTime: 2000,
        autoHide: true,
        onHide: () => router.back() // Navigate back after toast disappears
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update announcement. Please try again.',
        position: 'top',
        topOffset: 100,
      });
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Header screen='Edit Announcement' />

      <View style={styles.textContainer}>
        <Text style={styles.title}>Update Announcement</Text>
        <Text style={styles.description}>
          Make changes to the details of your announcement to keep it accurate and relevant.
        </Text>
      </View>
    
      <ScrollView style={styles.scroll}>
      <View style={styles.form}>
        <View style={styles.annTitle}>
          <Text style={styles.header}> Announcement Title </Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Title"
            value={announcementTitle}
            onChangeText={setAnnouncementTitle}
            maxLength={30}
          />
          <Text style={styles.charCount}>{announcementTitle.length}/30</Text>
        </View>
        <View style={styles.annMessage}>
          <Text style={styles.header}> Message </Text>
          <TextInput
            style={[styles.input, styles.contentArea]}
            placeholder="Enter Details of Announcement"
            multiline
            value={announcementContent}
            onChangeText={setAnnouncementContent}
          />
        </View>

        <View style={styles.button}>
          <TouchableOpacity 
            style={[styles.post, isLoading && styles.disabledButton]}
            onPress={handleUpdateAnnouncement}
            disabled={isLoading}
          >
            <Text style={styles.buttonText}>
              {isLoading ? "Updating..." : "Update Announcement"}
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