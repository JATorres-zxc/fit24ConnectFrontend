import { View, StyleSheet, } from "react-native";
import { useState } from "react";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/HomeHeader';
import AdminAnnouncements from "@/components/AdminSideAnnouncementsContainer";

import { Colors } from "@/constants/Colors";
import { announcements as initialAnnouncements } from "@/context/announcements";

export default function Home() {
  // Use state to manage announcements instead of static import
  const [announcements, setAnnouncements] = useState(initialAnnouncements);

  // Handle deletion by filtering out the deleted announcement
  const handleDelete = (id: string) => {
    setAnnouncements(currentAnnouncements => 
      currentAnnouncements.filter(announcement => announcement.id !== id)
    );
    
    // If you have a backend, you'd also want to sync the deletion
    // deleteAnnouncementFromAPI(id);
  };

  return (
    <View style={styles.container}>
      <Header name='admin' />

      <View style={styles.buttonContainer}>
        <Button label="Create Announcement" theme="primary" />
      </View>

      <View style={styles.announcementsContainer}>
        <AdminAnnouncements announcements={announcements} onDelete={handleDelete} />
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
