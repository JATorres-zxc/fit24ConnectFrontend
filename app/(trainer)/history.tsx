import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/HistoryHeader';
import { Colors } from '@/constants/Colors';
import AccessLogsContainer from '@/components/AccessLogsContainer';
import { accessLogs } from '@/context/accessLogs';

export default function HistoryScreen() {
  const sortedLogs = [...accessLogs].sort((a, b) => {
    // Combine date and time for comparison
    const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
    
    // Sort in descending order (most recent first)
    return dateTimeB - dateTimeA;
  });

  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.logsContainer}>
        <AccessLogsContainer accessLogs={sortedLogs} />
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
  logsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
