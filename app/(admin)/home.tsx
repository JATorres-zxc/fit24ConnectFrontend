import { Text, View, StyleSheet } from "react-native";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/HomeHeader';
import { Colors } from "@/constants/Colors";

export default function Home() {
  return (
    <View style={styles.container}>
      <Header name='admin' />

      <View style={styles.buttonContainer}>
        <Button label="Create Announcement" theme="primary" />
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
    flex: 1,
    alignItems: 'center',
  },
});
