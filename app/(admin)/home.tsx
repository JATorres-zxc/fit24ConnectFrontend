import { View, StyleSheet } from "react-native";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/HomeHeader';
import AdminAnnouncements from "@/components/AdminSideAnnouncementsContainer";

import { announcements } from "@/constants/announcements";
import { Colors } from "@/constants/Colors";

export default function Home() {
  return (
    <View style={styles.container}>
      <Header name='admin' />

      <View style={styles.buttonContainer}>
        <Button label="Create Announcement" theme="primary" />
      </View>

      <View style={styles.announcementsContainer}>
        <AdminAnnouncements announcements={announcements} />
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
