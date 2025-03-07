import { Text, View, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import Toast from "react-native-toast-message";

import Button from "@/components/CreateAnnouncementButton";
import Header from "@/components/HomeHeader";
import AnnouncementsContainer from "@/components/AnnouncementsContainer";

import { announcements } from "@/context/announcements";
import { Colors } from '@/constants/Colors';

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
    backgroundColor: Colors.bg,
    alignItems: "center",
  },
  announcementsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
