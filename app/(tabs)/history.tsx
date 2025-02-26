import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/HistoryHeader';
import { Colors } from '@/constants/Colors';

export default function HistoryScreen() {
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
