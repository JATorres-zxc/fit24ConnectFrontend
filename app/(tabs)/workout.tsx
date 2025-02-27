import { Text, View, StyleSheet } from 'react-native';
import Header from '@/components/WorkoutHeader';
import WorkoutsContainer from '@/components/WorkoutsContainer';
import { Colors } from '@/constants/Colors';

export default function WorkoutScreen() {
  return (
    <View style={styles.container}>
      <Header />
      <WorkoutsContainer />
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
