import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/NotificationsHeader';
import { Colors } from '@/constants/Colors';
import NotificationsContainer from '@/components/NotificationsContainer';

const notifications = [
  { id: "1", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"07:10:21"},
  { id: "2", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"22:13:41"},
  { id: "3", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"08:08:31"},
  { id: "4", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"01:24:21"},
  { id: "5", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"04:53:11"},
  { id: "6", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"09:18:35"},
  { id: "7", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"20:50:25"},
  { id: "8", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"11:23:41"},
  { id: "9", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"17:58:11"},
];

export default function NotificationScreen() {
  const sortedNotifications = [...notifications].sort((a, b) => {
    // Combine date and time for comparison
    const dateTimeA = new Date(`${a.date} ${a.time}`).getTime();
    const dateTimeB = new Date(`${b.date} ${b.time}`).getTime();
    
    // Sort in descending order (most recent first)
    return dateTimeB - dateTimeA;
  });

  return (
    <View style={styles.container}>
      <Header userType='trainer' />

      <View style={styles.notificationsContainer}>
        <NotificationsContainer notifications={sortedNotifications} />
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
  notificationsContainer: {
    flex: 1,
    width: "100%",
    alignItems: "center",
  },
});
