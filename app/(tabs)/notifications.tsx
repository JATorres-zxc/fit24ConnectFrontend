import { Text, View, StyleSheet } from 'react-native';

import Header from '@/components/NotificationsHeader';
import { Colors } from '@/constants/Colors';
import NotificationsContainer from '@/components/NotificationsContainer';

const notifications = [
  { id: "1", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"07:10:21"},
  { id: "2", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"11:23:41"},
  { id: "3", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"07:08:31"},
  { id: "4", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"07:10:21"},
  { id: "5", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"11:23:41"},
  { id: "6", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"07:08:31"},
  { id: "7", title: "Membership Expiring Soon", content: "Your gym membership is expiring in 3 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 9, 2025", time:"07:10:21"},
  { id: "8", title: "New Workout Program Available!", content: "Check out our latest strength and conditioning program designed by our top trainers. Start today!", date: "Mar 8, 2025", time:"11:23:41"},
  { id: "9", title: "Updated Gym Hours", content: "Your gym membership is expiring in 7 days. Renew now at the front desk to continue your fitness journey!", date: "Mar 5, 2025", time:"07:08:31"},
];

export default function NotificationScreen() {
  return (
    <View style={styles.container}>
      <Header />

      <View style={styles.notificationsContainer}>
        <NotificationsContainer notifications={notifications} />
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
