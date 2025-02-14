import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/ProfileHeader';

export default function ProfileScreen() {
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
