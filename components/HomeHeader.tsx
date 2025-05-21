import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '../constants/Fonts';
import { Colors } from '@/constants/Colors';

import { HeaderPropsUserTypewName } from '@/types/interface';

export default function Header({ userType, name }: HeaderPropsUserTypewName) {
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
        <Text style={styles.headerText}>
          Back to the Grind
          <Text style={{ fontFamily: Fonts.semiboldItalic }}>{name}!</Text>
        </Text>

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
    backgroundColor: Colors.bg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
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