import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '@/constants/Fonts';

interface HeaderProps {
  screen: string;
}

export default function Header({ screen }: HeaderProps) {
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
          <FontAwesome name='bell-o' color={'black'} size={24} onPress={() => router.push('/notifications')} />
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