import { Text, View, StyleSheet, TextInput, ScrollView, TouchableOpacity } from "react-native";
import { useState } from "react";

import Header from "@/components/NavigateBackHeader";
import { Colors } from "@/constants/Colors";
import { Fonts } from "@/constants/Fonts";

export default function CreateAnnouncement() {
  const [announcementTitle, setAnnouncementTitle] = useState("");

  const handleTitleChange = (text: string) => {
    if (text.length <= 30) {
      setAnnouncementTitle(text);
    }
  };

  return (
    <View style={styles.container}>
      <Header screen='Create Announcement' />

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
          />
        </View>

        <View style={styles.button}>
          <TouchableOpacity style={styles.post}>
            <Text style={styles.buttonText}>
              Post Announcement
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
  buttonText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.white,
    textAlign: 'center',
  },
});