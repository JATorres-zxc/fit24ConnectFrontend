import { Text, View, StyleSheet } from "react-native";

import Button from '@/components/CreateAnnouncementButton';
import Header from '@/components/HomeHeader';

export default function Home() {
  return (
    <View style={styles.container}>
      <Header name='Jilliane' />

      <View style={styles.footerContainer}>
        <Button label="Create Announcement" theme="primary" />
      </View>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    alignItems: 'center',
  },
  text: {
    color: '#000000',
  },
  footerContainer: {
    width: '85%',
    flex: 1,
    alignItems: 'center',
  },
});
