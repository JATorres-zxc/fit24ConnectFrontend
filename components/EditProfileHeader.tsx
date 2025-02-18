import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AntDesign from '@expo/vector-icons/AntDesign'
import { Fonts } from '@/constants/Fonts';

export default function Header() {
  return (
    <SafeAreaView>
      <View style={styles.header}>

        <View style={styles.leftSection}>
          <AntDesign 
            name='arrowleft' 
            color={'black'} 
            size={24} 
            onPress={() => router.push('/profile')} 
          />
          <Text style={styles.headerText}>
            Edit Profile
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={styles.save} onPress={() => router.push('/profile')}>Save</Text>
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
  rightSection: {
    alignItems: 'center',
  },
  save: {
    fontSize: 16,
    color: '#d7be69',
  },
});