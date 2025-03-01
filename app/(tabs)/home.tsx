import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import Button from "@/components/CreateAnnouncementButton";
import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

const announcements = [
  { id: "1", title: "New Gym Equipment Arrived!", content: "We've added new treadmills and weights to the gym.", date: "Feb 10, 2025", admin: "Jane" },
  { id: "2", title: "Membership Renewal Reminder", content: "Don't forget to renew your membership before the end of the month!", date: "Feb 8, 2025", admin: "Edward" },
  { id: "3", title: "Updated Gym Hours", content: "We're now open from 5 AM to 11 PM!", date: "Feb 5, 2025", admin: "Stephen" }
];

export default function Home() {
  const params = useLocalSearchParams();

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
        <AnnouncementsContainer announcements={announcements} />
      </View>

      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    alignItems: "center",
  },
  announcementsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
