import { View, StyleSheet } from 'react-native';

import Header from '@/components/AdminSectionHeaders';
import { Colors } from '@/constants/Colors';

export default function TrainersScreen() {
  return (
    <View style={styles.container}>
      <Header screen="Trainers" />
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
