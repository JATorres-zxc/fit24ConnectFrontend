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
            onPress={() => router.push('/editprofile')} 
          />
          <Text style={styles.headerText}>
            Edit Password
          </Text>
        </View>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '85%',
  },
  leftSection: {
    flexDirection: 'row',
    gap: 5,
  },
  headerText: {
    fontSize: 20,
    fontFamily: Fonts.semibold,
  },
});