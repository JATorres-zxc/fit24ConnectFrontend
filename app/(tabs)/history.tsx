import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/HistoryHeader';
import { Colors } from '@/constants/Colors';
import AccessLogsContainer from '@/components/AccessLogsContainer';

const accessLogs = [
  { id: "1", facilityName: "Fit24 Fitness Gym", accessStatus: "Granted", date: "Mar 9, 2025", time: "07:10:21" },
  { id: "2", facilityName: "Sauna", accessStatus: "Denied", date: "Mar 8, 2025", time: "22:13:41" },
  { id: "3", facilityName: "Locker", accessStatus: "Granted", date: "Mar 5, 2025", time: "08:08:31" },
  { id: "4", facilityName: "Locker", accessStatus: "Granted", date: "Mar 9, 2025", time: "01:24:21" },
  { id: "5", facilityName: "Sauna", accessStatus: "Denied", date: "Mar 8, 2025", time: "04:53:11" },
  { id: "6", facilityName: "Shower", accessStatus: "Granted", date: "Mar 5, 2025", time: "09:18:35" },
  { id: "7", facilityName: "Locker", accessStatus: "Denied", date: "Mar 9, 2025", time: "20:50:25" },
  { id: "8", facilityName: "Shower", accessStatus: "Granted", date: "Mar 8, 2025", time: "11:23:41" },
  { id: "9", facilityName: "Lounge", accessStatus: "Denied", date: "Mar 5, 2025", time: "17:58:11" },
];


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
