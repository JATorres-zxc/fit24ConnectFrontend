import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '@/constants/Fonts';

type HeaderProps = {
  userType: 'member' | 'trainer';
};

export default function Header({ userType }: HeaderProps) {
  const handleHomePress = () => {
    if (userType === 'trainer') {
      router.push('/(trainer)/home');
    } else {
      router.push('/(tabs)/home');
    }
  };

  const handleProfilePress = () => {
    if (userType === 'trainer') {
      router.push('/(trainer)/profile');
    } else {
      router.push('/(tabs)/profile');
    }
  }

  const handleNotificationPress = () => {
    if (userType === 'trainer') {
      router.push('/(trainer)/notifications');
    } else {
      router.push('/(tabs)/notifications');
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <FontAwesome 
            name='home' 
            color={'black'} 
            size={24} 
            onPress={handleHomePress} 
          />
          <Text style={styles.headerText}>
            Facility Access Logs
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <FontAwesome name='user-circle' color={'black'} size={24} onPress={handleProfilePress} />
          <FontAwesome name='bell-o' color={'black'} size={24} onPress={handleNotificationPress} />
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
});