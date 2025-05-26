import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '../constants/Fonts';
import { Colors } from '@/constants/Colors';

export default function Header() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <FontAwesome 
            name='home' 
            color={'black'} 
            size={24} 
            onPress={() => router.push('/(trainer)/home')} 
          />
          <Text style={styles.headerText}>
            Facility Access
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <FontAwesome name='user-circle' color={'black'} size={24} onPress={() => router.push('/(trainer)/profile')} />
          <FontAwesome name='bell-o' color={'black'} size={24} onPress={() => router.push('/(trainer)/notifications')} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.bg,
  },
  header: {
    width: '100%',
    backgroundColor: Colors.bg,
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