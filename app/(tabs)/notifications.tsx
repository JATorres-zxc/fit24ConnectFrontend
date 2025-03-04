import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/NotificationsHeader';
import { Colors } from '@/constants/Colors';

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
    backgroundColor: Colors.bg,
    alignItems: 'center',
  },
});
