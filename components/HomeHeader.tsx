import { router } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import FontAwesome from '@expo/vector-icons/FontAwesome'
import { Fonts } from '../constants/Fonts';
import { Colors } from '@/constants/Colors';

interface HeaderProps {
  name: string;
}

export default function Header({ name }: HeaderProps) {
  return (
    <SafeAreaView>
      <View style={styles.header}>
        <Text style={styles.headerText}>
          Back to the Grind,{' '}
          <Text style={{ fontFamily: Fonts.semiboldItalic }}>{name}!</Text>
        </Text>

        <View style={styles.headerIcon}>
            <FontAwesome name='user-circle' color={'black'} size={24} onPress={() => router.push('/profile')} />
            <FontAwesome name='bell-o' color={'black'} size={24} onPress={() => router.push('/notifications')} />
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