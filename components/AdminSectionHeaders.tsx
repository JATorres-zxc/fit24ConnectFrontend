import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '@/constants/Fonts';
import { Colors } from '@/constants/Colors';
import { useNotifications } from '@/context/NotificationContext';

interface HeaderProps {
  screen: string;
  unreadCount?: number;
}

export default function Header({ screen, unreadCount = 0 }: HeaderProps) {
  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <FontAwesome 
            name='home' 
            color={'black'} 
            size={24} 
            onPress={() => router.push('/(admin)/home')} 
          />
          <Text style={styles.headerText}>
            {screen}
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <View style={styles.notificationIconContainer}>
            <FontAwesome 
              name='bell-o' 
              color={'black'} 
              size={24} 
              onPress={() => router.push('/(admin)/notifications')}
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
    width: '85%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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