import { Text, StyleSheet, SafeAreaView, View } from 'react-native';
import { router } from 'expo-router';
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNotifications } from '@/context/NotificationContext';

export default function TrainerWOHeader() {
  const { unreadCount } = useNotifications();

  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <FontAwesome 
            name='home' 
            color={'black'} 
            size={24} 
            onPress={() => router.push('/home')} 
          />
          <View>
            <Text style={styles.headerText}>
              Created Workouts
            </Text>
            <Text style={styles.subtitleText}>
              manage workouts you've created
            </Text>
          </View>
        </View>

        <View style={styles.headerIcon}>
          <FontAwesome name='user-circle' color={Colors.black} size={24} onPress={() => router.push('/(trainer)/profile')} />

          <View style={styles.notificationIconContainer}>
            <FontAwesome 
              name='bell-o' 
              color={'black'} 
              size={24} 
              onPress={() => router.push('/(trainer)/notifications')}
            />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 30,
    marginBottom: 20,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
  },
  subtitleText: {
    fontSize: 14,
    fontFamily: Fonts.italic,
    color: Colors.textSecondary,
  },
  headerIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  notificationIconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: Colors.red,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
