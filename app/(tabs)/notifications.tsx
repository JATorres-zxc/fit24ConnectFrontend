import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/NotificationsHeader';

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Header />
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
    color: '#fff',
  },
});
